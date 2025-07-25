import { Injectable } from '@angular/core';
import type { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';

//Medico que se envia al backend
export interface MedicoFormDto {
  id_medico?: number; // opcional para POST
  id_usuario: number;
  id_especialidad: number;
  estado: EstadoUsuario;
  rol: string;
}

//Medico que se recibe del backend
export interface MedicoDTO {
  idMedico: number;
  idUsuario: number;
  idEspecialidad: number;
  nombreUsuario: string;
  estado: EstadoUsuario;
  imagenPerfil: string;
  rol: string;
  persona: PersonaDto;
  contratos: ContratoDto[];
}

export type EstadoUsuario = 'ACTIVO' | 'SUSPENDIDO' | 'ELIMINADO';

export interface PersonaDto {
  dni: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string; // YYYY-MM-DD
  sexo: string;
  direccion: string;
  telefono: string;
  email: string;
  edad: number;
  nombreCompleto?: string;
}

export interface UserDTO {
  id: number;
  username: string;
  email: string;
  roles: string[];
  estado: EstadoUsuario;
  persona: PersonaDto;
}

export interface ContratoDto {
  idContrato: number;
  fechaInicio: string;
  fechaFin: string;
  activo: boolean;
}

export interface EspecialidadDto {
  idEspecialidad: number;
  nombreEspecialidad: string;
  imgEspecialidad: string;
}

//Paciente
export interface PacienteDTO {
  idPaciente: number;
  idUsuario: number;
  seguro: SeguroDto;
}

export interface SeguroDto {
  id: number;
  nombre: string;
}

@Injectable({ providedIn: 'root' })
export class CrudService {
  private medicoUrl = `${environment.apiUrl}/api/v1/medicos`;
  private pacienteUrl = `${environment.apiUrl}/api/v1/pacientes`;
  private especialidadUrl = `${environment.apiUrl}/api/v1/especialidades`;
  private userUrl = `${environment.apiUrl}/api/v1/users`;

  public constructor(private http: HttpClient) {}

  // MÉDICOS
  public getMedicos(): Observable<MedicoDTO[]> {
    return this.http.get<MedicoDTO[]>(this.medicoUrl);
  }

  public createMedico(medico: MedicoFormDto): Observable<MedicoDTO> {
    return this.http.post<MedicoDTO>(this.medicoUrl, medico);
  }

  public updateMedico(id: number, medico: MedicoFormDto): Observable<MedicoDTO> {
    return this.http.put<MedicoDTO>(`${this.medicoUrl}/${id}`, medico);
  }

  public deleteMedico(id: number): Observable<void> {
    return this.http.delete<void>(`${this.medicoUrl}/${id}`);
  }

  // PACIENTES
  public getPacientes(): Observable<PacienteDTO[]> {
    return this.http.get<PacienteDTO[]>(this.pacienteUrl);
  }

  public createPaciente(paciente: PacienteDTO): Observable<PacienteDTO> {
    return this.http.post<PacienteDTO>(this.pacienteUrl, paciente);
  }

  public updatePaciente(id: number, paciente: PacienteDTO): Observable<PacienteDTO> {
    return this.http.put<PacienteDTO>(`${this.pacienteUrl}/${id}`, paciente);
  }

  public deletePaciente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.pacienteUrl}/${id}`);
  }
  // ESPECIALIDADES
  public getEspecialidades(): Observable<EspecialidadDto[]> {
    return this.http.get<EspecialidadDto[]>(this.especialidadUrl);
  }
  public createEspecialidad(especialidad: EspecialidadDto): Observable<EspecialidadDto> {
    return this.http.post<EspecialidadDto>(this.especialidadUrl, especialidad);
  }
  public updateEspecialidad(
    id: number,
    especialidad: EspecialidadDto
  ): Observable<EspecialidadDto> {
    return this.http.put<EspecialidadDto>(`${this.especialidadUrl}/${id}`, especialidad);
  }
  public deleteEspecialidad(id: number): Observable<void> {
    return this.http.delete<void>(`${this.especialidadUrl}/${id}`);
  }

  // USUARIOS
  /**
   * Actualiza el rol de un usuario.
   */
  public updateUserRole(id: number, rolNombre: string): Observable<UserDTO> {
    const params = new HttpParams().set('rolNombre', rolNombre);
    return this.http.put<UserDTO>(`${this.userUrl}/${id}/role`, null, { params });
  }

  /**
   * Activa un usuario.
   * PUT /api/v1/users/{id}/activate
   */
  public activateUser(id: number): Observable<void> {
    return this.http.put<void>(`${this.userUrl}/${id}/activate`, null);
  }

  /**
   * Suspende un usuario.
   * PUT /api/v1/users/{id}/suspend
   */
  public suspendUser(id: number): Observable<void> {
    return this.http.put<void>(`${this.userUrl}/${id}/suspend`, null);
  }

  /**
   * Elimina (marca como ELIMINADO) un usuario.
   * DELETE /api/v1/users/{id}
   */
  public deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.userUrl}/${id}`);
  }
}
