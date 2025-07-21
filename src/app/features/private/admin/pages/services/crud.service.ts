import { Injectable } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';

export interface MedicoDTO {
  idMedico: number;
  idUsuario: number;
  idEspecialidad: number;
  idHorarios: HorarioMedicoDto[];
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
}

export interface ContratoDto {
  idContrato: number;
  fechaInicio: string; // YYYY-MM-DD
  fechaFin: string; // YYYY-MM-DD
  activo: boolean;
}

export interface HorarioMedicoDto {
  idMedico: number;
  idHorario: number;
}

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

  public constructor(private http: HttpClient) {}

  // MÉDICOS
  public getMedicos(): Observable<MedicoDTO[]> {
    return this.http.get<MedicoDTO[]>(this.medicoUrl);
  }

  public createMedico(medico: MedicoDTO): Observable<MedicoDTO> {
    return this.http.post<MedicoDTO>(this.medicoUrl, medico);
  }

  public updateMedico(id: number, medico: MedicoDTO): Observable<MedicoDTO> {
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
}
