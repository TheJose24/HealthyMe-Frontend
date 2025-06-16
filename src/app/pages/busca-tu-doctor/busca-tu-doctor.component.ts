import { CommonModule } from '@angular/common';
import type { ElementRef } from '@angular/core';
import { Component, ViewChild } from '@angular/core';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-busca-tu-doctor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './busca-tu-doctor.component.html',
  styleUrl: './busca-tu-doctor.component.css',
  animations: [
    trigger('pageAnimation', [
      transition(':increment, :decrement', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateX(50px)' }),
            stagger(100, [
              animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
            ]),
          ],
          { optional: true }
        ),
        query(
          ':leave',
          [
            stagger(100, [
              animate('300ms ease-out', style({ opacity: 0, transform: 'translateX(-50px)' })),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
    trigger('filterAnimation', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(20px)' }),
            stagger(100, [
              animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class BuscaTuDoctorComponent {
  doctores = [
    {
      nombre: 'Dr. Javier Rodríguez',
      especialidad: 'Cardiología',
      descripcion:
        'Especialista en enfermedades del corazón con más de 15 años de experiencia. Realizó su formación avanzada en el Hospital Gregorio Marañón de Madrid.',
      imagen: './assets/images/doctor.png',
    },
    {
      nombre: 'Dra. María López',
      especialidad: 'Pediatría',
      descripcion:
        'Pediatra dedicada al cuidado infantil con enfoque en medicina preventiva. Miembro de la Sociedad Española de Pediatría.',
      imagen: './assets/images/doctora.png',
    },
    {
      nombre: 'Dr. Giovanni Bianchi',
      especialidad: 'Ortopedia',
      descripcion:
        'Cirujano ortopédico especializado en reemplazos articulares y medicina deportiva. Formado en la Universidad de Bologna.',
      imagen: './assets/images/doctor.png',
    },
    {
      nombre: 'Dra. Sophie Martin',
      especialidad: 'Dermatología',
      descripcion:
        'Dermatóloga cosmética y clínica con experiencia en tratamientos láser y cuidado de la piel. Realizó estudios en París.',
      imagen: './assets/images/doctora.png',
    },
    {
      nombre: 'Dr. Carlos Mendez',
      especialidad: 'Neurología',
      descripcion:
        'Neurólogo especializado en enfermedades neurodegenerativas y cefaleas. Jefe de departamento en el Hospital Clínico de Barcelona.',
      imagen: './assets/images/doctor.png',
    },
    {
      nombre: 'Dra. Elena Kowalska',
      especialidad: 'Ginecología',
      descripcion:
        'Ginecóloga y obstetra con enfoque en salud reproductiva y seguimiento del embarazo. Formada en Varsovia.',
      imagen: './assets/images/doctora.png',
    },
    {
      nombre: 'Dr. Antonio Silva',
      especialidad: 'Oftalmología',
      descripcion:
        'Cirujano oftalmológico experto en cataratas y corrección de la visión. Realiza más de 500 cirugías anuales.',
      imagen: './assets/images/doctor.png',
    },
    {
      nombre: 'Dra. Isabella Romano',
      especialidad: 'Endocrinología',
      descripcion:
        'Endocrinóloga especializada en diabetes y trastornos metabólicos. Investigadora en el campo de la nutrición.',
      imagen: './assets/images/doctora.png',
    },
    {
      nombre: 'Dr. Hans Müller',
      especialidad: 'Urología',
      descripcion:
        'Urólogo con subespecialización en oncología urológica. Realizó su formación en Heidelberg, Alemania.',
      imagen: './assets/images/doctor.png',
    },
    {
      nombre: 'Dra. Carmen Vargas',
      especialidad: 'Psiquiatría',
      descripcion:
        'Psiquiatra infantil y de adultos con enfoque en terapias cognitivo-conductuales. Directora de la Unidad de Salud Mental.',
      imagen: './assets/images/doctora.png',
    },
    {
      nombre: 'Dr. Paolo Ferrari',
      especialidad: 'Oncología',
      descripcion:
        'Oncólogo médico especializado en tumores gastrointestinales. Participa en ensayos clínicos internacionales.',
      imagen: './assets/images/doctor.png',
    },
    {
      nombre: 'Dra. Olga Petrov',
      especialidad: 'Neumología',
      descripcion:
        'Neumóloga experta en enfermedades respiratorias crónicas y trastornos del sueño. Investigadora en EPOC.',
      imagen: './assets/images/doctora.png',
    },
    {
      nombre: 'Dr. Miguel Ángel Santos',
      especialidad: 'Cirugía General',
      descripcion:
        'Cirujano general con amplia experiencia en cirugía laparoscópica y mínimamente invasiva. Profesor universitario.',
      imagen: './assets/images/doctor.png',
    },
    {
      nombre: 'Dra. Ana Belén García',
      especialidad: 'Reumatología',
      descripcion:
        'Reumatóloga especializada en enfermedades autoinmunes y artritis. Jefa de servicio en hospital universitario.',
      imagen: './assets/images/doctora.png',
    },
    {
      nombre: 'Dr. Pierre Dubois',
      especialidad: 'Hematología',
      descripcion:
        'Hematólogo con subespecialización en trastornos de la coagulación y medicina transfusional. Formado en Lyon.',
      imagen: './assets/images/doctor.png',
    },
    {
      nombre: 'Dra. Laura Fernández',
      especialidad: 'Medicina Familiar',
      descripcion:
        'Médico de familia con enfoque integral y preventivo. Coordinadora de atención primaria en centro de salud.',
      imagen: './assets/images/doctora.png',
    },
    {
      nombre: 'Dr. Stefan Wagner',
      especialidad: 'Cirugía Plástica',
      descripcion:
        'Cirujano plástico reconstructivo y estético. Especialista en microcirugía y reconstrucción mamaria.',
      imagen: './assets/images/doctor.png',
    },
    {
      nombre: 'Dra. Clara Jiménez',
      especialidad: 'Alergología',
      descripcion:
        'Alergóloga especializada en alergias alimentarias y asma. Desarrolla programas de inmunoterapia.',
      imagen: './assets/images/doctora.png',
    },
    {
      nombre: 'Dr. Luca Marino',
      especialidad: 'Gastroenterología',
      descripcion:
        'Gastroenterólogo experto en enfermedades inflamatorias intestinales y endoscopia digestiva. Formado en Milán.',
      imagen: './assets/images/doctor.png',
    },
    {
      nombre: 'Dra. Marta Díaz',
      especialidad: 'Medicina Interna',
      descripcion:
        'Internista con amplia experiencia en diagnóstico complejo y pacientes pluripatológicos. Tutora de residentes.',
      imagen: './assets/images/doctora.png',
    },
    {
      nombre: 'Dr. Andrés Navarro',
      especialidad: 'Cardiología',
      descripcion:
        'Cardiólogo intervencionista con experiencia en angioplastias y marcapasos. Jefe de hemodinámica en hospital terciario.',
      imagen: './assets/images/doctor.png',
    },
    {
      nombre: 'Dra. Patricia Costa',
      especialidad: 'Pediatría',
      descripcion:
        'Pediatra neonatóloga especializada en cuidados intensivos neonatales. Publica regularmente sobre nutrición infantil.',
      imagen: './assets/images/doctora.png',
    },
    {
      nombre: 'Dr. Fabio Ricci',
      especialidad: 'Ortopedia',
      descripcion:
        'Traumatólogo especializado en cirugía de columna vertebral. Desarrolló técnica mínimamente invasiva para escoliosis.',
      imagen: './assets/images/doctor.png',
    },
    {
      nombre: 'Dra. Valeria Esposito',
      especialidad: 'Dermatología',
      descripcion:
        'Dermatóloga pediátrica con enfoque en genodermatosis. Directora de la unidad de dermatología infantil.',
      imagen: './assets/images/doctora.png',
    },
    {
      nombre: 'Dr. Erik Johansson',
      especialidad: 'Neurología',
      descripcion:
        'Neurólogo especializado en epilepsia y trastornos del movimiento. Realizó fellowship en el Karolinska Institutet.',
      imagen: './assets/images/doctor.png',
    },
    {
      nombre: 'Dra. Silvia Montenegro',
      especialidad: 'Ginecología',
      descripcion:
        'Ginecóloga oncóloga con especial interés en cáncer de ovario. Lidera grupo de investigación en terapias biológicas.',
      imagen: './assets/images/doctora.png',
    },
    {
      nombre: 'Dr. Álvaro Ortega',
      especialidad: 'Oftalmología',
      descripcion:
        'Especialista en retina y vítreo con técnica quirúrgica innovadora para desprendimientos de retina complejos.',
      imagen: './assets/images/doctor.png',
    },
    {
      nombre: 'Dra. Ingrid Bergman',
      especialidad: 'Endocrinología',
      descripcion:
        'Endocrinóloga especializada en trastornos tiroideos y metabolismo óseo. Premio nacional de endocrinología 2022.',
      imagen: './assets/images/doctora.png',
    },
    {
      nombre: 'Dr. Sergey Petrov',
      especialidad: 'Urología',
      descripcion:
        'Urólogo pediátrico con técnica laparoscópica para corrección de malformaciones congénitas del tracto urinario.',
      imagen: './assets/images/doctor.png',
    },
    {
      nombre: 'Dra. Lucía Hernández',
      especialidad: 'Psiquiatría',
      descripcion:
        'Psiquiatra especializada en trastornos de la conducta alimentaria. Directora de unidad de hospitalización psiquiátrica.',
      imagen: './assets/images/doctor.png',
    },
  ];

  especialidades: string[] = ['Todos', 'Cardiología', 'Pediatría', 'Neurología', 'Psiquiatría'];
  especialidadDefault: string = 'Todos';
  paginaActual: number = 1;
  doctoresPorPagina: number = 9;

  get especialidadSeleccionada(): string {
    return this.especialidadDefault;
  }

  set especialidadSeleccionada(value: string) {
    this.especialidadDefault = value;
    this.paginaActual = 1;
  }

  get doctoresFiltrados() {
    if (this.especialidadSeleccionada === 'Todos') {
      return this.doctores;
    }
    return this.doctores.filter(doctor =>
      doctor.especialidad.toLowerCase().includes(this.especialidadSeleccionada.toLowerCase())
    );
  }

  get doctoresPaginados() {
    const startIndex = (this.paginaActual - 1) * this.doctoresPorPagina;
    return this.doctoresFiltrados.slice(startIndex, startIndex + this.doctoresPorPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.doctoresFiltrados.length / this.doctoresPorPagina);
  }

  cambiarPagina(pagina: number) {
    setTimeout(() => {
      this.paginaActual = pagina;
      this.scrollToElement();
    }, 50);
  }

  anterior() {
    if (this.paginaActual > 1) {
      setTimeout(() => {
        this.paginaActual--;
        this.scrollToElement();
      }, 50);
    }
  }

  siguiente() {
    if (this.paginaActual < this.totalPaginas) {
      setTimeout(() => {
        this.paginaActual++;
        this.scrollToElement();
      }, 50);
    }
  }

  @ViewChild('listaDoctores') position!: ElementRef<HTMLElement>;

  private scrollToElement() {
    this.position.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}
