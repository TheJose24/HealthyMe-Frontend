export interface IFeature {
  title: string;
  subtitle: string;
}

export interface IFAQ {
  question: string;
  answer: string;
}

export interface IStat {
  value: string;
  label: string;
}

export interface IUnidad {
  slug: string;
  title: string;
  tagline: string;
  overview: string;
  objectives: string[];
  detailsList: string[];
  image: string;
  image2: string;
  extras: string[];
  stats: IStat[];
  faqs: IFAQ[];
  ctaText: string;
  ctaButton: string;
  ctaLink: string;
}

export const UNIDADES: IUnidad[] = [
  {
    slug: 'lactancia-materna',
    title: 'Lactancia Materna',
    tagline: 'Apoyo integral para un vínculo saludable',
    overview: `Nuestra Unidad de Lactancia Materna combina la experiencia de consultores certificados
con las últimas guías internacionales para garantizar un comienzo óptimocd.`,
    objectives: [
      'Fomentar la producción natural de leche',
      'Corregir problemas de agarre y postura',
      'Brindar soporte emocional continuo',
      'Diseñar un plan nutricional balanceado',
    ],
    detailsList: [
      'Grupos de apoyo semanales con otras madres',
      'Línea telefónica 24/7 para resolver dudas',
      'Acceso a material digital y guías prácticas',
      'Consultas de seguimiento personalizadas',
    ],
    image: 'assets/images/unidades/lactancia-materna.jpg',
    image2: 'assets/images/unidades/lactancia.webp',
    extras: [
      'Consultas personalizadas',
      'Material digital exclusivo',
      'Sesiones de teleconsulta',
      'Talleres prácticos',
    ],

    stats: [
      { value: '95%', label: 'Tasa de éxito' },
      { value: '2k+', label: 'Madres asesoradas' },
      { value: '10 años', label: 'Experiencia' },
    ],
    faqs: [
      {
        question: '¿Cuántas sesiones necesito?',
        answer: '3–5 sesiones suelen bastar para un buen comienzo.',
      },
      {
        question: '¿Ofrecen teleconsulta?',
        answer: 'Sí, ofrecemos citas presenciales y virtuales.',
      },
      { question: '¿Primera consulta gratuita?', answer: 'La valoración inicial no tiene costo.' },
      { question: '¿Puedo asistir con mi familia?', answer: 'Tu red de apoyo es bienvenida.' },
    ],
    ctaText: '¿Lista para comenzar tu asesoría de lactancia?',
    ctaButton: 'Reservar Cita',
    ctaLink: '/reservar-cita',
  },

  {
    slug: 'laboratorio',
    title: 'Laboratorio',
    tagline: 'Resultados rápidos y confiables',
    overview:
      'Nuestro laboratorio clínico ofrece análisis de alta precisión respaldados por tecnología de última generación y un equipo de especialistas.',
    objectives: [
      'Procesamiento de muestras en menos de 24 h',
      'Control de calidad certificado',
      'Interpretación de resultados por patólogos',
      'Entrega digital segura de informes',
    ],
    detailsList: [
      'Equipos automatizados de última generación',
      'Protocolos ISO 15189',
      'Recolección a domicilio (previa cita)',
      'Soporte vía correo y WhatsApp',
    ],
    extras: [
      'Toma de muestras a domicilio',
      'Entrega digital de resultados',
      'Interpretación de especialistas',
      'Paquetes promocionales mensuales',
    ],
    stats: [
      { value: '99%', label: 'Exactitud de resultados' },
      { value: '10k+', label: 'Pruebas realizadas' },
      { value: '15 años', label: 'Trayectoria' },
    ],
    faqs: [
      {
        question: '¿Cómo solicito una prueba?',
        answer: 'Puedes agendar tu cita en línea o llamando a nuestro call center.',
      },
      {
        question: '¿Puedo compartir mis resultados?',
        answer: 'Sí, genera un PDF con contraseña para enviar a tu especialista.',
      },
      {
        question: '¿Tienen paquetes familiares?',
        answer: 'Consulta nuestros descuentos por volumen de pruebas.',
      },
      {
        question: '¿Cómo interpreto mis resultados básicos?',
        answer:
          'Cada informe incluye leyenda explicativa y puedes solicitar cita de interpretación.',
      },
    ],
    ctaText: '¿Necesitas un análisis clínico confiable?',
    ctaLink: '/reservar-cita',
    ctaButton: 'Reservar Cita',
    image: 'assets/images/unidades/laboratorio.jpg',
    image2: 'assets/images/unidades/lab.jpg',
  },

  {
    slug: 'optica',
    title: 'Óptica',
    tagline: 'Cuidado visual de calidad',
    overview:
      'Brindamos exámenes oftalmológicos integrales y lentes personalizados para cada necesidad, con asesoría profesional.',
    objectives: [
      'Evaluación completa de agudeza visual',
      'Asesoría en monturas y lentes',
      'Adaptación de lentes progresivos',
      'Seguimiento postventa',
    ],
    detailsList: [
      'Examen de vista con retinógrafo digital',
      'Gran variedad de monturas de diseño',
      'Lentes antirreflectantes y fotocromáticos',
      'Garantía y ajustes gratuitos',
    ],
    extras: [
      'Examen de vista completo',
      'Lentes personalizados',
      'Asesoría en monturas',
      'Revisión anual gratuita',
    ],
    stats: [
      { value: '98%', label: 'Satisfacción' },
      { value: '3K+', label: 'Lentes entregados' },
      { value: '13 años', label: 'Experiencia' },
    ],
    faqs: [
      {
        question: '¿Sirven mis lentes antiguos?',
        answer: 'Puedes traerlos, revisamos su graduación y te asesoramos.',
      },
      {
        question: '¿Tardan en fabricar mis lentes?',
        answer: 'Normalmente entre 3 y 5 días hábiles.',
      },
      {
        question: '¿Hacen adaptaciones de contacto?',
        answer: 'Sí, contamos con lentes de contacto blandos y rígidos.',
      },
      {
        question: '¿Realizan ajustes sin costo?',
        answer: 'Ofrecemos ajustes gratuitos de monturas dentro del primer mes de entrega.',
      },
    ],
    ctaText: '¿Listo para tu examen de la vista?',
    ctaLink: '/reservar-cita',
    ctaButton: 'Reservar Cita',
    image: 'assets/images/unidades/optica.jpg',
    image2: 'assets/images/unidades/optica1.webp',
  },

  {
    slug: 'unidad-heridas',
    title: 'Unidad Especializada de Heridas',
    tagline: 'Cicatrización segura y efectiva',
    overview:
      'Ofrecemos tratamiento integral de heridas agudas y crónicas, con técnicas avanzadas y un equipo multidisciplinario.',
    objectives: [
      'Vendajes de última generación',
      'Terapia de presión negativa',
      'Control de infecciones',
      'Evaluación continua de progresos',
    ],
    detailsList: [
      'Equipo especializado en lesiones complejas',
      'Protocolos basados en evidencia',
      'Soporte nutricional y fisioterapéutico',
      'Educación al paciente y familia',
    ],
    extras: [
      'Vendajes avanzados',
      'Terapia de presión negativa',
      'Seguimiento personalizado',
      'Teleconsulta de control',
    ],
    stats: [
      { value: '92%', label: 'Tasa de cicatrización' },
      { value: '1k+', label: 'Pacientes atendidos' },
      { value: '8 años', label: 'Trayectoria' },
    ],
    faqs: [
      {
        question: '¿Atención sin cita?',
        answer: 'Recomendamos agendar para evitar esperas.',
      },
      {
        question: '¿Hay terapia domiciliaria?',
        answer: 'Sí, bajo prescripción médica.',
      },
      {
        question: '¿Cubren seguros?',
        answer: 'Trabajamos con la mayoría de las EPS.',
      },
      {
        question: '¿Cómo cuido la herida en casa?',
        answer: 'Te enseñamos un protocolo sencillo de limpieza y cambio de vendaje diario.',
      },
    ],
    ctaText: '¿Necesitas cuidado de heridas profesional?',
    ctaLink: '/reservar-cita',
    ctaButton: 'Reservar Cita',
    image: 'assets/images/unidades/unidad-heridas.jpg',
    image2: 'assets/images/unidades/heridas.webp',
  },

  {
    slug: 'uci',
    title: 'UCI',
    tagline: 'Atención crítica las 24 horas',
    overview:
      'Nuestra Unidad de Cuidados Intensivos está equipada para brindar soporte vital avanzado y monitorización continua.',
    objectives: [
      'Monitoreo hemodinámico continuo',
      'Soporte ventilatorio avanzado',
      'Circuitos de protección COVID-19',
      'Atención multidisciplinaria',
    ],
    detailsList: [
      'Ventiladores de última generación',
      'Monitores multiparámetro',
      'Equipo de emergencia RCP',
      'Visita regulada a familiares',
    ],
    extras: [
      'Visita familiar regulada',
      'Soporte psicológico',
      'Terapia física in situ',
      'Asesoría nutricional',
    ],
    stats: [
      { value: '24/7', label: 'Atención continua' },
      { value: '3K+', label: 'Pacientes estabilizados' },
      { value: '12 años', label: 'Trayectoria' },
    ],
    faqs: [
      {
        question: '¿Cómo ingreso a UCI?',
        answer: 'Por referencia médica o emergencia.',
      },
      {
        question: '¿Puedo ingresar acompañante?',
        answer: 'El ingreso está regulado según protocolo hospitalario.',
      },
      {
        question: '¿Aceptan seguros?',
        answer: 'Sí, consulta con tu aseguradora para cobertura.',
      },
      {
        question: '¿Cómo funciona la visita familiar?',
        answer:
          'Tenemos horarios establecidos y acceso controlado para proteger la salud del paciente.',
      },
    ],
    ctaText: '¿Tiene una urgencia médica?',
    ctaLink: '/reservar-cita',
    ctaButton: 'Reservar Cita',
    image: 'assets/images/unidades/uci.jpg',
    image2: 'assets/images/unidades/uci.webp',
  },

  {
    slug: 'uci-neonatal',
    title: 'UCI Neonatal',
    tagline: 'Cuidado especializado para recién nacidos',
    overview:
      'Brindamos atención intensiva y humanizada a los más pequeños, con incubadoras de última generación y un equipo pediátrico.',
    objectives: [
      'Control térmico preciso',
      'Soporte respiratorio neonatal',
      'Monitoreo cardiaco contínuo',
      'Nutrición asistida',
    ],
    detailsList: [
      'Inkubadoras con humidificación',
      'Ventilación no invasiva',
      'Atención por neonatólogos',
      'Acompañamiento a la familia',
    ],
    extras: [
      'Soporte respiratorio',
      'Atención nutricional neonatal',
      'Charlas para padres',
      'Visitas en sala de espera familiar',
    ],
    stats: [
      { value: '99%', label: 'Tasas de supervivencia' },
      { value: '2K+', label: 'Recién nacidos atendidos' },
      { value: '10 años', label: 'Trayectoria' },
    ],
    faqs: [
      {
        question: '¿Cómo ingresar a UCI neonatal?',
        answer: 'Requiere referencia de obstetricia o emergencia neonatal.',
      },
      {
        question: '¿Quién puede acompañar?',
        answer: 'Un acompañante capacitado bajo protocolo hospitalario.',
      },
      {
        question: '¿Hay teleconsulta?',
        answer: 'Ofrecemos seguimiento remoto tras el alta.',
      },
      {
        question: '¿Puedo extraer leche y dársela al bebé?',
        answer: 'Sí, contamos con habitación de lactancia y almacenamiento seguro de muestras.',
      },
    ],
    ctaText: '¿Necesitas atención neonatal?',
    ctaLink: '/reservar-cita',
    ctaButton: 'Reservar Cita',
    image: 'assets/images/unidades/uci-neonatal.jpg',
    image2: 'assets/images/unidades/neonatal.webp',
  },
];
