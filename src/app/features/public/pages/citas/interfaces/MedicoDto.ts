import type { PersonaDTO } from './PersonaDTO';

export interface MedicoDto {
  id_medico: number;
  id_usuario: number;
  id_especialidad: number;
  nombre_usuario: string;
  persona: PersonaDTO;
}
