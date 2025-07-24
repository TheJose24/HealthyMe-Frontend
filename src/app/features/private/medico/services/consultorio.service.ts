// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface IConsultorioDTO {
  id: number;
  nombre: string;
  nombreSede: string;
  numeroHabitacion: number;
}

@Injectable({
  providedIn: 'root',
})
export class ConsultorioService {
  private baseUrl = `${environment.apiUrl}/api/v1/consultorios`;

  public constructor(private http: HttpClient) {}

  public get(id: number): Observable<IConsultorioDTO> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(raw => ({
        id: raw.id ?? raw.id,
        nombre: raw.nombre ?? raw.nombre,
        nombreSede: raw.nombre_sede ?? raw.nombreSede ?? '—',
        numeroHabitacion: raw.numero_habitacion ?? raw.numeroHabitacion ?? 0,
      }))
    );
  }
}
