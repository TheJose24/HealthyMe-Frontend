import { Injectable } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';

export interface ITriajeDTO {
  id: number;
  fecha: string;
  peso: number;
  talla: number;
  presionSistolica: number;
  presionDiastolica: number;
  frecuenciaCardiaca: number;
}

@Injectable({ providedIn: 'root' })
export class TriajeService {
  private baseUrl = `${environment.apiUrl}/api/v1/triajes`;

  public constructor(private http: HttpClient) {}

  public getTriajesByUsuario(usuarioId: number): Observable<ITriajeDTO[]> {
    return this.http.get<ITriajeDTO[]>(`${this.baseUrl}/paciente/${usuarioId}`);
  }
}
