import type { OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import type { CrudService, MedicoDTO, EspecialidadDto } from '../services/crud.service';

@Component({
  selector: 'app-medicos',
  standalone: true,
  templateUrl: './medicos.component.html',
  styleUrls: ['./medicos.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class MedicosComponent implements OnInit {
  medicos: MedicoDTO[] = [];
  especialidades: EspecialidadDto[] = [];
  selectedMedico: MedicoDTO | null = null;
  medicoForm: FormGroup;
  isEditing = false;

  constructor(
    private crudService: CrudService,
    private fb: FormBuilder
  ) {
    this.medicoForm = this.fb.group({
      idMedico: [null],
      idUsuario: [''],
      idEspecialidad: [''],
      nombre: [''],
      apellido: [''],
      email: [''],
      estado: [''],
      rol: [''],
    });
  }

  ngOnInit(): void {
    this.loadMedicos();
    this.loadEspecialidades();
  }

  loadMedicos(): void {
    this.crudService.getMedicos().subscribe((data: any[]) => {
      console.log('Médicos crudos →', JSON.stringify(data, null, 2)); // 📋

      this.medicos = data.map(raw => ({
        idMedico: raw.id_medico,
        idUsuario: raw.id_usuario,
        idEspecialidad: raw.id_especialidad,
        nombreUsuario: raw.nombre_usuario ?? '',
        estado: raw.estado ?? 'ACTIVO',
        imagenPerfil: raw.imagen_perfil ?? 'default-profile.png',
        rol: raw.rol ?? '',

        persona: {
          dni: raw.persona?.dni ?? '',
          nombre: raw.persona?.nombre ?? '',
          apellido: raw.persona?.apellido ?? '',
          fechaNacimiento: raw.persona?.fecha_nacimiento ?? '',
          sexo: raw.persona?.sexo ?? '',
          direccion: raw.persona?.direccion ?? '',
          telefono: raw.persona?.telefono ?? '',
          email: raw.persona?.email ?? '',
          edad: raw.persona?.edad ?? 0,
          nombreCompleto: raw.persona?.nombre_completo ?? '',
        },

        contratos:
          raw.contratos?.map((c: any) => ({
            idContrato: c.id_contrato,
            fechaInicio: c.fecha_inicio,
            fechaFin: c.fecha_fin,
            activo: c.activo,
          })) ?? [],
      }));
    });
  }

  loadEspecialidades(): void {
    this.crudService.getEspecialidades().subscribe((data: any[]) => {
      this.especialidades = data.map(raw => ({
        idEspecialidad: raw.id_especialidad,
        nombreEspecialidad: raw.nombre_especialidad,
        imgEspecialidad: raw.img_especialidad,
      }));
    });
  }

  selectMedico(medico: MedicoDTO): void {
    this.selectedMedico = medico;
    this.medicoForm.patchValue(medico);
    this.isEditing = true;
  }

  newMedico(): void {
    this.selectedMedico = null;
    this.medicoForm.reset();
    this.isEditing = false;
  }

  saveMedico(): void {
    const raw = this.medicoForm.value;

    // Prepara un objeto de llamadas
    const calls = {
      medico: this.crudService.updateMedico(raw.idMedico, {
        id_medico: raw.idMedico,
        id_usuario: raw.idUsuario,
        id_especialidad: raw.idEspecialidad,
        estado: raw.estado,
        rol: raw.rol,
      }),
      role: this.crudService.updateUserRole(raw.idUsuario, raw.rol),
      status:
        raw.estado === 'ACTIVO'
          ? this.crudService.activateUser(raw.idUsuario)
          : raw.estado === 'SUSPENDIDO'
            ? this.crudService.suspendUser(raw.idUsuario)
            : this.crudService.deleteUser(raw.idUsuario),
    };

    forkJoin(calls).subscribe({
      next: ({ medico, role, status }) => {
        this.loadMedicos();
        this.newMedico();
        console.log('Médico', medico);
        console.log('Role update result', role);
        console.log('Status change result', status);
      },
      error: err => console.error('Error en actualización', err),
    });
  }

  deleteMedico(id: number): void {
    this.crudService.deleteMedico(id).subscribe(() => {
      this.loadMedicos();
      this.newMedico();
    });
  }
  getNombreEspecialidad(id: number): string {
    const especialidad = this.especialidades.find(e => Number(e.idEspecialidad) === Number(id));
    return especialidad?.nombreEspecialidad ?? 'Sin especialidad';
  }
}
