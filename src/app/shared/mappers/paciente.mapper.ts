import type { PacienteDTO } from '../../features/private/admin/pages/services/crud.service';

export function normalizePaciente(paciente: PacienteDTO): any {
  return {
    id: paciente.idPaciente,
    id_usuario: paciente.idUsuario,
    seguro: {
      id: paciente.seguro?.id,
      nombre: paciente.seguro?.nombre,
    },
  };
}
