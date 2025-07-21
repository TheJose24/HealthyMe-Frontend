import { type Routes } from '@angular/router';
import { PrivateLayoutComponent } from '../../../layout/private-layout/private-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from '../../../shared/guards/auth.guard';
import { RoleGuard } from '../../../shared/guards/role.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: PrivateLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN'] },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: HomeComponent,
        title: 'Dashboard Admin',
      },
      {
        path: 'pacientes',
        loadComponent: () =>
          import('./pages/pacientes/pacientes.component').then(m => m.PacientesComponent),
        title: 'Gestión de Pacientes',
      },
      {
        path: 'medicos',
        loadComponent: () =>
          import('./pages/medicos/medicos.component').then(m => m.MedicosComponent),
        title: 'Gestión de Médicos',
      },
    ],
  },
];
