// ─────────────────────────────────────────────────────────────
// CLÜSS website content. This is the only file most people need
// to edit. After a change, run:  npm run build
// The site is built twice: in Spanish (cluss.nl/) and in English (cluss.nl/en/).
// Every text has both versions: { es: '…', en: '…' }. Change both.
// ─────────────────────────────────────────────────────────────

export const links = {
  instagram: 'https://www.instagram.com/clussthehague/',
  tiktok: 'https://www.tiktok.com/@clussthehague',
  linktree: 'https://linktr.ee/clussthehague',
  whatsapp: 'https://chat.whatsapp.com/I9ICM3HIx3DJc2pY46U2vq',
  email: 'clussthehague@gmail.com',
  joinGeneral: 'https://docs.google.com/forms/d/e/1FAIpQLSdQpIpqWc2jgrwK5QzoN_kh61sTrhNnAM05BOgxLgAbIzNWuA/viewform',
  joinActive: 'https://docs.google.com/forms/d/e/1FAIpQLSfHnaI2RyL1F59FiZw6O7IXOa255meYMvB2i-G5CdZGzJJMEg/viewform?usp=header',
  photos: 'https://drive.google.com/drive/folders/1JDE1fQVyFS2AnGkhsGjEIZngMbpAGhAR?usp=sharing',
  calendarEmbed: 'https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Europe%2FAmsterdam&showPrint=0&src=Y2x1c3N0aGVoYWd1ZUBnbWFpbC5jb20&src=ZXMuZHV0Y2gub2ZmaWNpYWwjaG9saWRheUBncm91cC52LmNhbGVuZGFyLmdvb2dsZS5jb20&src=ZW4tZ2IuZHV0Y2gjaG9saWRheUBncm91cC52LmNhbGVuZGFyLmdvb2dsZS5jb20&color=%23039be5&color=%230b8043&color=%230b8043',
  calendarOpen: 'https://calendar.google.com/calendar/u/0?cid=Y2x1c3N0aGVoYWd1ZUBnbWFpbC5jb20',
};

// Members area, and events and blog posts written there.
// Paste the two values from Supabase → Project Settings → API (see README.md, "Members area").
// Use the publishable key (sb_publishable_…), which is meant to be public. Never paste a secret key here.
// While these are empty, the members area shows "not connected" and the events below in this file are used.
export const backend = {
  url: 'https://ywsgshtifxehdzklfqiv.supabase.co',
  anonKey: 'sb_publishable_qXCDdXJIp2aMekyUTrFIJw_qwlBu8Ul',
};

export const home = {
  statement: {
    es: 'La asociación de estudiantes hispanohablantes de La Haya.',
    en: 'The Hague’s Spanish-speaking student association.',
  },
  about: {
    es: [
      '<strong>CLÜSS (Community of Leiden University for Spanish-Speakers)</strong> es una asociación dirigida por estudiantes que reúne a hispanohablantes y a quienes sienten pasión por las culturas hispanas.',
      'Queremos crear una comunidad inclusiva donde los estudiantes puedan conectar, compartir experiencias y sentirse como en casa, sin importar su origen ni su nivel de español.',
      'Con una mezcla de apoyo académico, actividades culturales y eventos sociales, CLÜSS ofrece oportunidades para aprender, crecer y crear vínculos de verdad, dentro y fuera del aula.',
      'Nuestra misión es sencilla: celebrar la lengua, la cultura y la comunidad en un ambiente acogedor y dinámico.',
    ],
    en: [
      '<strong>CLÜSS (Community of Leiden University for Spanish-Speakers)</strong> is a student-led association dedicated to bringing together Spanish speakers and students who are passionate about Hispanic cultures.',
      'We aim to create an inclusive community where students can connect, share experiences, and feel at home, no matter their background or level of Spanish.',
      'Through a mix of academic support, cultural activities, and social events, CLÜSS provides opportunities to learn, grow, and build meaningful connections both inside and outside the classroom.',
      'Our mission is simple: to celebrate language, culture, and community in a welcoming and engaging environment.',
    ],
  },
  reasons: [
    { es: 'conoce gente', en: 'meet new people', img: 'picnic.jpg', alt: { es: 'Estudiantes de CLÜSS sentados en el césped de un parque', en: 'CLÜSS students sitting on the grass in a park' } },
    { es: 'celebra la cultura', en: 'celebrate culture', img: 'evento-partido.jpg', alt: { es: 'Tres estudiantes con camisetas de fútbol en un pub', en: 'Three students in football shirts at a pub' } },
    { es: 'practica español', en: 'practise Spanish', img: 'mapa-palabras.jpg', alt: { es: 'Mapa de Latinoamérica lleno de palabras de jerga local', en: 'Map of Latin America covered in local slang words' } },
    { es: 'ven a los eventos', en: 'join our events', img: 'partido-bar.jpg', alt: { es: 'Un grupo viendo un partido juntos en un bar', en: 'A group watching a match together in a bar' } },
  ],
};

export const partners = [
  { name: 'Leiden University Fund', img: 'partners/leiden-university-fund.jpg', bg: '#ffffff' },
  { name: 'Picasso', img: 'partners/picasso.jpg', bg: '#000000' },
  { name: 'La Patrona, Cantina Mexicana', img: 'partners/la-patrona.jpg', bg: '#ffffff' },
];

export const committeesIntro = {
  es: 'Nuestros comités son el motor de CLÜSS. Cada uno contribuye a crear una experiencia dinámica, cercana y emocionante para nuestros miembros.',
  en: 'Our committees are the driving force behind CLÜSS. Each one contributes to creating a dynamic, supportive, and engaging experience for our members.',
};

export const committees = [
  {
    slug: 'academic-committee',
    suelo: 'academic',
    tag: 'academic',
    cartel: { es: ['ACADÉ', 'MICO'], en: ['ACADE', 'MIC'] },
    name: { es: 'Académico', en: 'Academic' },
    title: { es: 'Comité Académico', en: 'Academic Committee' },
    blurb: {
      es: 'El Comité Académico impulsa el crecimiento profesional e intelectual con visitas a embajadas, colaboraciones con instituciones culturales, oportunidades de networking y eventos académicos. Nuestro objetivo es fomentar el diálogo, el aprendizaje y el intercambio interdisciplinar dentro de la comunidad CLÜSS.',
      en: 'The Academic Committee promotes professional and intellectual growth through embassy visits, collaborations with cultural institutions, networking opportunities, and academic events. Our goal is to encourage dialogue, learning, and interdisciplinary exchange within the CLÜSS community.',
    },
    tagline: {
      es: 'Conectamos a los estudiantes con el mundo académico, las instituciones y las oportunidades profesionales.',
      en: 'Bridging students with academia, institutions, and professional opportunities.',
    },
    lead: {
      es: 'El Comité Académico se centra en el desarrollo académico, la colaboración con instituciones y el contacto con el mundo profesional para estudiantes interesados en carreras internacionales.',
      en: 'The Academic Committee focuses on academic development, institutional collaboration, and career exposure for students interested in international careers.',
    },
    doing: {
      es: [
        'Visitas a embajadas e instituciones en La Haya',
        'Paneles con profesionales del derecho, la diplomacia, la empresa y los asuntos internacionales',
        'Colaboraciones con instituciones como el Instituto Cervantes y las embajadas',
        'Talleres académicos y eventos de networking',
      ],
      en: [
        'Embassy visits and institutional trips in The Hague',
        'Panels with professionals in law, diplomacy, business, and international affairs',
        'Collaborations with institutions such as the Instituto Cervantes and embassies',
        'Academic workshops and networking events',
      ],
    },
    blocks: [
      {
        title: { es: 'contexto académico', en: 'academic context' },
        text: {
          es: 'CLÜSS forma parte de la Facultad de Humanidades de la Universidad de Leiden y conecta campos interdisciplinares como los Estudios Latinoamericanos, la Lingüística y los Estudios Globales, tendiendo un puente entre los estudiantes y las instituciones internacionales.',
          en: 'CLÜSS operates within Leiden University’s Faculty of Humanities and connects interdisciplinary fields such as Latin American Studies, Linguistics, and Global Studies, creating a bridge between students and international institutions.',
        },
      },
      {
        title: { es: 'eventos estrella', en: 'signature events' },
        list: {
          es: ['Panel académico mensual (derecho, diplomacia, empresa, ONG)', 'Una visita a una embajada o institución cada semestre', 'Eventos híbridos académico-culturales'],
          en: ['Monthly academic panel (law, diplomacy, business, NGOs)', 'Embassy or institutional visit per semester', 'Hybrid academic-cultural events'],
        },
      },
    ],
    roles: {
      es: ['Responsables de alianzas', 'Coordinación de eventos', 'Apoyo de investigación y contenidos'],
      en: ['Partnership leads', 'Events coordinator', 'Research/content support'],
    },
  },
  {
    slug: 'events-and-cultural-committee',
    suelo: 'rojo',
    tag: 'social',
    cartel: { es: ['EVENTOS', 'Y CULTURA'], en: ['EVENTS', '& CULTURE'] },
    name: { es: 'Eventos y Cultura', en: 'Events & Culture' },
    title: { es: 'Comité de Eventos y Cultura', en: 'Events and Cultural Committee' },
    blurb: {
      es: 'El Comité de Eventos y Cultura organiza fiestas, celebraciones culturales, cafés y quedadas informales que unen a la comunidad. Con estos eventos fomentamos amistades y creamos un ambiente acogedor para todos los miembros.',
      en: 'The Events and Cultural Committee organizes parties, cultural celebrations, coffee chats, and casual gatherings that bring the community together. Through these events, we foster friendships and create a welcoming atmosphere for all members.',
    },
    tagline: {
      es: 'Celebramos la cultura, las tradiciones y la comunidad.',
      en: 'Celebrating culture, traditions, and community.',
    },
    lead: {
      es: 'Este comité organiza los eventos culturales, sociales y gastronómicos que reúnen a los estudiantes.',
      en: 'This committee is responsible for organizing cultural, social, and culinary events that bring students together.',
    },
    doing: {
      es: [
        'Talleres de cocina (arepas, empanadas, paella)',
        'Noches de salsa y bailes latinos',
        'Celebraciones culturales y eventos temáticos',
        'Colaboraciones con asociaciones de estudiantes e instituciones culturales',
      ],
      en: [
        'Cooking workshops (arepas, empanadas, paella)',
        'Salsa and Latin dance nights',
        'Cultural celebrations and themed events',
        'Collaborations with student associations and cultural institutions',
      ],
    },
    blocks: [
      {
        title: { es: 'contexto cultural', en: 'cultural context' },
        text: {
          es: 'Participamos activamente en la vida cultural de los Países Bajos y colaboramos con iniciativas como el Latin American Film Festival (LAFF Amsterdam), el Spanish Film Festival y organizaciones culturales locales.',
          en: 'We actively engage with the cultural landscape in the Netherlands, collaborating with initiatives such as the Latin American Film Festival (LAFF Amsterdam), Spanish Film Festival, and local cultural organizations.',
        },
      },
    ],
    roles: {
      es: ['Responsable de logística', 'Curaduría cultural', 'Apoyo en alianzas'],
      en: ['Logistics lead', 'Cultural curator', 'Partnerships support'],
    },
    calendar: true,
  },
  {
    slug: 'communication-and-media-committee',
    suelo: 'media',
    tag: 'media',
    cartel: { es: ['COMUNICACIÓN', 'Y MEDIOS'], en: ['COMMUNICATION', '& MEDIA'] },
    name: { es: 'Comunicación y Medios', en: 'Communication & Media' },
    title: { es: 'Comité de Comunicación y Medios', en: 'Communication and Media Committee' },
    blurb: {
      es: 'El Comité de Comunicación y Medios gestiona la comunicación, el storytelling y el contenido digital de CLÜSS. Es un espacio donde los estudiantes pueden compartir ideas, historias y trabajos creativos.',
      en: 'The Communication and Media Committee manages CLÜSS’s communication, storytelling, and digital content. It provides a platform for students to share ideas, stories, and creative work.',
    },
    tagline: {
      es: 'La voz de la comunidad CLÜSS.',
      en: 'The voice of the CLÜSS community.',
    },
    lead: {
      es: 'Este comité gestiona toda la comunicación, el storytelling y el contenido digital de CLÜSS.',
      en: 'This committee manages all communication, storytelling, and digital content for CLÜSS.',
    },
    doing: {
      es: [
        'Gestionar el contenido y las campañas en redes sociales',
        'Cubrir los eventos y las actividades de la comunidad',
        'Crear series de contenido educativo y cultural',
      ],
      en: [
        'Manage social media content and campaigns',
        'Cover events and community activities',
        'Create educational and cultural content series',
      ],
    },
    blocks: [],
    roles: {
      es: ['Social Media Manager', 'Redacción de contenidos', 'Diseño y edición'],
      en: ['Social Media Manager', 'Content writers', 'Designer/Editor'],
    },
  },
  {
    slug: 'sports-committee',
    suelo: 'azul',
    tag: 'sport',
    cartel: { es: ['DEPOR', 'TES'], en: ['SPORTS'] },
    name: { es: 'Deportes', en: 'Sports' },
    title: { es: 'Comité de Deportes', en: 'Sports Committee' },
    blurb: {
      es: 'El Comité de Deportes refuerza la comunidad con torneos, partidos amistosos, quedadas para ver partidos y actividades recreativas. Queremos crear un ambiente inclusivo donde los estudiantes conecten a través del deporte y el trabajo en equipo.',
      en: 'The Sports Committee strengthens community through tournaments, friendly matches, watch parties, and recreational activities. We aim to create an inclusive environment where students can connect through sport and teamwork.',
    },
    tagline: {
      es: 'Hacemos comunidad con el deporte y el trabajo en equipo.',
      en: 'Building community through sport and teamwork.',
    },
    lead: {
      es: 'El Comité de Deportes promueve la inclusión y la comunidad a través del deporte y las actividades recreativas.',
      en: 'The Sports Committee promotes inclusion and community through sports and recreational activities.',
    },
    doing: {
      es: [
        'Liga País contra País (equipos por nacionalidad)',
        'Partidos amistosos y torneos',
        'Quedadas para ver los grandes eventos deportivos',
        'Actividades al aire libre (picnics, días de playa, senderismo)',
      ],
      en: [
        'Country vs Country League (nationality-based teams)',
        'Friendly matches and tournaments',
        'Watch parties for major sports events',
        'Outdoor social activities (picnics, beach days, hiking)',
      ],
    },
    blocks: [
      {
        title: { es: 'liga país contra país', en: 'country vs country league' },
        text: {
          es: 'Una competición amistosa en la que los estudiantes forman equipos según su nacionalidad o región para competir en una liga organizada.',
          en: 'A friendly competition where students form teams based on nationality or region to compete in a structured league.',
        },
      },
      {
        title: { es: 'cómo funciona', en: 'how it works' },
        list: {
          es: ['Equipos por país o región', 'Capitanes y responsables de equipo', 'Partidos semanales o quincenales', 'Semifinales y una jornada final'],
          en: ['Teams by country or region', 'Captains and team managers', 'Weekly or bi-weekly matches', 'Semifinals and final event day'],
        },
      },
      {
        title: { es: 'objetivos', en: 'goals' },
        list: {
          es: ['Crear comunidad a través del deporte', 'Identidad cultural e inclusión', 'Participación activa de los estudiantes'],
          en: ['Community building through sport', 'Cultural identity and inclusion', 'Active student engagement'],
        },
      },
    ],
    roles: {
      es: ['Coordinación de la liga', 'Responsables de equipo', 'Logística'],
      en: ['League coordinator', 'Team managers', 'Logistics'],
    },
    huellas: true,
  },
];

export const team = {
  intro: {
    es: 'CLÜSS está dirigida por un grupo de estudiantes comprometidos con construir una comunidad hispanohablante inclusiva y llena de vida en la Universidad de Leiden. Juntos creamos oportunidades de intercambio cultural, crecimiento académico y conexiones reales entre Leiden y La Haya.',
    en: 'CLÜSS is led by a dedicated group of students committed to building an inclusive and vibrant Spanish-speaking community at Leiden University. Together, we work to create opportunities for cultural exchange, academic growth, and meaningful connections across Leiden and The Hague.',
  },
  board: [
    {
      name: 'Martina Ramoneda Gázquez', photo: 'team/martina-ramoneda.jpg',
      role: { es: 'Presidenta', en: 'President' },
      duty: {
        es: 'Lidera la estrategia de CLÜSS, supervisa las actividades de la asociación y la representa dentro y fuera de la universidad.',
        en: 'Provides strategic leadership for CLÜSS, oversees the association’s activities, and represents the organization within and beyond the university.',
      },
      bio: {
        es: ['Estoy en segundo año del grado de IRO y soy de Barcelona, España. Fuera de los estudios, me gusta dedicar mi tiempo a proyectos creativos.', 'Siempre tengo ganas de aprender y vivir cosas nuevas. Me gusta salir de mi zona de confort, descubrir lugares desconocidos y hablar con personas de orígenes distintos al mío.'],
        en: ['I’m currently in my second year of the IRO program and come from Barcelona, Spain. Outside of my studies, I enjoy spending my time involved in creative projects.', 'I’m someone who is always eager to learn and experience new things. I enjoy stepping outside of my comfort zone, exploring unfamiliar places, and having conversations with people whose backgrounds are different from mine.'],
      },
    },
    {
      name: 'Martina Ruiz Cendón', photo: 'team/martina-ruiz.jpg',
      role: { es: 'Vicepresidenta y Relaciones Públicas', en: 'Vice-president & Public Relations' },
      duty: {
        es: 'Apoya a la presidencia en la coordinación de la asociación y se asegura de que los proyectos e iniciativas salgan adelante. Gestiona la imagen pública de la asociación, creando y difundiendo mensajes que refuerzan su reputación y cuidan la relación con los medios.',
        en: 'Supports the President in the coordination of the association and ensures the smooth implementation of projects and initiatives. Manages the public image of individuals or organizations by crafting and disseminating messages to enhance reputation and foster relationships with the media.',
      },
      bio: {
        es: ['Estudio segundo de IRO y soy de las Islas Canarias, España. Siempre me ha encantado el surf y todo lo creativo, y me interesa mucho el mundo hispanohablante y todas las culturas que lo forman. Me encanta aprender más sobre ellas y encontrar maneras de compartirlas.'],
        en: ['I’m a second-year IRO student from the Canary Islands, Spain. I’ve always loved surfing or doing anything creative, and I’m also really interested in the Spanish-speaking world and all the different cultures that make it up. I love learning more about them and finding ways to share them.'],
      },
    },
    {
      name: 'Fernanda von Loebenstein', photo: 'team/fernanda.jpg',
      role: { es: 'Secretaria', en: 'Secretary' },
      duty: {
        es: 'Gestiona la comunicación interna, las actas de las reuniones y las tareas administrativas para que la asociación funcione con eficacia.',
        en: 'Manages internal communication, meeting records, and administrative tasks to keep the organization running efficiently.',
      },
      bio: {
        es: ['Estudio segundo de IRO y soy mitad chilena, mitad alemana, aunque he vivido toda mi vida en Chile. Me apasiona la música, sobre todo el techno, y la cultura hispana. Por eso me alegra formar parte de CLÜSS y dar visibilidad a esta cultura y a esta lengua.'],
        en: ['I’m a second-year IRO student, half Chilean, half German, but I’ve lived in Chile my whole life. I’m very passionate about music, especially techno, and Hispanic culture. This is why I’m happy to be a member of CLÜSS, to bring visibility to this culture and language.'],
      },
    },
    {
      name: 'Riccardo Viganò', photo: 'team/riccardo.jpg',
      role: { es: 'Responsable de Asuntos Externos', en: 'Head of External Affairs' },
      duty: {
        es: 'Crea alianzas y representa a CLÜSS en sus colaboraciones con organizaciones, instituciones y otros actores de la comunidad.',
        en: 'Develops partnerships and represents CLÜSS in collaborations with external organizations, institutions, and community stakeholders.',
      },
      bio: {
        es: ['Estudio segundo de IRO. Me encanta viajar, conocer gente nueva y aprender cosas por el camino. Me apasiona la música, sobre todo el reguetón, y siempre me ha interesado el mundo hispanohablante y todas las culturas que lo forman. Me hace mucha ilusión formar parte de CLÜSS y tengo ganas de crear contactos y nuevas oportunidades para la asociación.'],
        en: ['I’m a second-year IRO student. I love travelling, meeting new people and learning new things along the way. I’m very passionate about music, especially reggaeton, and I’ve always been interested in the Spanish-speaking world and all the different cultures that make it up. I’m excited to be part of CLÜSS and I’m looking forward to building connections and creating new opportunities for the association.'],
      },
    },
    {
      name: 'Alicia Gómez de Tejada Paisano', photo: 'team/alicia.jpg',
      role: { es: 'Responsable de Asuntos Internos', en: 'Head of Internal Affairs' },
      duty: {
        es: 'Supervisa el funcionamiento interno de CLÜSS y trabaja para que todos los miembros vivan una experiencia cercana y motivadora.',
        en: 'Oversees the internal operations of CLÜSS and works to ensure an engaging and supportive experience for all members.',
      },
      bio: {
        es: ['Estudio primero de IRO y soy de Andalucía, España. Me apasiona leer, viajar y todo lo creativo. Me interesa especialmente la diversidad cultural y disfruto aprendiendo sobre otros países, tradiciones y puntos de vista.', 'Soy una persona curiosa y abierta a la que le encanta descubrir sitios nuevos, conocer a gente de orígenes distintos y aprender viviendo experiencias nuevas.'],
        en: ['I’m a first-year IRO student from Andalusia, Spain. I’m passionate about reading, traveling, and anything creative. I’m especially interested in cultural diversity, and I enjoy learning about different countries, traditions, and perspectives.', 'I’m a curious and open-minded person who loves discovering new places, meeting people from different backgrounds, and learning through new experiences.'],
      },
    },
    {
      name: 'Gerard Russomano', photo: 'team/gerard.jpg',
      role: { es: 'Responsable de Relaciones Públicas', en: 'Officer of Public Relations' },
      duty: {
        es: 'Se encarga de promover la imagen de la asociación y de comunicar sus actividades al público. Gestiona las redes sociales, crea contenido promocional y cuida la relación con el público externo y los colaboradores.',
        en: 'Responsible for promoting the organisation’s image and communicating its activities to the public. They manage social media, create promotional content, and build relationships with external audiences and partners.',
      },
      bio: {
        es: ['Estudio segundo del BA en International Justice en LUC y soy de Barcelona, España. En mi tiempo libre en La Haya juego al waterpolo, salgo en bici o voy a los distintos bares y discotecas que ofrece la ciudad. También soy mitad uruguayo y mitad italiano, así que me encanta la comunidad multicultural que forma la Universidad de Leiden.'],
        en: ['I am a second-year BA International Justice student at LUC from Barcelona, Spain. I spend my free time in Den Haag playing waterpolo, going cycling or going out to the different pubs and discos the city has to offer! I am also half Uruguayan and half Italian, so I am very keen on the multicultural community that forms Leiden University.'],
      },
    },
  ],
  join: {
    es: '¿Te interesa participar? En CLÜSS siempre buscamos estudiantes con ganas de aportar sus ideas y su talento. Si te apasionan los eventos, la escritura, el deporte, la fotografía o crear comunidad, aquí hay un sitio para ti.',
    en: 'Interested in getting involved? CLÜSS is always looking for enthusiastic students to contribute their ideas and talents. Whether you’re passionate about events, writing, sports, photography, or community building, there’s a place for you.',
  },
};

// Events sort themselves: a date in the future shows as "next", a past date moves to "past".
// Once the members area is connected, events are managed there instead and this list is only a fallback.
export const events = [
  {
    date: '2026-11-13',
    cartel: ['EMBA', 'JADA'],
    cartelSmall: 'de Chile',
    lead: 'Visita a la',
    title: 'Visit to the Embassy of Chile',
    en: 'Visit to the Embassy of Chile in The Hague.',
    time: '15:00',
    place: 'Embajada de Chile, La Haya',
    committee: 'academic',
    register: 'https://docs.google.com/forms/d/e/1FAIpQLSdWKaKUonSzC4zbgNO0COZVigExLkVKpMFzh2kkwD8WRPBhTA/viewform?usp=header',
    flag: 'chile',
  },
  {
    date: '2026-09-24',
    title: 'Visit to the Embassy of Uruguay',
    time: '14:15–15:30',
    place: 'Embajada de Uruguay',
    committee: 'academic',
    img: 'embajada-uruguay.jpg',
    imgAlt: 'A group of CLÜSS students with the Ambassador of Uruguay at the embassy in The Hague',
    imgCap: 'Con el embajador de Uruguay · Photo: Diplomat Magazine',
    article: { href: 'https://diplomatmagazine.eu/2026/09/28/uruguay-a-meeting-place-for-spanish-in-the-hague/', source: 'Diplomat Magazine', title: 'Uruguay, a Meeting Place for Spanish in The Hague' },
    text: ['A great opportunity for students to learn more about Uruguay, its culture, history, and international relations. There were only 15 places available for students.'],
    list: ['Uruguayan culture and traditions', 'The history of Uruguay', 'The role of an embassy', 'Diplomacy and international relations', 'The relationship between Uruguay and other countries'],
    listTitle: 'During the visit, students learned about:',
  },
];

export const pastPhotos = [
  { img: 'evento-partido.jpg', alt: { es: 'Tres estudiantes con camisetas de fútbol en un pub', en: 'Three students in football shirts at a pub' } },
  { img: 'partido-bar.jpg', alt: { es: 'Un grupo viendo un partido juntos en un bar', en: 'A group watching a match together in a bar' } },
  { img: 'picnic.jpg', alt: { es: 'Estudiantes de CLÜSS sentados en el césped de un parque', en: 'CLÜSS students sitting on the grass in a park' } },
];

export const join = {
  intro: {
    es: 'CLÜSS está abierta a todos los estudiantes interesados en las culturas y lenguas hispanohablantes y en la vida en comunidad de la Universidad de Leiden.',
    en: 'CLÜSS is open to all students interested in Spanish-speaking cultures, languages, and community life at Leiden University.',
  },
  why: {
    es: [
      'Conecta con una comunidad internacional',
      'Participa en eventos culturales y sociales',
      'Accede a oportunidades académicas y profesionales',
      'Únete a actividades deportivas y de equipo',
    ],
    en: [
      'Connect with an international community',
      'Participate in cultural and social events',
      'Access academic and professional opportunities',
      'Join sports and team activities',
    ],
  },
  options: [
    {
      name: { es: 'Miembro general', en: 'General membership' },
      talon: { es: 'Gratis', en: 'Free' },
      href: 'joinGeneral',
      lead: { es: 'Hazte miembro general de CLÜSS para:', en: 'Join CLÜSS as a general member to:' },
      list: {
        es: ['Ir a los eventos', 'Recibir la newsletter y las novedades', 'Participar en las actividades de la comunidad', 'Apuntarte a eventos deportivos y culturales'],
        en: ['Attend events', 'Receive newsletters and updates', 'Participate in community activities', 'Join sports and cultural events'],
      },
    },
    {
      name: { es: 'Miembro activo', en: 'Active member' },
      talon: { es: 'Comités', en: 'Committees' },
      href: 'joinActive',
      lead: { es: 'Para quienes quieren tener un papel más activo:', en: 'For students who want to take a more active role:' },
      list: {
        es: ['Organizar eventos', 'Unirte a los comités', 'Colaborar en medios y actividades deportivas'],
        en: ['Organize events', 'Join committees', 'Contribute to media and sports activities'],
      },
    },
  ],
  faq: {
    es: [
      ['¿Tengo que ser hablante nativo de español para unirme?', 'No. CLÜSS está abierta a todo el mundo: tanto si el español es tu lengua materna como si lo estás aprendiendo o simplemente te interesa su cultura.'],
      ['¿Puedo unirme si estudio en La Haya?', 'Sí. CLÜSS da la bienvenida a estudiantes de los campus de Leiden y de La Haya.'],
      ['¿Hay que pagar una cuota?', 'No. Por ahora ser miembro es gratis, aunque algunos eventos concretos pueden tener un pequeño coste de participación.'],
      ['¿Cómo me hago miembro?', 'Solo tienes que rellenar el formulario de inscripción de esta página. Una vez apuntado, recibirás novedades sobre los próximos eventos y las formas de participar.'],
      ['¿Puedo unirme a un comité?', '¡Claro! Animamos a los miembros a participar activamente uniéndose a uno de nuestros comités o echando una mano en los eventos.'],
      ['¿Qué tipo de eventos organiza CLÜSS?', 'Organizamos actividades académicas, culturales, sociales y deportivas: mesas redondas, visitas a embajadas, celebraciones culturales, torneos y encuentros de la comunidad.'],
      ['¿Pueden participar estudiantes de fuera de la Universidad de Leiden?', 'La mayoría de nuestras actividades están pensadas para estudiantes de la Universidad de Leiden, pero algunos eventos pueden estar abiertos a invitados o participantes externos.'],
      ['¿Cómo me entero de las actividades de CLÜSS?', 'Síguenos en Instagram y suscríbete a nuestra newsletter para recibir las últimas noticias y los anuncios de eventos.'],
    ],
    en: [
      ['Do I need to be a native Spanish speaker to join?', 'No. CLÜSS is open to everyone, whether Spanish is your first language, a language you are learning, or simply a culture you are interested in exploring.'],
      ['Can I join if I study in The Hague?', 'Yes. CLÜSS welcomes students from both Leiden and The Hague campuses.'],
      ['Is there a membership fee?', 'No. Membership is currently free, although some specific events may have a small participation fee.'],
      ['How can I become a member?', 'Simply complete the membership form on this page. Once registered, you will receive updates about upcoming events and opportunities to get involved.'],
      ['Can I join a committee?', 'Absolutely! Members are encouraged to take an active role in the association by joining one of our committees or volunteering at events.'],
      ['What kinds of events does CLÜSS organize?', 'We organize a variety of academic, cultural, social, and sports activities, including panel discussions, embassy visits, cultural celebrations, tournaments, and community gatherings.'],
      ['Can non-Leiden University students participate?', 'Most of our activities are designed for Leiden University students. However, some events may be open to guests or external participants.'],
      ['How can I stay updated on CLÜSS activities?', 'Follow us on Instagram and subscribe to our newsletter to receive the latest news and event announcements.'],
    ],
  },
  ready: {
    es: '¿Listo para unirte a CLÜSS? Forma parte de una comunidad que no para de crecer y que une cultura, lengua y estudiantes entre Leiden y La Haya.',
    en: 'Ready to join CLÜSS? Be part of a growing community that connects culture, language, and students across Leiden and The Hague.',
  },
};

export const contact = {
  intro: {
    es: 'Si tienes cualquier pregunta sobre CLÜSS, la membresía, los eventos o las colaboraciones, escríbenos.',
    en: 'If you have any questions about CLÜSS, membership, events, or collaborations, feel free to reach out.',
  },
  outro: {
    es: 'Tanto si quieres unirte, colaborar o simplemente saber más de CLÜSS, nos encantará saber de ti.',
    en: 'Whether you want to join, collaborate, or just learn more about CLÜSS, we’re happy to hear from you.',
  },
};
