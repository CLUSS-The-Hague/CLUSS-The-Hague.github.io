// ─────────────────────────────────────────────────────────────
// CLÜSS website content. This is the only file most people need
// to edit. After a change, run:  npm run build
// Spanish first, then English, as the design system asks.
// Anything marked TODO was missing or a placeholder on the old site.
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
  statement: 'La asociación de estudiantes hispanohablantes de La Haya.',
  statementEn: 'The Hague’s Spanish-speaking student association.',
  about: [
    '<strong>CLÜSS (Community of Leiden University for Spanish-Speakers)</strong> is a student-led association dedicated to bringing together Spanish speakers and students who are passionate about Hispanic cultures.',
    'We aim to create an inclusive community where students can connect, share experiences, and feel at home, no matter their background or level of Spanish.',
    'Through a mix of academic support, cultural activities, and social events, CLÜSS provides opportunities to learn, grow, and build meaningful connections both inside and outside the classroom.',
    'Our mission is simple: to celebrate language, culture, and community in a welcoming and engaging environment.',
  ],
  reasons: [
    { es: 'conoce gente', en: 'Meet new people', img: 'picnic.jpg', alt: 'CLÜSS students sitting on the grass in a park' },
    { es: 'celebra la cultura', en: 'Celebrate culture', img: 'evento-partido.jpg', alt: 'Three students in football shirts at a pub' },
    { es: 'practica español', en: 'Practice Spanish', img: 'mapa-palabras.jpg', alt: 'Map of Latin America covered in local slang words' },
    { es: 'ven a los eventos', en: 'Join events', img: 'partido-bar.jpg', alt: 'A group watching a match together in a bar' },
  ],
};

export const partners = [
  { name: 'Leiden University Fund', img: 'partners/leiden-university-fund.jpg', bg: '#ffffff' },
  { name: 'Picasso', img: 'partners/picasso.jpg', bg: '#000000' },
  { name: 'La Patrona, Cantina Mexicana', img: 'partners/la-patrona.jpg', bg: '#ffffff' },
];

export const committeesIntro = 'Our committees are the driving force behind CLÜSS. Each one contributes to creating a dynamic, supportive, and engaging experience for our members.';

export const committees = [
  {
    slug: 'academic-committee',
    suelo: 'academic',
    tag: 'academic',
    cartel: ['ACADÉ', 'MICO'],
    es: 'Académico',
    en: 'Academic Committee',
    blurb: 'The Academic Committee promotes professional and intellectual growth through embassy visits, collaborations with cultural institutions, networking opportunities, and academic events. Our goal is to encourage dialogue, learning, and interdisciplinary exchange within the CLÜSS community.',
    tagline: 'Bridging students with academia, institutions, and professional opportunities.',
    lead: 'The Academic Committee focuses on academic development, institutional collaboration, and career exposure for students interested in international careers.',
    doing: [
      'Embassy visits and institutional trips in The Hague',
      'Panels with professionals in law, diplomacy, business, and international affairs',
      'Collaborations with institutions such as the Instituto Cervantes and embassies',
      'Academic workshops and networking events',
    ],
    blocks: [
      { es: 'contexto académico', en: 'Academic context', text: 'CLÜSS operates within Leiden University’s Faculty of Humanities and connects interdisciplinary fields such as Latin American Studies, Linguistics, and Global Studies, creating a bridge between students and international institutions.' },
      { es: 'eventos estrella', en: 'Signature events', list: ['Monthly academic panel (law, diplomacy, business, NGOs)', 'Embassy or institutional visit per semester', 'Hybrid academic-cultural events'] },
    ],
    roles: ['Partnership leads', 'Events coordinator', 'Research/content support'],
  },
  {
    slug: 'events-and-cultural-committee',
    suelo: 'rojo',
    tag: 'social',
    cartel: ['EVENTOS', 'Y CULTURA'],
    es: 'Eventos y Cultura',
    en: 'Events and Cultural Committee',
    blurb: 'The Social Events Committee organizes parties, cultural celebrations, coffee chats, and casual gatherings that bring the community together. Through these events, we foster friendships and create a welcoming atmosphere for all members.',
    tagline: 'Celebrating culture, traditions, and community.',
    lead: 'This committee is responsible for organizing cultural, social, and culinary events that bring students together.',
    doing: [
      'Cooking workshops (arepas, empanadas, paella)',
      'Salsa and Latin dance nights',
      'Cultural celebrations and themed events',
      'Collaborations with student associations and cultural institutions',
    ],
    blocks: [
      { es: 'contexto cultural', en: 'Cultural context', text: 'We actively engage with the cultural landscape in the Netherlands, collaborating with initiatives such as the Latin American Film Festival (LAFF Amsterdam), Spanish Film Festival, and local cultural organizations.' },
    ],
    roles: ['Logistics lead', 'Cultural curator', 'Partnerships support'],
    calendar: true,
  },
  {
    slug: 'communication-and-media-committee',
    suelo: 'media',
    tag: 'media',
    cartel: ['COMUNICACIÓN', 'Y MEDIOS'],
    es: 'Comunicación y Medios',
    en: 'Communication and Media Committee',
    blurb: 'The Communication and Media Committee manages CLÜSS’s communication, storytelling, and digital content. It provides a platform for students to share ideas, stories, and creative work.',
    tagline: 'The voice of the CLÜSS community.',
    lead: 'This committee manages all communication, storytelling, and digital content for CLÜSS.',
    doing: [
      'Manage social media content and campaigns',
      'Cover events and community activities',
      'Create educational and cultural content series',
    ],
    blocks: [],
    roles: ['Social Media Manager', 'Content writers', 'Designer/Editor'],
  },
  {
    slug: 'sports-committee',
    suelo: 'azul',
    tag: 'sport',
    cartel: ['DEPOR', 'TES'],
    es: 'Deportes',
    en: 'Sports Committee',
    blurb: 'The Sports Committee strengthens community through tournaments, friendly matches, watch parties, and recreational activities. We aim to create an inclusive environment where students can connect through sport and teamwork.',
    tagline: 'Building community through sport and teamwork.',
    lead: 'The Sports Committee promotes inclusion and community through sports and recreational activities.',
    doing: [
      'Country vs Country League (nationality-based teams)',
      'Friendly matches and tournaments',
      'Watch parties for major sports events',
      'Outdoor social activities (picnics, beach days, hiking)',
    ],
    blocks: [
      { es: 'liga país contra país', en: 'Country vs Country League', text: 'A friendly competition where students form teams based on nationality or region to compete in a structured league.' },
      { es: 'cómo funciona', en: 'Structure', list: ['Teams by country or region', 'Captains and team managers', 'Weekly or bi-weekly matches', 'Semifinals and final event day'] },
      { es: 'objetivos', en: 'Goals', list: ['Community building through sport', 'Cultural identity and inclusion', 'Active student engagement'] },
    ],
    roles: ['League coordinator', 'Team managers', 'Logistics'],
    huellas: true,
  },
];

export const team = {
  intro: 'CLÜSS is led by a dedicated group of students committed to building an inclusive and vibrant Spanish-speaking community at Leiden University. Together, we work to create opportunities for cultural exchange, academic growth, and meaningful connections across Leiden and The Hague.',
  board: [
    {
      role: 'President', es: 'Presidencia', name: 'Martina Ramoneda Gázquez', photo: 'team/martina-ramoneda.jpg',
      duty: 'Provides strategic leadership for CLÜSS, oversees the association’s activities, and represents the organization within and beyond the university.',
      bio: ['I’m currently in my second year of the IRO program and come from Barcelona, Spain. Outside of my studies, I enjoy spending my time involved in creative projects.', 'I’m someone who is always eager to learn and experience new things. I enjoy stepping outside of my comfort zone, exploring unfamiliar places, and having conversations with people whose backgrounds are different from mine.'],
    },
    {
      role: 'Vice-president & Public Relations', es: 'Vicepresidencia y RR. PP.', name: 'Martina Ruiz Cendón', photo: 'team/martina-ruiz.jpg',
      duty: 'Supports the President in the coordination of the association and ensures the smooth implementation of projects and initiatives. Manages the public image of individuals or organizations by crafting and disseminating messages to enhance reputation and foster relationships with the media.',
      bio: ['I’m a second-year IRO student from the Canary Islands, Spain. I’ve always loved surfing or doing anything creative, and I’m also really interested in the Spanish-speaking world and all the different cultures that make it up. I love learning more about them and finding ways to share them.'],
    },
    {
      role: 'Secretary', es: 'Secretaría', name: 'Fernanda von Loebenstein', photo: 'team/fernanda.jpg',
      duty: 'Manages internal communication, meeting records, and administrative tasks to keep the organization running efficiently.',
      bio: ['I’m a second-year IRO student, half Chilean, half German, but I’ve lived in Chile my whole life. I’m very passionate about music, especially techno, and Hispanic culture. This is why I’m happy to be a member of CLÜSS, to bring visibility to this culture and language.'],
    },
    {
      role: 'Head of External Affairs', es: 'Asuntos Externos', name: 'Riccardo Viganò', photo: 'team/riccardo.jpg',
      duty: 'Develops partnerships and represents CLÜSS in collaborations with external organizations, institutions, and community stakeholders.',
      bio: ['I’m a second-year IRO student. I love travelling, meeting new people and learning new things along the way. I’m very passionate about music, especially reggaeton, and I’ve always been interested in the Spanish-speaking world and all the different cultures that make it up. I’m excited to be part of CLÜSS and I’m looking forward to building connections and creating new opportunities for the association.'],
    },
    {
      role: 'Head of Internal Affairs', es: 'Asuntos Internos', name: 'Alicia Gómez de Tejada Paisano', photo: 'team/alicia.jpg',
      duty: 'Oversees the internal operations of CLÜSS and works to ensure an engaging and supportive experience for all members.',
      bio: ['I’m a first-year IRO student from Andalusia, Spain. I’m passionate about reading, traveling, and anything creative. I’m especially interested in cultural diversity, and I enjoy learning about different countries, traditions, and perspectives.', 'I’m a curious and open-minded person who loves discovering new places, meeting people from different backgrounds, and learning through new experiences.'],
    },
    {
      role: 'Officer of Public Relations', es: 'Relaciones Públicas', name: 'Gerard Russomano', photo: 'team/gerard.jpg',
      duty: 'Responsible for promoting the organisation’s image and communicating its activities to the public. They manage social media, create promotional content, and build relationships with external audiences and partners.',
      bio: ['I am a second-year BA International Justice student at LUC from Barcelona, Spain. I spend my free time in Den Haag playing waterpolo, going cycling or going out to the different pubs and discos the city has to offer! I am also half Uruguayan and half Italian, so I am very keen on the multicultural community that forms Leiden University.'],
    },
  ],
  join: 'Interested in getting involved? CLÜSS is always looking for enthusiastic students to contribute their ideas and talents. Whether you’re passionate about events, writing, sports, photography, or community building, there’s a place for you.',
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
    day: 'Vie 13 Nov',
    time: '15:00',
    place: 'Embajada de Chile, La Haya',
    committee: 'academic',
    register: 'https://docs.google.com/forms/d/e/1FAIpQLSdWKaKUonSzC4zbgNO0COZVigExLkVKpMFzh2kkwD8WRPBhTA/viewform?usp=header',
    flag: 'chile',
  },
  {
    date: '2026-09-24',
    title: 'Visit to the Embassy of Uruguay',
    day: 'Jue 24 Sep',
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
  { img: 'evento-partido.jpg', alt: 'Three students in football shirts at a pub' },
  { img: 'partido-bar.jpg', alt: 'A group watching a match together in a bar' },
  { img: 'picnic.jpg', alt: 'CLÜSS students sitting on the grass in a park' },
];

export const join = {
  intro: 'CLÜSS is open to all students interested in Spanish-speaking cultures, languages, and community life at Leiden University.',
  why: [
    'Connect with an international community',
    'Participate in cultural and social events',
    'Access academic and professional opportunities',
    'Join sports and team activities',
  ],
  options: [
    {
      name: 'General Membership', es: 'General', talon: 'Gratis', href: 'joinGeneral',
      lead: 'Join CLÜSS as a general member to:',
      list: ['Attend events', 'Receive newsletters and updates', 'Participate in community activities', 'Join sports and cultural events'],
    },
    {
      name: 'Active Member', es: 'Activo', talon: 'Comités', href: 'joinActive',
      lead: 'For students who want to take a more active role:',
      list: ['Organize events', 'Join committees', 'Contribute to media and sports activities'],
    },
  ],
  faq: [
    ['Do I need to be a native Spanish speaker to join?', 'No. CLÜSS is open to everyone, whether Spanish is your first language, a language you are learning, or simply a culture you are interested in exploring.'],
    ['Can I join if I study in The Hague?', 'Yes. CLÜSS welcomes students from both Leiden and The Hague campuses.'],
    ['Is there a membership fee?', 'No. Membership is currently free, although some specific events may have a small participation fee.'],
    ['How can I become a member?', 'Simply complete the membership form on this page. Once registered, you will receive updates about upcoming events and opportunities to get involved.'],
    ['Can I join a committee?', 'Absolutely! Members are encouraged to take an active role in the association by joining one of our committees or volunteering at events.'],
    ['What kinds of events does CLÜSS organize?', 'We organize a variety of academic, cultural, social, and sports activities, including panel discussions, embassy visits, cultural celebrations, tournaments, and community gatherings.'],
    ['Can non-Leiden University students participate?', 'Most of our activities are designed for Leiden University students. However, some events may be open to guests or external participants.'],
    ['How can I stay updated on CLÜSS activities?', 'Follow us on Instagram and subscribe to our newsletter to receive the latest news and event announcements.'],
  ],
  ready: 'Be part of a growing community that connects culture, language, and students across Leiden and The Hague.',
};

export const contact = {
  intro: 'If you have any questions about CLÜSS, membership, events, or collaborations, feel free to reach out.',
  outro: 'Whether you want to join, collaborate, or just learn more about CLÜSS, we’re happy to hear from you.',
};
