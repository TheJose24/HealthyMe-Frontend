import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { BehaviorSubject, Subject } from 'rxjs';
import type { OllamaService } from './ollama.service';
import { ChatMessage } from '../models/chat-message.model';
import type {
  IChatSession,
  IChatState,
  IChatMessage,
  IPatientContext,
} from '../interfaces/chat.interface';
import type { IOllamaError } from '../interfaces/ollama.interface';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly chatState$ = new BehaviorSubject<IChatState>({
    currentSession: null,
    isConnected: false,
    isTyping: false,
    lastError: null,
  });

  private readonly messagesSubject$ = new BehaviorSubject<IChatMessage[]>([]);
  private readonly isOpenSubject$ = new BehaviorSubject<boolean>(false);
  private readonly newMessageSubject$ = new Subject<IChatMessage>();

  private readonly maxMessages = 50;
  private readonly storageKey = 'healthyme_chat_history';

  public constructor(private ollamaService: OllamaService) {
    this.initializeChat();
    this.subscribeToOllamaStatus();
  }

  // Observables públicos
  public get state$(): Observable<IChatState> {
    return this.chatState$.asObservable();
  }

  public get messages$(): Observable<IChatMessage[]> {
    return this.messagesSubject$.asObservable();
  }

  public get isOpen$(): Observable<boolean> {
    return this.isOpenSubject$.asObservable();
  }

  public get newMessage$(): Observable<IChatMessage> {
    return this.newMessageSubject$.asObservable();
  }

  // Métodos principales
  public toggleChat(): void {
    const currentState = this.isOpenSubject$.value;
    this.isOpenSubject$.next(!currentState);

    if (!currentState && !this.chatState$.value.currentSession) {
      this.startNewSession();
    }
  }

  public async sendMessage(content: string, patientContext?: IPatientContext): Promise<void> {
    if (!content.trim()) return;

    try {
      // Crear y agregar mensaje del usuario
      const userMessage = ChatMessage.createUserMessage(content.trim());
      this.addMessage(userMessage);

      // Mostrar indicador de escritura
      this.setTyping(true);
      const typingIndicator = ChatMessage.createTypingIndicator();
      this.addMessage(typingIndicator);

      // Actualizar contexto del paciente si se proporciona
      if (patientContext) {
        this.updatePatientContext(patientContext);
      }

      // Generar respuesta del bot
      const startTime = Date.now();
      const response = await this.ollamaService.generateResponse(content);

      // Remover indicador de escritura
      this.removeMessage(typingIndicator.id);
      this.setTyping(false);

      // Crear y agregar respuesta del bot
      const botMessage = ChatMessage.createBotMessage(response.response, {
        confidence: this.calculateConfidence(response),
        modelUsed: response.model,
        processingTime: Date.now() - startTime,
      });

      this.addMessage(botMessage);

      // Limpiar errores previos
      this.setError(null);
    } catch (error) {
      this.setTyping(false);
      this.handleChatError(error);
    }
  }

  public startNewSession(patientContext?: IPatientContext): void {
    const session: IChatSession = {
      id: this.generateSessionId(),
      messages: [],
      startTime: new Date(),
      isActive: true,
      patientContext,
    };

    this.updateState({ currentSession: session });
    this.messagesSubject$.next([]);

    // Mensaje de bienvenida
    const welcomeMessage = ChatMessage.createBotMessage(
      '¡Hola! Soy tu asistente médico virtual de HealthyMe. Estoy aquí para ayudarte con información médica general. ¿En qué puedo asistirte hoy?'
    );

    this.addMessage(welcomeMessage);
  }

  public endCurrentSession(): void {
    const currentState = this.chatState$.value;
    if (currentState.currentSession) {
      const session = { ...currentState.currentSession, isActive: false };
      this.saveSessionToStorage(session);
      this.updateState({ currentSession: null });
      this.messagesSubject$.next([]);
    }
  }

  public clearChat(): void {
    this.messagesSubject$.next([]);
    this.setError(null);

    if (this.chatState$.value.currentSession) {
      this.startNewSession();
    }
  }

  public closeChat(): void {
    this.isOpenSubject$.next(false);
    this.setTyping(false);
  }

  public getMessageHistory(): IChatMessage[] {
    return this.messagesSubject$.value;
  }

  public loadChatHistory(): IChatSession[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  // Métodos privados
  private initializeChat(): void {
    // Cargar configuración inicial
    this.updateState({
      currentSession: null,
      isConnected: false,
      isTyping: false,
      lastError: null,
    });

    // Agregar mensaje de bienvenida offline
    if (!this.ollamaService.isConnected$) {
      const offlineMessage = ChatMessage.createBotMessage(
        'El asistente médico no está disponible en este momento. Puede contactarnos directamente o agendar una cita.'
      );
      this.addMessage(offlineMessage);
    }
  }

  private subscribeToOllamaStatus(): void {
    this.ollamaService.isConnected$.subscribe(isConnected => {
      this.updateState({ isConnected });

      if (!isConnected && this.chatState$.value.currentSession) {
        this.setError('Conexión perdida con el asistente médico');
      }
    });
  }

  private addMessage(message: IChatMessage): void {
    const currentMessages = this.messagesSubject$.value;
    const updatedMessages = [...currentMessages, message];

    // Limitar número de mensajes
    if (updatedMessages.length > this.maxMessages) {
      updatedMessages.splice(0, updatedMessages.length - this.maxMessages);
    }

    this.messagesSubject$.next(updatedMessages);
    this.newMessageSubject$.next(message);

    // Actualizar sesión actual
    const currentState = this.chatState$.value;
    if (currentState.currentSession) {
      const updatedSession = {
        ...currentState.currentSession,
        messages: updatedMessages,
      };
      this.updateState({ currentSession: updatedSession });
    }
  }

  private removeMessage(messageId: string): void {
    const currentMessages = this.messagesSubject$.value;
    const filteredMessages = currentMessages.filter(msg => msg.id !== messageId);
    this.messagesSubject$.next(filteredMessages);
  }

  private setTyping(isTyping: boolean): void {
    this.updateState({ isTyping });
  }

  private setError(error: string | null): void {
    this.updateState({ lastError: error });
  }

  private updateState(partialState: Partial<IChatState>): void {
    const currentState = this.chatState$.value;
    const newState = { ...currentState, ...partialState };
    this.chatState$.next(newState);
  }

  private updatePatientContext(context: IPatientContext): void {
    const currentState = this.chatState$.value;
    if (currentState.currentSession) {
      const updatedSession = {
        ...currentState.currentSession,
        patientContext: { ...currentState.currentSession.patientContext, ...context },
      };
      this.updateState({ currentSession: updatedSession });
    }
  }

  private handleChatError(error: any): void {
    let errorMessage = 'Ocurrió un error inesperado';

    if (error && typeof error === 'object' && 'message' in error) {
      const ollamaError = error as IOllamaError;
      switch (ollamaError.code) {
        case 'CONNECTION_ERROR':
          errorMessage = 'No se pudo conectar con el asistente médico. Intente nuevamente.';
          break;
        case 'MODEL_NOT_FOUND':
          errorMessage = 'El modelo médico no está disponible. Contacte al soporte técnico.';
          break;
        case 'SERVER_ERROR':
          errorMessage = 'Error en el servidor. Intente nuevamente en unos momentos.';
          break;
        default:
          errorMessage = ollamaError.message || 'Error desconocido';
      }
    }

    this.setError(errorMessage);

    const errorBotMessage = ChatMessage.createBotMessage(
      `Lo siento, ${errorMessage} Mientras tanto, puede contactar directamente con nuestros especialistas.`
    );

    this.addMessage(errorBotMessage);
  }

  private calculateConfidence(response: any): number {
    // Lógica simple para calcular confianza basada en la respuesta
    if (response.total_duration && response.eval_count) {
      return Math.min(0.95, 0.7 + (response.eval_count / 100) * 0.25);
    }
    return 0.8; // Confianza por defecto
  }

  private saveSessionToStorage(session: IChatSession): void {
    try {
      const history = this.loadChatHistory();
      const updatedHistory = [session, ...history.slice(0, 9)]; // Mantener últimas 10 sesiones
      localStorage.setItem(this.storageKey, JSON.stringify(updatedHistory));
    } catch (error) {
      console.warn('No se pudo guardar el historial del chat:', error);
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
