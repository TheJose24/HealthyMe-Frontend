import { Injectable } from '@angular/core';
import type { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';

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

@Injectable({
  providedIn: 'root',
})
export class DashboardApiService {
  private readonly baseUrlReservas = `${environment.apiUrl}/api/v1/reservas-lab`;
  private readonly baseUrlCitas = `${environment.apiUrl}/api/v1/citas`;
  private readonly baseUrlFacturas = `${environment.apiUrl}/api/v1/facturas`;
  private readonly baseUrlPagos = `${environment.apiUrl}/api/v1/pagos`;
  private readonly baseUrlPacientes = `${environment.apiUrl}/api/v1/pacientes`;
  private readonly baseUrlMedicos = `${environment.apiUrl}/api/v1/medicos`;

  public constructor(private http: HttpClient) {}

  public getTotalPacientes(): Observable<number> {
    return this.http.get<number>(`${this.baseUrlPacientes}/count`);
  }

  public getTotalMedicos(): Observable<number> {
    return this.http.get<number>(`${this.baseUrlMedicos}/count`);
  }

  public getTotalCitas(): Observable<number> {
    return this.http.get<number>(`${this.baseUrlCitas}/count`);
  }

  public getTotalReservas(): Observable<number> {
    return this.http.get<number>(`${this.baseUrlReservas}/count`);
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
