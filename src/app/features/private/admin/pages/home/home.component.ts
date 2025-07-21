import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import type { ChartConfiguration, ChartData } from 'chart.js';
import type { DashboardApiService } from '../services/stats.service';
import { Observable, forkJoin } from 'rxjs';

interface IPayment {
  id: string;
  patient: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'failed';
}

interface IAppointment {
  id: string;
  time: string;
  area: string;
  doctor: string;
  patient: string;
  status: 'confirmed' | 'pending' | 'completed';
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
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
    rooms: 0,
  };

  constructor(private dashboardService: DashboardApiService) {}

  ngOnInit(): void {
    forkJoin({
      patients: this.dashboardService.getTotalPacientes(),
      doctors: this.dashboardService.getTotalMedicos(),
      appointments: this.dashboardService.getTotalCitas(),
      laboratories: this.dashboardService.getTotalReservas(),
      rooms: this.fetchRoomCountStatic(), // Si aún no tienes endpoint, puedes dejarlo así
    }).subscribe(result => {
      this.generalStats = {
        totalPatients: result.patients,
        totalDoctors: result.doctors,
        monthlyAppointments: result.appointments,
        laboratories: result.laboratories,
        rooms: result.rooms,
      };
    });
  }
  private fetchRoomCountStatic(): Observable<number> {
    // Si no tienes endpoint para cuartos, devuelve un observable estático
    return new Observable<number>(observer => {
      observer.next(32);
      observer.complete();
    });
  }

  // Últimos pagos
  public recentPayments: IPayment[] = [
    {
      id: 'PAY001',
      patient: 'María González',
      amount: 150.0,
      date: '2024-06-18',
      status: 'paid',
    },
    {
      id: 'PAY002',
      patient: 'Carlos Mendoza',
      amount: 275.5,
      date: '2024-06-18',
      status: 'pending',
    },
    {
      id: 'PAY003',
      patient: 'Ana Torres',
      amount: 120.0,
      date: '2024-06-17',
      status: 'paid',
    },
  ];

  // Citas de hoy
  public todayAppointments: IAppointment[] = [
    {
      id: 'APP001',
      time: '09:00',
      area: 'Cardiología',
      doctor: 'Dr. Juan Pérez',
      patient: 'Luis Rodriguez',
      status: 'confirmed',
    },
    {
      id: 'APP002',
      time: '10:30',
      area: 'Pediatría',
      doctor: 'Dra. Carmen Silva',
      patient: 'Sofia Martinez',
      status: 'pending',
    },
    {
      id: 'APP003',
      time: '11:15',
      area: 'Neurología',
      doctor: 'Dr. Roberto López',
      patient: 'Miguel Castro',
      status: 'confirmed',
    },
    {
      id: 'APP004',
      time: '14:00',
      area: 'Ginecología',
      doctor: 'Dra. Patricia Ruiz',
      patient: 'Elena Vargas',
      status: 'confirmed',
    },
  ];

  // Gráfico de nuevos pacientes (últimos 4 meses)
  public newPatientsChartData: ChartData<'bar'> = {
    labels: ['Marzo', 'Abril', 'Mayo', 'Junio'],
    datasets: [
      {
        data: [85, 102, 94, 127],
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
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
    datasets: [
      {
        data: [45000, 52000, 48000, 61000, 58000, 67000],
        label: 'Ingresos',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
      {
        data: [35000, 38000, 42000, 45000, 44000, 48000],
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
    labels: [
      'Cardiología',
      'Pediatría',
      'Ginecología',
      'Neurología',
      'Traumatología',
      'Dermatología',
    ],
    datasets: [
      {
        data: [245, 198, 176, 154, 132, 98],
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
