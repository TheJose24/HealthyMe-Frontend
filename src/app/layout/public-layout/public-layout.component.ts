import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ChatComponent } from '../../shared/components/buttons/chat/chat.component';
import { ChatbotComponent } from '../../shared/components/chatbot/chatbot.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ChatComponent, ChatbotComponent],
  template: `
    <div class="flex min-h-screen flex-col">
      <app-header class="sticky top-0 z-50"></app-header>
      <main class="flex-grow">
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
      <app-chat></app-chat>
      <app-chatbot></app-chatbot>
    </div>
  `,
  styles: ``,
})
export class PublicLayoutComponent {}
