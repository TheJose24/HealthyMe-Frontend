import { Injectable } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface IMedicoDTO {
  idMedico: number;
  nombreMedico: string;
  nombreEspecialidad: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class MedicoService {
  private baseUrl = `${environment.apiUrl}/api/v1/medicos`;

  public constructor(private http: HttpClient) {}

  public get(id: number): Observable<IMedicoDTO> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(raw => ({
        idMedico: raw.id_medico ?? raw.idMedico,
        nombreMedico: raw.nombre_medico ?? raw.nombreMedico,
        nombreEspecialidad: raw.nombre_especialidad ?? raw.nombreEspecialidad,
        email: raw.email ?? '',
      }))
    );
  }

  public getNombreCompleto(id: number): Observable<string> {
    return this.get(id).pipe(map(m => m.nombreMedico ?? `Médico #${id}`));
  }

  public getEspecialidad(id: number): Observable<string> {
    return this.get(id).pipe(map(m => m.nombreEspecialidad ?? '—'));
  }
}
