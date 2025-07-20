import { HttpClient } from '@angular/common/http';
import type { HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import type { IEspecialidad, IMedico } from './doctor.model';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  private urlApiMedico = `${environment.apiUrl}/api/v1/medicos`;
  private urlApiEspecialidad = `${environment.apiUrl}/api/v1/especialidades`;

  constructor(@Inject(HttpClient) private http: HttpClient) {}

  // Obtener todos los medicos
  listAllMedicos(): Observable<IMedico[]> {
    return this.http.get<IMedico[]>(this.urlApiMedico).pipe(catchError(this.handleError));
  }

  // Obtener especilidad by Medico
  listEspecialidadByMedico(idEspecialidad: number): Observable<IEspecialidad[]> {
    return this.http
      .get<IEspecialidad[]>(`${this.urlApiEspecialidad}/${idEspecialidad}`)
      .pipe(catchError(this.handleError));
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 0) {
      console.error('Se ha producido un error', error.error);
    } else {
      console.error('No retorno', error.status, error.error);
    }
    return throwError(() => new Error('Algo salio mal. Intenete nuevamente'));
  }
}
