import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { FormBuilder, type FormGroup } from '@angular/forms';
import { Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, state } from '@angular/animations';

interface IFaq {
  id: number;
  pregunta: string;
  respuesta: string;
  abierto: boolean;
  icono: string;
}

interface IContactInfo {
  icono: string;
  titulo: string;
  contenido: string;
  enlace?: string;
  color: string;
}

interface IOfficeHour {
  dia: string;
  horario: string;
  activo: boolean;
}

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css'],
  animations: [
    trigger('slideDown', [
      state('closed', style({ height: '0px', overflow: 'hidden', opacity: 0 })),
      state('open', style({ height: '*', overflow: 'visible', opacity: 1 })),
      transition('closed <=> open', [animate('300ms cubic-bezier(0.4, 0, 0.2, 1)')]),
    ]),
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class ContactoComponent implements OnInit {
  // Propiedades públicas
  public contactForm!: FormGroup;
  public isSubmitting: boolean = false;
  public showSuccessMessage: boolean = false;

  public faqs: IFaq[] = [
    {
      id: 1,
      pregunta: '¿Cómo puedo agendar una cita médica?',
      respuesta:
        'Puedes agendar tu cita a través de nuestra plataforma en línea, llamando al número de contacto, o visitando cualquiera de nuestras sedes. Nuestro sistema te permite elegir fecha, hora y especialista.',
      abierto: false,
      icono: 'ri-calendar-check-line',
    },
    {
      id: 2,
      pregunta: '¿Qué seguros médicos aceptan?',
      respuesta:
        'Trabajamos con los principales seguros médicos del país incluyendo EsSalud, SIS, seguros privados como Pacifico, Rimac, La Positiva, y también atendemos pacientes particulares.',
      abierto: false,
      icono: 'ri-shield-check-line',
    },
    {
      id: 3,
      pregunta: '¿Ofrecen telemedicina?',
      respuesta:
        'Sí, contamos con servicios de telemedicina para consultas de seguimiento, revisión de exámenes y consultas preventivas. Disponible de lunes a sábado.',
      abierto: false,
      icono: 'ri-video-chat-line',
    },
    {
      id: 4,
      pregunta: '¿Cuál es el tiempo de espera para una cita?',
      respuesta:
        'Los tiempos varían según la especialidad. Medicina general: mismo día o siguiente día. Especialidades: 1-7 días. Urgencias: atención inmediata.',
      abierto: false,
      icono: 'ri-time-line',
    },
    {
      id: 5,
      pregunta: '¿Tienen servicios de emergencia 24/7?',
      respuesta:
        'Sí, nuestro servicio de emergencias está disponible las 24 horas, los 7 días de la semana en nuestras sedes principales de Lima y provincia.',
      abierto: false,
      icono: 'ri-hospital-line',
    },
  ];

  public contactInfo: IContactInfo[] = [
    {
      icono: 'ri-phone-line',
      titulo: 'Teléfono Principal',
      contenido: '+51 1 234-5678',
      enlace: 'tel:+51123445678',
      color: 'bg-blue-500',
    },
    {
      icono: 'ri-smartphone-line',
      titulo: 'WhatsApp',
      contenido: '+51 987 654 321',
      enlace: 'https://wa.me/51987654321',
      color: 'bg-green-500',
    },
    {
      icono: 'ri-mail-line',
      titulo: 'Correo Electrónico',
      contenido: 'contacto@healthyme.com',
      enlace: 'mailto:contacto@healthyme.com',
      color: 'bg-red-500',
    },
    {
      icono: 'ri-map-pin-line',
      titulo: 'Dirección Principal',
      contenido: 'Av. Principal 123, Lima, Perú',
      color: 'bg-purple-500',
    },
  ];

  public officeHours: IOfficeHour[] = [
    { dia: 'Lunes - Viernes', horario: '8:00 AM - 8:00 PM', activo: true },
    { dia: 'Sábados', horario: '8:00 AM - 2:00 PM', activo: true },
    { dia: 'Domingos', horario: 'Solo Emergencias', activo: false },
    { dia: 'Feriados', horario: 'Solo Emergencias', activo: false },
  ];

  // Constructor con modificador de accesibilidad
  public constructor(private fb: FormBuilder) {}

  // Métodos del ciclo de vida
  public ngOnInit(): void {
    this.initializeForm();
  }

  // Métodos públicos (ordenados antes que los privados)
  public toggleFaq(index: number): void {
    this.faqs[index].abierto = !this.faqs[index].abierto;
  }

  public async submitForm(): Promise<void> {
    if (this.contactForm.valid) {
      this.isSubmitting = true;

      try {
        // Simular envío del formulario
        await this.simulateFormSubmission();

        this.showSuccessMessage = true;
        this.contactForm.reset();
        this.contactForm.patchValue({ tipoConsulta: 'general', aceptaTerminos: false });

        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 5000);
      } catch (error) {
        // Manejo de errores sin console.log
        this.handleFormError(error);
      } finally {
        this.isSubmitting = false;
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  public getFieldError(fieldName: string): string | null {
    const field = this.contactForm.get(fieldName);
    if (field && field.invalid && field.touched) {
      if (field.errors?.['required']) {
        return `${this.getFieldDisplayName(fieldName)} es requerido`;
      }
      if (field.errors?.['email']) {
        return 'Ingrese un email válido';
      }
      if (field.errors?.['minlength']) {
        return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors?.['pattern']) {
        return 'Formato inválido';
      }
    }
    return null;
  }

  // Métodos privados (ordenados después de los públicos)
  private initializeForm(): void {
    this.contactForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.pattern(/^[0-9]{9}$/)]],
      asunto: ['', Validators.required],
      tipoConsulta: ['general', Validators.required],
      mensaje: ['', [Validators.required, Validators.minLength(10)]],
      aceptaTerminos: [false, Validators.requiredTrue],
    });
  }

  private simulateFormSubmission(): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        // Enviado exitosamente - log removido
        resolve();
      }, 2000);
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.contactForm.controls).forEach(key => {
      this.contactForm.get(key)?.markAsTouched();
    });
  }

  private getFieldDisplayName(fieldName: string): string {
    const names: { [key: string]: string } = {
      nombre: 'Nombre',
      email: 'Email',
      telefono: 'Teléfono',
      asunto: 'Asunto',
      mensaje: 'Mensaje',
      aceptaTerminos: 'Aceptación de términos',
    };
    return names[fieldName] || fieldName;
  }

  private handleFormError(error: unknown): void {
    // Manejo de errores con un sistema de logging
    if (error instanceof Error) {
      // enviar el error a un servicio de monitoreo como Sentry
      // this.errorService.logError(error);
    }

    // Mostrar mensaje de error al usuario
    // this.showErrorMessage = true;
  }
}
