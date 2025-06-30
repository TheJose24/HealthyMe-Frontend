import { Injectable } from '@angular/core';
import type { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';

export interface IAppointment {
  id: string;
  time: string;
  area: string;
  doctor: string;
  patient: string;
  status: 'confirmed' | 'pending' | 'completed';
}

export interface IBalanceMensual {
  mes: string;
  ingresos: number;
  egresos: number;
}

export interface IPayment {
  id: string;
  patient: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'failed';
}

export interface IPacientesPorMes {
  mes: string;
  cantidad: number;
}

export interface IEspecialidadContada {
  especialidad: string;
  cantidad: number;
}

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  public getStatistics(): string {
    // Simulación de estadisticas
    return '';
  }
}

export class DashboardApiService {
  private apiPacientes = 'http://localhost:8080/api/v1/pacientes/count';
  private apiMedicos = 'http://localhost:8080/api/medicos/count';
  private apiCitas = 'http://localhost:8080/api/citas/count';
  private apiLaboratorio = 'http://localhost:8080/api/reservas/count';
  private readonly baseUrlCitas = 'http://localhost:8080/api/citas';
  private readonly baseUrlFacturas = 'http://localhost:8080/payment/api/facturas';
  private readonly baseUrlPagos = 'http://localhost:8080/payment/api/pagos';
  private readonly baseUrlPacientes = 'http://localhost:8080/api/v1/pacientes';

  public constructor(private http: HttpClient) {}

  public getTotalPacientes(): Observable<number> {
    return this.http.get<number>(this.apiPacientes);
  }

  public getTotalMedicos(): Observable<number> {
    return this.http.get<number>(this.apiMedicos);
  }

  public getTotalCitas(): Observable<number> {
    return this.http.get<number>(this.apiCitas);
  }

  public getTotalReservas(): Observable<number> {
    return this.http.get<number>(this.apiLaboratorio);
  }

  public getCitasDeHoy(): Observable<IAppointment[]> {
    return this.http.get<IAppointment[]>(`${this.baseUrlCitas}/hoy`);
  }

  public getBalanceMensual(): Observable<IBalanceMensual[]> {
    return this.http.get<IBalanceMensual[]>(`${this.baseUrlFacturas}/balance-mensual`);
  }

  public getHistorialPagos(): Observable<IPayment[]> {
    return this.http.get<IPayment[]>(`${this.baseUrlPagos}/historial`);
  }

  public getPacientesPorMes(): Observable<IPacientesPorMes[]> {
    return this.http.get<IPacientesPorMes[]>(`${this.baseUrlPacientes}/por-mes`);
  }

  public getEspecialidadesMasSolicitadas(): Observable<IEspecialidadContada[]> {
    return this.http.get<IEspecialidadContada[]>(
      `${this.baseUrlCitas}/especialidades/mas-solicitadas`
    );
  }
}
