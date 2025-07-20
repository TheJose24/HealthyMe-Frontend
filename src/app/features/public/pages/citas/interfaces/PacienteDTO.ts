import type { SeguroDTO } from './SeguroDTO';

export interface PacienteDTO {
  id?: number;
  id_usuario: number;
  seguro?: SeguroDTO;
}
