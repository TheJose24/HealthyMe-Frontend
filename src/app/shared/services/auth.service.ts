// src/app/shared/services/auth.service.ts

import { Injectable } from '@angular/core';
import type { HttpClient } from '@angular/common/http';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import type { AuthResponse } from '../../shared/models/auth-response.model';
import type { UserDTO } from '../../shared/interfaces/user.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/api/v1`;
  public error: string | null = null;

  constructor(private http: HttpClient) {}

  /** Login: devuelve AuthResponse o lanza HttpErrorResponse */
  async login(nombreUsuario: string, password: string): Promise<AuthResponse> {
    try {
      const payload = { nombre_usuario: nombreUsuario, contrasena: password };
      const res = await this.http.post<any>(`${this.baseUrl}/auth/login`, payload).toPromise();

      if (!res?.access_token || !res?.refresh_token) {
        this.error = 'Tokens faltantes en la respuesta';
        throw new Error(this.error);
      }

      const mapped: AuthResponse = {
        accessToken: res.access_token,
        refreshToken: res.refresh_token,
        username: res.username,
        rol: res.rol,
      };

      return mapped;
    } catch (err) {
      // Mapeo de HttpErrorResponse vs. otros errores
      if (err instanceof HttpErrorResponse) {
        this.error =
          err.error?.message || `Error ${err.status}: ${err.statusText || 'Bad Request'}`;
      } else {
        this.error = (err as Error).message;
      }

      console.error('AuthService.login error →', this.error);
      throw err;
    }
  }

  /** Obtiene el usuario actual o lanza error */
  async getCurrentUser(): Promise<UserDTO> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        this.error = 'No hay token de acceso';
        throw new Error(this.error);
      }

      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      const user = await this.http
        .get<UserDTO>(`${this.baseUrl}/users/me`, { headers })
        .toPromise();

      if (!user) {
        this.error = 'No se pudo obtener el usuario';
        throw new Error(this.error);
      }

      return user;
    } catch (err) {
      if (err instanceof HttpErrorResponse) {
        this.error =
          err.error?.message ||
          `Error ${err.status}: ${err.statusText || 'Error al obtener usuario'}`;
      } else {
        this.error = (err as Error).message;
      }

      console.error('AuthService.getCurrentUser error →', this.error);
      throw err;
    }
  }
}
