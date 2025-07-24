import { Injectable } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { map } from 'rxjs';

export interface ISeguroDto {
  id: number;
  nombre: string;
}

export interface IPacienteDto {
  id: number;
  idUsuario: number;

  nombre: string;
  apellido: string;
  seguro?: ISeguroDto;
  nombreCompleto: string;
}

@Injectable({ providedIn: 'root' })
export class PacienteService {
  private baseUrl = `${environment.apiUrl}/api/v1/pacientes`;

  public constructor(private http: HttpClient) {}

  public getPaciente(idPaciente: number): Observable<IPacienteDto> {
    return this.http.get<IPacienteDto>(`${this.baseUrl}/${idPaciente}`).pipe(
      map(p => ({
        ...p,
        nombreCompleto: `${p.nombre} ${p.apellido}`,
      }))
    );
  }

  public getPacienteByUsuario(idUsuario: number): Observable<IPacienteDto> {
    return this.http.get<IPacienteDto>(`${this.baseUrl}/usuario/${idUsuario}`);
  }

  public getTodos(): Observable<IPacienteDto[]> {
    return this.http.get<IPacienteDto[]>(this.baseUrl);
  }
}
