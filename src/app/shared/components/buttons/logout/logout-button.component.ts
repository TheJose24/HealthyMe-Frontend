import { Component } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logout-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      (click)="logout()"
      type="button"
      class="flex w-full items-center transition-colors duration-200 hover:text-teal-400"
    >
      <i class="fas fa-sign-out-alt mr-2"></i>
      Cerrar sesión
    </button>
  `,
})
export class LogoutButtonComponent {
  private constructor(private router: Router) {}

  public logout(): void {
    this.router.navigate(['/']);
  }
}
