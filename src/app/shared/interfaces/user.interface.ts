import type { EstadoUsuario } from './estado.enum'; // si defines tu enum también
import type { PersonaDTO } from './persona.interface'; // si lo modelas aparte
import type { ContratoDTO } from './contrato.interface'; // igual para contratos

export interface UserDTO {
  idUsuario: number;
  nombreUsuario: string;
  estado: EstadoUsuario; // 'ACTIVO' | 'SUSPENDIDO' | 'ELIMINADO'
  imagenPerfil: string;
  rol: string; // e.g. 'ADMIN', 'PACIENTE'
  persona: PersonaDTO;
  contratos: ContratoDTO[];
}
