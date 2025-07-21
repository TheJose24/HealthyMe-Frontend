import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { FormBuilder, FormGroup } from '@angular/forms';
import { Validators, ReactiveFormsModule } from '@angular/forms';
import type { AuthService } from '../../../../shared/services/auth.service';
import type { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      nombreUsuario: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  async handleLogin() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    const { nombreUsuario, password } = this.loginForm.value;

    try {
      const response = await this.authService.login(nombreUsuario, password);
      console.log('Access Token recibido →', response.accessToken);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      const user = await this.authService.getCurrentUser();

      if (user.rol === 'ADMIN') {
        this.router.navigate(['/admin']);
      } else if (user.rol === 'PACIENTE') {
        this.router.navigate(['/paciente']);
      } else {
        this.router.navigate(['/unauthorized']);
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      this.error = 'Credenciales inválidas o usuario suspendido';
    } finally {
      this.isLoading = false;
    }
  }
}
