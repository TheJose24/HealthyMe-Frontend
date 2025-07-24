import { Injectable } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

export interface ITriajeDTO {
  id: number;
  fecha: string;
  peso: number;
  talla: number;
  presionArterial: number;
  frecuenciaCardiaca: number;
}

@Injectable({ providedIn: 'root' })
export class TriajeService {
  private baseUrl = `${environment.apiUrl}/api/v1/triajes`;

  public constructor(private http: HttpClient) {}

  public getTriajesByUsuario(usuarioId: number): Observable<ITriajeDTO[]> {
    return this.http.get<any[]>(`${this.baseUrl}/paciente/${usuarioId}`).pipe(
      map(arr =>
        arr.map(item => ({
          id: item.id_triaje,
          fecha: item.fecha,
          peso: +item.peso,
          talla: +item.talla,
          presionArterial: +item.presion_arterial,
          frecuenciaCardiaca: +item.frecuencia_cardiaca,
        }))
      )
    );
  }
}
