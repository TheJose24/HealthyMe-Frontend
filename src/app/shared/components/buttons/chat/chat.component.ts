import { Component, type OnInit, type OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import type { ChatService } from '../../../services/chat.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
  animations: [
    trigger('bounce', [
      state('normal', style({ transform: 'scale(1)' })),
      state('bounced', style({ transform: 'scale(1.1)' })),
      transition('normal <=> bounced', animate('200ms ease-in-out')),
    ]),
    trigger('pulse', [
      transition('* => *', [
        animate('1s ease-in-out', style({ transform: 'scale(1.05)' })),
        animate('1s ease-in-out', style({ transform: 'scale(1)' })),
      ]),
    ]),
  ],
})
export class ChatComponent implements OnInit, OnDestroy {
  public isOpen = false;
  public isConnected = false;
  public hasUnreadMessages = false;
  public animationState = 'normal';

  private subscriptions = new Subscription();

  public constructor(private chatService: ChatService) {}

  public ngOnInit(): void {
    // Suscribirse al estado del chat
    this.subscriptions.add(
      this.chatService.isOpen$.subscribe(isOpen => {
        this.isOpen = isOpen;
      })
    );

    this.subscriptions.add(
      this.chatService.state$.subscribe(state => {
        this.isConnected = state.isConnected;
      })
    );

    this.subscriptions.add(
      this.chatService.newMessage$.subscribe(message => {
        if (message.sender === 'bot' && !this.isOpen) {
          this.hasUnreadMessages = true;
          this.triggerBounce();
        }
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public toggleChat(): void {
    this.chatService.toggleChat();
    this.hasUnreadMessages = false;
    this.triggerBounce();
  }

  private triggerBounce(): void {
    this.animationState = 'bounced';
    setTimeout(() => {
      this.animationState = 'normal';
    }, 200);
  }
}
