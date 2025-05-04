// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { Component, ViewChild, NgZone } from '@angular/core';
import type { OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import ScrollReveal from 'scrollreveal';
import GLightbox from 'glightbox';

// Importar estilos de Swiper y GLightbox
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'glightbox/dist/css/glightbox.css';

interface IFaq {
  question: string;
  answer: string;
  isOpen: boolean;
}

interface IGlightboxInstance {
  destroy: () => void;
  open: (index?: number) => void;
  close: () => void;
}

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('heroSwiper')
  public heroSwiperRef!: ElementRef;
  @ViewChild('testimonialSwiper')
  public testimonialSwiperRef!: ElementRef;

  // Datos de estadísticas
  public statistics = [
    { value: '15', suffix: '+', label: 'Años de servicio' },
    { value: '50', suffix: '+', label: 'Especialistas' },
    { value: '30,000', suffix: '+', label: 'Pacientes atendidos' },
    { value: '20', suffix: '+', label: 'Especialidades' },
  ];

  // Datos de beneficios
  public benefits = [
    {
      title: 'Profesionales Expertos',
      description:
        'Contamos con médicos certificados y especialistas con amplia experiencia en múltiples disciplinas médicas.',
      iconClass: 'ri-user-heart-line',
    },
    {
      title: 'Tecnología de Punta',
      description:
        'Utilizamos equipos de última generación para diagnósticos más precisos y tratamientos menos invasivos.',
      iconClass: 'bx bx-chip',
    },
    {
      title: 'Atención Humana',
      description:
        'Nos enfocamos en tu bienestar integral, con un trato cálido y personalizado para ti y tu familia.',
      iconClass: 'ri-hand-heart-line',
    },
    {
      title: 'Atención Rápida',
      description:
        'Ofrecemos atención oportuna con tiempos de espera reducidos y disponibilidad de citas prioritarias.',
      iconClass: 'bx bx-timer',
    },
    {
      title: 'Historia Clínica Digital',
      description:
        'Accede a tu información médica desde cualquier lugar con nuestro sistema seguro de historias clínicas.',
      iconClass: 'ri-folder-user-line',
    },
    {
      title: 'Precios Accesibles',
      description:
        'Ofrecemos planes y tarifas justas para que la salud de calidad sea accesible para todos los peruanos.',
      iconClass: 'bx bx-coin-stack',
    },
  ];

  // Datos de especialidades
  public specialties = [
    { name: 'Cardiología', iconClass: 'ri-heart-pulse-line' },
    { name: 'Neurología', iconClass: 'ri-brain-line' },
    { name: 'Pediatría', iconClass: 'bx bxs-baby-carriage' },
    { name: 'Traumatología', iconClass: 'bx bx-band-aid' },
    { name: 'Ginecología', iconClass: 'bx bx-female' },
    { name: 'Oftalmología', iconClass: 'ri-eye-line' },
    { name: 'Dermatología', iconClass: 'bx bx-spray-can' },
    { name: 'Endocrinología', iconClass: 'bx bx-dna' },
  ];

  // Hero Banners para Swiper
  public heroBanners = [
    {
      title:
        'Cuidando la <span class="text-primary dark:text-primary-light">salud</span> de todos los peruanos',
      subtitle: 'Comprometidos con tu bienestar',
      description:
        'Nuestro equipo de especialistas altamente calificados está listo para cuidar de ti y tu familia con la mejor tecnología y atención personalizada.',
      image: 'assets/images/medico.svg',
      bgClass: 'bg-gradient-to-r from-primary/5 to-secondary/5',
    },
    {
      title:
        'Tecnología <span class="text-primary dark:text-primary-light">médica</span> de última generación',
      subtitle: 'Innovación en salud',
      description:
        'Contamos con equipamiento médico de vanguardia para diagnósticos precisos y tratamientos efectivos en todas nuestras especialidades.',
      image: 'assets/images/tech-medical.png',
      bgClass: 'bg-gradient-to-r from-secondary/5 to-primary/5',
    },
    {
      title: 'Tu salud en <span class="text-primary dark:text-primary-light">buenas</span> manos',
      subtitle: 'Experiencia y profesionalismo',
      description:
        'Médicos especialistas con amplia experiencia brindan atención personalizada y tratamientos efectivos para cada paciente.',
      image: 'assets/images/medico-especialista.png',
      bgClass: 'bg-gradient-to-r from-primary/5 to-primary/10',
    },
  ];

  // Datos de testimonios
  public testimonials = [
    {
      author: 'María Rodríguez',
      avatar: 'assets/images/avatars/patient1.png',
      rating: 5,
      text: 'La atención fue excelente, desde la recepción hasta la consulta con el especialista. El Dr. Gutiérrez fue muy profesional y dedicó el tiempo necesario para explicarme mi condición y opciones de tratamiento.',
      date: 'Hace 2 semanas',
    },
    {
      author: 'Carlos Méndez',
      avatar: 'assets/images/avatars/patient2.png',
      rating: 4,
      text: 'Llevé a mi hijo para una consulta pediátrica y quedé muy satisfecho. Las instalaciones son modernas, limpias y el personal muy amable. La doctora fue excelente con mi hijo.',
      date: 'Hace 1 mes',
    },
    {
      author: 'Ana Torres',
      avatar: 'assets/images/avatars/patient3.png',
      rating: 5,
      text: 'La cirugía fue un éxito y el seguimiento post-operatorio impecable. Todo el equipo médico me hizo sentir segura y en las mejores manos. Recomendaría HealthyMe sin dudarlo.',
      date: 'Hace 3 meses',
    },
    {
      author: 'Juan Pérez',
      avatar: 'assets/images/avatars/patient4.png',
      rating: 5,
      text: 'Excelente experiencia con el servicio de telemedicina. Era escéptico al principio, pero la consulta online fue muy profesional y el seguimiento posterior impecable. La app es muy intuitiva y fácil de usar.',
      date: 'Hace 2 semanas',
    },
  ];

  // Galería de imágenes
  public galleryImages = [
    {
      thumb: 'assets/images/facilities/reception.jpg',
      full: 'assets/images/facilities/reception.jpg',
      alt: 'Recepción principal',
      title: 'Recepción principal',
    },
    {
      thumb: 'assets/images/facilities/consultation.jpg',
      full: 'assets/images/facilities/consultation.jpg',
      alt: 'Sala de consultas',
      title: 'Sala de consultas',
    },
    {
      thumb: 'assets/images/facilities/treatment.jpeg',
      full: 'assets/images/facilities/treatment.jpeg',
      alt: 'Área de tratamientos',
      title: 'Área de tratamientos',
    },
    {
      thumb: 'assets/images/facilities/laboratory.png',
      full: 'assets/images/facilities/laboratory.png',
      alt: 'Laboratorio especializado',
      title: 'Laboratorio especializado',
    },
  ];

  // FAQs
  public faqs: IFaq[] = [
    {
      question: '¿Cómo puedo agendar una cita?',
      answer:
        'Puede agendar una cita a través de nuestra plataforma web, llamando a nuestro centro de contacto al (01) 555-7890 o directamente en nuestros centros médicos. Se requiere identificación y datos de contacto básicos.',
      isOpen: false,
    },
    {
      question: '¿Qué debo llevar a mi consulta?',
      answer:
        'Para su primera visita, le recomendamos traer su documento de identidad, tarjeta de seguro (si aplica), historial médico relevante y lista de medicamentos que esté tomando actualmente.',
      isOpen: false,
    },
    {
      question: '¿Trabajan con seguros de salud?',
      answer:
        'Sí, trabajamos con las principales aseguradoras del país. Puede verificar la cobertura específica de su seguro llamando a nuestro centro de atención o en la sección de seguros de nuestra web.',
      isOpen: false,
    },
    {
      question: '¿Ofrecen telemedicina?',
      answer:
        'Sí, ofrecemos servicios de telemedicina para consultas generales y seguimiento de tratamientos. Puede agendar una consulta virtual a través de nuestra plataforma web o aplicación móvil.',
      isOpen: false,
    },
  ];

  // Estado de carga de secciones diferidas
  public sectionsLoaded = {
    benefits: false,
    gallery: false,
    testimonials: false,
    ctaAndFaqs: false,
  };

  // Instancias de Swiper
  private heroSwiper!: Swiper;
  private testimonialSwiper!: Swiper;

  // Instancia ScrollReveal
  private sr!: typeof ScrollReveal;

  // Instancia GLightbox
  private glightbox!: IGlightboxInstance;

  private observer: MutationObserver | null = null;

  public constructor(private ngZone: NgZone) {}

  public ngOnInit(): void {
    // Inicializar ScrollReveal
    this.sr = ScrollReveal({
      origin: 'bottom',
      distance: '20px',
      duration: 800,
      delay: 200,
      easing: 'ease-in-out',
      reset: false,
    });

    this.setupMutationObserver();
  }

  public ngAfterViewInit(): void {
    // Inicializar Swiper para Hero
    setTimeout(() => {
      if (this.heroSwiperRef?.nativeElement) {
        this.heroSwiper = new Swiper(this.heroSwiperRef.nativeElement, {
          modules: [Navigation, Pagination, Autoplay, EffectFade],
          slidesPerView: 1,
          spaceBetween: 0,
          effect: 'fade',
          fadeEffect: {
            crossFade: true,
          },
          loop: true,
          autoplay: {
            delay: 6000,
            disableOnInteraction: false,
          },
          pagination: {
            el: '.hero-pagination',
            clickable: true,
          },
          navigation: {
            nextEl: '.hero-button-next',
            prevEl: '.hero-button-prev',
          },
        });
      }

      // Revelar estadísticas iniciales
      this.sr.reveal('.statistics-item', {
        interval: 200,
        origin: 'bottom',
        distance: '20px',
      });

      // Inicializar GLightbox
      this.glightbox = GLightbox({
        touchNavigation: true,
        loop: true,
        autoplayVideos: false,
      }) as IGlightboxInstance;
    }, 0);
  }

  public ngOnDestroy(): void {
    // Detener observación de cambios en el DOM
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    // Destruir instancias
    if (this.heroSwiper) {
      this.heroSwiper.destroy();
    }

    if (this.testimonialSwiper) {
      this.testimonialSwiper.destroy();
    }

    if (this.glightbox) {
      this.glightbox.close();
    }
  }

  public openGallery(index = 0): void {
    this.glightbox?.open(index);
  }

  public toggleFaq(faq: IFaq): void {
    faq.isOpen = !faq.isOpen;
  }

  private setupMutationObserver(): void {
    // Crear un observer para detectar cuando se añaden elementos al DOM
    this.observer = new MutationObserver(mutations => {
      // Detectar si se han añadido elementos que nos interesan
      let needsBenefitsReveal = false;
      let needsSpecialtiesReveal = false;
      let needsGalleryReveal = false;
      let needsTestimonialsReveal = false;
      let needsCtaFaqsReveal = false;

      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node instanceof HTMLElement) {
              // Buscar clases específicas en los elementos añadidos o sus descendientes
              if (node.querySelector('.benefit-card') || node.classList.contains('benefit-card')) {
                needsBenefitsReveal = true;
              }
              if (
                node.querySelector('.specialty-card') ||
                node.classList.contains('specialty-card')
              ) {
                needsSpecialtiesReveal = true;
              }
              if (node.querySelector('.gallery-item') || node.classList.contains('gallery-item')) {
                needsGalleryReveal = true;
              }
              if (
                node.querySelector('.testimonial-swiper') ||
                node.classList.contains('testimonial-swiper')
              ) {
                needsTestimonialsReveal = true;
              }
              if (
                node.querySelector('.cta-content') ||
                node.classList.contains('cta-content') ||
                node.querySelector('.faq-item') ||
                node.classList.contains('faq-item')
              ) {
                needsCtaFaqsReveal = true;
              }
            }
          });
        }
      });

      this.ngZone.run(() => {
        if (needsBenefitsReveal) {
          setTimeout(() => this.revealBenefits(), 300);
        }
        if (needsSpecialtiesReveal) {
          setTimeout(() => this.revealSpecialties(), 300);
        }
        if (needsGalleryReveal) {
          setTimeout(() => this.revealGallery(), 300);
        }
        if (needsTestimonialsReveal) {
          setTimeout(() => this.initTestimonials(), 300);
        }
        if (needsCtaFaqsReveal) {
          setTimeout(() => this.revealCtaAndFaqs(), 300);
        }
      });
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false,
    });
  }

  private revealBenefits(): void {
    this.sr.reveal('.benefit-card', {
      interval: 150,
      origin: 'bottom',
      distance: '20px',
      cleanup: true,
    });
  }

  private revealSpecialties(): void {
    this.sr.reveal('.specialty-card', {
      interval: 100,
      origin: 'bottom',
      distance: '30px',
      cleanup: true,
    });
  }

  private revealGallery(): void {
    this.sr.reveal('.gallery-item', {
      interval: 125,
      origin: 'left',
      distance: '20px',
      cleanup: true,
    });

    if (this.glightbox) {
      this.glightbox.destroy();
    }

    // Crear una nueva instancia con los elementos de la galería
    this.glightbox = GLightbox({
      elements: this.galleryImages.map(img => ({
        href: img.full,
        type: 'image',
        title: img.title,
        alt: img.alt,
      })) as any,
      touchNavigation: true,
      loop: true,
      autoplayVideos: false,
    }) as IGlightboxInstance;
  }

  private initTestimonials(): void {
    // Inicializar Swiper para testimonios
    if (this.testimonialSwiperRef?.nativeElement) {
      setTimeout(() => {
        this.testimonialSwiper = new Swiper(this.testimonialSwiperRef.nativeElement, {
          modules: [Navigation, Pagination, Autoplay],
          slidesPerView: 1,
          spaceBetween: 20,
          autoplay: {
            delay: 5000,
            disableOnInteraction: false,
          },
          loop: true,
          pagination: {
            el: '.testimonial-pagination',
            clickable: true,
          },
          navigation: {
            nextEl: '.testimonial-button-next',
            prevEl: '.testimonial-button-prev',
          },
          breakpoints: {
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          },
        });
      }, 0);
    }
  }

  private revealCtaAndFaqs(): void {
    this.sr.reveal('.faq-item', {
      interval: 150,
      origin: 'right',
      distance: '20px',
      cleanup: true,
    });

    this.sr.reveal('.cta-content', {
      delay: 200,
      origin: 'left',
      distance: '50px',
      cleanup: true,
    });

    this.sr.reveal('.cta-image', {
      delay: 400,
      origin: 'right',
      distance: '50px',
      cleanup: true,
    });
  }
}
