import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { CrudService, PacienteDTO } from '../services/crud.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { normalizePaciente } from '../../../../../shared/mappers/paciente.mapper';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class PacientesComponent implements OnInit {
  pacientes: PacienteDTO[] = [];
  selectedPaciente: PacienteDTO | null = null;
  pacienteForm: FormGroup;
  isEditing = false;

  constructor(
    private crudService: CrudService,
    private fb: FormBuilder
  ) {
    this.pacienteForm = this.fb.group({
      idPaciente: [null],
      idUsuario: [null],
      seguro: this.fb.group({
        id: [null],
        nombre: [''],
      }),
    });
  }

  ngOnInit(): void {
    this.loadPacientes();
  }

  loadPacientes(): void {
    this.crudService.getPacientes().subscribe((data: any[]) => {
      console.log(JSON.stringify(data, null, 2));
      this.pacientes = data.map(raw => ({
        idPaciente: raw.id,
        idUsuario: raw.id_usuario,
        seguro: {
          id: raw.seguro?.id,
          nombre: raw.seguro?.nombre || 'Sin seguro',
        },
      }));
    });
  }

  selectPaciente(paciente: PacienteDTO): void {
    this.selectedPaciente = paciente;
    this.pacienteForm.patchValue(paciente);
    this.isEditing = true;
  }

  newPaciente(): void {
    this.selectedPaciente = null;
    this.pacienteForm.reset();
    this.isEditing = false;
  }
  savePaciente(): void {
    const rawPaciente = this.pacienteForm.value;
    const pacienteId = rawPaciente.idPaciente;
    const paciente = normalizePaciente(rawPaciente);

    console.log('Paciente a guardar →', JSON.stringify(paciente, null, 2));

    if (this.isEditing && pacienteId) {
      this.crudService.updatePaciente(pacienteId, paciente).subscribe(() => {
        this.loadPacientes();
        this.newPaciente();
      });
    } else {
      this.crudService.createPaciente(paciente).subscribe(() => {
        this.loadPacientes();
        this.newPaciente();
      });
    }
  }

  deletePaciente(id: number): void {
    this.crudService.deletePaciente(id).subscribe(() => {
      this.loadPacientes();
      this.newPaciente();
    });
  }
}
