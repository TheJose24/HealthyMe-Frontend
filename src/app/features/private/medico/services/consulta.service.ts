import { Injectable } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface IConsulta {
  idConsulta?: number;
  sintomas: string;
  diagnostico: string;
  fecha: string;
  idCita: number;
  idPaciente: number;
  idMedico: number;
}

@Injectable({ providedIn: 'root' })
export class ConsultaService {
  private baseUrl = `${environment.apiUrl}/api/v1/consultas`;

  public constructor(private http: HttpClient) {}

  public getByPaciente(idPaciente: number): Observable<IConsulta[]> {
    return this.http.get<IConsulta[]>(`${this.baseUrl}/paciente/${idPaciente}`);
  }

  public guardar(dto: Omit<IConsulta, 'idConsulta'>): Observable<IConsulta> {
    const payload = {
      sintomas: dto.sintomas.trim(),
      diagnostico: dto.diagnostico.trim(),
      fecha: dto.fecha,
      id_cita: dto.idCita,
      id_paciente: dto.idPaciente,
      id_medico: dto.idMedico,
    };

    return this.http.post<IConsulta>(this.baseUrl, payload);
  }
}
