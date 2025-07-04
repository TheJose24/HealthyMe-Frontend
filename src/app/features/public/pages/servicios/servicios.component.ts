import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { Router } from '@angular/router';

interface IEspecialidad {
  nombre: string;
  imagen: string;
  tipo: 'medico' | 'unidad';
  boton: string;
  ruta: string;
}

@Component({
  selector: 'app-especialidades',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css'],
})
export class ServiciosComponent {
  public especialidades: IEspecialidad[] = [
    {
      nombre: 'Medicina General',
      imagen: 'assets/images/especialidades/medicina-general.png',
      tipo: 'medico',
      boton: 'Reserva Aquí',
      ruta: '/citas/agendar?especialidad=medicina-general',
    },
    {
      nombre: 'Cardiología',
      imagen: 'assets/images/especialidades/cardiologia.png',
      tipo: 'medico',
      boton: 'Reserva Aquí',
      ruta: '/citas/agendar?especialidad=cardiologia',
    },
    {
      nombre: 'Traumatología',
      imagen: 'assets/images/especialidades/traumatologia.png',
      tipo: 'medico',
      boton: 'Reserva Aquí',
      ruta: '/citas/agendar?especialidad=traumatologia',
    },
    {
      nombre: 'Lactancia Materna',
      imagen: 'assets/images/unidades/lactancia-materna.jpg',
      tipo: 'unidad',
      boton: 'Información',
      ruta: '/servicios/lactancia-materna',
    },
    {
      nombre: 'Laboratorio',
      imagen: 'assets/images/unidades/lab.jpg',
      tipo: 'unidad',
      boton: 'Información',
      ruta: '/servicios/laboratorio',
    },
    {
      nombre: 'Óptica',
      imagen: 'assets/images/unidades/optica.jpg',
      tipo: 'unidad',
      boton: 'Información',
      ruta: '/servicios/optica',
    },
  ];
  public especialidadesMedicas = this.especialidades.filter(e => e.tipo === 'medico');
  public especialidadesUnidades = this.especialidades.filter(e => e.tipo === 'unidad');

  public constructor(private router: Router) {}

  public irEspecialidadesMedicas(): void {
    this.router.navigate(['/especialidades-medicas']);
  }

  public irUnidadesEspecializadas(): void {
    this.router.navigate(['/unidades-especializadas']);
  }

  public trackByNombre(index: number, item: IEspecialidad): string {
    return item.nombre;
  }
}
