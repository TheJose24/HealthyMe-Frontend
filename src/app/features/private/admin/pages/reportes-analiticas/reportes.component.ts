// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ReportesService } from './services/reportes.service';
import type {
  ReporteGeneral,
  FiltrosReporte,
  ReporteCitas,
  ReporteIngresos,
  ReporteMedicos,
  ReporteDiagnosticos,
  ReporteMensualDTO,
  ReporteAnualDTO,
} from './interfaces/reportes.interface';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css',
})
export class ReportesComponent implements OnInit {
  public filtrosForm: FormGroup;
  public reporteGeneral: ReporteGeneral | null = null;
  public reporteCitas: ReporteCitas | null = null;
  public reporteIngresos: ReporteIngresos | null = null;
  public reporteMedicos: ReporteMedicos | null = null;
  public reporteDiagnosticos: ReporteDiagnosticos | null = null;

  // Nuevas propiedades para reportes específicos del backend
  public reporteMensual: ReporteMensualDTO | null = null;
  public reporteAnual: ReporteAnualDTO | null = null;

  public isLoading = false;
  public tipoReporte: 'mensual' | 'anual' = 'mensual';
  public currentYear = new Date().getFullYear();
  public currentMonth = new Date().getMonth() + 1;

  public meses = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' },
  ];

  public anios: number[] = [];

  // Propiedades para datos específicos de citas
  public citasHoy: any[] = [];
  public especialidadesSolicitadas: any[] = [];
  public totalCitasCount = 0;

  constructor(
    private fb: FormBuilder,
    private reportesService: ReportesService
  ) {
    this.filtrosForm = this.createForm();
    this.generateYearsList();
  }

  public ngOnInit(): void {
    this.loadReporteInicial();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      tipoReporte: [this.tipoReporte, Validators.required],
      mes: [this.currentMonth, Validators.required],
      anio: [this.currentYear, Validators.required],
    });
  }

  private generateYearsList(): void {
    const startYear = 2020;
    const endYear = this.currentYear + 1;
    this.anios = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i).reverse();
  }

  public onTipoReporteChange(tipo: 'mensual' | 'anual'): void {
    this.tipoReporte = tipo;
    this.filtrosForm.patchValue({ tipoReporte: tipo });

    // Si es anual, deshabilitar el selector de mes
    const mesControl = this.filtrosForm.get('mes');
    if (tipo === 'anual') {
      mesControl?.disable();
    } else {
      mesControl?.enable();
    }
  }

  public generarReporte(): void {
    if (this.filtrosForm.invalid) {
      return;
    }

    this.isLoading = true;
    const filtros: FiltrosReporte = {
      tipoReporte: this.tipoReporte,
      anio: this.filtrosForm.get('anio')?.value,
      mes: this.tipoReporte === 'mensual' ? this.filtrosForm.get('mes')?.value : undefined,
    };

    // Cargar reportes usando los nuevos endpoints
    Promise.all([
      this.reportesService.getReporteGeneral(filtros).toPromise(),
      this.reportesService.getReporteCitas(filtros).toPromise(),
      this.reportesService.getReporteIngresos(filtros).toPromise(),
      this.reportesService.getReporteMedicos(filtros).toPromise(),
      this.reportesService.getReporteDiagnosticos(filtros).toPromise(),
      this.loadReporteEspecifico(filtros),
    ])
      .then(([general, citas, ingresos, medicos, diagnosticos]) => {
        this.reporteGeneral = general || null;
        this.reporteCitas = citas || null;
        this.reporteIngresos = ingresos || null;
        this.reporteMedicos = medicos || null;
        this.reporteDiagnosticos = diagnosticos || null;
        this.isLoading = false;
      })
      .catch(error => {
        console.error('Error cargando reportes:', error);
        this.isLoading = false;
      });
  }

  private async loadReporteEspecifico(filtros: FiltrosReporte): Promise<void> {
    try {
      if (filtros.tipoReporte === 'mensual' && filtros.mes) {
        const fecha = `${filtros.anio}-${filtros.mes.toString().padStart(2, '0')}-01`;
        this.reporteMensual =
          (await this.reportesService.getReporteMensual(fecha).toPromise()) || null;
      } else {
        this.reporteAnual =
          (await this.reportesService.getReporteAnual(filtros.anio).toPromise()) || null;
      }
    } catch (error) {
      console.error('Error cargando reporte específico:', error);
    }
  }

  public exportarReporte(formato: 'pdf' | 'excel'): void {
    if (formato === 'pdf') {
      const filtros: FiltrosReporte = {
        tipoReporte: this.tipoReporte,
        anio: this.filtrosForm.get('anio')?.value,
        mes: this.tipoReporte === 'mensual' ? this.filtrosForm.get('mes')?.value : undefined,
      };

      // Usar nuevo método de exportación PDF
      const { fechaInicio, fechaFin } = this.getFechasFromFiltros(filtros);

      this.reportesService.exportarReportePDF('completo', fechaInicio, fechaFin).subscribe({
        next: blob => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `reporte_${this.tipoReporte}_${filtros.anio}${filtros.mes ? `_${filtros.mes}` : ''}.${formato}`;
          link.click();
          window.URL.revokeObjectURL(url);
        },
        error: error => {
          console.error('Error exportando reporte:', error);
        },
      });
    } else {
      // Exportar a Excel usando el método existente
      const filtros: FiltrosReporte = {
        tipoReporte: this.tipoReporte,
        anio: this.filtrosForm.get('anio')?.value,
        mes: this.tipoReporte === 'mensual' ? this.filtrosForm.get('mes')?.value : undefined,
      };

      this.reportesService.exportarReporte(filtros, formato).subscribe({
        next: blob => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `reporte_${this.tipoReporte}_${filtros.anio}${filtros.mes ? `_${filtros.mes}` : ''}.${formato}`;
          link.click();
          window.URL.revokeObjectURL(url);
        },
        error: error => {
          console.error('Error exportando reporte:', error);
        },
      });
    }
  }

  public getMesNombre(numeroMes: number): string {
    const mes = this.meses.find(m => m.value === numeroMes);
    return mes ? mes.label : '';
  }

  public getTitleReporte(): string {
    const anio = this.filtrosForm.get('anio')?.value;
    if (this.tipoReporte === 'mensual') {
      const mes = this.filtrosForm.get('mes')?.value;
      return `Reporte ${this.getMesNombre(mes)} ${anio}`;
    }
    return `Reporte Anual ${anio}`;
  }

  private loadReporteInicial(): void {
    // Cargar datos específicos de citas además del reporte general
    this.loadDatosCitas();
    this.generarReporte();
  }

  private loadDatosCitas(): void {
    // Cargar datos adicionales de citas
    Promise.all([
      this.reportesService.getCitasHoy().toPromise(),
      this.reportesService.getEspecialidadesMasSolicitadas().toPromise(),
      this.reportesService.getTotalCitas().toPromise(),
    ])
      .then(([citasHoy, especialidades, totalCitas]) => {
        this.citasHoy = citasHoy || [];
        this.especialidadesSolicitadas = especialidades || [];
        this.totalCitasCount = totalCitas || 0;
      })
      .catch(error => {
        console.error('Error cargando datos de citas:', error);
      });
  }

  public formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(amount);
  }

  public formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  public getVariacionClass(variacion: number): string {
    if (variacion > 0) return 'text-green-600';
    if (variacion < 0) return 'text-red-600';
    return 'text-gray-600';
  }

  public getVariacionIcon(variacion: number): string {
    if (variacion > 0) return 'ri-arrow-up-line';
    if (variacion < 0) return 'ri-arrow-down-line';
    return 'ri-subtract-line';
  }

  private getFechasFromFiltros(filtros: FiltrosReporte): { fechaInicio: string; fechaFin: string } {
    const anio = filtros.anio;
    let fechaInicio = `${anio}-01-01`;
    let fechaFin = `${anio}-12-31`;

    if (filtros.tipoReporte === 'mensual' && filtros.mes) {
      const mes = filtros.mes.toString().padStart(2, '0');
      fechaInicio = `${anio}-${mes}-01`;
      fechaFin = `${anio}-${mes}-${new Date(anio, filtros.mes, 0).getDate()}`;
    }

    return { fechaInicio, fechaFin };
  }
}
