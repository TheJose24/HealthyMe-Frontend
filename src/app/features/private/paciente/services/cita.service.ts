import { Injectable } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { map } from 'rxjs';

export interface ICitaDTO {
  id: string;
  fecha: string;
  hora: string;
  estado: 'PENDIENTE' | 'REALIZADA' | 'CANCELADA';
  idMedico: number;
  idPaciente: number;
  idConsultorio: number;
  nombreMedico: string;
  nombreEspecialidad: string;

  nombreConsultorio?: string;
  nombreSede?: string;
  numeroHabitacion?: number;
}

export interface ICounts {
  pendientes: number;
  realizadas: number;
  canceladas: number;
}

@Injectable({ providedIn: 'root' })
export class CitaService {
  private baseUrl = `${environment.apiUrl}/api/v1/citas`;

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
    return this.http
      .get<ICitaDTO[]>(`${this.baseUrl}/usuario/${usuarioId}`)
      .pipe(map(list => list.map(this.toDto)));
  }
  public getByUsuarioAndEstado(usuarioId: number, estado: string): Observable<ICitaDTO[]> {
    return this.http
      .get<ICitaDTO[]>(`${this.baseUrl}/usuario/${usuarioId}?estado=${estado}`)
      .pipe(map(list => list.map(this.toDto)));
  }

  public marcarCancelada(usuarioId: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${usuarioId}/estado`, {
      estado: 'CANCELADA',
    });
  }
  public getById(id: string): Observable<ICitaDTO> {
    return this.http.get<ICitaDTO>(`${this.baseUrl}/${id}`).pipe(map(this.toDto));
  }
  private toDto = (r: any): ICitaDTO => ({
    id: r.id ?? r.id_cita ?? '',
    fecha: r.fecha,
    hora: r.hora,
    estado: r.estado,
    idMedico: r.idMedico ?? r.id_medico ?? null,
    idPaciente: r.idPaciente ?? r.id_paciente,
    nombreMedico: '',
    nombreEspecialidad: '',
    idConsultorio: r.idConsultorio ?? r.id_consultorio ?? null,
  });
}
