import { Component, Input, Output, EventEmitter, type OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { LogoComponent } from '../../../../shared/components/logo/logo.component';

export interface ISidebarItem {
  label: string;
  icon: string;
  route?: string;
  children?: ISidebarItem[];
  badge?: string | number;
  roles?: TUserRole[];
  isActive?: boolean;
  isExpanded?: boolean;
  divider?: boolean;
}

export type TUserRole = 'admin' | 'medico' | 'paciente';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LogoComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  @Input() public isCollapsed = false;
  @Input() public userRole: TUserRole = 'admin';
  @Input() public userName = 'Usuario';
  @Input() public userEmail = 'user@healthyme.com';
  @Input() public userAvatar = '';

  @Output() public toggleSidebar = new EventEmitter<void>();
  @Output() public logout = new EventEmitter<void>();

  public menuItems: ISidebarItem[] = [];

  public constructor(private router: Router) {}

  public ngOnInit(): void {
    this.loadMenuByRole();
  }

  public onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  public onLogout(): void {
    this.logout.emit();
  }

  public toggleSubmenu(item: ISidebarItem): void {
    if (item.children) {
      item.isExpanded = !item.isExpanded;
    }
  }

  public navigateTo(route: string): void {
    if (route) {
      this.router.navigate([route]);
    }
  }

  public trackByLabel(index: number, item: ISidebarItem): string {
    return item.label;
  }

  public getRoleDisplayName(): string {
    switch (this.userRole) {
      case 'admin':
        return 'Administrador';
      case 'medico':
        return 'Médico';
      case 'paciente':
        return 'Paciente';
      default:
        return 'Usuario';
    }
  }

  public getRoleColor(): string {
    switch (this.userRole) {
      case 'admin':
        return 'bg-red-500/20 text-red-300 ring-1 ring-red-500/30';
      case 'medico':
        return 'bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/30';
      case 'paciente':
        return 'bg-green-500/20 text-green-300 ring-1 ring-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 ring-1 ring-gray-500/30';
    }
  }

  private loadMenuByRole(): void {
    const allMenuItems: ISidebarItem[] = [
      // Dashboard Principal
      {
        label: 'Dashboard',
        icon: 'ri-dashboard-3-line',
        route: `/${this.userRole}/dashboard`,
        roles: ['admin', 'medico', 'paciente'],
      },

      // === MÓDULOS DE ADMINISTRADOR ===
      {
        label: 'Gestión de Personal',
        icon: 'ri-team-line',
        roles: ['admin'],
        children: [
          {
            label: 'Médicos',
            icon: 'ri-user-heart-line',
            route: '/admin/medicos',
          },
          {
            label: 'Enfermeros',
            icon: 'ri-nurse-line',
            route: '/admin/enfermeros',
          },
          {
            label: 'Personal Administrativo',
            icon: 'ri-admin-line',
            route: '/admin/administrativos',
          },
        ],
      },
      {
        label: 'Gestión de Pacientes',
        icon: 'ri-user-line',
        route: '/admin/pacientes',
        roles: ['admin'],
      },
      {
        label: 'Especialidades Médicas',
        icon: 'ri-hospital-line',
        route: '/admin/especialidades',
        roles: ['admin'],
      },
      {
        label: 'Instalaciones',
        icon: 'ri-building-line',
        roles: ['admin'],
        children: [
          {
            label: 'Consultorios',
            icon: 'ri-door-line',
            route: '/admin/consultorios',
          },
          {
            label: 'Laboratorios',
            icon: 'ri-test-tube-line',
            route: '/admin/laboratorios',
          },
          {
            label: 'Quirófanos',
            icon: 'ri-surgical-mask-line',
            route: '/admin/quirofanos',
          },
          {
            label: 'Equipos Médicos',
            icon: 'ri-stethoscope-line',
            route: '/admin/equipos',
          },
        ],
      },
      {
        label: 'Facturación',
        icon: 'ri-bill-line',
        roles: ['admin'],
        children: [
          {
            label: 'Tarifas',
            icon: 'ri-price-tag-3-line',
            route: '/admin/tarifas',
          },
          {
            label: 'Seguros Médicos',
            icon: 'ri-shield-cross-line',
            route: '/admin/seguros',
          },
          {
            label: 'Reportes Financieros',
            icon: 'ri-line-chart-line',
            route: '/admin/reportes-financieros',
          },
        ],
      },
      {
        label: 'Reportes y Analíticas',
        icon: 'ri-bar-chart-box-line',
        route: '/admin/reportes',
        roles: ['admin'],
      },

      // === MÓDULOS DE MÉDICO ===
      {
        label: 'Mi Agenda',
        icon: 'ri-calendar-check-line',
        route: '/medico/agenda',
        roles: ['medico'],
      },
      {
        label: 'Mis Pacientes',
        icon: 'ri-user-heart-line',
        route: '/medico/pacientes',
        roles: ['medico'],
      },
      {
        label: 'Consultas',
        icon: 'ri-stethoscope-line',
        roles: ['medico'],
        children: [
          {
            label: 'Consultas del Día',
            icon: 'ri-calendar-todo-line',
            route: '/medico/consultas/hoy',
          },
          {
            label: 'Historial de Consultas',
            icon: 'ri-history-line',
            route: '/medico/historial-consultas',
          },
          {
            label: 'Teleconsultas',
            icon: 'ri-video-line',
            route: '/medico/teleconsultas',
          },
        ],
      },
      {
        label: 'Historias Clínicas',
        icon: 'ri-file-text-line',
        route: '/medico/historias-clinicas',
        roles: ['medico'],
      },
      {
        label: 'Prescripciones',
        icon: 'ri-prescription-line',
        route: '/medico/prescripciones',
        roles: ['medico'],
      },
      {
        label: 'Resultados de Laboratorio',
        icon: 'ri-flask-line',
        route: '/medico/resultados-lab',
        roles: ['medico'],
      },
      {
        label: 'Mi Horario',
        icon: 'ri-time-line',
        route: '/medico/horarios',
        roles: ['medico'],
      },

      // === MÓDULOS DE PACIENTE ===
      {
        label: 'Mis Citas',
        icon: 'ri-calendar-check-line',
        route: '/paciente/citas',
        roles: ['paciente'],
      },
      {
        label: 'Agendar Cita',
        icon: 'ri-calendar-event-line',
        route: '/paciente/agendar',
        roles: ['paciente'],
      },
      {
        label: 'Mis Diagnósticos',
        icon: 'ri-file-user-line',
        route: '/paciente/diagnosticos',
        roles: ['paciente'],
      },
      {
        label: 'Mis Recetas Médicas',
        icon: 'ri-prescription-line',
        route: '/paciente/recetas',
        roles: ['paciente'],
      },
      {
        label: 'Mis Resultados',
        icon: 'ri-file-chart-line',
        roles: ['paciente'],
        children: [
          {
            label: 'Laboratorio',
            icon: 'ri-test-tube-line',
            route: '/paciente/resultados-lab',
          },
          {
            label: 'Imágenes',
            icon: 'ri-image-line',
            route: '/paciente/imagenes',
          },
          {
            label: 'Reportes Médicos',
            icon: 'ri-file-list-3-line',
            route: '/paciente/reportes',
          },
        ],
      },
      {
        label: 'Teleconsulta',
        icon: 'ri-video-line',
        route: '/paciente/teleconsulta',
        roles: ['paciente'],
      },
      {
        label: 'Facturación',
        icon: 'ri-bill-line',
        route: '/paciente/facturas',
        roles: ['paciente'],
      },

      // === MÓDULOS COMUNES ===
      {
        divider: true,
        label: '',
        icon: '',
        roles: ['admin', 'medico', 'paciente'],
      },
      {
        label: 'Mi Perfil',
        icon: 'ri-user-settings-line',
        route: `/${this.userRole}/perfil`,
        roles: ['admin', 'medico', 'paciente'],
      },
      {
        label: 'Notificaciones',
        icon: 'ri-notification-3-line',
        route: `/${this.userRole}/notificaciones`,
        badge: '3',
        roles: ['admin', 'medico', 'paciente'],
      },
      {
        label: 'Configuración',
        icon: 'ri-settings-3-line',
        route: `/${this.userRole}/configuracion`,
        roles: ['admin', 'medico', 'paciente'],
      },
    ];

    // Filtrar items según el rol del usuario
    this.menuItems = allMenuItems.filter(item => item.roles?.includes(this.userRole));
  }
}
