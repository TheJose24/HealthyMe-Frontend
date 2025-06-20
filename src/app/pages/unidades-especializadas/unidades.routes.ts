import type { Routes } from '@angular/router';
import { EspecialidadComponent } from './especializadas.component';
import { DetalleUnidadComponent } from './detalle-unidad.component';

export const unidadesRoutes: Routes = [
  { path: '', component: EspecialidadComponent },
  { path: ':slug', component: DetalleUnidadComponent },
];
