import { Component } from '@angular/core';
import type { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { CitaService } from '../services/cita.service';
import type { ICitaDTO } from '../services/cita.service';
import { FormsModule } from '@angular/forms';

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

  public constructor(private readonly citaService: CitaService) {}

  public get totalPages(): number {
    return Math.ceil(this.citas.length / this.pageSize);
  }

  public get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  public get displayedCitas(): ICitaDTO[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.citas.slice(start, start + this.pageSize);
  }

  public ngOnInit(): void {
    this.loadCitas();
  }

  public loadCitas(): void {
    this.citaService.getAllByUsuario(this.usuarioId).subscribe((data: ICitaDTO[]) => {
      this.citas = this.filtro ? data.filter(c => c.estado === this.filtro) : data;
      this.currentPage = 1;
    });
  }

  public onFiltroChange(value: string): void {
    this.filtro = value;
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
      this.citaService.delete(citaId).subscribe(() => this.loadCitas());
    }
  }

  public openDetail(c: ICitaDTO): void {
    this.citaService.getById(c.id).subscribe(
      dto => {
        this.selectedCita = dto;
      },
      err => {
        console.error('Error al cargar detalle de cita', err);
      }
    );
  }

  public closeModal(): void {
    this.selectedCita = null;
  }
}
