export interface FiltrosReporte {
  tipoReporte: 'mensual' | 'anual';
  anio: number;
  mes?: number;
  fechaInicio?: string; // formato 'yyyy-MM-dd'
  fechaFin?: string; // formato 'yyyy-MM-dd'
}

// DTOs del backend
export interface ReporteGeneralDTO {
  fecha_generacion: string; // ISO DateTime
  total_citas: number;
  citas_pendientes: number;
  citas_realizadas: number;
  ingresos_totales: number;
  ingresos_mes_actual: number;
  medicos_activos: number;
  pacientes_totales: number;
  especialidades_mas_solicitadas: EspecialidadContadaDTO[];
}

export interface ReporteMensualDTO {
  mes: string; // formato 'yyyy-MM-dd'
  citasDelMes: number;
  ingresosDelMes: number;
  medicosActivosDelMes: number;
  citasPorDia: CitasPorDiaDTO[];
  ingresosPorDia: IngresosPorDiaDTO[];
}

export interface ReporteAnualDTO {
  year: number;
  citasDelAno: number;
  ingresosDelAno: number;
  reportesPorMes: ReporteMensualDTO[];
}

export interface CitasReporteDTO {
  fecha_inicio: string;
  fecha_fin: string;
  total_citas: number;
  citas_pendientes: number;
  citas_realizadas: number;
  citas_canceladas: number;
  tasa_completitud: number; // Porcentaje de citas realizadas
  citas_por_dia: CitasPorDiaDTO[];
}

export interface BalanceMensualDTO {
  fechaInicio: string;
  fechaFin: string;
  monto: number;
  ingresos: number;
  cantidadTransacciones: number;
}

export interface CitasPorDiaDTO {
  fecha: string;
  cantidad: number;
}

export interface IngresosPorDiaDTO {
  fecha: string;
  monto: number;
}

export interface CitasPorEspecialidadDTO {
  especialidad: string;
  cantidad: number;
}

export interface EspecialidadContadaDTO {
  especialidad: string;
  cantidad: number;
}

// Interfaces adaptadas para el frontend (mantener compatibilidad)
export interface ReporteGeneral {
  periodo: string;
  totalCitas: number;
  citasCompletadas: number;
  citasCanceladas: number;
  totalIngresos: number;
  medicosActivos: number;
  pacientesAtendidos: number;
  variaciones: {
    citas: number;
    ingresos: number;
    medicos: number;
    pacientes: number;
  };
}

export interface ReporteCitas {
  total_citas: number;
  citasPorEstado: {
    estado: string;
    cantidad: number;
    porcentaje: number;
  }[];
  citasPorDia?: {
    fecha: string;
    cantidad: number;
  }[];
  citasPorMes?: {
    mes: string;
    cantidad: number;
  }[];
}

export interface ReporteIngresos {
  totalIngresos: number;
  ingresosPorMetodoPago: {
    metodoPago: string;
    monto: number;
    porcentaje: number;
  }[];
  ingresosPorEspecialidad: {
    especialidad: string;
    monto: number;
    porcentaje: number;
  }[];
  ingresosPorPeriodo?: {
    periodo: string;
    monto: number;
  }[];
}

export interface ReporteMedicos {
  totalMedicos: number;
  medicosActivos: number;
  medicosInactivos: number;
  medicosPorEspecialidad: {
    especialidad: string;
    cantidad: number;
    activos: number;
  }[];
  topMedicosPorCitas: {
    medico: string;
    especialidad: string;
    totalCitas: number;
    citasCompletadas: number;
  }[];
}

export interface ReporteDiagnosticos {
  totalDiagnosticos: number;
  diagnosticosFrecuentes: {
    diagnostico: string;
    codigo: string;
    cantidad: number;
    porcentaje: number;
  }[];
  diagnosticosPorEspecialidad: {
    especialidad: string;
    diagnosticos: {
      diagnostico: string;
      cantidad: number;
    }[];
  }[];
}

export interface CitaDTO {
  id: string;
  fecha: string; // formato 'yyyy-MM-dd'
  hora: string; // formato 'HH:mm:ss'
  estado: 'PENDIENTE' | 'REALIZADA' | 'CANCELADA';
  idPaciente: number;
  idMedico: number;
  idConsultorio?: string;
}

export interface CitasHoyDTO {
  id: string;
  doctor: string;
  area: string;
  time: string;
  status: string;
  patient?: string;
}
