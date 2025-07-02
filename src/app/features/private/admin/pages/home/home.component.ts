import { CommonModule } from '@angular/common';
import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import type { ChartConfiguration, ChartData } from 'chart.js';
import { DashboardApiService } from './stats.service';
import type { IAppointment, IPayment } from './stats.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  // Estadísticas generales
  public generalStats = {
    totalPatients: 0,
    totalDoctors: 0,
    monthlyAppointments: 0,
    laboratories: 0,
    rooms: 32,
  };

  // Últimos pagos
  public recentPayments: IPayment[] = [];
  // Citas de hoy
  public todayAppointments: IAppointment[] = [];

  // Gráfico de nuevos pacientes (últimos 4 meses)
  public newPatientsChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Nuevos Pacientes',
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  public newPatientsChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Nuevos Pacientes por Mes',
      },
    },
    scales: {
      x: {},
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 20,
        },
      },
    },
  };

  // Gráfico de balance (ingresos vs egresos)
  public balanceChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Ingresos',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
      {
        data: [],
        label: 'Egresos',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  public balanceChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Balance de Ingresos y Egresos',
      },
    },
    scales: {
      x: {},
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return 'S/. ' + Number(value) / 1000 + 'K';
          },
        },
      },
    },
  };

  // Gráfico de especialidades preferidas (barras horizontales)
  public specialtiesChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Citas',
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(14, 165, 233, 0.8)',
        ],
        borderColor: [
          'rgba(99, 102, 241, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(251, 146, 60, 1)',
          'rgba(14, 165, 233, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  public specialtiesChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Especialidades Más Solicitadas',
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {},
    },
  };

  // Gráfico de satisfacción del cliente
  public satisfactionChartData: ChartData<'doughnut'> = {
    labels: ['Muy Satisfecho', 'Satisfecho', 'Neutral', 'Insatisfecho'],
    datasets: [
      {
        data: [68, 25, 5, 2],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)', // Verde - Muy Satisfecho
          'rgba(59, 130, 246, 0.8)', // Azul - Satisfecho
          'rgba(251, 146, 60, 0.8)', // Naranja - Neutral
          'rgba(239, 68, 68, 0.8)', // Rojo - Insatisfecho
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(251, 146, 60, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  public satisfactionChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Satisfacción del Cliente (%)',
      },
    },
  };

  public constructor(private dashboardService: DashboardApiService) {}

  public ngOnInit(): void {
    this.dashboardService.getTotalPacientes().subscribe(data => {
      this.generalStats.totalPatients = data;
    });

    this.dashboardService.getTotalMedicos().subscribe(data => {
      this.generalStats.totalDoctors = data;
    });

    this.dashboardService.getTotalCitas().subscribe(data => {
      this.generalStats.monthlyAppointments = data;
    });

    this.dashboardService.getTotalReservas().subscribe(data => {
      this.generalStats.laboratories = data;
    });

    this.dashboardService.getCitasDeHoy().subscribe(data => {
      this.todayAppointments = data;
    });

    this.dashboardService.getHistorialPagos().subscribe(data => {
      this.recentPayments = data;
    });

    this.dashboardService.getPacientesPorMes().subscribe(data => {
      this.newPatientsChartData.labels = data.map(p => p.mes);
      this.newPatientsChartData.datasets[0].data = data.map(p => p.cantidad);
    });

    this.dashboardService.getBalanceMensual().subscribe(data => {
      this.balanceChartData.labels = data.map(b => b.mes);
      this.balanceChartData.datasets[0].data = data.map(b => b.ingresos);
      this.balanceChartData.datasets[1].data = data.map(b => b.egresos);
    });

    this.dashboardService.getEspecialidadesMasSolicitadas().subscribe(data => {
      this.specialtiesChartData.labels = data.map(e => e.especialidad);
      this.specialtiesChartData.datasets[0].data = data.map(e => e.cantidad);
    });
  }

  public getStatusClass(status: string): string {
    switch (status) {
      case 'paid':
      case 'confirmed':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  public getStatusText(status: string): string {
    switch (status) {
      case 'paid':
        return 'Pagado';
      case 'pending':
        return 'Pendiente';
      case 'failed':
        return 'Fallido';
      case 'confirmed':
        return 'Confirmada';
      case 'completed':
        return 'Completada';
      default:
        return status;
    }
  }
}
