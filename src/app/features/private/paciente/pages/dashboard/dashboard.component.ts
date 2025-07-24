import { Component } from '@angular/core';
import type { OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { CalendarOptions } from '@fullcalendar/core';
import type { ChartData } from 'chart.js';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { CitaService } from '../../services/cita.service';
import type { ICitaDTO, ICounts } from '../../services/cita.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TriajeService } from '../../services/triaje.service';
import type { ITriajeDTO } from '../../services/triaje.service';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FullCalendarModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  @ViewChild(BaseChartDirective) public chart?: BaseChartDirective;
  public usuarioId = 3;
  public nextCita: ICitaDTO | null = null;
  public counts: ICounts = { pendientes: 0, realizadas: 0, canceladas: 0 };
  public ultimas: ICitaDTO[] = [];

  public keys: (keyof ICounts)[] = ['pendientes', 'realizadas', 'canceladas'];

  public triajes: ITriajeDTO[] = [];
  public pesoData: ChartData<'line'> = { labels: [], datasets: [] };
  public presionData: ChartData<'line'> = { labels: [], datasets: [] };

  public citasMesData: ChartData<'bar'> = { labels: [], datasets: [] };

  public calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    events: [],
  };
  public constructor(
    private citaService: CitaService,
    private triajeService: TriajeService
  ) {}

  public ngOnInit(): void {
    this.loadNextByUsuario();
    this.loadCountsByUsuario();
    this.loadUltimasByUsuario();
    this.loadTriaje();
    this.loadCitasPorMes();
    this.loadCalendar();
  }

  private loadNextByUsuario(): void {
    this.citaService
      .getNextByUsuario(this.usuarioId)
      .pipe(catchError(() => of(null as unknown as ICitaDTO)))
      .subscribe(dto => (this.nextCita = dto));
  }

  private loadCountsByUsuario(): void {
    this.citaService
      .getCountsByUsuario(this.usuarioId)
      .pipe(catchError(() => of({ pendientes: 0, realizadas: 0, canceladas: 0 } as ICounts)))
      .subscribe(cnt => (this.counts = cnt));
  }

  private loadUltimasByUsuario(): void {
    this.citaService
      .getUltimasByUsuario(this.usuarioId, 5)
      .pipe(catchError(() => of([] as ICitaDTO[])))
      .subscribe(list => (this.ultimas = list));
  }

  private loadTriaje(): void {
    this.triajeService
      .getTriajesByUsuario(this.usuarioId)
      .pipe(catchError(() => of([] as ITriajeDTO[])))
      .subscribe(data => {
        this.triajes = data;
        const labels = data.map(t => t.fecha);
        this.pesoData = {
          labels,
          datasets: [{ data: data.map(t => t.peso), label: 'Peso (kg)' }],
        };
        this.presionData = {
          labels,
          datasets: [{ data: data.map(t => t.presionArterial), label: 'Presión Arterial' }],
        };
      });
  }

  private loadCitasPorMes(): void {
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
    const vals = [2, 4, 3, 5, 1, 6];
    this.citasMesData = { labels: meses, datasets: [{ data: vals, label: 'Citas por mes' }] };
    this.chart?.update();
  }

  private loadCalendar(): void {
    this.citaService
      .getUltimasByUsuario(this.usuarioId, 20)
      .pipe(catchError(() => of([] as ICitaDTO[])))
      .subscribe(citas => {
        this.calendarOptions = {
          initialView: 'dayGridMonth',
          events: citas.map(c => ({
            title: c.estado,
            start: `${c.fecha}T${c.hora}`,
            allDay: false,
          })),
        };
      });
  }
}
