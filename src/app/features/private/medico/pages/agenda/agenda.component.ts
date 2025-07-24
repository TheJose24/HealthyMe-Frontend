import { Component, ViewChild } from '@angular/core';
import type { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import type { FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { EventClickArg } from '@fullcalendar/core';
import type { EventInput } from '@fullcalendar/core';
import type { DatesSetArg } from '@fullcalendar/core';
import type { CalendarOptions } from '@fullcalendar/core';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { CitaService } from '../../services/cita.service';
import type { ICita } from '../../services/cita.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { PacienteService } from '../../services/paciente.service';
import type { IPacienteDto } from '../../services/paciente.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ConsultorioService } from '../../services/consultorio.service';
import type { IConsultorioDTO } from '../../services/consultorio.service';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css'],
})
export class AgendaComponent implements OnInit {
  @ViewChild('calendar') public calendarComponent!: FullCalendarComponent;
  public calendarOptions!: CalendarOptions;
  public medicoId!: number;

  public showModal = false;
  public selectedCita: ICita | null = null;
  public selectedPaciente?: IPacienteDto;
  public selectedConsultorio?: IConsultorioDTO;

  public constructor(
    private agendaSvc: CitaService,
    private pacienteSvc: PacienteService,
    private consultorioSvc: ConsultorioService
  ) {}

  public ngOnInit(): void {
    this.medicoId = 1;

    this.calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: 'timeGridWeek',
      headerToolbar: false,
      events: [],
      datesSet: this.onDatesSet.bind(this),
      eventClick: this.onEventClick.bind(this),
    };
  }

  public onDatesSet(arg: DatesSetArg): void {
    const start = arg.startStr.slice(0, 10);
    const end = arg.endStr.slice(0, 10);

    this.agendaSvc.getCitasPorMedico(this.medicoId, start, end).subscribe(citas => {
      const events: EventInput[] = citas.map(c => ({
        id: c.id,
        title: this.estadoLabel(c.estado),
        start: `${c.fecha}T${c.hora}`,
        end: this.calcEnd(c),
        backgroundColor: this.colorByEstado(c.estado),
        borderColor: this.colorByEstado(c.estado),
        extendedProps: { ...c },
      }));
      const api = this.calendarComponent.getApi();
      api.removeAllEvents();
      api.addEventSource(events);
    });
  }

  public onEventClick(arg: EventClickArg): void {
    const cita = arg.event.extendedProps as ICita;

    const pid = (cita as any).idPaciente ?? (cita as any).id_paciente;
    const idConsultorio = (cita as any).idConsultorio ?? (cita as any).id_consultorio;

    this.selectedCita = cita;
    this.showModal = true;

    if (!pid) {
      return;
    }
    this.pacienteSvc.getPaciente(pid).subscribe(
      p => (this.selectedPaciente = p),
      _ => (this.selectedPaciente = undefined)
    );
    if (idConsultorio) {
      this.consultorioSvc.get(idConsultorio).subscribe(
        c => (this.selectedConsultorio = c),
        _ => (this.selectedConsultorio = undefined)
      );
    }
  }

  public closeModal(): void {
    this.showModal = false;
    this.selectedCita = null;
  }

  public calcEnd(c: ICita): string {
    const durMin = 30;
    const inicio = new Date(`${c.fecha}T${c.hora}`);
    return new Date(inicio.getTime() + durMin * 60000).toISOString();
  }

  public calcEndTime(c: ICita): string {
    const end = new Date(`${c.fecha}T${c.hora}`);
    end.setMinutes(end.getMinutes() + 30);
    return end.toTimeString().slice(0, 5);
  }

  public prev(): void {
    this.calendarComponent.getApi().prev();
  }
  public today(): void {
    this.calendarComponent.getApi().today();
  }
  public next(): void {
    this.calendarComponent.getApi().next();
  }
  private estadoLabel(e: ICita['estado']): string {
    return {
      PENDIENTE: 'Pendiente',
      REALIZADA: 'Realizada',
      CANCELADA: 'Cancelada',
    }[e];
  }

  private colorByEstado(e: ICita['estado']): string {
    return (
      {
        PENDIENTE: '#F59E0B',
        REALIZADA: '#10B981',
        CANCELADA: '#EF4444',
      }[e] ?? '#3B82F6'
    );
  }
}
