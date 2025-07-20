import type { EstadoCita } from '../enums/EstadoCita';

export interface CitaDTO {
  id?: string;
  fecha: string; // yyyy-MM-dd
  hora: string; // HH:mm:ss
  estado: EstadoCita;
  id_paciente: number;
  id_medico: number;
  id_consultorio?: string;
}
