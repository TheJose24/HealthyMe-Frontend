import type { Routes } from '@angular/router'; // Cambiado a import type

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
        path: 'nosotros',
        loadComponent: () =>
          import('./pages/nosotros/nosotros.component').then(c => c.NosotrosComponent),
        title: 'Nosotros',
      },
      {
        path: 'contacto',
        loadComponent: () =>
          import('./pages/contacto/contacto.component').then(c => c.ContactoComponent),
        title: 'Contacto',
      },
    ],
  },
  // Ruta de fallback (opcional)
  { path: '**', redirectTo: '' },
];
