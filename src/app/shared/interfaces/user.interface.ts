import type { EEstadoUsuario } from './estado.enum'; // si defines tu enum también
import type { IPersonaDTO } from './persona.interface'; // si lo modelas aparte
import type { IContratoDTO } from './contrato.interface'; // igual para contratos

export interface IUserDTO {
  idUsuario: number;
  nombreUsuario: string;
  estado: EEstadoUsuario; // 'ACTIVO' | 'SUSPENDIDO' | 'ELIMINADO'
  imagenPerfil: string;
  rol: string; // e.g. 'ADMIN', 'PACIENTE'
  persona: IPersonaDTO;
  contratos: IContratoDTO[];
}
