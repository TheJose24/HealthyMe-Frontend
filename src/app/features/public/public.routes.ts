import type { Routes } from '@angular/router';
import { PublicLayoutComponent } from '../../layout/public-layout/public-layout.component';

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
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

      {
        path: 'servicios',
        loadComponent: () =>
          import('./pages/servicios/servicios.component').then(c => c.ServiciosComponent),
        title: 'Servicios',
      },

      {
        path: 'especialidades-medicas',
        loadComponent: () =>
          import('./pages/especialidades-medicas/especialidades-medicas.component').then(
            c => c.EspecialidadesMedicasComponent
          ),
        title: 'Servicios',
      },

      {
        path: 'doctores',
        loadComponent: () =>
          import('./pages/busca-tu-doctor/busca-tu-doctor.component').then(
            c => c.BuscaTuDoctorComponent
          ),
        title: 'Busca tu doctor',
      },
      {
        path: 'nosotros',
        loadComponent: () =>
          import('./pages/nosotros/nosotros.component').then(c => c.NosotrosComponent),
        title: 'Nosotros',
      },
      {
        path: 'citas/agendar',
        loadComponent: () => import('./pages/citas/citas.component').then(r => r.CitasComponent),
        title: 'Solicitar Cita',
      },
      {
        path: 'sedes',
        loadComponent: () => import('./pages/sedes/sedes.component').then(c => c.SedesComponent),
        title: 'Nuestras Sedes',
      },
      {
        path: 'unidades-especializadas',
        title: 'Unidades Especializadas',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/unidades-especializadas/especializadas.component').then(
                c => c.EspecialidadComponent
              ),
            title: 'Unidades Especializadas',
          },
          {
            path: ':slug',
            loadComponent: () =>
              import('./pages/unidades-especializadas/detalle-unidad.component').then(
                c => c.DetalleUnidadComponent
              ),
          },
        ],
      },
      {
        path: 'contacto',
        loadComponent: () =>
          import('./pages/contacto/contacto.component').then(c => c.ContactoComponent),
        title: 'Contacto - HealthyMe',
        data: {
          description: 'Contacta con HealthyMe para agendar citas y resolver consultas médicas',
          keywords: 'contacto, citas médicas, consultas, healthyme',
        },
      },
    ],
  },
];
