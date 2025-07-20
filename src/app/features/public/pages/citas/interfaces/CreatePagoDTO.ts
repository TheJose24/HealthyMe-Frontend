import type { EntidadOrigen } from '../enums/EntidadOrigen';

export interface CreatePagoDTO {
  monto: number;
  id_metodo_pago: number;
  entidad_referencia: EntidadOrigen;
  id_referencia: number;
  id_paciente: number;
}
