// Builds the static site into dist/. No dependencies: `npm run build`.
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import * as c from './content/site.mjs';
import {
  PUNTITOS, esc, href, mark, btn, tag, titular, lista, cartel, fotoTag,
  splitEvents, eventPoster, pastEvent, noNextEvents, normPost, postCard, postArticle, noPosts, fingerprint, todayInHague,
} from './src/render.mjs';

const OUT = 'dist';
const SITE = 'https://www.cluss.nl';
const { links: L } = c;

// ── small pieces only the build needs (the rest are in src/render.mjs) ──
let selloN = 0;
function sello(text, cls = '', extra = '') {
  const id = `sg-${++selloN}`;
  return `<div class="sello ${cls}" ${extra} aria-hidden="true"><svg viewBox="0 0 300 300"><defs><path id="${id}" d="M150,150 m-108,0 a108,108 0 1,1 216,0 a108,108 0 1,1 -216,0"/></defs><circle class="disco" cx="150" cy="150" r="148"/><g class="giro"><text><textPath href="#${id}" textLength="672" lengthAdjust="spacing">${text}</textPath></text></g><path class="centro" transform="translate(95,121.1) scale(1.1)" d="${PUNTITOS}"/></svg></div>`;
}

const pill = (label, cls = '', extra = '') => `<div class="peg pill ${cls}" ${extra}>${label}</div>`;

function cinta(words, cls = '') {
  const run = words.map((w) => `<span>${w}</span><i>✦</i>`).join('');
  return `<div class="cinta ${cls}" aria-hidden="true"><div class="cinta-track">${run.repeat(6)}</div></div>`;
}

// Local photos from public/img. A missing file shows a placeholder instead of a broken image.
function foto(file, alt, cls = '', opts = {}) {
  if (!fs.existsSync(path.join('public/img', file))) {
    const initials = (opts.name || '').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('');
    return `<figure class="foto vacia ${cls}"><div class="foto-in"><svg viewBox="0 0 100 52" aria-hidden="true"><path d="${PUNTITOS}"/></svg>${initials ? `<b>${initials}</b>` : ''}<span>Foto pronto</span></div></figure>`;
  }
  return fotoTag(`/img/${file}`, alt, cls, opts);
}

// la trama de puntitos: a halftone disc, moon or disco ball
function trama(size = 600, step = 20) {
  const r0 = size / 2; let out = '';
  for (let y = step / 2; y < size; y += step) {
    for (let x = step / 2 + ((Math.round(y / step) % 2) * step) / 2; x < size; x += step) {
      const d = Math.hypot(x - r0, y - r0) / r0;
      if (d > 1) continue;
      const shade = Math.hypot(x - size * 0.34, y - size * 0.32) / size;
      const r = Math.max(1.1, (1 - shade * 1.15) * step * 0.52);
      out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}"/>`;
    }
  }
  return `<svg class="trama" viewBox="0 0 ${size} ${size}" aria-hidden="true">${out}</svg>`;
}

// huellas: the Ü dots as footprints walking a route
function huellas(w = 1200, h = 200, steps = 15) {
  let out = '';
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    const x = 30 + t * (w - 60);
    const y = h / 2 + Math.sin(t * Math.PI * 2.4) * (h * 0.32);
    const dy = Math.cos(t * Math.PI * 2.4) * (h * 0.32) * (Math.PI * 2.4) / (w - 60);
    const a = (Math.atan(dy) * 180) / Math.PI + 90;
    out += `<path transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${a.toFixed(1)}) scale(.34) translate(-50,-26)" d="${PUNTITOS}"/>`;
  }
  return `<svg class="huellas" viewBox="0 0 ${w} ${h}" aria-hidden="true">${out}</svg>`;
}

// ── two languages ──────────────────────────────────────────────────────
// The Spanish site lives at /, the English one at /en/. Every page below is drawn once per language.
const LANGS = ['es', 'en'];
// Picks the right language from a { es, en } pair in content/site.mjs. Anything else passes through.
const pick = (lang) => (v) => (v && typeof v === 'object' && !Array.isArray(v) && 'es' in v ? v[lang] : v);
// The same page in the other language. The members area is only in Spanish.
const other = (lang) => (lang === 'en' ? 'es' : 'en');
const NO_EN = new Set(['/miembros/', '/404.html']);
const counterpart = (lang, route) => (lang === 'es' && NO_EN.has(route) ? '/en/' : href(other(lang), route));

const UI = {
  es: {
    nav: [['/', 'Inicio', 'home'], ['/about/committees/', 'Comités', 'committees'], ['/team/', 'Board', 'team'], ['/events/', 'Eventos', 'events'], ['/blog/', 'Blog', 'blog'], ['/contact/', 'Contacto', 'contact']],
    signIn: 'Iniciar sesión', members: 'Área de miembros', join: 'Únete', menu: 'Menú', skip: 'Saltar al contenido', home: 'CLÜSS, inicio',
    mainNav: 'Principal', mobileNav: 'Móvil', switchTo: 'English', switchShort: 'EN',
    footSign: '¡te esperamos!', footSite: 'El sitio', footCommittees: 'Comités', footTalk: 'Habla con nosotros', whatsapp: 'Comunidad de WhatsApp',
    defaultTitle: 'CLÜSS · La asociación de estudiantes hispanohablantes de La Haya',
    shareAlt: 'CLÜSS: la asociación de estudiantes hispanohablantes de La Haya',
    locale: 'es_ES',
  },
  en: {
    nav: [['/', 'Home', 'home'], ['/about/committees/', 'Committees', 'committees'], ['/team/', 'Board', 'team'], ['/events/', 'Events', 'events'], ['/blog/', 'Blog', 'blog'], ['/contact/', 'Contact', 'contact']],
    signIn: 'Sign in', members: 'Members area', join: 'Join', menu: 'Menu', skip: 'Skip to content', home: 'CLÜSS, home',
    mainNav: 'Main', mobileNav: 'Mobile', switchTo: 'Español', switchShort: 'ES',
    footSign: 'see you there!', footSite: 'The site', footCommittees: 'Committees', footTalk: 'Talk to us', whatsapp: 'WhatsApp community',
    defaultTitle: 'CLÜSS · The Hague’s Spanish-speaking student association',
    shareAlt: 'CLÜSS: The Hague’s Spanish-speaking student association',
    locale: 'en_GB',
  },
};

// ── search engines and link previews ───────────────────────────────────
// Search results cut descriptions at about 160 characters, so longer ones end at a word.
function clip(text, max = 158) {
  const s = String(text || '').replace(/\s+/g, ' ').trim();
  if (s.length <= max) return s;
  return `${s.slice(0, max).replace(/\s+\S*$/, '').replace(/[,;:.\s]+$/, '')}…`;
}
const abs = (src) => (!src ? '' : /^https?:\/\//.test(src) ? src : `${SITE}${src.startsWith('/') ? '' : '/img/'}${src}`);
// Structured data (schema.org) lets Google show CLÜSS and its events as rich results.
const ldScript = (data) => `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', ...data }).replace(/</g, '\\u003c')}</script>`;
const SHARE_SRC = `${SITE}/brand/share.png`;
const ORG_REF = { '@type': 'Organization', name: 'CLÜSS', url: `${SITE}/`, logo: `${SITE}/brand/icon-512.png` };
const ORG = (lang) => ({
  ...ORG_REF, '@id': `${SITE}/#org`,
  alternateName: ['CLUSS', 'CLÜSS The Hague', 'Community of Leiden University for Spanish-Speakers'],
  description: lang === 'en'
    ? 'The Hague’s Spanish-speaking student association at Leiden University, open to Spanish speakers and anyone who loves Hispanic cultures.'
    : 'La asociación de estudiantes hispanohablantes de la Universidad de Leiden en La Haya, abierta a hispanohablantes y a quien ame las culturas hispanas.',
  image: SHARE_SRC, email: L.email,
  address: { '@type': 'PostalAddress', addressLocality: 'Den Haag', addressRegion: 'Zuid-Holland', addressCountry: 'NL' },
  areaServed: [{ '@type': 'City', name: 'The Hague' }, { '@type': 'City', name: 'Leiden' }],
  knowsLanguage: ['es', 'en'],
  sameAs: [L.instagram, L.tiktok, L.linktree],
});
const crumbs = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, p], i) => ({ '@type': 'ListItem', position: i + 1, name, item: `${SITE}${p}` })),
});

// `route` is the page's address on the Spanish site; the English one adds /en in front.
function layout({ lang, route, title, desc, active, body, suelo = 'dia', head = '', noindex = false, image = null, type = 'website', published = '', ld = [], canonical = '' }) {
  const u = UI[lang];
  const pathName = route === '/404.html' ? route : href(lang, route);
  const navLinks = u.nav.map(([h, l, k]) => `<a href="${href(lang, h)}"${k === active ? ' aria-current="page"' : ''}>${l}</a>`).join('');
  const fullTitle = title ? `${title} · CLÜSS` : u.defaultTitle;
  const d = clip(desc);
  const img = image && image.src ? { ...image, src: abs(image.src) } : { src: SHARE_SRC, w: 1200, h: 630, alt: u.shareAlt };
  const alt = counterpart(lang, route);
  const hasBoth = !NO_EN.has(route);
  const alternates = hasBoth ? `
<link rel="alternate" hreflang="es" href="${SITE}${route}">
<link rel="alternate" hreflang="en" href="${SITE}/en${route}">
<link rel="alternate" hreflang="x-default" href="${SITE}${route}">` : '';
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${fullTitle}</title>
<meta name="description" content="${d}">${noindex ? '\n<meta name="robots" content="noindex">' : ''}
<meta name="theme-color" content="#F6F3EC">
<link rel="canonical" href="${SITE}${canonical || pathName}">${alternates}
<meta property="og:type" content="${type}">
<meta property="og:site_name" content="CLÜSS">
<meta property="og:locale" content="${u.locale}">
<meta property="og:locale:alternate" content="${UI[other(lang)].locale}">
<meta property="og:title" content="${fullTitle}">
<meta property="og:description" content="${d}">
<meta property="og:url" content="${SITE}${pathName}">
<meta property="og:image" content="${img.src}">${img.w ? `\n<meta property="og:image:width" content="${img.w}">\n<meta property="og:image:height" content="${img.h}">` : ''}
<meta property="og:image:alt" content="${img.alt || 'CLÜSS'}">${published ? `\n<meta property="article:published_time" content="${published}">` : ''}
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/svg+xml" href="/brand/puntitos-rojo.svg">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/fonts/unbounded-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/space-grotesk-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/styles.css">
<script src="/main.js" defer></script>
${DB_META}${head}
${ld.map(ldScript).join('\n')}
</head>
<body class="page-${active}">
<a class="skip" href="#main">${u.skip}</a>
<header class="top" data-top>
  <a class="top-logo" href="${href(lang, '/')}" aria-label="${u.home}"><img src="/brand/cluss-rojo.svg" alt="CLÜSS" width="945" height="386"></a>
  <nav class="top-nav" aria-label="${u.mainNav}">${navLinks}</nav>
  <a class="top-lang" href="${alt}" hreflang="${other(lang)}" lang="${other(lang)}"><span aria-hidden="true">${u.switchShort}</span><span class="sr">${u.switchTo}</span></a>
  <a class="btn linea btn-sesion" href="/miembros/" data-sesion="${u.members}"${active === 'members' ? ' aria-current="page"' : ''}>${u.signIn}</a>
  <a class="btn btn-top${active === 'join' ? ' is-here' : ''}" href="${href(lang, '/join-us/')}">${u.join}</a>
  <button class="burger" type="button" aria-expanded="false" aria-controls="menu" data-burger><span class="sr">${u.menu}</span><i></i><i></i></button>
</header>
<div class="menu" id="menu" data-suelo="rojo" hidden>
  <nav aria-label="${u.mobileNav}"><a href="/miembros/" class="menu-sesion" data-sesion="${u.members}">${u.signIn}</a>${navLinks}<a href="${href(lang, '/join-us/')}">${u.join}</a><a href="${alt}" class="menu-lang" hreflang="${other(lang)}" lang="${other(lang)}">${u.switchTo}</a></nav>
</div>
<main id="main" data-suelo="${suelo}">
${body}
</main>
<footer class="pie" data-suelo="noche">
  <div class="pie-grid">
    <div class="pie-sign">
      <p class="titular">${u.footSign}</p>
      ${mark('chispas', 'rojo', 'pie-chispas')}
    </div>
    <div class="pie-col">
      <h2 class="micro">${u.footSite}</h2>
      ${u.nav.map(([h, l]) => `<a href="${href(lang, h)}">${l}</a>`).join('')}
      <a href="${href(lang, '/join-us/')}">${u.join}</a>
      <a href="${alt}" hreflang="${other(lang)}" lang="${other(lang)}">${u.switchTo}</a>
    </div>
    <div class="pie-col">
      <h2 class="micro">${u.footCommittees}</h2>
      ${c.committees.map((m) => `<a href="${href(lang, `/about/committees/${m.slug}/`)}">${m.name[lang]}</a>`).join('')}
    </div>
    <div class="pie-col">
      <h2 class="micro">${u.footTalk}</h2>
      <a href="mailto:${L.email}">${L.email}</a>
      <a href="${L.instagram}" target="_blank" rel="noopener">Instagram</a>
      <a href="${L.tiktok}" target="_blank" rel="noopener">TikTok</a>
      <a href="${L.whatsapp}" target="_blank" rel="noopener">${u.whatsapp}</a>
      <a href="${L.linktree}" target="_blank" rel="noopener">Linktree</a>
      <a href="/miembros/">${u.members}</a>
    </div>
  </div>
  <img class="pie-logo" src="/brand/cluss-blanco.svg" alt="CLÜSS" loading="lazy">
  <div class="pie-base micro">
    <span>Community of Leiden University for Spanish-Speakers</span>
    <span>@clussthehague · cluss.nl</span>
  </div>
</footer>
</body>
</html>`;
}

// ── sections used more than once ───────────────────────────────────────
function pageHead({ lines, intro, suelo = 'dia', label, stickers = '', tagline, kicker }) {
  const join = lines.join('').length <= 9;
  return `<section class="cabecera" data-suelo="${suelo}">
    <div class="cabecera-in">
      ${kicker ? `<p class="micro cabecera-k">${kicker}</p>` : ''}
      ${cartel(lines, { label, join })}
      ${tagline || intro ? `<div class="cabecera-sub">
        ${tagline ? `<p class="subtitular">${tagline}</p>` : ''}
        ${intro ? `<p class="cuerpo">${intro}</p>` : ''}
      </div>` : ''}
      ${stickers}
    </div>
  </section>`;
}

function askBlock({ title, text = '', href: to, label, extra = '' }) {
  return `<section class="ask" data-suelo="rojo">
    <div class="ask-in">
      ${titular(title, 'h2', 'ask-t')}
      ${text ? `<p class="ask-x">${text}</p>` : ''}
      <div class="fila-btn">${btn(to, label, 'papel big')}${extra}</div>
      ${mark('flecha', 'blanco', 'ask-flecha')}
    </div>
  </section>`;
}

function calendarBlock(lang) {
  return `<section class="seccion" id="calendario">
    <div class="wrap">
      <div class="cal-cab">
        ${titular(lang === 'en' ? 'calendar.' : 'calendario.')}
        ${btn(L.calendarOpen, lang === 'en' ? 'Add it to your calendar' : 'Añádelo a tu calendario', 'linea')}
      </div>
      <div class="cal">
        <iframe src="${L.calendarEmbed.replaceAll('&', '&amp;')}" title="${lang === 'en' ? 'CLÜSS calendar' : 'Calendario de CLÜSS'}" loading="lazy" scrolling="no"></iframe>
      </div>
    </div>
  </section>`;
}

// ── events and posts ───────────────────────────────────────────────────
// With the members area connected, published events and posts come from the database.
// Without it (or if it can't be reached during the build), the events in content/site.mjs are used.
// CLUSS_DB_URL and CLUSS_DB_KEY override content/site.mjs, which is handy for testing.
const backend = process.env.CLUSS_DB_URL ? { url: process.env.CLUSS_DB_URL, anonKey: process.env.CLUSS_DB_KEY || '' } : c.backend;
const DB = backend && backend.url && backend.anonKey ? backend : null;
const DB_META = DB ? `<meta name="cluss-db" content="${esc(DB.url)}|${esc(DB.anonKey)}">\n<script type="module" src="/live.js"></script>\n` : '';

async function fromDb(table, query) {
  const res = await fetch(`${DB.url}/rest/v1/${table}?${query}`, { headers: { apikey: DB.anonKey } });
  if (!res.ok) throw new Error(`${table}: ${res.status} ${await res.text()}`);
  return res.json();
}

let eventRows = c.events;
let postRows = [];
if (DB) {
  try {
    eventRows = await fromDb('events', 'select=*&status=eq.published&order=date.asc');
    postRows = await fromDb('posts', 'select=*&status=eq.published&order=published_at.desc');
  } catch (err) {
    console.warn(`Could not read the members database, using content/site.mjs instead. ${err.message}`);
    eventRows = c.events;
    postRows = [];
  }
}
const today = todayInHague();
const { next: nextEvents, past: pastEvents } = splitEvents(eventRows, today);
const posts = postRows.map(normPost);
// The live script redraws a block only when its fingerprint differs from the one built here.
const fpHome = fingerprint([today, nextEvents[0] || null]);
const fpEvents = fingerprint([today, nextEvents, pastEvents]);
const fpPosts = fingerprint(posts);

// Dates for the sitemap: when each page last changed.
const day = (v) => String(v || '').slice(0, 10);
const latest = (...dates) => dates.flat().map(day).filter(Boolean).sort().pop() || today;
let codeDate = '';
try { codeDate = execSync('git log -1 --format=%cs', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch { /* not a git checkout */ }
codeDate = codeDate || today;
const postUpdated = Object.fromEntries(postRows.map((r) => [r.slug, latest(r.updated_at, r.published_at)]));
const eventsDate = latest(codeDate, eventRows.map((r) => r.updated_at), pastEvents.slice(0, 1).map((e) => e.date));
const lastmod = {
  '/': eventsDate,
  '/events/': eventsDate,
  '/blog/': latest(codeDate, Object.values(postUpdated)),
  ...Object.fromEntries(posts.map((p) => [`/blog/${p.slug}/`, postUpdated[p.slug] || p.date])),
};

// Each event as schema.org data, so Google can list it in event search.
const plain = (v) => String(v || '').replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
function hagueTime(date, [h, m]) {
  const off = new Intl.DateTimeFormat('en', { timeZone: 'Europe/Amsterdam', timeZoneName: 'longOffset' })
    .formatToParts(new Date(`${date}T${h}:${m}:00Z`)).find((x) => x.type === 'timeZoneName').value.replace('GMT', '');
  return `${date}T${h}:${m}:00${off || '+00:00'}`;
}
function eventLd(e, lang) {
  const times = [...String(e.time || '').matchAll(/(\d{1,2})[:.](\d{2})/g)].map((x) => [x[1].padStart(2, '0'), x[2]]);
  const where = plain(e.place) || 'The Hague';
  const name = plain(e.title) || plain([e.lead, ...(e.cartel || [])].join(' '));
  return {
    '@type': 'Event', name,
    startDate: times[0] ? hagueTime(e.date, times[0]) : e.date,
    ...(times[1] ? { endDate: hagueTime(e.date, times[1]) } : {}),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: { '@type': 'Place', name: where, address: { '@type': 'PostalAddress', addressLocality: /leiden/i.test(where) ? 'Leiden' : 'Den Haag', addressCountry: 'NL' } },
    description: plain(e.en) || plain((e.text || [])[0]) || `${name}: a CLÜSS event.`,
    image: [e.img ? abs(e.img) : SHARE_SRC],
    organizer: ORG_REF,
    url: `${SITE}${href(lang, '/events/')}`,
  };
}

// ── pages ──────────────────────────────────────────────────────────────
// Returns { route: () => html } for one language. Routes are the Spanish addresses.
function sitePages(lang) {
  const t = pick(lang);
  const es = lang === 'es';
  const h = (p) => href(lang, p);
  const pages = {};
  const inicio = es ? 'Inicio' : 'Home';
  const comites = es ? 'Comités' : 'Committees';

  pages['/'] = () => layout({
    lang, route: '/', active: 'home',
    desc: es
      ? 'CLÜSS es la asociación de estudiantes hispanohablantes de la Universidad de Leiden en La Haya: eventos, visitas a embajadas y cultura, hables mucho o poco español.'
      : 'CLÜSS is The Hague’s Spanish-speaking student association at Leiden University: events, embassy visits and culture, whatever your level of Spanish.',
    ld: [ORG(lang), { '@type': 'WebSite', '@id': `${SITE}/#website`, url: `${SITE}/`, name: 'CLÜSS', inLanguage: ['es', 'en'], publisher: { '@id': `${SITE}/#org` } }, ...nextEvents.slice(0, 1).map((e) => eventLd(e, lang))],
    body: `
    <section class="hero" data-suelo="dia">
      <h1 class="sr">${es ? 'CLÜSS: la asociación de estudiantes hispanohablantes de La Haya' : 'CLÜSS: The Hague’s Spanish-speaking student association'} (Community of Leiden University for Spanish-Speakers)</h1>
      <div class="hero-base">
        <div class="hero-txt">
          <div class="hero-logo"><img src="/brand/cluss-rojo.svg" alt="" width="945" height="386" fetchpriority="high"></div>
          <p class="subtitular">${t(c.home.statement)}</p>
          <div class="fila-btn">${btn(h('/join-us/'), es ? 'Únete a la familia' : 'Join the family')}${btn(h('/events/'), es ? 'Ver eventos' : 'See events', 'linea')}</div>
        </div>
        <div class="hero-fotos">
          ${foto('la-haya.jpg', es ? 'La Haya al atardecer, con la torre de la Grote Kerk' : 'The Hague at sunset, with the tower of the Grote Kerk', 'f1', { eager: true })}
          ${foto('picnic.jpg', t(c.home.reasons[0].alt), 'f2', { eager: true })}
          ${sello(es ? 'CLÜSS ✦ Leiden ✦ La Haya ✦ Familia ✦' : 'CLÜSS ✦ Leiden ✦ The Hague ✦ Family ✦', 'hero-sello', 'data-drag data-spin')}
        </div>
      </div>
    </section>
    <div class="cintas">
      ${cinta(es ? ['Conoce gente', 'Celebra la cultura', 'Practica español', 'Ven a los eventos'] : ['Meet people', 'Celebrate culture', 'Practise Spanish', 'Come to events'], 'c1')}
      ${cinta(es ? ['La Haya', 'Leiden', 'Familia', 'Hables mucho o poco'] : ['The Hague', 'Leiden', 'Family', 'Any level of Spanish'], 'c2 cobalto rev')}
    </div>
    <div data-live="home-event" data-fp="${fpHome}">${nextEvents[0] ? eventPoster(nextEvents[0], { lang }) : ''}</div>
    <section class="seccion quienes">
      <div class="wrap quienes-grid">
        <div class="quienes-a">
          <h2 class="titular grande">${es ? '¿quiénes' : 'who'} <span class="lazo-w">${es ? 'somos?' : 'are we?'}${mark('lazo', 'rojo', 'draw sweep lazo-m')}</span></h2>
          <div class="quienes-fotos">
            ${foto('campus-spui.jpg', es ? 'El edificio del campus Spui de la Universidad de Leiden en La Haya' : 'Leiden University’s Spui campus building in The Hague', 'qf1', { cap: es ? 'Campus Spui, La Haya' : 'Campus Spui, The Hague' })}
            ${foto('clase.jpg', es ? 'Estudiantes en un aula de la Universidad de Leiden' : 'Students in a lecture hall at Leiden University', 'qf2')}
            ${foto('canal.jpg', es ? 'Un canal holandés al anochecer' : 'A Dutch canal at dusk', 'qf3')}
          </div>
        </div>
        <div class="quienes-b prosa">
          ${t(c.home.about).map((p) => `<p>${p}</p>`).join('')}
          ${btn(h('/team/'), es ? 'Conoce al Board' : 'Meet the board')}
        </div>
      </div>
    </section>
    <section class="razones" data-suelo="noche">
      ${trama()}
      <div class="wrap">
        <h2 class="micro razones-k">${es ? '¿Por qué unirte a CLÜSS?' : 'Why join CLÜSS?'}</h2>
        <ul class="razones-l">
          ${c.home.reasons.map((r) => `<li><a href="${h('/join-us/')}"><span class="razon-t">${r[lang]}</span>${foto(r.img, t(r.alt), 'razon-f')}</a></li>`).join('')}
        </ul>
      </div>
    </section>
    <section class="socios">
      <div class="wrap">
        <h2 class="micro">${es ? 'Nuestras colaboraciones' : 'Our partnerships'}</h2>
        <ul class="socios-l">
          ${c.partners.map((p) => `<li style="background:${p.bg}"><img src="/img/${p.img}" alt="${p.name}" loading="lazy"></li>`).join('')}
        </ul>
      </div>
    </section>
    <section class="comunidad" data-suelo="rojo">
      <div class="comunidad-in">
        ${titular(es ? 'únete a la familia.' : 'join the family.', 'h2', 'ask-t')}
        <ul class="redes">
          <li><a href="${L.instagram}" target="_blank" rel="noopener"><span class="micro">Instagram</span><b>@clussthehague</b></a></li>
          <li><a href="${L.tiktok}" target="_blank" rel="noopener"><span class="micro">TikTok</span><b>@clussthehague</b></a></li>
          <li><a href="mailto:${L.email}"><span class="micro">Email</span><b class="redes-mail">${L.email}</b></a></li>
        </ul>
        ${sello(es ? 'Conoce gente ✦ Practica español ✦ Ven ✦' : 'Meet people ✦ Practise Spanish ✦ Come ✦', 'negro comunidad-sello', 'data-spin')}
      </div>
    </section>`,
  });

  pages['/about/committees/'] = () => layout({
    lang, route: '/about/committees/', title: comites, active: 'committees',
    desc: t(c.committeesIntro),
    ld: [crumbs([[inicio, h('/')], [comites, h('/about/committees/')]])],
    body: `
    ${pageHead({ lines: es ? ['4 COMITÉS,', '1 FAMILIA.'] : ['4 COMMITTEES,', '1 FAMILY.'], suelo: 'azul', tagline: es ? 'Encuentra tu sitio.' : 'Find your place.', intro: t(c.committeesIntro), stickers: mark('chispas', 'blanco', 'cab-chispas') })}
    <section class="comites">
      ${c.committees.map((m) => `<article class="comite-card">
        <a href="${h(`/about/committees/${m.slug}/`)}" class="comite-bloque" data-suelo="${m.suelo}">
          <h2 class="comite-nombre">${m.name[lang]}</h2>
        </a>
        <div class="comite-txt">
          <p>${t(m.blurb)}</p>
          ${btn(h(`/about/committees/${m.slug}/`), es ? 'Leer más' : 'Read more', 'linea')}
        </div>
      </article>`).join('')}
    </section>
    ${askBlock({ title: es ? '¿te vienes?' : 'are you in?', text: es ? 'Elige un comité y ayuda a llevar CLÜSS.' : 'Pick a committee and help run CLÜSS.', href: L.joinActive, label: es ? 'Únete a un comité' : 'Join a committee' })}`,
  });

  for (const m of c.committees) {
    const route = `/about/committees/${m.slug}/`;
    pages[route] = () => layout({
      lang, route, title: m.title[lang], active: 'committees',
      desc: `${t(m.tagline)} ${t(m.lead)}`,
      ld: [crumbs([[inicio, h('/')], [comites, h('/about/committees/')], [m.title[lang], h(route)]])],
      body: `
      ${pageHead({ lines: t(m.cartel), suelo: m.suelo, label: m.title[lang], tagline: t(m.tagline), kicker: es ? 'Comité' : 'Committee' })}
      ${m.huellas ? `<div class="huellas-w">${huellas()}</div>` : ''}
      <section class="seccion">
        <div class="wrap dos">
          <div>
            ${titular(es ? '¿qué hacemos?' : 'what we do.')}
            <p class="cuerpo mt">${t(m.lead)}</p>
          </div>
          ${lista(t(m.doing), 'grande')}
        </div>
      </section>
      ${m.blocks.map((b, i) => `<section class="seccion ${i % 2 === 0 ? 'tinte' : ''}">
        <div class="wrap dos">
          <div>
            ${titular(`${t(b.title)}.`, 'h2', 'medio')}
          </div>
          <div class="prosa">
            ${b.text ? `<p>${t(b.text)}</p>` : ''}
            ${b.list ? lista(t(b.list)) : ''}
          </div>
        </div>
      </section>`).join('')}
      ${m.calendar ? calendarBlock(lang) : ''}
      <section class="seccion">
        <div class="wrap">
          ${titular(es ? 'el equipo.' : 'the team.', 'h2', 'medio')}
          <ul class="roles">${t(m.roles).map((r) => `<li>${tag(m.tag, r)}</li>`).join('')}</ul>
        </div>
      </section>
      <nav class="otros" aria-label="${es ? 'Otros comités' : 'Other committees'}">
        ${c.committees.filter((o) => o.slug !== m.slug).map((o) => `<a href="${h(`/about/committees/${o.slug}/`)}" data-suelo="${o.suelo}">${o.name[lang]}<span aria-hidden="true">→</span></a>`).join('')}
      </nav>
      ${askBlock({ title: es ? '¿te vienes?' : 'are you in?', text: es ? 'Únete a este comité y ayuda a llevar CLÜSS.' : 'Join this committee and help run CLÜSS.', href: L.joinActive, label: es ? 'Únete a un comité' : 'Join a committee' })}`,
    });
  }

  pages['/team/'] = () => layout({
    lang, route: '/team/', title: 'Board', active: 'team',
    desc: es
      ? 'Conoce al board de CLÜSS: los estudiantes que dirigen la asociación de estudiantes hispanohablantes de La Haya en la Universidad de Leiden.'
      : 'Meet the CLÜSS board: the students who lead The Hague’s Spanish-speaking student association at Leiden University.',
    body: `
    ${pageHead({ lines: ['BOARD'], intro: t(c.team.intro), stickers: sello(es ? 'CLÜSS ✦ Leiden ✦ La Haya ✦ Familia ✦' : 'CLÜSS ✦ Leiden ✦ The Hague ✦ Family ✦', 'cab-sello', 'data-spin') })}
    <section class="seccion junta">
      <div class="wrap">
        ${titular(es ? 'la junta.' : 'the board.')}
      </div>
      <div class="wrap junta-l">
        ${c.team.board.map((p, i) => `<article class="persona ${i % 2 ? 'par' : ''}">
          ${foto(p.photo, p.name, 'persona-f', { name: p.name })}
          <div class="persona-t">
            ${pill(t(p.role), i % 3 === 0 ? 'static' : i % 3 === 1 ? 'static academic' : 'static media')}
            <h3 class="persona-n">${p.name}</h3>
            <p class="persona-d">${t(p.duty)}</p>
            ${t(p.bio).map((b) => `<p>${b}</p>`).join('')}
          </div>
        </article>`).join('')}
      </div>
    </section>
    ${askBlock({ title: es ? 'únete al equipo.' : 'join the team.', text: t(c.team.join), href: L.joinActive, label: es ? 'Quiero colaborar' : 'I want to help' })}`,
  });

  pages['/events/'] = () => layout({
    lang, route: '/events/', title: es ? 'Eventos en La Haya' : 'Events in The Hague', active: 'events',
    ld: [...nextEvents, ...pastEvents].map((e) => eventLd(e, lang)),
    desc: es
      ? 'Próximos eventos y eventos pasados de CLÜSS: visitas a embajadas, celebraciones culturales, fiestas, torneos y más, en La Haya y Leiden.'
      : 'Upcoming and past CLÜSS events: embassy visits, cultural celebrations, parties, tournaments and more, in The Hague and Leiden.',
    body: `
    ${pageHead({ lines: es ? ['EVEN', 'TOS'] : ['EVENTS'] })}
    <section class="seccion prox-h"><div class="wrap">${titular(es ? 'próximos eventos.' : 'upcoming events.')}</div></section>
    <div data-live="next-events" data-fp="${fpEvents}">${nextEvents.length ? nextEvents.map((ev) => eventPoster(ev, { lang, moreLink: false, showText: true, headTag: 'h3', instagram: L.instagram })).join('') : noNextEvents(lang)}</div>
    ${calendarBlock(lang)}
    <section class="seccion pasados" data-suelo="noche">
      <div class="wrap">
        ${titular(es ? 'eventos pasados.' : 'past events.')}
        <div data-live="past-events" data-fp="${fpEvents}">${pastEvents.map((ev) => pastEvent(ev, lang)).join('')}</div>
        <div class="galeria">
          ${c.pastPhotos.map((p, i) => foto(p.img, t(p.alt), `g${i + 1}`)).join('')}
        </div>
        <div class="fila-btn">${btn(L.photos, es ? 'Todas las fotos' : 'All photos', 'papel')}</div>
      </div>
    </section>
    ${askBlock({ title: es ? 'únete a la familia.' : 'join the family.', text: es ? 'Hables mucho o poco español, aquí tienes sitio.' : 'Whatever your level of Spanish, there’s a place for you.', href: h('/join-us/'), label: es ? 'Hazte miembro' : 'Become a member' })}`,
  });

  pages['/join-us/'] = () => layout({
    lang, route: '/join-us/', title: es ? 'Únete' : 'Join us', active: 'join',
    desc: `${es ? 'Únete a CLÜSS.' : 'Join CLÜSS.'} ${t(c.join.intro)}`,
    body: `
    <section class="cabecera unete" data-suelo="rojo">
      <div class="cabecera-in">
        ${cartel(es ? ['ÚNE', 'TE.'] : ['JOIN', 'US.'], { label: es ? 'Únete' : 'Join us', join: true })}
        <div class="cabecera-sub">
          <p class="subtitular">${es ? 'Hazte parte de la familia.' : 'Become part of the family.'}</p>
        </div>
        ${sello(es ? 'Conoce gente ✦ Practica español ✦ Ven ✦' : 'Meet people ✦ Practise Spanish ✦ Come ✦', 'negro cab-sello', 'data-spin')}
      </div>
    </section>
    <section class="seccion">
      <div class="wrap dos">
        <div>
          ${titular(es ? '¿por qué CLÜSS?' : 'why CLÜSS?')}
          <p class="cuerpo mt">${t(c.join.intro)}</p>
          ${foto('notas.jpg', es ? 'Manos clavando notas escritas a mano en un tablón' : 'Hands pinning handwritten notes on a board', 'unete-f')}
        </div>
        <div>
          ${lista(t(c.join.why), 'grande')}
          <div class="fila-btn mt">${btn(L.joinGeneral, es ? 'Únete' : 'Join')}</div>
        </div>
      </div>
    </section>
    <section class="seccion tipos" data-suelo="noche">
      <div class="wrap">
        ${titular(es ? 'elige cómo.' : 'choose how.')}
        <div class="tipos-l">
          ${c.join.options.map((o) => `<article class="ticket grande" data-suelo="dia" style="--notch:var(--negro)">
            <div class="ticket-cuerpo libre">
              <h3 class="ticket-t">${t(o.name)}</h3>
              <p>${t(o.lead)}</p>
              ${lista(t(o.list))}
              ${btn(L[o.href], es ? 'Únete' : 'Join')}
            </div>
            <div class="talon"><span>${t(o.talon)}</span></div>
          </article>`).join('')}
        </div>
      </div>
    </section>
    <section class="seccion faq">
      <div class="wrap dos">
        <div class="faq-a">
          ${titular(es ? 'preguntas frecuentes.' : 'frequently asked questions.', 'h2', 'medio')}
        </div>
        <div class="faq-l">
          ${t(c.join.faq).map(([q, a]) => `<details><summary>${q}<span aria-hidden="true"></span></summary><p>${a}</p></details>`).join('')}
        </div>
      </div>
    </section>
    ${askBlock({ title: es ? '¿te vienes?' : 'are you in?', text: t(c.join.ready), href: L.joinGeneral, label: es ? 'Únete' : 'Join' })}`,
  });

  pages['/contact/'] = () => layout({
    lang, route: '/contact/', title: es ? 'Contacto' : 'Contact', active: 'contact',
    desc: t(c.contact.intro),
    body: `
    ${pageHead({ lines: es ? ['HABLE', 'MOS.'] : ['LET’S', 'TALK.'], tagline: es ? 'Nos encantará saber de ti.' : 'We’d love to hear from you.', intro: t(c.contact.intro), label: es ? 'Hablemos' : 'Let’s talk', stickers: mark('chispas', 'rojo', 'cab-chispas') })}
    <section class="seccion contacto" data-suelo="azul">
      <div class="wrap">
        ${titular(es ? 'escríbenos.' : 'write to us.')}
        <div class="email-w">
          <a class="email" href="mailto:${L.email}">${L.email}</a>
          <button class="btn papel" type="button" data-copy="${L.email}" data-copy-done="${es ? '¡Copiado!' : 'Copied!'}"><span data-copy-l>${es ? 'Copiar' : 'Copy'}</span></button>
        </div>
        <ul class="contacto-l">
          <li><a href="${L.instagram}" target="_blank" rel="noopener"><span class="micro">Instagram</span><b>@clussthehague</b></a></li>
          <li><a href="${L.tiktok}" target="_blank" rel="noopener"><span class="micro">TikTok</span><b>@clussthehague</b></a></li>
          <li><a href="${L.whatsapp}" target="_blank" rel="noopener"><span class="micro">WhatsApp</span><b>${es ? 'Comunidad' : 'Community'}</b></a></li>
          <li><a href="${L.linktree}" target="_blank" rel="noopener"><span class="micro">${es ? 'Enlaces rápidos' : 'Quick links'}</span><b>Linktree</b></a></li>
        </ul>
      </div>
    </section>
    ${askBlock({ title: es ? 'hablemos.' : 'let’s talk.', text: t(c.contact.outro), href: L.joinGeneral, label: es ? 'Únete' : 'Join' })}`,
  });

  pages['/blog/'] = () => layout({
    lang, route: '/blog/', title: 'Blog', active: 'blog',
    desc: es
      ? 'Noticias, historias y crónicas de CLÜSS, la asociación de estudiantes hispanohablantes de La Haya.'
      : 'News, stories and recaps from CLÜSS, the Spanish-speaking student association in The Hague.',
    body: `
    ${pageHead({ lines: ['BLOG'], tagline: es ? 'Historias, noticias y crónicas de CLÜSS.' : 'Stories, news and recaps from CLÜSS.' })}
    <section class="seccion blog">
      <div class="wrap">
        <div class="entradas" data-live="posts" data-fp="${fpPosts}">${posts.length ? posts.map((p, i) => postCard(p, i, lang)).join('') : noPosts(lang)}</div>
      </div>
    </section>
    ${askBlock({ title: es ? '¿quieres escribir?' : 'want to write?', text: es ? 'Los miembros activos pueden escribir en el blog desde el área de miembros.' : 'Active members can write for the blog from the members area.', href: '/miembros/', label: es ? 'Área de miembros' : 'Members area' })}`,
  });

  // Posts are written once, in whatever language the author chose. The English address shows the same post
  // with English menus and points search engines to the Spanish address, so it isn't counted twice.
  for (const p of posts) {
    const route = `/blog/${p.slug}/`;
    pages[route] = () => layout({
      lang, route, title: esc(p.title), active: 'blog', canonical: route,
      desc: esc(p.excerpt || p.title),
      type: 'article', published: p.date,
      image: p.cover ? { src: p.cover, alt: esc(p.coverAlt || p.title) } : null,
      ld: [{
        '@type': 'BlogPosting', headline: p.title.slice(0, 110), description: p.excerpt || undefined,
        datePublished: p.date, dateModified: postUpdated[p.slug] || p.date,
        author: p.author ? { '@type': 'Person', name: p.author } : ORG_REF, publisher: ORG_REF,
        image: [p.cover ? abs(p.cover) : SHARE_SRC], mainEntityOfPage: `${SITE}${route}`,
      }, crumbs([[inicio, h('/')], ['Blog', h('/blog/')], [p.title, h(route)]])],
      body: postArticle(p, lang),
    });
  }

  return pages;
}

// The members area and the 404 page are only in Spanish.
const extraPages = {
  '/miembros/': () => layout({
    lang: 'es', route: '/miembros/', title: 'Área de miembros', active: 'members', noindex: true,
    desc: 'Área privada para los miembros activos de CLÜSS.',
    head: DB ? '<script src="/vendor/supabase.js" defer></script>\n<script type="module" src="/miembros.js"></script>' : '',
    body: `<div class="miembros" id="app" data-configured="${DB ? 'yes' : 'no'}">
      <section class="cabecera" data-suelo="dia"><div class="cabecera-in">
        <p class="micro cabecera-k">CLÜSS</p>
        ${cartel(['MIEM', 'BROS'], { label: 'Área de miembros', join: true })}
        <div class="cabecera-sub">
          <p class="cuerpo">${DB ? 'Cargando…' : 'El área de miembros todavía no está conectada. Mira README.md, «Members area».'}</p>
        </div>
      </div></section>
    </div>`,
  }),
};

const page404 = () => layout({
  lang: 'es', route: '/404.html', title: 'No encontrado', active: 'none',
  desc: 'Esta página no existe.',
  // A blog post published after the last build has no page yet; the live script draws it here.
  body: `<div data-live="post"></div><section class="cabecera perdido" data-suelo="noche" data-perdido><div class="cabecera-in">
    ${cartel(['AQUÍ', 'NADA.'], { label: 'Aquí nada', join: true })}
    <div class="cabecera-sub"><p class="cuerpo">Esta página no existe. Algunos enlaces antiguos cambiaron cuando dejamos Google Sites.</p>
    <div class="fila-btn">${btn('/', 'Volver al inicio', 'papel')}${btn('/en/', 'English', 'linea')}</div></div>
  </div></section>`,
});

// Every page, at its real address: Spanish at the route, English under /en.
const pages = { ...extraPages };
for (const lang of LANGS) {
  for (const [route, render] of Object.entries(sitePages(lang))) pages[href(lang, route)] = render;
}

// ── write everything ───────────────────────────────────────────────────
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
fs.cpSync('public', OUT, { recursive: true });
for (const f of ['styles.css', 'main.js', 'render.mjs', 'live.js', 'miembros.js']) fs.copyFileSync(path.join('src', f), path.join(OUT, f));

for (const [route, render] of Object.entries(pages)) {
  const dir = path.join(OUT, route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), render());
}
fs.writeFileSync(path.join(OUT, '404.html'), page404());

// English copies of blog posts point to the Spanish address, so only that one is listed.
const listed = Object.keys(pages).filter((r) => r !== '/miembros/' && !/^\/en\/blog\/./.test(r));
const urls = listed.map((r) => `<url><loc>${SITE}${r}</loc><lastmod>${lastmod[r.replace(/^\/en\//, '/')] || codeDate}</lastmod></url>`).join('\n');
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);

// Old Google Sites addresses keep working. Plain redirect pages work on any host.
const oldUrls = [
  ['/inicio', '/'],
  ['/about', '/'],
  ['/about-clüss', '/'],
  ['/about-clüss/committees', '/about/committees/'],
  ...c.committees.map((m) => [`/about-clüss/committees/${m.slug}`, `/about/committees/${m.slug}/`]),
  ['/about-clüss/committees/journal-and-media-committee', '/about/committees/communication-and-media-committee/'],
  ['/raíces', '/'],
];
for (const [from, to] of oldUrls) {
  const dir = path.join(OUT, from);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>CLÜSS</title><meta name="robots" content="noindex"><link rel="canonical" href="${SITE}${to}"><meta http-equiv="refresh" content="0; url=${to}"></head><body><a href="${to}">This page has moved.</a></body></html>`);
}

console.log(`Built ${Object.keys(pages).length + 1} pages into ${OUT}/ (events from ${DB && eventRows !== c.events ? 'database' : 'content/site.mjs'}; next: ${nextEvents.length}, past: ${pastEvents.length}, posts: ${posts.length})`);
