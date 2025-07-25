import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { AuthService } from '../../../../shared/services/auth.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  public loginForm: FormGroup;
  public error: string | null = null;
  public isLoading = false;
  public showPassword = false;

  public constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      nombreUsuario: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  public async handleLogin(): Promise<void> {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    this.error = null;

    const { nombreUsuario, password } = this.loginForm.value;

    try {
      const response = await this.authService.login(nombreUsuario, password);

      const storage = localStorage;
      storage.setItem('accessToken', response.accessToken);
      storage.setItem('refreshToken', response.refreshToken);

      const user = await this.authService.getCurrentUser();
      storage.setItem('user', JSON.stringify(user));

      // Navegación basada en rol
      this.navigateByRole(user.rol);
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      this.error = this.getErrorMessage(error);
    } finally {
      this.isLoading = false;
    }
  }

  private navigateByRole(rol: string): void {
    const routes = {
      ADMIN: '/admin',
      PACIENTE: '/paciente',
      MEDICO: '/medico',
    };
    const route = routes[rol as keyof typeof routes] || '/unauthorized';
    this.router.navigate([route]);
  }

  private getErrorMessage(error: any): string {
    if (error?.status === 401) {
      return 'Usuario o contraseña incorrectos';
    } else if (error?.status === 403) {
      return 'Usuario suspendido o sin permisos';
    } else if (error?.status === 0) {
      return 'Error de conexión. Verifica tu internet';
    }
    return 'Error inesperado. Intenta nuevamente';
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });
  }

  public getFieldError(fieldName: string): string | null {
    const field = this.loginForm.get(fieldName);
    if (field?.touched && field?.errors) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} es requerido`;
      }
      if (field.errors['minlength']) {
        const minLength = field.errors['minlength'].requiredLength;
        return `Mínimo ${minLength} caracteres`;
      }
    }
    return null;
  }

  private getFieldLabel(fieldName: string): string {
    const labels = {
      nombreUsuario: 'Usuario',
      password: 'Contraseña',
    };
    return labels[fieldName as keyof typeof labels] || fieldName;
  }

  public isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field?.touched && field?.errors);
  }
}
