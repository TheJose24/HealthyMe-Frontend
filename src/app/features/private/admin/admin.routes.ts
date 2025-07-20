import { type Routes } from '@angular/router';
import { PrivateLayoutComponent } from '../../../layout/private-layout/private-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { ReportesComponent } from './pages/reportes-analiticas/reportes.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: PrivateLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: HomeComponent,
      },
      {
        path: 'reportes',
        component: ReportesComponent,
      },
    ],
  },
];
