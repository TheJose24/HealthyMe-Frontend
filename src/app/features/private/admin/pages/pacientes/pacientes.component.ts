import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { CrudService, PacienteDTO } from '../services/crud.service';
import type { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

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
    this.crudService.getPacientes().subscribe(data => {
      this.pacientes = data;
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
    const paciente: PacienteDTO = this.pacienteForm.value;
    if (this.isEditing && paciente.idPaciente) {
      this.crudService.updatePaciente(paciente.idPaciente, paciente).subscribe(() => {
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
