import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { RecetaService } from '../../services/receta.service';
import type { IRecetaDTO } from '../../services/receta.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { MedicoService } from '../../services/medico.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ConsultaService } from '../../services/consulta.service';

@Component({
  standalone: true,
  selector: 'app-recetas',
  templateUrl: './recetas.component.html',
  imports: [CommonModule],
  providers: [DatePipe],
})
export class RecetasComponent implements OnInit {
  public recetas: IRecetaDTO[] = [];

  public doctor: Record<number, string> = {};
  public especialidad: Record<number, string> = {};
  public consultaFecha: Record<number, string> = {};

  public recetaDetalle: IRecetaDTO | null = null;

  public constructor(
    private recetaService: RecetaService,
    private consultaService: ConsultaService,
    private medicoService: MedicoService
  ) {}

  public ngOnInit(): void {
    this.recetaService.list().subscribe(list => {
      this.recetas = list;

      list.forEach(r => {
        if (!r.idConsulta) return;

        this.consultaService.buscarPorId(r.idConsulta).subscribe(con => {
          if (!con) return;

          this.consultaFecha[r.idReceta] = con.fecha;

          this.medicoService.get(con.idMedico).subscribe(m => {
            this.doctor[r.idReceta] = m.nombreMedico;
            this.especialidad[r.idReceta] = m.nombreEspecialidad;
          });
        });
      });
    });
  }

  public verDetalle(r: IRecetaDTO): void {
    this.recetaDetalle = r;
  }

  public descargar(id: number): void {
    this.recetaService.descargarPdf(id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `receta-${id}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
