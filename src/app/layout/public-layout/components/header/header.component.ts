import type { OnInit } from '@angular/core';
import { Component, signal, effect, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LogoComponent } from '../../../../shared/components/logo/logo.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LogoComponent],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  public navigationItems = [
    { label: 'Inicio', route: '/' },
    { label: 'Servicios', route: '/servicios' },
    { label: 'Busca tu doctor', route: '/doctores' },
    { label: 'Nosotros', route: '/nosotros' },
  ];

  public darkMode = signal<boolean>(this.getInitialDarkModeState());
  public mobileMenuOpen = signal<boolean>(false);
  public isScrolled = signal<boolean>(false);

  public constructor() {
    effect(() => {
      this.updateDocumentClass();
    });
  }

  // Cerrar el menú móvil cuando se hace clic fuera o cambia el tamaño de la ventana
  @HostListener('window:resize')
  public onResize(): void {
    if (window.innerWidth >= 768) {
      // md breakpoint
      this.mobileMenuOpen.set(false);
    }
  }

  // Detectar scroll para cambiar la opacidad del header
  @HostListener('window:scroll', ['$event'])
  public checkScrollPosition(): void {
    const scrolled = window.scrollY > 20;
    this.isScrolled.set(scrolled);
  }

  public ngOnInit(): void {
    this.updateDocumentClass();
    this.checkScrollPosition();
  }

  public toggleDarkMode(): void {
    this.darkMode.update(current => !current);
    localStorage.setItem('darkMode', String(this.darkMode()));
  }

  public toggleMobileMenu(): void {
    this.mobileMenuOpen.update(current => !current);
  }

  public closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  private getInitialDarkModeState(): boolean {
    const savedPreference = localStorage.getItem('darkMode');
    return savedPreference === 'true';
  }

  private updateDocumentClass(): void {
    if (this.darkMode()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
