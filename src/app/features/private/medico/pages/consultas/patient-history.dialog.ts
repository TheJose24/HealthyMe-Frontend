import type { OnInit } from '@angular/core';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TriajeService } from '../../services/triaje.service';
import type { ITriaje } from '../../services/triaje.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ConsultaService } from '../../services/consulta.service';
import type { IConsulta } from '../../services/consulta.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { RecetaService } from '../../services/receta.service';
import type { IReceta } from '../../services/receta.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ExamenService } from '../../services/examen.service';
import type { IExamen } from '../../services/examen.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { PacienteService } from '../../services/paciente.service';
import { forkJoin } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-patient-history-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatCardModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <header class="flex items-center justify-between bg-gradient-healthyme px-6 py-3 text-white">
      <div class="flex items-center gap-2">
        <svg
          class="h-6 w-6 shrink-0 text-white transition-transform duration-200 group-hover:rotate-45"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span class="align-middle text-base font-semibold leading-none">
          Historial — {{ pacienteNombre }}
        </span>
      </div>

      <button type="button" mat-icon-button (click)="ref.close()">
        <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </header>

    <ng-container *ngIf="!loading; else spinner">
      <mat-tab-group class="flex h-full flex-col" mat-stretch-tabs>
        <!-- ▸ Triajes -->
        <mat-tab label="Triajes">
          <div class="h-[calc(100vh-112px)] overflow-y-auto bg-gray-100 p-4">
            <ng-container *ngIf="triajes.length; else sinTriaje">
              <table class="w-full border-collapse text-xs">
                <thead class="sticky top-0 bg-gray-50 text-gray-600 shadow">
                  <tr>
                    <th class="px-3 py-2 text-left">Fecha</th>
                    <th class="px-3 py-2">Peso</th>
                    <th class="px-3 py-2">Talla</th>
                    <th class="px-3 py-2">Presión</th>
                    <th class="px-3 py-2">FC</th>
                    <th class="px-3 py-2">FR</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let t of triajes" class="odd:bg-white even:bg-gray-50">
                    <td class="px-3 py-1">
                      {{ t.fecha | date: 'dd/MM/yyyy' }}
                      <span class="text-gray-500">{{ t.hora }}</span>
                    </td>
                    <td class="px-3 py-1">{{ t.peso }} kg</td>
                    <td class="px-3 py-1">{{ t.talla }} m</td>
                    <td class="px-3 py-1">{{ t.presionArterial }} mmHg</td>
                    <td class="px-3 py-1">{{ t.frecuenciaCardiaca }} lpm</td>
                    <td class="px-3 py-1">{{ t.frecuenciaRespiratoria }} rpm</td>
                  </tr>
                </tbody>
              </table>
            </ng-container>
            <ng-template #sinTriaje>
              <p class="text-center text-gray-500">Sin registros de triaje.</p>
            </ng-template>
          </div>
        </mat-tab>

        <!-- ▸ Consultas -->
        <mat-tab label="Consultas">
          <div class="h-[calc(100vh-112px)] overflow-y-auto bg-gray-100 p-4">
            <ng-container *ngIf="consultas.length; else sinConsultas">
              <mat-card
                *ngFor="let c of consultas"
                class="rounded-lg border border-gray-200 !bg-white p-4 !text-gray-800 shadow-sm"
              >
                <p class="text-lg font-semibold">{{ c.fecha | date: 'dd MMM y' }}</p>
                <p class="text-sm text-gray-700">
                  <strong>Diagnostico:</strong> {{ c.diagnostico }}
                </p>
                <p class="text-sm text-gray-700"><strong>Síntomas:</strong> {{ c.sintomas }}</p>
              </mat-card>
            </ng-container>
            <ng-template #sinConsultas>
              <p class="text-center text-gray-500">Sin consultas previas.</p>
            </ng-template>
          </div>
        </mat-tab>

        <!-- ▸ Recetas -->
        <mat-tab label="Recetas">
          <div class="h-[calc(100vh-112px)] overflow-y-auto bg-gray-100 p-4">
            <ng-container *ngIf="recetas.length; else sinRecetas">
              <mat-accordion>
                <mat-expansion-panel
                  *ngFor="let r of recetas; let i = index"
                  class="!rounded-lg !border !border-gray-200 !bg-white !text-gray-800"
                >
                  <mat-expansion-panel-header class="!justify-center !bg-white">
                    <span
                      mat-panel-title
                      class="text-primary-700 flex w-full items-center justify-center gap-2 font-medium"
                    >
                      <svg
                        class="h-6 w-6 shrink-0 text-blue-600 transition-transform duration-200 group-hover:rotate-6"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M7 3h8l5 5v13a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"
                        />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14 3v5h5" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10 14h4m-2-2v4" />
                      </svg>

                      Receta #{{ i + 1 }}
                    </span>
                  </mat-expansion-panel-header>

                  <ul class="ml-5 list-disc text-xs">
                    <li *ngFor="let m of r.medicamentos">
                      {{ m.nombre }} — {{ m.dosis }} ({{ m.indicaciones }})
                    </li>
                  </ul>
                  <a
                    mat-stroked-button
                    color="primary"
                    size="small"
                    [href]="recetaSrv.pdfUrl(r.idReceta)"
                    target="_blank"
                    rel="noopener"
                  >
                    Descargar / Imprimir PDF
                  </a>
                </mat-expansion-panel>
              </mat-accordion>
            </ng-container>
            <ng-template #sinRecetas>
              <p class="text-center text-gray-500">No hay recetas registradas.</p>
            </ng-template>
          </div>
        </mat-tab>

        <!-- ▸ Exámenes -->
        <mat-tab label="Exámenes">
          <div class="h-[calc(100vh-112px)] overflow-y-auto bg-gray-100 p-4">
            <ng-container *ngIf="examenes?.length; else sinExamenes">
              <mat-card
                *ngFor="let e of examenes"
                class="rounded-lg border border-gray-200 !bg-white p-4 !text-gray-800 shadow-sm"
              >
                <div class="flex justify-between">
                  <p class="text-sm font-medium">{{ e.nombreExamen }}</p>
                  <span class="text-xs text-gray-500">
                    {{ e.fechaRealizacion | date: 'dd MMM y' }}
                  </span>
                </div>
                <p *ngIf="e.resultados" class="text-sm">
                  <strong>Resultados:</strong> {{ e.resultados }}
                </p>
                <p *ngIf="e.observaciones" class="text-sm">
                  <strong>Obs.:</strong> {{ e.observaciones }}
                </p>
                <button
                  type="button"
                  mat-button
                  color="primary"
                  (click)="abrirPdfExamen(e.idExamen)"
                >
                  Ver PDF
                </button>
              </mat-card>
            </ng-container>

            <ng-template #sinExamenes>
              <p class="text-center text-gray-500">No hay exámenes registrados.</p>
            </ng-template>
          </div>
        </mat-tab>
      </mat-tab-group>
    </ng-container>

    <ng-template #spinner>
      <div class="flex h-full items-center justify-center">
        <mat-spinner diameter="48"></mat-spinner>
      </div>
    </ng-template>
  `,
})
export class PatientHistoryDialogComponent implements OnInit {
  public pacienteNombre = '';

  public triajes: ITriaje[] = [];
  public consultas: IConsulta[] = [];
  public recetas: IReceta[] = [];
  public examenes: IExamen[] = [];

  public loading = true;

  public constructor(
    public ref: MatDialogRef<PatientHistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private triajeSrv: TriajeService,
    private consultaSrv: ConsultaService,
    public recetaSrv: RecetaService,
    public examenSrv: ExamenService,
    private pacienteSrv: PacienteService
  ) {}

  public ngOnInit(): void {
    forkJoin({
      pac: this.pacienteSrv.getPaciente(this.data.id),
      tri: this.triajeSrv.getByPaciente(this.data.id),
      con: this.consultaSrv.getByPaciente(this.data.id),
      rec: this.recetaSrv.getByPaciente(this.data.id),
      exa: this.examenSrv.getByPaciente(this.data.id),
    }).subscribe(({ pac, tri, con, rec, exa }) => {
      this.pacienteNombre = pac.nombreCompleto;
      this.triajes = tri;
      this.consultas = con;
      this.recetas = rec.map(r => ({
        ...r,
        idReceta: (r as any).id_receta,
      }));
      this.examenes = exa.map(e => ({
        ...e,
        idExamen: (e as any).id_examen,
      }));
      this.loading = false;
    });
  }

  public abrirPdfReceta(idReceta: number): void {
    this.recetaSrv.getPdf(idReceta).subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank', 'noopener');
        setTimeout(() => URL.revokeObjectURL(url), 1000 * 60);
      },
      error: () => alert('No se pudo descargar la receta. Intenta nuevamente.'),
    });
  }

  public abrirPdfExamen(id?: number): void {
    if (!id) {
      return;
    }
    this.examenSrv.getPdf(id).subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank', 'noopener');
        setTimeout(() => URL.revokeObjectURL(url), 60000);
      },
      error: () => alert('No se pudo descargar el examen.'),
    });
  }
}
