import type { Routes } from '@angular/router';
import { PrivateLayoutComponent } from '../../../layout/private-layout/private-layout.component';

export const MEDICO_ROUTES: Routes = [
  {
    path: '',
    component: PrivateLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'agenda',
        pathMatch: 'full',
      },
      {
        path: 'agenda',
        loadComponent: () => import('./pages/agenda/agenda.component').then(m => m.AgendaComponent),
      },
      {
        path: 'consultas',
        children: [
          {
            path: 'hoy',
            loadComponent: () =>
              import('./pages/consultas/consultas-hoy.component').then(
                m => m.ConsultasHoyComponent
              ),
          },
          {
            path: ':citaId',
            loadComponent: () =>
              import('./pages/consultas/consulta-detalle.component').then(
                m => m.ConsultaDetalleComponent
              ),
          },
        ],
      },
    ],
  },
];
