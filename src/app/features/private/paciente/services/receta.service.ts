import { Injectable } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface IMedicamentoDTO {
  nombre: string;
  dosis: string;
  indicaciones: string;
}

export interface IRecetaDTO {
  idReceta: number;
  fechaEmision: Date;
  idConsulta: number;
  medicamentos: IMedicamentoDTO[];
}

@Injectable({ providedIn: 'root' })
export class RecetaService {
  private baseUrl = `${environment.apiUrl}/api/v1/recetas`;

  public constructor(private http: HttpClient) {}

  public list(): Observable<IRecetaDTO[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      map(raw =>
        raw.map(
          r =>
            ({
              idReceta: r.id_receta ?? r.idReceta,
              fechaEmision: new Date(`${r.fecha_emision}T00:00:00`),
              idConsulta: r.id_consulta ?? r.idConsulta,
              medicamentos: r.medicamentos,
            }) as IRecetaDTO
        )
      )
    );
  }

  public descargarPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/pdf`, {
      responseType: 'blob',
    });
  }
}
