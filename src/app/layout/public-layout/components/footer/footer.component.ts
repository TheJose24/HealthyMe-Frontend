import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LogoComponent } from '../../../../shared/components/logo/logo.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, LogoComponent],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  public currentYear = new Date().getFullYear();

  public quickLinks = [
    { label: 'Inicio', route: '/' },
    { label: 'Servicios', route: '/servicios' },
    { label: 'Especialidades', route: '/especialidades' },
    { label: 'Doctores', route: '/doctores' },
    { label: 'Nosotros', route: '/nosotros' },
    { label: 'Contacto', route: '/contacto' },
  ];

  public legalLinks = [
    { label: 'Términos y Condiciones', route: '/terminos' },
    { label: 'Política de Privacidad', route: '/privacidad' },
    { label: 'Protección de Datos', route: '/proteccion-datos' },
  ];

  public contactInfo = {
    address: 'Av. Principal 123, Lima, Perú',
    email: 'contacto@healthyme.pe',
    phone: '(01) 555-1234',
    emergencyPhone: '(01) 555-5678',
  };

  public socialLinks = [
    { name: 'Facebook', icon: 'facebook', url: 'https://facebook.com/' },
    { name: 'Instagram', icon: 'instagram', url: 'https://instagram.com/' },
    { name: 'Twitter', icon: 'twitter', url: 'https://twitter.com/' },
    { name: 'LinkedIn', icon: 'linkedin', url: 'https://linkedin.com/' },
  ];
}
