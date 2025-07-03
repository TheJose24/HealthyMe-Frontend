import { Component, ViewChild } from '@angular/core';
import type { OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';

interface IValue {
  id: number;
  titulo: string;
  descripcion: string;
  icono: string;
  color: string;
}

interface ITeamMember {
  id: number;
  nombre: string;
  cargo: string;
  descripcion: string;
  imagen: string;
  linkedin?: string;
  especialidad: string;
}

interface IStatistic {
  id: number;
  numero: string;
  titulo: string;
  descripcion: string;
  icono: string;
  color: string;
}

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nosotros.component.html',
  styleUrls: ['./nosotros.component.css'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(50px)' }),
        animate('800ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
    trigger('staggerAnimation', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(30px)' }),
            stagger(200, [
              animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
    ]),
  ],
})
export class NosotrosComponent implements OnInit, AfterViewInit {
  @ViewChild('statsSection') public statsSection!: ElementRef;

  public valores: IValue[] = [
    {
      id: 1,
      titulo: 'Excelencia Médica',
      descripcion:
        'Comprometidos con los más altos estándares de calidad en cada tratamiento y diagnóstico.',
      icono: 'ri-award-line',
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 2,
      titulo: 'Innovación Tecnológica',
      descripcion:
        'Integramos las últimas tecnologías para brindar una experiencia médica moderna y eficiente.',
      icono: 'ri-computer-line',
      color: 'from-green-500 to-green-600',
    },
    {
      id: 3,
      titulo: 'Atención Humanizada',
      descripcion: 'Cada paciente es único. Brindamos cuidado personalizado con calidez y empatía.',
      icono: 'ri-heart-line',
      color: 'from-red-500 to-red-600',
    },
    {
      id: 4,
      titulo: 'Compromiso Social',
      descripcion:
        'Trabajamos por la salud de nuestra comunidad con responsabilidad y transparencia.',
      icono: 'ri-community-line',
      color: 'from-purple-500 to-purple-600',
    },
  ];

  public estadisticas: IStatistic[] = [
    {
      id: 1,
      numero: '10,000+',
      titulo: 'Pacientes Atendidos',
      descripcion: 'Confianza depositada en nosotros',
      icono: 'ri-user-heart-line',
      color: 'text-blue-600',
    },
    {
      id: 2,
      numero: '50+',
      titulo: 'Médicos Especialistas',
      descripcion: 'Profesionales altamente calificados',
      icono: 'ri-stethoscope-line',
      color: 'text-green-600',
    },
    {
      id: 3,
      numero: '15',
      titulo: 'Especialidades Médicas',
      descripcion: 'Cobertura integral de salud',
      icono: 'ri-hospital-line',
      color: 'text-purple-600',
    },
    {
      id: 4,
      numero: '4.5',
      titulo: 'Satisfacción del Cliente',
      descripcion: 'Calidad reconocida por nuestros pacientes',
      icono: 'ri-star-line',
      color: 'text-yellow-600',
    },
  ];

  public equipoLiderago: ITeamMember[] = [
    {
      id: 1,
      nombre: 'Dr. Carlos Mendoza',
      cargo: 'Director Médico',
      descripcion: 'Más de 20 años de experiencia en administración hospitalaria y cardiología.',
      imagen: 'assets/images/doctor.png',
      linkedin: 'https://linkedin.com/in/carlos-mendoza',
      especialidad: 'Cardiología',
    },
    {
      id: 2,
      nombre: 'Ing. María Rodríguez',
      cargo: 'Directora de Tecnología',
      descripcion:
        'Especialista en transformación digital en el sector salud con certificaciones internacionales.',
      imagen: 'assets/images/doctora.png',
      linkedin: 'https://linkedin.com/in/maria-rodriguez',
      especialidad: 'Tecnología Médica',
    },
    {
      id: 3,
      nombre: 'Dra. Ana Gutiérrez',
      cargo: 'Jefa de Calidad',
      descripcion: 'Experta en gestión de calidad hospitalaria y acreditación internacional.',
      imagen: 'assets/images/doctora.png',
      linkedin: 'https://linkedin.com/in/ana-gutierrez',
      especialidad: 'Gestión de Calidad',
    },
  ];

  public animateStats: boolean = false;

  public ngOnInit(): void {
    this.initializeData();
  }

  public ngAfterViewInit(): void {
    this.setupIntersectionObserver();
  }

  public trackByValorId(_index: number, valor: IValue): number {
    return valor.id;
  }

  public trackByStatId(_index: number, stat: IStatistic): number {
    return stat.id;
  }

  public trackByMemberId(_index: number, member: ITeamMember): number {
    return member.id;
  }

  public openLinkedIn(url?: string): void {
    if (url) {
      window.open(url, '_blank');
    }
  }

  private initializeData(): void {
    // Método para inicialización futura de datos
    // this.loadTeamData();
    // this.loadStatistics();
  }

  private setupIntersectionObserver(): void {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting && !this.animateStats) {
              this.animateStats = true;
              this.animateNumbers();
            }
          });
        },
        { threshold: 0.5 }
      );

      if (this.statsSection) {
        observer.observe(this.statsSection.nativeElement);
      }
    }
  }

  private animateNumbers(): void {
    this.estadisticas.forEach((stat, index) => {
      setTimeout(() => {
        this.animateCounter(stat);
      }, index * 200);
    });
  }

  private animateCounter(stat: IStatistic): void {
    const duration = 2000;
    const increment = 50;
    const steps = duration / increment;
    let currentStep = 0;

    // Guardamos el valor original para la animación
    const originalNumber = stat.numero;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      // Animación específica según el tipo de estadística
      if (originalNumber.includes('%')) {
        const targetValue = parseFloat(originalNumber.replace('%', ''));
        const currentValue = Math.min(targetValue * progress, targetValue);
        stat.numero = `${currentValue.toFixed(1)}%`;
      } else if (originalNumber.includes('+')) {
        const targetValue = parseInt(originalNumber.replace(/[^0-9]/g, ''));
        const currentValue = Math.min(targetValue * progress, targetValue);
        stat.numero = `${Math.floor(currentValue).toLocaleString()}+`;
      }

      if (currentStep >= steps) {
        clearInterval(timer);
        // Restauramos el valor original al final de la animación
        stat.numero = originalNumber;
      }
    }, increment);
  }
}
