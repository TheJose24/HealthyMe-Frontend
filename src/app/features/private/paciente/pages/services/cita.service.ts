import { Injectable } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';

export interface ICitaDTO {
  id: string;
  fecha: string;
  hora: string;
  estado: 'PENDIENTE' | 'REALIZADA' | 'CANCELADA';
  idMedico: number;
  idPaciente: number;
}

export interface ICounts {
  pendientes: number;
  cumplidas: number;
  canceladas: number;
}

@Injectable({ providedIn: 'root' })
export class CitaService {
  private baseUrl = `${environment.apiUrl}/api/citas`;

  public constructor(private http: HttpClient) {}

  public getNextByUsuario(usuarioId: number): Observable<ICitaDTO> {
    return this.http.get<ICitaDTO>(`${this.baseUrl}/usuario/${usuarioId}/proxima`);
  }

  public getCountsByUsuario(usuarioId: number): Observable<ICounts> {
    return this.http.get<ICounts>(`${this.baseUrl}/usuario/${usuarioId}/count`);
  }

  public getUltimasByUsuario(usuarioId: number, size = 5): Observable<ICitaDTO[]> {
    return this.http.get<ICitaDTO[]>(`${this.baseUrl}/usuario/${usuarioId}/ultimas?size=${size}`);
  }
  public getAllByUsuario(usuarioId: number): Observable<ICitaDTO[]> {
    return this.http.get<ICitaDTO[]>(`${environment.apiUrl}/usuario/${usuarioId}`);
  }
  public getByUsuarioAndEstado(usuarioId: number, estado: string): Observable<ICitaDTO[]> {
    return this.http.get<ICitaDTO[]>(`${environment.apiUrl}/usuario/${usuarioId}?estado=${estado}`);
  }
  public delete(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/${id}`);
  }
  public getById(id: string): Observable<ICitaDTO> {
    return this.http.get<ICitaDTO>(`${environment.apiUrl}/${id}`);
  }
}
