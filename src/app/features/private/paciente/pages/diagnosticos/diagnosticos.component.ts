import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ConsultaService } from '../../services/consulta.service';
import type { IConsultaDTO } from '../../services/consulta.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { MedicoService } from '../../services/medico.service';

@Component({
  standalone: true,
  selector: 'app-consultas',
  templateUrl: './diagnosticos.component.html',
  styleUrls: ['./diagnosticos.component.css'],
  imports: [CommonModule, RouterModule],
  providers: [DatePipe],
})
export class DiagnosticosComponent implements OnInit {
  public consultas: IConsultaDTO[] = [];
  public detalles: IConsultaDTO | null = null;

  public doctor: Record<number, string> = {};
  public especialidad: Record<number, string> = {};

  public constructor(
    private service: ConsultaService,
    private medicoService: MedicoService
  ) {}

  public ngOnInit(): void {
    this.service.list().subscribe(lista => {
      this.consultas = lista;

      lista.forEach(c => {
        if (!c.idMedico) {
          console.warn('Consulta sin idMedico', c);
          return;
        }

        this.medicoService
          .getNombreCompleto(c.idMedico)
          .subscribe(n => (this.doctor[c.idConsulta] = n));

        this.medicoService
          .getEspecialidad(c.idMedico)
          .subscribe(e => (this.especialidad[c.idConsulta] = e));
      });
    });
  }
}
