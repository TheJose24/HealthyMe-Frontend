import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import type { CrudService, MedicoDTO } from '../services/crud.service';

@Component({
  selector: 'app-medicos',
  standalone: true,
  templateUrl: './medicos.component.html',
  styleUrls: ['./medicos.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class MedicosComponent implements OnInit {
  medicos: MedicoDTO[] = [];
  selectedMedico: MedicoDTO | null = null;
  medicoForm: FormGroup;
  isEditing = false;

  constructor(
    private crudService: CrudService,
    private fb: FormBuilder
  ) {
    this.medicoForm = this.fb.group({
      idMedico: [null],
      nombre: [''],
      apellido: [''],
      especialidad: [''],
      email: [''],
    });
  }

  ngOnInit(): void {
    this.loadMedicos();
  }

  loadMedicos(): void {
    this.crudService.getMedicos().subscribe(data => (this.medicos = data));
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
    const medico: MedicoDTO = this.medicoForm.value;
    if (this.isEditing && medico.idMedico) {
      this.crudService.updateMedico(medico.idMedico, medico).subscribe(() => {
        this.loadMedicos();
        this.newMedico();
      });
    } else {
      this.crudService.createMedico(medico).subscribe(() => {
        this.loadMedicos();
        this.newMedico();
      });
    }
  }

  deleteMedico(id: number): void {
    this.crudService.deleteMedico(id).subscribe(() => {
      this.loadMedicos();
      this.newMedico();
    });
  }
}
