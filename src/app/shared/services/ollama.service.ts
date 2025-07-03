import { Injectable } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { BehaviorSubject, throwError, retry, timeout, catchError } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import type {
  IOllamaRequest,
  IOllamaResponse,
  IOllamaConfig,
  IOllamaError,
} from '../interfaces/ollama.interface';

@Injectable({
  providedIn: 'root',
})
export class OllamaService {
  private readonly config: IOllamaConfig = {
    baseUrl: 'https://bot.devbyjose.me',
    model: 'healthyme-bot',
    timeout: 90000, // Aumentar timeout para el modelo personalizado
    maxRetries: 2,
    systemPrompt: '', // Ya no necesario, el modelo tiene las instrucciones
  };

  private readonly connectionStatus$ = new BehaviorSubject<boolean>(false);
  private readonly _isProcessing$ = new BehaviorSubject<boolean>(false);

  private conversationHistory: string[] = [];
  private readonly maxHistoryLength = 8; // Aumentar para mejor contexto

  public constructor(private http: HttpClient) {
    this.checkConnection();
  }

  public get isConnected$(): Observable<boolean> {
    return this.connectionStatus$.asObservable();
  }

  public get isProcessing$(): Observable<boolean> {
    return this._isProcessing$.asObservable();
  }

  public async generateResponse(prompt: string): Promise<IOllamaResponse> {
    this._isProcessing$.next(true);

    // Construir prompt simple con contexto de conversación
    const contextualPrompt = this.buildSimpleContextualPrompt(prompt);

    const request: IOllamaRequest = {
      model: this.config.model,
      prompt: contextualPrompt,
      stream: false,
      options: {
        temperature: 0.3,
        top_p: 0.85,
        top_k: 40,
        repeat_penalty: 1.1,
        num_predict: 800,
        num_ctx: 4096,
        stop: ['<|endoftext|>', '<|end|>', '\n\n---\n\n', 'USER:', 'Human:'],
      },
    };

    try {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
      });

      const response = await this.http
        .post<IOllamaResponse>(`${this.config.baseUrl}/api/generate`, request, { headers })
        .pipe(
          timeout(this.config.timeout),
          retry({
            count: this.config.maxRetries,
            delay: 3000,
          }),
          catchError(this.handleError.bind(this))
        )
        .toPromise();

      this._isProcessing$.next(false);

      // Filtrar thinking tags y procesar respuesta
      const filteredResponse = this.filterThinkingTags(response!.response);
      const processedResponse = { ...response!, response: filteredResponse };

      // Agregar al historial
      this.addToHistory(`Paciente: ${prompt}`);
      this.addToHistory(`HealthyMe: ${filteredResponse}`);

      return processedResponse;
    } catch (error) {
      this._isProcessing$.next(false);
      throw this.handleError(error);
    }
  }

  public generateStreamResponse(prompt: string): Observable<IOllamaResponse> {
    this._isProcessing$.next(true);

    const request: IOllamaRequest = {
      model: this.config.model,
      prompt: this.buildSimpleContextualPrompt(prompt),
      stream: true,
      options: {
        temperature: 0.2,
        top_p: 0.85,
        top_k: 40,
        repeat_penalty: 1.1,
        num_predict: 800,
        num_ctx: 4096,
      },
    };

    return this.http.post<IOllamaResponse>(`${this.config.baseUrl}/api/generate`, request).pipe(
      map(response => ({
        ...response,
        response: this.filterThinkingTags(response.response),
      })),
      timeout(this.config.timeout),
      retry({
        count: this.config.maxRetries,
        delay: 2000,
      }),
      tap({
        complete: () => this._isProcessing$.next(false),
        error: () => this._isProcessing$.next(false),
      }),
      catchError(this.handleError.bind(this))
    );
  }

  public async checkConnection(): Promise<boolean> {
    try {
      const headers = new HttpHeaders({
        Accept: 'application/json',
      });

      await this.http
        .get(`${this.config.baseUrl}/api/tags`, { headers })
        .pipe(
          timeout(10000),
          catchError(() => throwError(() => new Error('Connection failed')))
        )
        .toPromise();

      this.connectionStatus$.next(true);
      return true;
    } catch {
      this.connectionStatus$.next(false);
      return false;
    }
  }

  public async getAvailableModels(): Promise<string[]> {
    try {
      const headers = new HttpHeaders({
        Accept: 'application/json',
      });

      const response = await this.http
        .get<{ models: { name: string }[] }>(`${this.config.baseUrl}/api/tags`, { headers })
        .toPromise();

      return response?.models.map(model => model.name) || [];
    } catch {
      return [];
    }
  }

  /**
   * Construye un prompt simple con contexto de conversación
   * Ya no necesita instrucciones porque están en el modelo
   */
  private buildSimpleContextualPrompt(currentPrompt: string): string {
    let contextualPrompt = '';

    // Agregar historial de conversación si existe
    if (this.conversationHistory.length > 0) {
      const recentHistory = this.conversationHistory.slice(-6).join('\n');
      contextualPrompt += `Historial de conversación:\n${recentHistory}\n\n`;
    }

    // Solo agregar la consulta actual
    contextualPrompt += `Consulta: ${currentPrompt}`;

    return contextualPrompt;
  }

  /**
   * Filtra las etiquetas <think></think> del modelo
   */
  private filterThinkingTags(response: string): string {
    if (!response) return '';

    let filtered = response;

    // Remover etiquetas thinking (múltiples variaciones)
    const thinkingPatterns = [
      /<think>[\s\S]*?<\/think>/gi,
      /<thinking>[\s\S]*?<\/thinking>/gi,
      /\[thinking\][\s\S]*?\[\/thinking\]/gi,
    ];

    thinkingPatterns.forEach(pattern => {
      filtered = filtered.replace(pattern, '');
    });

    // Remover etiquetas sueltas
    const looseTagPatterns = [
      /<\/?think>/gi,
      /<\/?thinking>/gi,
      /\[\/thinking\]/gi,
      /\[thinking\]/gi,
    ];

    looseTagPatterns.forEach(pattern => {
      filtered = filtered.replace(pattern, '');
    });

    // Remover contenido en inglés que pueda ser thinking no filtrado
    const englishThinkingLines = filtered.split('\n').filter(line => {
      const trimmedLine = line.trim().toLowerCase();
      const englishIndicators = [
        'okay,',
        'first,',
        'i should',
        'i need to',
        'let me think',
        'the user is',
        'common reasons include',
        'since the user',
      ];

      return !englishIndicators.some(indicator => trimmedLine.startsWith(indicator));
    });

    filtered = englishThinkingLines.join('\n');

    // Limpiar espacios excesivos
    filtered = filtered
      .replace(/\n{3,}/g, '\n\n')
      .replace(/^\s+|\s+$/g, '')
      .trim();

    // Si queda vacío, generar respuesta por defecto
    if (!filtered.trim() || filtered.length < 10) {
      return this.generateFallbackResponse();
    }

    return filtered;
  }

  /**
   * Respuesta de respaldo cuando el filtrado falla
   */
  private generateFallbackResponse(): string {
    return `**Disculpe, hubo un problema procesando su consulta.**

Por favor, reformule su pregunta o para atención inmediata puede:

📞 **Contactar HealthyMe directamente:**
- **Urgencias 24/7** para emergencias médicas
- **Citas programadas** con nuestros especialistas
- **Telemedicina** para consultas virtuales

🏥 **Nuestras especialidades incluyen:**
Medicina Interna, Cardiología, Gastroenterología, Neurología, Dermatología, Ortopedia, Ginecología, Psiquiatría, y más.

*Su salud es nuestra prioridad. Para diagnósticos precisos, consulte con nuestros profesionales médicos.*`;
  }

  private addToHistory(entry: string): void {
    this.conversationHistory.push(entry);

    // Mantener historial limitado
    if (this.conversationHistory.length > this.maxHistoryLength * 2) {
      this.conversationHistory = this.conversationHistory.slice(-this.maxHistoryLength * 2);
    }
  }

  private handleError(error: any): Observable<never> {
    let ollamaError: IOllamaError;

    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 0:
          ollamaError = {
            code: 'CONNECTION_ERROR',
            message:
              'No se pudo conectar con el asistente médico de HealthyMe. Verifique su conexión.',
            details: error,
          };
          break;
        case 404:
          ollamaError = {
            code: 'MODEL_NOT_FOUND',
            message: 'El modelo HealthyMe-Bot no está disponible. Contacte al soporte técnico.',
            details: error,
          };
          break;
        case 500:
          ollamaError = {
            code: 'SERVER_ERROR',
            message:
              'Error temporal en el sistema. Intente nuevamente o contacte con nuestro personal médico.',
            details: error,
          };
          break;
        case 429:
          ollamaError = {
            code: 'RATE_LIMIT',
            message:
              'Demasiadas consultas simultáneas. Espere un momento antes de intentar nuevamente.',
            details: error,
          };
          break;
        default:
          ollamaError = {
            code: 'HTTP_ERROR',
            message: `Error de comunicación (${error.status}). Contacte al soporte de HealthyMe.`,
            details: error,
          };
      }
    } else if (error.name === 'TimeoutError') {
      ollamaError = {
        code: 'TIMEOUT_ERROR',
        message:
          'La consulta está tomando más tiempo del esperado. Para consultas complejas, considere contactar directamente con nuestros especialistas.',
        details: error,
      };
    } else {
      ollamaError = {
        code: 'UNKNOWN_ERROR',
        message: 'Error inesperado. Para asistencia inmediata, contacte con HealthyMe.',
        details: error,
      };
    }

    this.connectionStatus$.next(false);
    return throwError(() => ollamaError);
  }

  public updateConfig(newConfig: Partial<IOllamaConfig>): void {
    Object.assign(this.config, newConfig);
    this.checkConnection();
  }

  public getConfig(): IOllamaConfig {
    return { ...this.config };
  }

  public clearHistory(): void {
    this.conversationHistory = [];
  }

  /**
   * Reinicia la conexión con el modelo personalizado
   */
  public async reconnect(): Promise<boolean> {
    this.connectionStatus$.next(false);
    return await this.checkConnection();
  }

  /**
   * Verifica si el modelo personalizado está disponible
   */
  public async verifyCustomModel(): Promise<boolean> {
    try {
      const models = await this.getAvailableModels();
      return models.includes(this.config.model);
    } catch {
      return false;
    }
  }

  /**
   * Obtiene información del modelo personalizado
   */
  public async getModelInfo(): Promise<any> {
    try {
      const headers = new HttpHeaders({
        Accept: 'application/json',
      });

      const response = await this.http
        .post(`${this.config.baseUrl}/api/show`, { name: this.config.model }, { headers })
        .toPromise();

      return response;
    } catch {
      return null;
    }
  }
}
