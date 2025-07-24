import { Injectable } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HttpClient, HttpParams } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface ICita {
  id: string;
  fecha: string;
  hora: string;
  estado: 'PENDIENTE' | 'REALIZADA' | 'CANCELADA';
  idPaciente: number;
  idMedico: number;

  pacienteNombre?: string;
  nombreEspecialidad?: string;
}

@Injectable({ providedIn: 'root' })
export class CitaService {
  private baseUrl = `${environment.apiUrl}/api/v1/citas`;

  public constructor(private http: HttpClient) {}

  public getCitasPorMedico(idMedico: number, start: string, end: string): Observable<ICita[]> {
    const params = new HttpParams().set('start', start).set('end', end);
    return this.http.get<ICita[]>(`${this.baseUrl}/medico/${idMedico}`, { params });
  }

  public getHoyByMedico(idMedico: number, estado: string = 'PENDIENTE'): Observable<ICita[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}/medico/${idMedico}/hoy?estado=${estado}`)
      .pipe(map(list => list.map(this.toDto)));
  }

  public marcarRealizada(id: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/estado`, {
      estado: 'REALIZADA',
    });
  }

  public getById(id: string): Observable<ICita> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(map(this.toDto));
  }

  private toDto = (r: any): ICita => ({
    id: r.id ?? r.id_cita,
    fecha: r.fecha,
    hora: r.hora,
    estado: r.estado,
    idPaciente: r.idPaciente ?? r.id_paciente,
    idMedico: r.idMedico ?? r.id_medico,
    nombreEspecialidad: r.nombreEspecialidad ?? r.especialidad,
    pacienteNombre: r.pacienteNombre ?? r.nombrePaciente,
  });
}
