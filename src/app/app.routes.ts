import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/public/public.routes').then(r => r.PUBLIC_ROUTES),
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/private/admin/admin.routes').then(r => r.ADMIN_ROUTES),
  },
  {
    path: '404',
    loadComponent: () =>
      import('./features/public/pages/not-found/not-found.component').then(
        c => c.NotFoundComponent
      ),
    title: 'Página no encontrada',
  },

  {
    path: '**',
    redirectTo: '404',
  },
];
