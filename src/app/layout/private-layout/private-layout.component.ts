import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-private-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, FooterComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <app-sidebar
        [isCollapsed]="sidebarCollapsed"
        [userRole]="currentUserRole"
        [userName]="currentUser.name || 'Usuario Demo'"
        [userEmail]="currentUser.email || 'demo@healthyme.com'"
        [userAvatar]="currentUser.avatar"
        (toggleSidebar)="toggleSidebar()"
        (logout)="handleLogout()"
      ></app-sidebar>

      <!-- Contenido principal con ajuste dinámico -->
      <div
        class="min-h-screen transition-all duration-300 ease-in-out"
        [class.ml-80]="!sidebarCollapsed"
        [class.ml-16]="sidebarCollapsed"
      >
        <!-- Header/Navbar opcional -->
        <header
          class="sticky top-0 z-30 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-700 dark:bg-gray-800/80"
        >
          <div class="px-4 sm:px-6 lg:px-8">
            <div class="flex h-16 items-center justify-between">
              <!-- Botón toggle para móviles -->
              <button
                type="button"
                class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 lg:hidden"
                (click)="toggleSidebar()"
              >
                <i class="ri-menu-line text-xl"></i>
              </button>

              <!-- Contenido del header -->
              <div class="flex items-center space-x-4">
                <!-- Breadcrumbs, búsqueda, notificaciones, etc. -->
                <h1 class="text-lg font-semibold text-gray-900 dark:text-white">Dashboard</h1>
              </div>
            </div>
          </div>
        </header>

        <!-- Contenido principal -->
        <main class="flex-1 p-4 lg:p-6">
          <router-outlet />
        </main>

        <!-- Footer -->
        <footer class="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div class="px-4 lg:px-6">
            <app-footer />
          </div>
        </footer>
      </div>

      <!-- Overlay para móviles cuando el sidebar está abierto -->
      <button
        type="button"
        *ngIf="!sidebarCollapsed"
        class="fixed inset-0 z-40 bg-black/50 lg:hidden"
        (click)="toggleSidebar()"
      >
        <span class="sr-only">Presiona Escape, Enter o Espacio para cerrar el menú</span>
      </button>
    </div>
  `,
  styles: `
    /* Transiciones suaves */
    .transition-all {
      transition-property: all;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      transition-duration: 300ms;
    }

    /* Responsive adjustments */
    @media (max-width: 1024px) {
      .ml-80,
      .ml-16 {
        margin-left: 0 !important;
      }
    }

    /* Header backdrop effect */
    .backdrop-blur-md {
      backdrop-filter: blur(12px);
    }
  `,
})
export class PrivateLayoutComponent {
  public sidebarCollapsed = false;
  public currentUserRole: 'admin' | 'medico' | 'paciente' = 'admin';
  public currentUser = {
    name: 'Dr. Juan Pérez',
    email: 'juan.perez@healthyme.com',
    avatar: 'assets/images/avatars/patient4.png',
  };

  public toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  public handleLogout(): void {
    // cerrar sesión
  }
}
