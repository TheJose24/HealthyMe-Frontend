import type { IChatMessage } from '../interfaces/chat.interface';

export class ChatMessage implements IChatMessage {
  public id: string;
  public content: string;
  public sender: 'user' | 'bot';
  public timestamp: Date;
  public isTyping?: boolean;
  public metadata?: {
    confidence?: number;
    modelUsed?: string;
    processingTime?: number;
  };

  public constructor(
    content: string,
    sender: 'user' | 'bot',
    options?: {
      id?: string;
      timestamp?: Date;
      isTyping?: boolean;
      metadata?: any;
    }
  ) {
    this.id = options?.id || this.generateId();
    this.content = content;
    this.sender = sender;
    this.timestamp = options?.timestamp || new Date();
    this.isTyping = options?.isTyping || false;
    this.metadata = options?.metadata;
  }

  public static createUserMessage(content: string): ChatMessage {
    return new ChatMessage(content, 'user');
  }

  public static createBotMessage(content: string, metadata?: any): ChatMessage {
    return new ChatMessage(content, 'bot', { metadata });
  }

  public static createTypingIndicator(): ChatMessage {
    return new ChatMessage('...', 'bot', { isTyping: true });
  }

  public toJSON(): IChatMessage {
    return {
      id: this.id,
      content: this.content,
      sender: this.sender,
      timestamp: this.timestamp,
      isTyping: this.isTyping,
      metadata: this.metadata,
    };
  }

  private generateId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
