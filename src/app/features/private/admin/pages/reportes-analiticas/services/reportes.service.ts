import { Injectable } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HttpClient, HttpParams } from '@angular/common/http';
import { type Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../../../../environments/environment';
import type {
  FiltrosReporte,
  ReporteGeneral,
  ReporteCitas,
  ReporteIngresos,
  ReporteMedicos,
  ReporteDiagnosticos,
  ReporteGeneralDTO,
  ReporteMensualDTO,
  ReporteAnualDTO,
  CitasReporteDTO,
  BalanceMensualDTO,
  CitasHoyDTO,
  EspecialidadContadaDTO,
} from '../interfaces/reportes.interface';

@Injectable({
  providedIn: 'root',
})
export class ReportesService {
  private readonly apiUrl = `${environment.apiUrl}/api/v1`;

  constructor(private http: HttpClient) {}

  public getReporteGeneral(filtros: FiltrosReporte): Observable<ReporteGeneral> {
    return this.http.get<ReporteGeneralDTO>(`${this.apiUrl}/reportes/general`).pipe(
      map(dto => this.mapReporteGeneralDTO(dto, filtros)),
      catchError(error => {
        console.error('Error obteniendo reporte general:', error);
        throw error;
      })
    );
  }

  public getReporteCitas(filtros: FiltrosReporte): Observable<ReporteCitas> {
    const { fechaInicio, fechaFin } = this.getFechasFromFiltros(filtros);

    return this.http
      .get<CitasReporteDTO>(`${this.apiUrl}/reportes/citas`, {
        params: new HttpParams().set('fechaInicio', fechaInicio).set('fechaFin', fechaFin),
      })
      .pipe(
        map(dto => {
          return this.mapCitasReporteDTO(dto);
        }),
        catchError(error => {
          console.error('Error obteniendo reporte de citas:', error);
          throw error;
        })
      );
  }

  public getReporteIngresos(filtros: FiltrosReporte): Observable<ReporteIngresos> {
    const { fechaInicio, fechaFin } = this.getFechasFromFiltros(filtros);

    return this.http
      .get<BalanceMensualDTO>(`${this.apiUrl}/reportes/ingresos`, {
        params: new HttpParams().set('fechaInicio', fechaInicio).set('fechaFin', fechaFin),
      })
      .pipe(
        map(dto => this.mapBalanceMensualDTO(dto)),
        catchError(error => {
          console.error('Error obteniendo reporte de ingresos:', error);
          throw error;
        })
      );
  }

  public getReporteMedicos(_filtros: FiltrosReporte): Observable<ReporteMedicos> {
    return this.http.get<number>(`${this.apiUrl}/reportes/medicos-activos`).pipe(
      map(medicosActivos => ({
        totalMedicos: medicosActivos,
        medicosActivos: medicosActivos,
        medicosInactivos: 0, // No hay endpoint para médicos inactivos
        medicosPorEspecialidad: [],
        topMedicosPorCitas: [],
      })),
      catchError(error => {
        console.error('Error obteniendo reporte de médicos:', error);
        return of({
          totalMedicos: 0,
          medicosActivos: 0,
          medicosInactivos: 0,
          medicosPorEspecialidad: [],
          topMedicosPorCitas: [],
        });
      })
    );
  }

  public getReporteDiagnosticos(_filtros: FiltrosReporte): Observable<ReporteDiagnosticos> {
    // No hay endpoint específico para diagnósticos, devolver datos vacíos
    return of({
      totalDiagnosticos: 0,
      diagnosticosFrecuentes: [],
      diagnosticosPorEspecialidad: [],
    });
  }

  // Nuevos métodos para usar endpoints específicos del backend
  public getReporteMensual(fecha: string): Observable<ReporteMensualDTO> {
    return this.http.get<ReporteMensualDTO>(`${this.apiUrl}/reportes/mensual`, {
      params: new HttpParams().set('fecha', fecha),
    });
  }

  public getReporteAnual(year: number): Observable<ReporteAnualDTO> {
    return this.http.get<ReporteAnualDTO>(`${this.apiUrl}/reportes/anual`, {
      params: new HttpParams().set('year', year.toString()),
    });
  }

  public getEstadisticasCitas(fechaInicio: string, fechaFin: string): Observable<CitasReporteDTO> {
    return this.http.get<CitasReporteDTO>(`${this.apiUrl}/reportes/citas`, {
      params: new HttpParams().set('fechaInicio', fechaInicio).set('fechaFin', fechaFin),
    });
  }

  public getIngresosPorPeriodo(
    fechaInicio: string,
    fechaFin: string
  ): Observable<BalanceMensualDTO> {
    return this.http.get<BalanceMensualDTO>(`${this.apiUrl}/reportes/ingresos`, {
      params: new HttpParams().set('fechaInicio', fechaInicio).set('fechaFin', fechaFin),
    });
  }

  public getMedicosActivos(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/reportes/medicos-activos`);
  }

  // Métodos de exportación usando los nuevos endpoints
  public exportarReportePDF(
    tipo: 'general' | 'completo',
    fechaInicio?: string,
    fechaFin?: string
  ): Observable<Blob> {
    if (tipo === 'general') {
      return this.http.get(`${this.apiUrl}/reportes/pdf/general`, {
        responseType: 'blob',
      });
    } else {
      const params = new HttpParams()
        .set('fechaInicio', fechaInicio || '')
        .set('fechaFin', fechaFin || '');

      return this.http.get(`${this.apiUrl}/reportes/pdf/completo`, {
        params,
        responseType: 'blob',
      });
    }
  }

  // Mantener compatibilidad con método anterior
  public exportarReporte(filtros: FiltrosReporte, formato: 'pdf' | 'excel'): Observable<Blob> {
    if (formato === 'pdf') {
      const { fechaInicio, fechaFin } = this.getFechasFromFiltros(filtros);
      return this.exportarReportePDF('completo', fechaInicio, fechaFin);
    } else {
      // Para Excel, podrías implementar una generación local o solicitar endpoint al backend
      throw new Error('Exportación a Excel no implementada aún');
    }
  }

  // Métodos auxiliares específicos para citas (mantener compatibilidad)
  public getCitasHoy(): Observable<CitasHoyDTO[]> {
    return this.http.get<CitasHoyDTO[]>(`${this.apiUrl}/citas/hoy`);
  }

  public getEspecialidadesMasSolicitadas(): Observable<EspecialidadContadaDTO[]> {
    return this.http.get<EspecialidadContadaDTO[]>(
      `${this.apiUrl}/citas/especialidades/mas-solicitadas`
    );
  }

  public getTotalCitas(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/citas/count`);
  }

  // Métodos privados para mapear DTOs
  private mapReporteGeneralDTO(dto: ReporteGeneralDTO, filtros: FiltrosReporte): ReporteGeneral {
    return {
      periodo: this.buildPeriodoString(filtros),
      totalCitas: dto.total_citas,
      citasCompletadas: dto.citas_realizadas,
      citasCanceladas: dto.total_citas - dto.citas_realizadas - dto.citas_pendientes,
      totalIngresos: dto.ingresos_totales,
      medicosActivos: dto.medicos_activos,
      pacientesAtendidos: dto.pacientes_totales,
      variaciones: {
        // Calcular variaciones comparando con ingresos mes actual vs total
        citas: 0, // Requeriría datos del período anterior
        ingresos:
          dto.ingresos_mes_actual > 0
            ? (dto.ingresos_mes_actual / dto.ingresos_totales) * 100 - 100
            : 0,
        medicos: 0,
        pacientes: 0,
      },
    };
  }

  private mapCitasReporteDTO(dto: CitasReporteDTO): ReporteCitas {
    const total = dto.total_citas;

    return {
      total_citas: dto.total_citas,
      citasPorEstado: [
        {
          estado: 'PENDIENTE',
          cantidad: dto.citas_pendientes,
          porcentaje: total > 0 ? (dto.citas_pendientes / total) * 100 : 0,
        },
        {
          estado: 'REALIZADA',
          cantidad: dto.citas_realizadas,
          porcentaje: total > 0 ? (dto.citas_realizadas / total) * 100 : 0,
        },
        {
          estado: 'CANCELADA',
          cantidad: dto.citas_canceladas,
          porcentaje: total > 0 ? (dto.citas_canceladas / total) * 100 : 0,
        },
      ],
      citasPorDia: dto.citas_por_dia,
    };
  }

  private mapBalanceMensualDTO(dto: BalanceMensualDTO): ReporteIngresos {
    return {
      totalIngresos: dto.ingresos,
      ingresosPorMetodoPago: [], // Requeriría endpoint específico
      ingresosPorEspecialidad: [], // Requeriría endpoint específico
      ingresosPorPeriodo: [
        {
          periodo: `${dto.fechaInicio} - ${dto.fechaFin}`,
          monto: dto.ingresos,
        },
      ],
    };
  }

  private getFechasFromFiltros(filtros: FiltrosReporte): { fechaInicio: string; fechaFin: string } {
    if (filtros.tipoReporte === 'mensual' && filtros.mes) {
      const year = filtros.anio;
      const month = filtros.mes;
      const fechaInicio = `${year}-${month.toString().padStart(2, '0')}-01`;
      const ultimoDia = new Date(year, month, 0).getDate();
      const fechaFin = `${year}-${month.toString().padStart(2, '0')}-${ultimoDia}`;
      return { fechaInicio, fechaFin };
    } else {
      // Para reporte anual
      const fechaInicio = `${filtros.anio}-01-01`;
      const fechaFin = `${filtros.anio}-12-31`;
      return { fechaInicio, fechaFin };
    }
  }

  private buildPeriodoString(filtros: FiltrosReporte): string {
    if (filtros.tipoReporte === 'mensual' && filtros.mes) {
      const meses = [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
      ];
      return `${meses[filtros.mes - 1]} ${filtros.anio}`;
    }
    return `Año ${filtros.anio}`;
  }
}
