import { Injectable } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface IConsultaDTO {
  idConsulta: number;
  fecha: string;
  sintomas: string;
  diagnostico: string;
  idCita: number;
  idPaciente: number;
  idMedico: number;
}

@Injectable({ providedIn: 'root' })
export class ConsultaService {
  private baseUrl = `${environment.apiUrl}/api/v1/consultas`;

  public constructor(private http: HttpClient) {}

  public list(): Observable<IConsultaDTO[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      map(rawList =>
        rawList.map(r => ({
          idConsulta: r.id_consulta ?? r.idConsulta,
          fecha: r.fecha,
          sintomas: r.sintomas,
          diagnostico: r.diagnostico,
          idCita: r.id_cita ?? r.idCita,
          idPaciente: r.id_paciente ?? r.idPaciente,
          idMedico: r.id_medico ?? r.idMedico,
        }))
      )
    );
  }

  public buscarPorId(id: number): Observable<IConsultaDTO> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(r => ({
        idConsulta: r.id_consulta,
        fecha: r.fecha,
        sintomas: r.sintomas,
        diagnostico: r.diagnostico,
        idMedico: r.id_medico,
        idCita: r.id_cita,
        idPaciente: r.id_paciente,
      }))
    );
  }
}
