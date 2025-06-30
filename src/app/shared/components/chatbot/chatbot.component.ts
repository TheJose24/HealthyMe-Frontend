import {
  Component,
  type OnInit,
  type OnDestroy,
  type ElementRef,
  ViewChild,
  type AfterViewChecked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ChatService } from '../../services/chat.service';
import type { IChatMessage, IChatState } from '../../interfaces/chat.interface';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0%)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateY(100%)', opacity: 0 })),
      ]),
    ]),
    trigger('messageAnimation', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(20px)' }),
            stagger(100, [
              animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-in', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class ChatbotComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') public messagesContainer!: ElementRef;
  @ViewChild('messageInput') public messageInput!: ElementRef;

  public isOpen = false;
  public messages: IChatMessage[] = [];
  public chatState: IChatState | null = null;
  public currentMessage = '';
  public isTyping = false;
  public isConnected = false;

  private subscriptions = new Subscription();
  private shouldScrollToBottom = false;

  public constructor(private chatService: ChatService) {}

  public ngOnInit(): void {
    this.subscribeToChat();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  public async sendMessage(): Promise<void> {
    if (!this.currentMessage.trim() || this.isTyping) return;

    const message = this.currentMessage.trim();
    this.currentMessage = '';
    this.shouldScrollToBottom = true;

    try {
      await this.chatService.sendMessage(message);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  public onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  public closeChat(): void {
    this.chatService.closeChat();
  }

  public clearChat(): void {
    this.chatService.clearChat();
    this.shouldScrollToBottom = true;
  }

  public formatTime(timestamp: Date): string {
    return new Date(timestamp).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  public getMessageClasses(message: IChatMessage): string {
    const baseClasses = 'flex w-full mb-4';
    return message.sender === 'user'
      ? `${baseClasses} justify-end`
      : `${baseClasses} justify-start`;
  }

  public getBubbleClasses(message: IChatMessage): string {
    const baseClasses = 'max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm';

    if (message.isTyping) {
      return `${baseClasses} bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300`;
    }

    return message.sender === 'user'
      ? `${baseClasses} bg-blue-500 text-white ml-auto`
      : `${baseClasses} bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600`;
  }

  public trackByMessageId(index: number, message: IChatMessage): string {
    return message.id;
  }

  private subscribeToChat(): void {
    // Suscribirse al estado de apertura
    this.subscriptions.add(
      this.chatService.isOpen$.subscribe(isOpen => {
        this.isOpen = isOpen;
        if (isOpen) {
          setTimeout(() => this.focusInput(), 100);
        }
      })
    );

    // Suscribirse a los mensajes
    this.subscriptions.add(
      this.chatService.messages$.subscribe(messages => {
        this.messages = messages;
        this.shouldScrollToBottom = true;
      })
    );

    // Suscribirse al estado del chat
    this.subscriptions.add(
      this.chatService.state$.subscribe(state => {
        this.chatState = state;
        this.isTyping = state.isTyping;
        this.isConnected = state.isConnected;
      })
    );
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const element = this.messagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  private focusInput(): void {
    if (this.messageInput) {
      this.messageInput.nativeElement.focus();
    }
  }
}
