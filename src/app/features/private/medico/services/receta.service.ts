import { Injectable } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface IMedicamento {
  nombre: string;
  dosis: string;
  indicaciones: string;
}

export interface IReceta {
  idReceta: number;
  fechaEmision: string;
  idConsulta: number;
  medicamentos: IMedicamento[];
}

@Injectable({ providedIn: 'root' })
export class RecetaService {
  private baseUrl = `${environment.apiUrl}/api/v1/recetas`;

  public constructor(private http: HttpClient) {}

  public getByPaciente(idPaciente: number): Observable<IReceta[]> {
    return this.http.get<IReceta[]>(`${this.baseUrl}/paciente/${idPaciente}`);
  }

  public pdfUrl(idReceta: number): string {
    return `${this.baseUrl}/${idReceta}/pdf`;
  }

  public getPdf(idReceta: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${idReceta}/pdf`, {
      responseType: 'blob',
      headers: { Accept: 'application/pdf' },
    });
  }
}
