import { Injectable } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface IMedicoDto {
  id: number;
  nombre: string;
  apellido: string;
  especialidad: string;
}

@Injectable({ providedIn: 'root' })
export class MedicoService {
  private readonly baseUrl = `${environment.apiUrl}/api/v1/medicos`;

  public constructor(private http: HttpClient) {}

  public getMedico(id: number): Observable<IMedicoDto> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(m => ({
        ...m,
        especialidad: m.nombre_especialidad,
      }))
    );
  }
}
