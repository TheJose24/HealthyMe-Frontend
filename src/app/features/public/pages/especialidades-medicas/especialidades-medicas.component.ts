import { Component } from '@angular/core';
import type { OnInit, AfterViewInit } from '@angular/core';
import type { Router } from '@angular/router';
import ScrollReveal from 'scrollreveal';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface IEspecialidadMedica {
  nombre: string;
  imagen: string;
  slug: string;
}

@Component({
  selector: 'app-especialidades-medicas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './especialidades-medicas.component.html',
  styleUrls: ['./especialidades-medicas.component.css'],
})
export class EspecialidadesMedicasComponent implements OnInit, AfterViewInit {
  public especialidades: IEspecialidadMedica[] = [
    {
      nombre: 'Medicina General',
      imagen: 'assets/images/especialidades/medicina-general.png',
      slug: 'medicina-general',
    },
    {
      nombre: 'Cardiología',
      imagen: 'assets/images/especialidades/cardiologia.png',
      slug: 'cardiologia',
    },
    {
      nombre: 'Endocrinología',
      imagen: 'assets/images/especialidades/endocrinologia.png',
      slug: 'endocrinologia',
    },
    {
      nombre: 'Pediatría',
      imagen: 'assets/images/especialidades/pediatria.png',
      slug: 'pediatria',
    },
    {
      nombre: 'Dermatología',
      imagen: 'assets/images/especialidades/dermatologia.png',
      slug: 'dermatologia',
    },
    {
      nombre: 'Otorrinolaringología',
      imagen: 'assets/images/especialidades/otorrino.png',
      slug: 'otorrinolaringologia',
    },
    { nombre: 'Urología', imagen: 'assets/images/especialidades/urologia.png', slug: 'urologia' },
    {
      nombre: 'Traumatología',
      imagen: 'assets/images/especialidades/traumatologia.png',
      slug: 'traumatologia',
    },
    {
      nombre: 'Gastroenterología',
      imagen: 'assets/images/especialidades/gastro.png',
      slug: 'gastroenterologia',
    },
    {
      nombre: 'Oncología',
      imagen: 'assets/images/especialidades/oncologia.png',
      slug: 'oncologia',
    },
    {
      nombre: 'Psicología',
      imagen: 'assets/images/especialidades/psicologia.png',
      slug: 'psicologia',
    },
    {
      nombre: 'Obstetricia',
      imagen: 'assets/images/especialidades/obstetricia.png',
      slug: 'obstetricia',
    },
  ];

  public filtro = '';
  public especialidadesFiltradas: IEspecialidadMedica[] = this.especialidades;

  public constructor(private router: Router) {}

  public ngOnInit(): void {
    window.scrollTo({ top: 0 });
    this.filtrar();
  }

  public ngAfterViewInit(): void {
    ScrollReveal().reveal('.card-sr', {
      interval: 120,
      distance: '40px',
      duration: 700,
      origin: 'bottom',
    });
  }

  public filtrar(): void {
    const f = this.filtro.trim().toLowerCase();
    this.especialidadesFiltradas = this.especialidades.filter(e =>
      e.nombre.toLowerCase().includes(f)
    );
  }

  public reservar(slug: string): void {
    this.router.navigate(['/citas/agendar'], { queryParams: { especialidad: slug } });
  }
}
