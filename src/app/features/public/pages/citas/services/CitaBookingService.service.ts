import { Injectable } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { type Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import type { RegisterRequest } from '../interfaces/RegisterRequest';
import type { RegisterResponse } from '../interfaces/RegisterResponse';
import type { PacienteDTO } from '../interfaces/PacienteDTO';
import type { CreatePagoDTO } from '../interfaces/CreatePagoDTO';
import type { CitaDTO } from '../interfaces/CitaDTO';
import type { PagoResponse } from '../interfaces/PagoResponse';
import type { CitaResponse } from '../interfaces/CitaResponse';
import type { EspecialidadDto } from '../interfaces/EspecialidadDto';
import type { MedicoDto } from '../interfaces/MedicoDto';
import type { MetodoPagoDTO } from '../interfaces/MetodoPagoDTO';

@Injectable({
  providedIn: 'root',
})
export class CitaBookingService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * 1. Registrar usuario
   */
  public registerUser(userData: RegisterRequest): Observable<RegisterResponse> {
    return this.http
      .post<RegisterResponse>(`${this.apiUrl}/api/v1/auth/signup`, userData)
      .pipe(catchError(this.handleError));
  }

  /**
   * 2. Crear paciente
   */
  public createPaciente(pacienteData: PacienteDTO): Observable<PacienteDTO> {
    return this.http
      .post<PacienteDTO>(`${this.apiUrl}/api/v1/pacientes`, pacienteData)
      .pipe(catchError(this.handleError));
  }

  /**
   * 3. Procesar pago
   */
  public processPago(pagoData: CreatePagoDTO): Observable<PagoResponse> {
    return this.http
      .post<PagoResponse>(`${this.apiUrl}/api/v1/pagos`, pagoData)
      .pipe(catchError(this.handleError));
  }

  /**
   * 4. Crear cita
   */
  public createCita(citaData: CitaDTO): Observable<CitaResponse> {
    return this.http
      .post<CitaResponse>(`${this.apiUrl}/api/v1/citas`, citaData)
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtener todas las especialidades del backend
   */
  public getEspecialidades(): Observable<{ id: number; nombre: string }[]> {
    return this.http.get<EspecialidadDto[]>(`${this.apiUrl}/api/v1/especialidades`).pipe(
      map(especialidades =>
        especialidades.map(esp => ({
          id: esp.id_especialidad,
          nombre: esp.nombre_especialidad,
        }))
      ),
      catchError(this.handleError)
    );
  }

  /**
   * Obtener médicos por ID de especialidad usando el endpoint real
   */
  public getMedicosByEspecialidadId(
    idEspecialidad: number
  ): Observable<{ id: number; nombre: string }[]> {
    return this.http
      .get<MedicoDto[]>(`${this.apiUrl}/api/v1/medicos/especialidad/${idEspecialidad}`)
      .pipe(
        map(medicos =>
          medicos.map(medico => ({
            id: medico.id_medico,
            nombre: `Dr(a). ${medico.nombre_usuario}`,
          }))
        ),
        catchError(this.handleError)
      );
  }

  /**
   * Obtener médicos por nombre de especialidad (método auxiliar)
   * Este método primero obtiene el ID de la especialidad y luego los médicos
   */
  public getMedicosByEspecialidad(
    nombreEspecialidad: string
  ): Observable<{ id: number; nombre: string }[]> {
    return this.getEspecialidades().pipe(
      map(especialidades => {
        const especialidadEncontrada = especialidades.find(
          esp => esp.nombre === nombreEspecialidad
        );

        if (!especialidadEncontrada) {
          throw new Error(`No se encontró la especialidad: ${nombreEspecialidad}`);
        }

        return especialidadEncontrada.id;
      }),
      // Usar switchMap para cambiar al observable de médicos
      switchMap(idEspecialidad => this.getMedicosByEspecialidadId(idEspecialidad)),
      catchError(this.handleError)
    );
  }

  /**
   * Obtener métodos de pago activos del backend
   */
  public getMetodosPago(): Observable<{ id: number; nombre: string }[]> {
    return this.http.get<MetodoPagoDTO[]>(`${this.apiUrl}/api/v1/metodos-pago/activos`).pipe(
      map(metodos =>
        metodos.map(metodo => ({
          id: metodo.id,
          nombre: metodo.nombre,
        }))
      ),
      catchError(this.handleError)
    );
  }

  /**
   * Manejo centralizado de errores
   */
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'Ha ocurrido un error inesperado';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      switch (error.status) {
        case 400:
          errorMessage = error.error?.message || 'Datos inválidos';
          break;
        case 401:
          errorMessage = 'No autorizado';
          break;
        case 403:
          errorMessage = 'Acceso denegado';
          break;
        case 404:
          errorMessage = 'Recurso no encontrado';
          break;
        case 409:
          errorMessage = error.error?.message || 'Conflicto en los datos';
          break;
        case 500:
          errorMessage = 'Error interno del servidor';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.error?.message || 'Error desconocido'}`;
      }
    }

    console.error('Error en CitaBookingService:', error);
    return throwError(() => new Error(errorMessage));
  };
}
