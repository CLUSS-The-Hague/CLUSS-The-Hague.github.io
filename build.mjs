// Builds the static site into dist/. No dependencies: `npm run build`.
import fs from 'node:fs';
import path from 'node:path';
import * as c from './content/site.mjs';

const OUT = 'dist';
const SITE = 'https://www.cluss.nl';
const { links: L } = c;

// ── the real Ü dots, from the design system's sello giratorio ──────────
const PUNTITOS = 'M23.4,7.3C20.9,7.7 18.2,8.4 16.0,9.8C13.8,11.0 11.7,12.9 10.2,15.0C8.8,17.1 7.7,19.7 7.4,22.2C7.0,24.7 7.2,27.5 7.8,30.0C8.4,32.5 9.5,35.1 11.0,37.1C12.5,39.2 14.6,41.1 16.7,42.4C18.9,43.8 21.5,44.9 24.0,45.2C26.6,45.4 29.4,45.2 31.8,44.3C34.1,43.4 36.6,41.9 38.3,40.1C40.1,38.3 41.6,35.8 42.5,33.4C43.4,31.1 43.9,28.3 43.8,25.7C43.8,23.2 43.4,20.4 42.4,18.0C41.5,15.7 39.9,13.3 38.0,11.6C36.2,9.9 33.7,8.5 31.2,7.8C28.9,7.1 26.0,7.0 23.4,7.3ZM71.8,7.2C69.3,7.5 66.6,8.5 64.5,9.9C62.4,11.3 60.5,13.4 59.2,15.5C57.9,17.8 57.1,20.4 56.7,23.0C56.3,25.5 56.3,28.3 56.8,30.8C57.3,33.3 58.2,36.0 59.7,38.0C61.0,40.2 63.1,42.2 65.3,43.4C67.5,44.7 70.3,45.2 72.8,45.4C75.4,45.5 78.2,45.2 80.6,44.3C83.0,43.4 85.4,42.0 87.2,40.2C89.1,38.5 90.7,36.1 91.6,33.7C92.5,31.4 93.0,28.6 92.9,26.1C92.8,23.5 91.9,20.8 90.8,18.5C89.7,16.2 88.2,13.9 86.3,12.1C84.5,10.4 82.0,8.9 79.7,8.1C77.2,7.2 74.4,7.0 71.8,7.2Z';

// ── small pieces ───────────────────────────────────────────────────────
const es = (t) => `<span lang="es">${t}</span>`;
const en = (t, cls = '') => `<p class="traduccion ${cls}"><span aria-hidden="true">EN → </span>${t}</p>`;
const mark = (name, color = 'rojo', cls = '') => `<img class="mark ${cls}" src="/brand/${name}-${color}.svg" alt="" aria-hidden="true" loading="lazy">`;
const ext = (href) => (/^https?:|^mailto:/.test(href) ? ' target="_blank" rel="noopener"' : '');
const btn = (href, label, kind = '') => `<a class="btn ${kind}" href="${href}"${ext(href)}>${label}<span aria-hidden="true" class="btn-a">→</span></a>`;
const tag = (kind, label) => `<span class="comite ${kind}"><i></i>${label}</span>`;
const COMITE = { academic: 'Academic', social: 'Events &amp; Culture', media: 'Communication &amp; Media', sport: 'Sports' };

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

function foto(file, alt, cls = '', opts = {}) {
  const exists = fs.existsSync(path.join('public/img', file));
  if (!exists) {
    const initials = (opts.name || '').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('');
    return `<figure class="foto vacia ${cls}"><div class="foto-in"><svg viewBox="0 0 100 52" aria-hidden="true"><path d="${PUNTITOS}"/></svg>${initials ? `<b>${initials}</b>` : ''}<span>Foto pronto</span></div></figure>`;
  }
  return `<figure class="foto ${cls}"><div class="foto-in"><img src="/img/${file}" alt="${alt}" loading="${opts.eager ? 'eager' : 'lazy'}" decoding="async"></div>${opts.cap ? `<figcaption>${opts.cap}</figcaption>` : ''}</figure>`;
}

// Big poster type. Lines are split by hand, like the posts ("CLÁ / SICO").
// With `join`, the word runs on one line on wide screens and splits on phones.
// The size itself is capped in styles.css (.cartel), by screen width and height.
function cartel(lines, { cls = '', tagName = 'h1', label, join = false } = {}) {
  const longest = Math.max(...lines.map((l) => [...l].length));
  const total = lines.reduce((sum, l) => sum + [...l].length, 0);
  const aria = label ? ` aria-label="${label}"` : '';
  return `<${tagName} class="cartel ${join ? 'unida' : ''} ${cls}" style="--n:${join ? total : longest};--n-m:${longest}" lang="es"${aria}>${lines.map((l) => `<span>${l}</span>`).join('')}</${tagName}>`;
}

const titular = (text, tagName = 'h2', cls = '') => `<${tagName} class="titular ${cls}" lang="es">${text}</${tagName}>`;

const lista = (items, cls = '') => `<ul class="lista ${cls}">${items.map((i) => `<li><svg viewBox="0 0 100 52" aria-hidden="true"><path d="${PUNTITOS}"/></svg><span>${i}</span></li>`).join('')}</ul>`;

function ticketFacts(ev) {
  return `<div class="ticket" data-suelo="${ev.paper || 'noche'}" style="--notch:${ev.notch || 'var(--blanco)'}">
    <dl class="ticket-cuerpo">
      <div><dt>Día</dt><dd>${ev.day}</dd></div>
      <div><dt>Hora</dt><dd>${ev.time}</dd></div>
      <div><dt>Sitio</dt><dd>${ev.place}</dd></div>
    </dl>
    <div class="talon"><span>${ev.talon || COMITE[ev.committee] || 'CLÜSS'}</span></div>
  </div>`;
}

const FLAG_CHILE = `<div class="flag-peg" role="img" aria-label="Bandera de Chile"><svg viewBox="0 0 200 200"><polygon points="196,100 177,121 183,148 157,157 148,183 121,177 100,196 79,177 52,183 43,157 17,148 23,121 4,100 23,79 17,52 43,43 52,17 79,23 100,4 121,23 148,17 157,43 183,52 177,79" fill="#E8322B"/><g transform="rotate(6 100 100)"><rect x="32" y="52" width="136" height="96" rx="4" fill="#F6F3EC" stroke="#111111" stroke-width="2"/><rect x="40" y="60" width="120" height="40" fill="#F6F3EC"/><rect x="40" y="100" width="120" height="40" fill="#E8322B"/><rect x="40" y="60" width="40" height="40" fill="#2B3FE0"/><polygon points="60,67 63.06,75.79 72.36,75.98 64.95,81.61 67.64,90.52 60,85.2 52.36,90.52 55.05,81.61 47.64,75.98 56.94,75.79" fill="#F6F3EC"/><rect x="40" y="60" width="120" height="80" fill="none" stroke="#111111" stroke-width="1.5"/></g></svg></div>`;

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
  ['/about/', 'Nosotros', 'about'],
  ['/about/committees/', 'Comités', 'committees'],
  ['/team/', 'Equipo', 'team'],
  ['/events/', 'Eventos', 'events'],
  ['/contact/', 'Contacto', 'contact'],
];

function layout({ title, desc, active, body, pathName, suelo = 'dia' }) {
  const nav = NAV.map(([h, l, k]) => `<a href="${h}"${k === active ? ' aria-current="page"' : ''} lang="es">${l}</a>`).join('');
  const fullTitle = title ? `${title} · CLÜSS` : 'CLÜSS · Community of Leiden University for Spanish-Speakers';
  const ld = pathName === '/' ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'Organization', name: 'CLÜSS', alternateName: 'Community of Leiden University for Spanish-Speakers', url: SITE, email: L.email, sameAs: [L.instagram, L.tiktok] })}</script>` : '';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${fullTitle}</title>
<meta name="description" content="${desc}">
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
${ld}
</head>
<body class="page-${active}">
<a class="skip" href="#main">Skip to content</a>
<header class="top" data-top>
  <a class="top-logo" href="/" aria-label="CLÜSS, home"><img src="/brand/cluss-rojo.svg" alt="CLÜSS" width="945" height="386"></a>
  <nav class="top-nav" aria-label="Main">${nav}</nav>
  <a class="btn btn-top${active === 'join' ? ' is-here' : ''}" href="/join-us/" lang="es">Únete</a>
  <button class="burger" type="button" aria-expanded="false" aria-controls="menu" data-burger><span class="sr">Menu</span><i></i><i></i></button>
</header>
<div class="menu" id="menu" data-suelo="rojo" hidden>
  <nav aria-label="Mobile">${NAV.map(([h, l, k]) => `<a href="${h}"${k === active ? ' aria-current="page"' : ''} lang="es">${l}</a>`).join('')}<a href="/join-us/" lang="es">Únete</a></nav>
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

// ── events logic ───────────────────────────────────────────────────────
const today = new Date().toISOString().slice(0, 10);
const nextEvents = c.events.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date));
const pastEvents = c.events.filter((e) => e.date < today).sort((a, b) => b.date.localeCompare(a.date));

function eventPoster(ev, { paper = 'dia', notch = 'var(--cobalto)', headTag = 'h2', suelo = 'azul', moreLink = true, showText = false } = {}) {
  const lines = ev.cartel || ev.title.toUpperCase().split(' ').slice(0, 2);
  return `<section class="evento" data-suelo="${suelo}">
    <div class="evento-in">
      ${ev.lead ? `<p class="subtitular evento-lead" lang="es">${ev.lead}</p>` : ''}
      ${cartel(lines, { join: true, tagName: headTag, label: `${ev.lead || ''} ${lines.join('')} ${ev.cartelSmall || ''}`.trim() })}
      <div class="evento-fila">
        ${ev.cartelSmall ? `<p class="evento-small" lang="es" aria-hidden="true"><span class="sub-mark">${ev.cartelSmall}${mark('subrayado', suelo === 'azul' ? 'blanco' : 'rojo', 'draw wipe')}</span></p>` : ''}
        ${ev.flag === 'chile' ? FLAG_CHILE : ''}
      </div>
      <div class="evento-base">
        <div class="evento-txt">
          ${ev.en ? en(ev.en) : ''}
          ${ev.committee ? tag(ev.committee, COMITE[ev.committee]) : ''}
          ${showText && ev.text ? ev.text.map((t) => `<p>${t}</p>`).join('') : ''}
          ${ev.register ? `<div class="fila-btn">${btn(ev.register, 'Apúntate', 'papel')}</div>` : ''}
          ${showText && !ev.register ? `<div class="fila-btn">${btn(L.instagram, 'Instagram', 'papel')}</div>` : ''}
          ${moreLink ? `<div class="fila-btn">${btn('/events/', 'Todos los eventos', 'papel')}</div>` : ''}
        </div>
        ${ticketFacts({ ...ev, paper, notch, talon: ev.talon })}
      </div>
    </div>
  </section>`;
}

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
  ${nextEvents[0] ? eventPoster(nextEvents[0]) : ''}
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
        ${btn('/about/', 'Leer más')}
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

pages['/about/'] = () => layout({
  title: 'About', active: 'about', pathName: '/about/',
  desc: c.about.intro,
  body: `
  ${pageHead({ lines: ['NOSO', 'TROS'], enLine: 'About CLÜSS. Community of Leiden University for Spanish-Speakers.', tagline: c.about.intro, stickers: sello('CLÜSS ✦ Leiden ✦ The Hague ✦ Familia ✦', 'cab-sello', 'data-spin') })}
  <section class="seccion">
    <div class="wrap dos">
      <div>
        <h2 class="titular grande" lang="es">¿quiénes <span class="lazo-w">somos?${mark('lazo', 'rojo', 'draw sweep lazo-m')}</span></h2>
        ${en('Who we are')}
      </div>
      <div class="prosa">
        ${c.about.who.map((p) => `<p>${p}</p>`).join('')}
        ${btn('/team/', 'Conoce al equipo')}
      </div>
    </div>
  </section>
  <section class="seccion mision" data-suelo="azul">
    <div class="wrap">
      ${titular('misión y objetivos.')}
      ${en('Mission &amp; objectives')}
      <ul class="mision-l">
        ${c.about.mission.map((m) => `<li>${mark('estrella', 'blanco')}<span>${m}</span></li>`).join('')}
      </ul>
    </div>
  </section>
  <section class="seccion">
    <div class="wrap dos">
      <div>
        ${titular('4 comités,<br>1 familia.')}
        ${en('Committees &amp; activities')}
      </div>
      <div class="prosa">
        <p>${c.about.committeesTeaser}</p>
        ${btn('/about/committees/', 'Ver los comités')}
      </div>
    </div>
  </section>
  <section class="fotos-tira">
    ${foto('la-haya.jpg', 'The Hague at sunset', 't1')}
    ${foto('campus-spui.jpg', 'Leiden University’s Spui campus building in The Hague', 't2')}
    ${foto('canal.jpg', 'A Dutch canal at dusk', 't3')}
    ${foto('clase.jpg', 'Students in a lecture hall', 't4')}
  </section>
  ${askBlock({})}`,
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
  title: 'Team', active: 'team', pathName: '/team/',
  desc: c.team.intro,
  body: `
  ${pageHead({ lines: ['EQUI', 'PO'], enLine: 'Meet the team', intro: c.team.intro, stickers: sello('CLÜSS ✦ Leiden ✦ The Hague ✦ Familia ✦', 'cab-sello', 'data-spin') })}
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
  ${nextEvents.length ? nextEvents.map((ev) => eventPoster(ev, { moreLink: false, showText: true, headTag: 'h3' })).join('') : `<section class="seccion"><div class="wrap prosa"><p>Nothing is announced right now. Check the calendar below or follow @clussthehague.</p></div></section>`}
  ${calendarBlock()}
  <section class="seccion pasados" data-suelo="noche">
    <div class="wrap">
      ${titular('eventos pasados.')}
      ${en('Past events')}
      ${pastEvents.map((ev) => `<article class="pasado">
        ${ev.img ? foto(ev.img, ev.imgAlt || ev.title, 'pasado-f', { cap: ev.imgCap }) : ''}
        <div class="pasado-t">
          <p class="dato">${ev.day} · ${ev.place}</p>
          <h3 class="medio titular">${ev.title}</h3>
          ${ev.text.map((t) => `<p>${t}</p>`).join('')}
          ${ev.list ? `<p>${ev.listTitle}</p>${lista(ev.list)}` : ''}
          ${ev.article ? `<div class="pasado-art"><p>${ev.article.source} wrote about this visit: “${ev.article.title}”.</p>${btn(ev.article.href, 'Leer el artículo', 'papel')}</div>` : ''}
        </div>
      </article>`).join('')}
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

const page404 = () => layout({
  title: 'Not found', active: 'none', pathName: '/404.html',
  desc: 'This page does not exist.',
  body: `<section class="cabecera perdido" data-suelo="noche"><div class="cabecera-in">
    ${cartel(['AQUÍ', 'NADA.'], { label: 'Aquí nada', join: true })}
    <div class="cabecera-sub">${en('This page does not exist. Some of our old links moved when we left Google Sites.')}
    <div class="fila-btn">${btn('/', 'Volver al inicio', 'papel')}</div></div>
  </div></section>`,
});

// ── write everything ───────────────────────────────────────────────────
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
fs.cpSync('public', OUT, { recursive: true });
fs.copyFileSync('src/styles.css', path.join(OUT, 'styles.css'));
fs.copyFileSync('src/main.js', path.join(OUT, 'main.js'));

for (const [route, render] of Object.entries(pages)) {
  const dir = path.join(OUT, route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), render());
}
fs.writeFileSync(path.join(OUT, '404.html'), page404());

const urls = Object.keys(pages).map((r) => `<url><loc>${SITE}${r}</loc></url>`).join('');
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);

// Old Google Sites addresses keep working. Plain redirect pages work on any host.
const oldUrls = [
  ['/inicio', '/'],
  ['/about-clüss', '/about/'],
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

console.log(`Built ${Object.keys(pages).length + 1} pages into ${OUT}/ (next: ${nextEvents.length}, past: ${pastEvents.length})`);
