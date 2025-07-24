import { Injectable } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface IExamen {
  idExamen: number;
  nombreExamen: string;
  resultados?: string;
  observaciones?: string;
  fechaRealizacion: string;
  idPaciente: number;
}

@Injectable({ providedIn: 'root' })
export class ExamenService {
  private baseUrl = `${environment.apiUrl}/api/v1/examenes`;

  public constructor(private http: HttpClient) {}

  public getByPaciente(idPaciente: number): Observable<IExamen[]> {
    return this.http.get<IExamen[]>(`${this.baseUrl}/paciente/${idPaciente}`);
  }

  public pdfUrl(idExamen: number): string {
    return `${this.baseUrl}/${idExamen}/pdf`;
  }

  public getPdf(idExamen: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${idExamen}/pdf`, {
      responseType: 'blob',
      headers: { Accept: 'application/pdf' },
    });
  }
}
