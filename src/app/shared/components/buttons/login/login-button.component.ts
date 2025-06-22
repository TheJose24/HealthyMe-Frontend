import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      (click)="login()"
      class="flex w-full items-center transition-colors duration-200 hover:text-teal-400"
    >
      <i class="fas fa-sign-in-alt mr-2"></i>
      Iniciar sesión
    </button>
  `,
})
export class LoginButtonComponent {
  public login(): void {
    // implementación del inicio de sesión
  }
}
