import { Component } from '@angular/core';
import type { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { CitaService } from '../../services/cita.service';
import type { ICitaDTO } from '../../services/cita.service';
import { FormsModule } from '@angular/forms';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { MedicoService } from '../../services/medico.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ConsultorioService } from '../../services/consultorio.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-mis-citas',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.css'],
})
export class MisCitasComponent implements OnInit {
  public usuarioId: number = 1;
  public citas: ICitaDTO[] = [];
  public estados = ['PENDIENTE', 'REALIZADA', 'CANCELADA'];
  public filtro: string = '';
  public pageSize = 5;
  public currentPage = 1;
  public selectedCita: ICitaDTO | null = null;

  public constructor(
    private readonly citaService: CitaService,
    private medicoService: MedicoService,
    private consultorioService: ConsultorioService
  ) {}

  public get totalPages(): number {
    return Math.ceil(this.filteredCitas.length / this.pageSize);
  }

  public get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  public get displayedCitas(): ICitaDTO[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredCitas.slice(start, start + this.pageSize);
  }

  private get filteredCitas(): ICitaDTO[] {
    return this.filtro ? this.citas.filter(c => c.estado === this.filtro) : this.citas;
  }

  public ngOnInit(): void {
    this.loadCitas();
  }

  public loadCitas(): void {
    const obs$ = this.filtro
      ? this.citaService.getByUsuarioAndEstado(this.usuarioId, this.filtro)
      : this.citaService.getAllByUsuario(this.usuarioId);

    obs$.subscribe(list => {
      this.citas = list;
      this.currentPage = 1;

      list.forEach(c => {
        if (!c.idMedico) {
          return;
        }

        this.medicoService.get(c.idMedico).subscribe(m => {
          c.nombreMedico = m.nombreMedico;
          c.nombreEspecialidad = m.nombreEspecialidad;
        });
        if (c.idConsultorio) {
          this.consultorioService.get(c.idConsultorio).subscribe(consultorio => {
            c.nombreConsultorio = consultorio.nombre;
            c.nombreSede = consultorio.nombreSede ?? '—';
            c.numeroHabitacion = consultorio.numeroHabitacion ?? 0;
          });
        }
      });
    });
  }

  public onFiltroChange(value: string): void {
    this.filtro = value;
    this.currentPage = 1;
    this.loadCitas();
  }

  public goToPage(page: number): void {
    this.currentPage = page;
  }

  public prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  public nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  public cancelar(citaId: string): void {
    if (confirm('¿Estás seguro de cancelar esta cita?')) {
      this.citaService.marcarCancelada(citaId).subscribe(() => this.loadCitas());
    }
  }

  public openDetail(c: ICitaDTO): void {
    if (!c.id || !c.idMedico || !c.idConsultorio) {
      return;
    }
    forkJoin({
      cita: this.citaService.getById(c.id),
      medico: this.medicoService.get(c.idMedico),
      consultorio: this.consultorioService.get(c.idConsultorio),
    }).subscribe(
      ({ cita, medico, consultorio }) => {
        cita.nombreMedico = medico.nombreMedico;
        cita.nombreEspecialidad = medico.nombreEspecialidad;
        cita.nombreConsultorio = consultorio.nombre;
        cita.nombreSede = consultorio.nombreSede;
        cita.numeroHabitacion = consultorio.numeroHabitacion ?? 0;

        this.selectedCita = cita;
      },
      err => console.error('Error al cargar detalle de cita', err)
    );
  }
  public closeModal(): void {
    this.selectedCita = null;
  }
}
