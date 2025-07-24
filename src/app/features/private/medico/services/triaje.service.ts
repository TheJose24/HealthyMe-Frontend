import { Injectable } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface ITriaje {
  id: number;
  fecha: string;
  hora: string;
  peso: number;
  talla: number;
  presionArterial: number;
  frecuenciaCardiaca: number;
  frecuenciaRespiratoria: number;
}

@Injectable({ providedIn: 'root' })
export class TriajeService {
  private baseUrl = `${environment.apiUrl}/api/v1/triajes`;

  public constructor(private http: HttpClient) {}

  public getByPaciente(idPaciente: number): Observable<ITriaje[]> {
    return this.http.get<ITriaje[]>(`${this.baseUrl}/paciente/${idPaciente}`);
  }
}
