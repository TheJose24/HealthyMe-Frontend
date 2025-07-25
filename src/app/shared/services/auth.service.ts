// src/app/shared/services/auth.service.ts

import { Injectable } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import type { IAuthResponse } from '../../shared/models/auth-response.model';
import type { IUserDTO } from '../../shared/interfaces/user.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public error: string | null = null;
  private baseUrl = `${environment.apiUrl}/api/v1`;

  public constructor(private http: HttpClient) {}

  /** Login: devuelve AuthResponse o lanza HttpErrorResponse */
  public async login(nombreUsuario: string, password: string): Promise<IAuthResponse> {
    try {
      const payload = { nombre_usuario: nombreUsuario, contrasena: password };
      const res = await this.http.post<any>(`${this.baseUrl}/auth/login`, payload).toPromise();

      if (!res?.access_token || !res?.refresh_token) {
        this.error = 'Tokens faltantes en la respuesta';
        throw new Error(this.error);
      }

      const mapped: IAuthResponse = {
        accessToken: res.access_token,
        refreshToken: res.refresh_token,
        username: res.username,
        rol: res.rol,
      };

      // guardar tokens en localStorage
      localStorage.setItem('accessToken', mapped.accessToken);
      localStorage.setItem('refreshToken', mapped.refreshToken);

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
  public async getCurrentUser(): Promise<IUserDTO> {
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
        .get<IUserDTO>(`${this.baseUrl}/users/me`, { headers })
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
