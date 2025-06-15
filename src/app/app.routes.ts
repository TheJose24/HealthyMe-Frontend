import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/public-layout/public-layout.component').then(c => c.PublicLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/inicio/inicio.component').then(c => c.InicioComponent),
        pathMatch: 'full',
        title: 'Inicio',
      },
      {
        path: 'libro-reclamaciones',
        loadComponent: () =>
          import('./pages/libro-reclamaciones/libro-reclamaciones.component').then(
            c => c.LibroReclamacionesComponent
          ),
        title: 'Libro de Reclamaciones',
      },

      /*{
        path: 'servicios',
        loadComponent: () =>
          import('./pages/servicios/servicios.component').then(c => c.ServiciosComponent),
        title: 'Servicios',
      },
      {
        path: 'doctores',
        loadComponent: () =>
          import('./pages/doctores/doctores.component').then(c => c.DoctoresComponent),
        title: 'Busca tu doctor',
      },
      {
        path: 'nosotros',
        loadComponent: () =>
          import('./pages/nosotros/nosotros.component').then(c => c.NosotrosComponent),
        title: 'Nosotros',
      },
      {
        path: 'citas',
        loadChildren: () => import('./pages/citas/citas.routes').then(r => r.citasRoutes),
      },*/
      {
        path: '404',
        loadComponent: () =>
          import('./pages/not-found/not-found.component').then(c => c.NotFoundComponent),
        title: 'Página no encontrada',
      },
    ],
  },

  // Rutas para los dashboards (separadas del layout público)
  /*{
    path: 'dashboard',
    loadComponent: () =>
      import('./layout/dashboard-layout/dashboard-layout.component').then(
        c => c.DashboardLayoutComponent
      ),
    loadChildren: () => import('./dashboard/dashboard.routes').then(r => r.dashboardRoutes),
  },*/

  {
    path: '**',
    redirectTo: '404',
  },
];
