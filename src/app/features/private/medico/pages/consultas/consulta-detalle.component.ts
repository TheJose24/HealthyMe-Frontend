import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import type { TemplateRef } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ChangeDetectorRef } from '@angular/core';
import type { OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ActivatedRoute } from '@angular/router';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { MatDialog } from '@angular/material/dialog';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { MatDialogModule } from '@angular/material/dialog';
import type { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { CitaService } from '../../services/cita.service';
import type { ICita } from '../../services/cita.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { PacienteService } from '../../services/paciente.service';
import type { IPacienteDto } from '../../services/paciente.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ConsultaService } from '../../services/consulta.service';
import type { IConsulta } from '../../services/consulta.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { PatientHistoryDialogComponent } from './patient-history.dialog';

@Component({
  selector: 'app-consulta-detalle',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
  ],
  templateUrl: './consulta-detalle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsultaDetalleComponent implements OnInit {
  @ViewChild('confirmTpl') public confirmTpl!: TemplateRef<any>;
  public dialogRef!: MatDialogRef<any, boolean>;
  public cita!: ICita;
  public paciente!: IPacienteDto;

  public loading = true;
  public isSaving = false;

  public consulta: IConsulta = {
    idConsulta: 0,
    sintomas: '',
    diagnostico: '',
    fecha: '',
    idCita: 0,
    idPaciente: 0,
    idMedico: 0,
  };

  public constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private citaSrv: CitaService,
    private pacSrv: PacienteService,
    private consSrv: ConsultaService,
    private cdr: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    const citaId = +this.route.snapshot.paramMap.get('citaId')!;

    this.citaSrv.getById(String(citaId)).subscribe({
      next: c => {
        this.cita = c;
        this.consulta = {
          ...this.consulta,
          idCita: +c.id,
          idPaciente: c.idPaciente,
          idMedico: c.idMedico,
          fecha: c.fecha,
        };

        this.pacSrv.getPaciente(c.idPaciente).subscribe({
          next: p => {
            this.paciente = p;
            this.loading = false;
            this.cdr.markForCheck();
          },
          error: () => (this.loading = false),
        });
      },
      error: () => (this.loading = false),
    });
  }

  public openHistorial(): void {
    this.dialog.open(PatientHistoryDialogComponent, {
      data: { id: this.paciente.id },
      width: '32rem',
      maxWidth: '90vw',
      height: '100vh',
      position: { right: '0', top: '0' },
      backdropClass: 'bg-transparent',
      panelClass: ['p-0', 'shadow-2xl', 'ring-1', 'ring-gray-200', 'rounded-l-lg'],
    });
  }

  public onGuardarClick(): void {
    if (!this.consulta.idCita) {
      alert('Aún se está cargando la cita');
      return;
    }
    if (!this.consulta.sintomas.trim() || !this.consulta.diagnostico.trim()) {
      alert('Completa síntomas y diagnóstico');
      return;
    }
    if (this.isSaving) return;

    this.dialogRef = this.dialog.open(this.confirmTpl, {
      backdropClass: 'bg-black/20',
      autoFocus: false,
      disableClose: true,
    });

    this.dialogRef.afterClosed().subscribe(ok => {
      if (!ok) return;

      this.guardarConsulta();
    });
  }

  public guardarConsulta(): void {
    this.isSaving = true;

    this.consSrv.guardar(this.consulta).subscribe({
      next: () => {
        this.citaSrv.marcarRealizada(this.cita.id).subscribe({
          next: () => {
            this.isSaving = false;
            alert('Consulta guardada y cita marcada como realizada ✔');

            this.router.navigate(['../consultas/hoy'], { relativeTo: this.route.parent });
          },
          error: () => {
            this.isSaving = false;
            alert('La consulta se guardó, pero no se pudo actualizar el estado de la cita.');
          },
        });
      },
      error: err => {
        this.isSaving = false;
        alert(err.error?.message ?? 'Error al guardar');
      },
    });
  }

  public cancelar(): void {
    this.router.navigate(['../consultas/hoy'], { relativeTo: this.route.parent });
  }
}
