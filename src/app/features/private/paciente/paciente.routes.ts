import type { Routes } from '@angular/router';
import { PrivateLayoutComponent } from '../../../layout/private-layout/private-layout.component';
import { AuthGuard } from '../../../shared/guards/auth.guard';
import { RoleGuard } from '../../../shared/guards/role.guard';

export const PACIENTE_ROUTES: Routes = [
  {
    path: '',
    component: PrivateLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['PACIENTE'] },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'citas',
        loadComponent: () => import('./pages/citas/citas.component').then(m => m.MisCitasComponent),
      },
      {
        path: 'diagnosticos',
        loadComponent: () =>
          import('./pages/diagnosticos/diagnosticos.component').then(m => m.DiagnosticosComponent),
      },
      {
        path: 'recetas',
        loadComponent: () =>
          import('./pages/recetas/recetas.component').then(m => m.RecetasComponent),
      },
    ],
  },
];
