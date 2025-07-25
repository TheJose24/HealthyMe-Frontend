import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { FormBuilder } from '@angular/forms';
import type { FormGroup } from '@angular/forms';
import { Validators, ReactiveFormsModule } from '@angular/forms';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { AuthService } from '../../../../shared/services/auth.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  public loginForm: FormGroup;
  public error: string | null = null;
  public isLoading = false;

  public constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      nombreUsuario: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  public async handleLogin(): Promise<void> {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    const { nombreUsuario, password } = this.loginForm.value;

    try {
      const response = await this.authService.login(nombreUsuario, password);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      const user = await this.authService.getCurrentUser();

      localStorage.setItem('user', JSON.stringify(user));

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
