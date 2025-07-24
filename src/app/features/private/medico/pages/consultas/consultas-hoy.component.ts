import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { forkJoin, of, switchMap, map } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { MedicoService } from '../../services/medico.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { PacienteService } from '../../services/paciente.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { CitaService } from '../../services/cita.service';
import type { ICita } from '../../services/cita.service';

@Component({
  selector: 'app-consultas-hoy',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './consultas-hoy.component.html',
})
export class ConsultasHoyComponent implements OnInit {
  public citas: ICita[] = [];
  public isLoading = true;

  public constructor(
    private citaSrv: CitaService,
    private pacSrv: PacienteService,
    private medSrv: MedicoService
  ) {}

  public ngOnInit(): void {
    const idMedico = 1;

    this.citaSrv
      .getHoyByMedico(idMedico)
      .pipe(
        switchMap(citas => {
          const trabajos$ = citas.map(c =>
            forkJoin({
              cita: of(c),
              pac: this.pacSrv.getPaciente(c.idPaciente),
              med: this.medSrv.getMedico(c.idMedico),
            }).pipe(
              map(({ cita, pac, med }) => ({
                ...cita,
                pacienteNombre: `${pac.nombre} ${pac.apellido}`,
                nombreEspecialidad: med.especialidad,
              }))
            )
          );
          return forkJoin(trabajos$);
        })
      )
      .subscribe({
        next: list => (this.citas = list),
        complete: () => (this.isLoading = false),
      });
  }
}
