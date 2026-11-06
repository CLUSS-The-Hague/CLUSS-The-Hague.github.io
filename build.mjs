// Builds the static site into dist/. No dependencies: `npm run build`.
import fs from 'node:fs';
import path from 'node:path';
import * as c from './content/site.mjs';
import {
  PUNTITOS, COMITE, esc, en, mark, ext, btn, tag, titular, lista, cartel, fotoTag,
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

const es = (t) => `<span lang="es">${t}</span>`;

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

// ── chrome ─────────────────────────────────────────────────────────────
const NAV = [
  ['/', 'Inicio', 'home'],
  ['/about/committees/', 'Comités', 'committees'],
  ['/team/', 'Board', 'team'],
  ['/events/', 'Eventos', 'events'],
  ['/blog/', 'Blog', 'blog'],
  ['/contact/', 'Contacto', 'contact'],
];

function layout({ title, desc, active, body, pathName, suelo = 'dia', head = '', noindex = false }) {
  const nav = NAV.map(([h, l, k]) => `<a href="${h}"${k === active ? ' aria-current="page"' : ''} lang="es">${l}</a>`).join('');
  const fullTitle = title ? `${title} · CLÜSS` : 'CLÜSS · Community of Leiden University for Spanish-Speakers';
  const ld = pathName === '/' ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'Organization', name: 'CLÜSS', alternateName: 'Community of Leiden University for Spanish-Speakers', url: SITE, email: L.email, sameAs: [L.instagram, L.tiktok] })}</script>` : '';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${fullTitle}</title>
<meta name="description" content="${desc}">${noindex ? '\n<meta name="robots" content="noindex">' : ''}
<meta name="theme-color" content="#F6F3EC">
<link rel="canonical" href="${SITE}${pathName}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="CLÜSS">
<meta property="og:title" content="${fullTitle}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${SITE}${pathName}">
<meta property="og:image" content="${SITE}/img/la-haya.jpg">
<link rel="icon" type="image/svg+xml" href="/brand/puntitos-rojo.svg">
<link rel="preload" href="/fonts/unbounded-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/space-grotesk-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/styles.css">
<script src="/main.js" defer></script>
${DB_META}${head}
${ld}
</head>
<body class="page-${active}">
<a class="skip" href="#main">Skip to content</a>
<header class="top" data-top>
  <a class="top-logo" href="/" aria-label="CLÜSS, home"><img src="/brand/cluss-rojo.svg" alt="CLÜSS" width="945" height="386"></a>
  <nav class="top-nav" aria-label="Main">${nav}</nav>
  <a class="btn linea btn-sesion" href="/miembros/" lang="es" data-sesion${active === 'members' ? ' aria-current="page"' : ''}>Iniciar sesión</a>
  <a class="btn btn-top${active === 'join' ? ' is-here' : ''}" href="/join-us/" lang="es">Únete</a>
  <button class="burger" type="button" aria-expanded="false" aria-controls="menu" data-burger><span class="sr">Menu</span><i></i><i></i></button>
</header>
<div class="menu" id="menu" data-suelo="rojo" hidden>
  <nav aria-label="Mobile"><a href="/miembros/" class="menu-sesion" lang="es" data-sesion>Iniciar sesión</a>${NAV.map(([h, l, k]) => `<a href="${h}"${k === active ? ' aria-current="page"' : ''} lang="es">${l}</a>`).join('')}<a href="/join-us/" lang="es">Únete</a></nav>
</div>
<main id="main" data-suelo="${suelo}">
${body}
</main>
<footer class="pie" data-suelo="noche">
  <div class="pie-grid">
    <div class="pie-sign">
      <p class="titular" lang="es">¡te esperamos!</p>
      ${mark('chispas', 'rojo', 'pie-chispas')}
    </div>
    <div class="pie-col">
      <h2 class="micro">El sitio</h2>
      ${NAV.map(([h, l]) => `<a href="${h}" lang="es">${l}</a>`).join('')}
      <a href="/join-us/" lang="es">Únete</a>
    </div>
    <div class="pie-col">
      <h2 class="micro">Comités</h2>
      ${c.committees.map((m) => `<a href="/about/committees/${m.slug}/" lang="es">${m.es}</a>`).join('')}
    </div>
    <div class="pie-col">
      <h2 class="micro">Habla con nosotros</h2>
      <a href="mailto:${L.email}">${L.email}</a>
      <a href="${L.instagram}" target="_blank" rel="noopener">Instagram</a>
      <a href="${L.tiktok}" target="_blank" rel="noopener">TikTok</a>
      <a href="${L.whatsapp}" target="_blank" rel="noopener">WhatsApp community</a>
      <a href="${L.linktree}" target="_blank" rel="noopener">Linktree</a>
      <a href="/miembros/" lang="es">Área de miembros</a>
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
function pageHead({ lines, enLine, intro, suelo = 'dia', label, stickers = '', tagline, kicker }) {
  const join = lines.join('').length <= 9;
  return `<section class="cabecera" data-suelo="${suelo}">
    <div class="cabecera-in">
      ${kicker ? `<p class="micro cabecera-k">${kicker}</p>` : ''}
      ${cartel(lines, { label, join })}
      <div class="cabecera-sub">
        ${tagline ? `<p class="subtitular">${tagline}</p>` : ''}
        ${enLine ? en(enLine) : ''}
        ${intro ? `<p class="cuerpo">${intro}</p>` : ''}
      </div>
      ${stickers}
    </div>
  </section>`;
}

function askBlock({ title = 'únete a la familia.', enLine = 'Join the family. No matter your level of Spanish.', href = '/join-us/', label = 'Hazte miembro', extra = '' }) {
  return `<section class="ask" data-suelo="rojo">
    <div class="ask-in">
      ${titular(title, 'h2', 'ask-t')}
      ${en(enLine)}
      <div class="fila-btn">${btn(href, label, 'papel big')}${extra}</div>
      ${mark('flecha', 'blanco', 'ask-flecha')}
    </div>
  </section>`;
}

function calendarBlock() {
  return `<section class="seccion" id="calendario">
    <div class="wrap">
      <div class="cal-cab">
        <div>
          ${titular('calendario.')}
          ${en('Everything CLÜSS has coming up.')}
        </div>
        ${btn(L.calendarOpen, 'Añádelo a tu calendario', 'linea')}
      </div>
      <div class="cal">
        <iframe src="${L.calendarEmbed.replaceAll('&', '&amp;')}" title="CLÜSS calendar" loading="lazy" scrolling="no"></iframe>
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

// ── pages ──────────────────────────────────────────────────────────────
const pages = {};

pages['/'] = () => layout({
  active: 'home', pathName: '/',
  desc: 'CLÜSS is the Community of Leiden University for Spanish-Speakers: a student-led association in The Hague and Leiden for Spanish speakers and anyone who loves Hispanic cultures, whatever their level of Spanish.',
  body: `
  <section class="hero" data-suelo="dia">
    <h1 class="sr">CLÜSS: Community of Leiden University for Spanish-Speakers</h1>
    <div class="hero-base">
      <div class="hero-txt">
        <div class="hero-logo"><img src="/brand/cluss-rojo.svg" alt="" width="945" height="386" fetchpriority="high"></div>
        <p class="subtitular" lang="es">${c.home.statement}</p>
        ${en(c.home.statementEn)}
        <div class="fila-btn">${btn('/join-us/', 'Únete a la familia')}${btn('/events/', 'Ver eventos', 'linea')}${pill('Todos los niveles', 'hero-p1 alt', 'data-drag lang="es"')}</div>
      </div>
      <div class="hero-fotos">
        ${foto('la-haya.jpg', 'The Hague at sunset, with the tower of the Grote Kerk', 'f1', { eager: true })}
        ${foto('picnic.jpg', 'CLÜSS students sitting on the grass in a park', 'f2', { eager: true })}
        ${sello('CLÜSS ✦ Leiden ✦ The Hague ✦ Familia ✦', 'hero-sello', 'data-drag data-spin')}
      </div>
    </div>
  </section>
  <div class="cintas">
    ${cinta(['Conoce gente', 'Celebra la cultura', 'Practica español', 'Ven a los eventos'], 'c1')}
    ${cinta(['La Haya', 'Leiden', 'Familia', 'Hables mucho o poco'], 'c2 cobalto rev')}
  </div>
  <div data-live="home-event" data-fp="${fpHome}">${nextEvents[0] ? eventPoster(nextEvents[0]) : ''}</div>
  <section class="seccion quienes">
    <div class="wrap quienes-grid">
      <div class="quienes-a">
        <h2 class="titular grande" lang="es">¿quiénes <span class="lazo-w">somos?${mark('lazo', 'rojo', 'draw sweep lazo-m')}</span></h2>
        ${en('Who are we?')}
        <div class="quienes-fotos">
          ${foto('campus-spui.jpg', 'Leiden University’s Spui campus building in The Hague', 'qf1', { cap: 'Campus Spui, La Haya' })}
          ${foto('clase.jpg', 'Students in a lecture hall at Leiden University', 'qf2')}
          ${foto('canal.jpg', 'A Dutch canal at dusk', 'qf3')}
        </div>
      </div>
      <div class="quienes-b prosa">
        ${c.home.about.map((p) => `<p>${p}</p>`).join('')}
        ${btn('/team/', 'Conoce al Board')}
      </div>
    </div>
  </section>
  <section class="razones" data-suelo="noche">
    ${trama()}
    <div class="wrap">
      <h2 class="micro razones-k">Why join CLÜSS?</h2>
      <ul class="razones-l">
        ${c.home.reasons.map((r) => `<li><a href="/join-us/"><span class="razon-t" lang="es">${r.es}</span><span class="razon-en"><span aria-hidden="true">EN → </span>${r.en}</span>${foto(r.img, r.alt, 'razon-f')}</a></li>`).join('')}
      </ul>
    </div>
  </section>
  <section class="socios">
    <div class="wrap">
      <h2 class="micro">Nuestras colaboraciones · Our partnerships</h2>
      <ul class="socios-l">
        ${c.partners.map((p) => `<li style="background:${p.bg}"><img src="/img/${p.img}" alt="${p.name}" loading="lazy"></li>`).join('')}
      </ul>
    </div>
  </section>
  <section class="comunidad" data-suelo="rojo">
    <div class="comunidad-in">
      ${titular('únete a la familia.', 'h2', 'ask-t')}
      ${en('Join our community.')}
      <ul class="redes">
        <li><a href="${L.instagram}" target="_blank" rel="noopener"><span class="micro">Instagram</span><b>@clussthehague</b></a></li>
        <li><a href="${L.tiktok}" target="_blank" rel="noopener"><span class="micro">TikTok</span><b>@clussthehague</b></a></li>
        <li><a href="mailto:${L.email}"><span class="micro">Email</span><b class="redes-mail">${L.email}</b></a></li>
      </ul>
      ${sello('Conoce gente ✦ Practica español ✦ Ven ✦', 'negro comunidad-sello', 'data-spin')}
    </div>
  </section>`,
});

pages['/about/committees/'] = () => layout({
  title: 'Committees', active: 'committees', pathName: '/about/committees/',
  desc: c.committeesIntro,
  body: `
  ${pageHead({ lines: ['4 COMITÉS,', '1 FAMILIA.'], suelo: 'azul', enLine: 'Committees. Find your place.', intro: c.committeesIntro, stickers: mark('chispas', 'blanco', 'cab-chispas') })}
  <section class="comites">
    ${c.committees.map((m) => `<article class="comite-card">
      <a href="/about/committees/${m.slug}/" class="comite-bloque" data-suelo="${m.suelo}">
        <h2 class="comite-nombre" lang="es">${m.es}</h2>
        <span class="comite-en">${m.en}</span>
      </a>
      <div class="comite-txt">
        <p>${m.blurb}</p>
        ${btn(`/about/committees/${m.slug}/`, 'Leer más', 'linea')}
      </div>
    </article>`).join('')}
  </section>
  ${askBlock({ title: '¿te vienes?', enLine: 'Pick a committee and help run CLÜSS.', href: L.joinActive, label: 'Únete a un comité' })}`,
});

for (const m of c.committees) {
  pages[`/about/committees/${m.slug}/`] = () => layout({
    title: m.en, active: 'committees', pathName: `/about/committees/${m.slug}/`,
    desc: `${m.tagline} ${m.lead}`,
    body: `
    ${pageHead({ lines: m.cartel, suelo: m.suelo, label: m.es, enLine: m.en, tagline: m.tagline, kicker: 'Comité' })}
    ${m.huellas ? `<div class="huellas-w">${huellas()}</div>` : ''}
    <section class="seccion">
      <div class="wrap dos">
        <div>
          ${titular('¿qué hacemos?')}
          ${en('What we do')}
          <p class="cuerpo mt">${m.lead}</p>
        </div>
        ${lista(m.doing, 'grande')}
      </div>
    </section>
    ${m.blocks.map((b, i) => `<section class="seccion ${i % 2 === 0 ? 'tinte' : ''}">
      <div class="wrap dos">
        <div>
          ${titular(`${b.es}.`, 'h2', 'medio')}
          ${en(b.en)}
        </div>
        <div class="prosa">
          ${b.text ? `<p>${b.text}</p>` : ''}
          ${b.list ? lista(b.list) : ''}
        </div>
      </div>
    </section>`).join('')}
    ${m.calendar ? calendarBlock() : ''}
    <section class="seccion">
      <div class="wrap">
        ${titular('el equipo.', 'h2', 'medio')}
        ${en(`${m.en} team members`)}
        <ul class="roles">${m.roles.map((r) => `<li>${tag(m.tag, r)}</li>`).join('')}</ul>
      </div>
    </section>
    <nav class="otros" aria-label="Other committees">
      ${c.committees.filter((o) => o.slug !== m.slug).map((o) => `<a href="/about/committees/${o.slug}/" data-suelo="${o.suelo}" lang="es">${o.es}<span aria-hidden="true">→</span></a>`).join('')}
    </nav>
    ${askBlock({ title: '¿te vienes?', enLine: 'Join this committee and help run CLÜSS.', href: L.joinActive, label: 'Únete a un comité' })}`,
  });
}

pages['/team/'] = () => layout({
  title: 'Board', active: 'team', pathName: '/team/',
  desc: c.team.intro,
  body: `
  ${pageHead({ lines: ['BOARD'], enLine: 'Meet the board', intro: c.team.intro, stickers: sello('CLÜSS ✦ Leiden ✦ The Hague ✦ Familia ✦', 'cab-sello', 'data-spin') })}
  <section class="seccion junta">
    <div class="wrap">
      ${titular('la junta.')}
      ${en('Executive Board')}
    </div>
    <div class="wrap junta-l">
      ${c.team.board.map((p, i) => `<article class="persona ${i % 2 ? 'par' : ''}">
        ${foto(p.photo, p.name || p.role, 'persona-f', { name: p.name })}
        <div class="persona-t">
          ${pill(p.es, i % 3 === 0 ? 'static' : i % 3 === 1 ? 'static academic' : 'static media', 'lang="es"')}
          <h3 class="persona-n">${p.name || p.role}</h3>
          ${p.name ? `<p class="micro persona-r">${p.role}</p>` : ''}
          <p class="persona-d">${p.duty}</p>
          ${p.bio.map((b) => `<p>${b}</p>`).join('')}
        </div>
      </article>`).join('')}
    </div>
  </section>
  ${askBlock({ title: 'únete al equipo.', enLine: c.team.join, href: L.joinActive, label: 'Quiero colaborar' })}`,
});

pages['/events/'] = () => layout({
  title: 'Events', active: 'events', pathName: '/events/',
  desc: 'Upcoming and past CLÜSS events: embassy visits, cultural celebrations, parties, tournaments and more, in The Hague and Leiden.',
  body: `
  ${pageHead({ lines: ['EVEN', 'TOS'], enLine: 'Events' })}
  <section class="seccion prox-h"><div class="wrap">${titular('próximos eventos.')}${en('Next events')}</div></section>
  <div data-live="next-events" data-fp="${fpEvents}">${nextEvents.length ? nextEvents.map((ev) => eventPoster(ev, { moreLink: false, showText: true, headTag: 'h3', instagram: L.instagram })).join('') : noNextEvents}</div>
  ${calendarBlock()}
  <section class="seccion pasados" data-suelo="noche">
    <div class="wrap">
      ${titular('eventos pasados.')}
      ${en('Past events')}
      <div data-live="past-events" data-fp="${fpEvents}">${pastEvents.map(pastEvent).join('')}</div>
      <div class="galeria">
        ${c.pastPhotos.map((p, i) => foto(p.img, p.alt, `g${i + 1}`)).join('')}
      </div>
      <div class="fila-btn">${btn(L.photos, 'Todas las fotos', 'papel')}</div>
    </div>
  </section>
  ${askBlock({})}`,
});

pages['/join-us/'] = () => layout({
  title: 'Join us', active: 'join', pathName: '/join-us/',
  desc: c.join.intro,
  body: `
  <section class="cabecera unete" data-suelo="rojo">
    <div class="cabecera-in">
      ${cartel(['ÚNE', 'TE.'], { label: 'Únete', join: true })}
      <div class="cabecera-sub">
        <p class="subtitular" lang="es">Hazte parte de la familia.</p>
        ${en('Become part of our community.')}
      </div>
      ${sello('Conoce gente ✦ Practica español ✦ Ven ✦', 'negro cab-sello', 'data-spin')}
    </div>
  </section>
  <section class="seccion">
    <div class="wrap dos">
      <div>
        ${titular('¿por qué CLÜSS?')}
        ${en('Why join CLÜSS?')}
        <p class="cuerpo mt">${c.join.intro}</p>
        ${foto('notas.jpg', 'Hands pinning handwritten notes on a board', 'unete-f')}
      </div>
      <div>
        ${lista(c.join.why, 'grande')}
        <div class="fila-btn mt">${btn(L.joinGeneral, 'Únete')}</div>
      </div>
    </div>
  </section>
  <section class="seccion tipos" data-suelo="noche">
    <div class="wrap">
      ${titular('elige cómo.')}
      ${en('Membership options')}
      <div class="tipos-l">
        ${c.join.options.map((o) => `<article class="ticket grande" data-suelo="dia" style="--notch:var(--negro)">
          <div class="ticket-cuerpo libre">
            <h3 class="ticket-t">${o.name}</h3>
            <p>${o.lead}</p>
            ${lista(o.list)}
            ${btn(L[o.href], 'Únete')}
          </div>
          <div class="talon"><span lang="es">${o.talon}</span></div>
        </article>`).join('')}
      </div>
    </div>
  </section>
  <section class="seccion faq">
    <div class="wrap dos">
      <div class="faq-a">
        ${titular('preguntas frecuentes.', 'h2', 'medio')}
        ${en('Q&amp;A: frequently asked questions')}
      </div>
      <div class="faq-l">
        ${c.join.faq.map(([q, a]) => `<details><summary>${q}<span aria-hidden="true"></span></summary><p>${a}</p></details>`).join('')}
      </div>
    </div>
  </section>
  ${askBlock({ title: '¿te vienes?', enLine: `Ready to join CLÜSS? ${c.join.ready}`, href: L.joinGeneral, label: 'Únete' })}`,
});

pages['/contact/'] = () => layout({
  title: 'Contact', active: 'contact', pathName: '/contact/',
  desc: c.contact.intro,
  body: `
  ${pageHead({ lines: ['HABLE', 'MOS.'], enLine: 'Contact. We’d love to hear from you.', intro: c.contact.intro, label: 'Hablemos', stickers: mark('chispas', 'rojo', 'cab-chispas') })}
  <section class="seccion contacto" data-suelo="azul">
    <div class="wrap">
      ${titular('escríbenos.')}
      ${en('Get in touch')}
      <div class="email-w">
        <a class="email" href="mailto:${L.email}">${L.email}</a>
        <button class="btn papel" type="button" data-copy="${L.email}"><span data-copy-l>Copiar</span></button>
      </div>
      <ul class="contacto-l">
        <li><a href="${L.instagram}" target="_blank" rel="noopener"><span class="micro">Instagram</span><b>@clussthehague</b></a></li>
        <li><a href="${L.tiktok}" target="_blank" rel="noopener"><span class="micro">TikTok</span><b>@clussthehague</b></a></li>
        <li><a href="${L.whatsapp}" target="_blank" rel="noopener"><span class="micro">WhatsApp</span><b>Community</b></a></li>
        <li><a href="${L.linktree}" target="_blank" rel="noopener"><span class="micro">Quick links</span><b>Linktree</b></a></li>
      </ul>
    </div>
  </section>
  ${askBlock({ title: 'hablemos.', enLine: c.contact.outro, href: L.joinGeneral, label: 'Únete' })}`,
});

pages['/blog/'] = () => layout({
  title: 'Blog', active: 'blog', pathName: '/blog/',
  desc: 'News, stories and recaps from CLÜSS, the Spanish-speaking student association in The Hague.',
  body: `
  ${pageHead({ lines: ['BLOG'], enLine: 'Stories, news and recaps from CLÜSS.' })}
  <section class="seccion blog">
    <div class="wrap">
      <div class="entradas" data-live="posts" data-fp="${fpPosts}">${posts.length ? posts.map(postCard).join('') : noPosts}</div>
    </div>
  </section>
  ${askBlock({ title: '¿quieres escribir?', enLine: 'Active members can write for the blog from the members area.', href: '/miembros/', label: 'Área de miembros' })}`,
});

for (const p of posts) {
  pages[`/blog/${p.slug}/`] = () => layout({
    title: esc(p.title), active: 'blog', pathName: `/blog/${p.slug}/`,
    desc: esc(p.excerpt || p.title),
    body: postArticle(p),
  });
}

pages['/miembros/'] = () => layout({
  title: 'Área de miembros', active: 'members', pathName: '/miembros/', noindex: true,
  desc: 'Private area for CLÜSS active members.',
  head: DB ? '<script src="/vendor/supabase.js" defer></script>\n<script type="module" src="/miembros.js"></script>' : '',
  body: `<div class="miembros" id="app" data-configured="${DB ? 'yes' : 'no'}">
    <section class="cabecera" data-suelo="dia"><div class="cabecera-in">
      <p class="micro cabecera-k">CLÜSS</p>
      ${cartel(['MIEM', 'BROS'], { label: 'Área de miembros', join: true })}
      <div class="cabecera-sub">${en('Members area')}
        <p class="cuerpo">${DB ? 'Loading…' : 'The members area is not connected yet. See README.md, “Members area”.'}</p>
      </div>
    </div></section>
  </div>`,
});

const page404 = () => layout({
  title: 'Not found', active: 'none', pathName: '/404.html',
  desc: 'This page does not exist.',
  // A blog post published after the last build has no page yet; the live script draws it here.
  body: `<div data-live="post"></div><section class="cabecera perdido" data-suelo="noche" data-perdido><div class="cabecera-in">
    ${cartel(['AQUÍ', 'NADA.'], { label: 'Aquí nada', join: true })}
    <div class="cabecera-sub">${en('This page does not exist. Some of our old links moved when we left Google Sites.')}
    <div class="fila-btn">${btn('/', 'Volver al inicio', 'papel')}</div></div>
  </div></section>`,
});

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

const urls = Object.keys(pages).filter((r) => r !== '/miembros/').map((r) => `<url><loc>${SITE}${r}</loc></url>`).join('');
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`);
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
