// Shared by the build (Node) and the live site (browser).
// Draws events and blog posts the same way in both places.
// Anything that can come from the members area goes through esc().

export const PUNTITOS = 'M23.4,7.3C20.9,7.7 18.2,8.4 16.0,9.8C13.8,11.0 11.7,12.9 10.2,15.0C8.8,17.1 7.7,19.7 7.4,22.2C7.0,24.7 7.2,27.5 7.8,30.0C8.4,32.5 9.5,35.1 11.0,37.1C12.5,39.2 14.6,41.1 16.7,42.4C18.9,43.8 21.5,44.9 24.0,45.2C26.6,45.4 29.4,45.2 31.8,44.3C34.1,43.4 36.6,41.9 38.3,40.1C40.1,38.3 41.6,35.8 42.5,33.4C43.4,31.1 43.9,28.3 43.8,25.7C43.8,23.2 43.4,20.4 42.4,18.0C41.5,15.7 39.9,13.3 38.0,11.6C36.2,9.9 33.7,8.5 31.2,7.8C28.9,7.1 26.0,7.0 23.4,7.3ZM71.8,7.2C69.3,7.5 66.6,8.5 64.5,9.9C62.4,11.3 60.5,13.4 59.2,15.5C57.9,17.8 57.1,20.4 56.7,23.0C56.3,25.5 56.3,28.3 56.8,30.8C57.3,33.3 58.2,36.0 59.7,38.0C61.0,40.2 63.1,42.2 65.3,43.4C67.5,44.7 70.3,45.2 72.8,45.4C75.4,45.5 78.2,45.2 80.6,44.3C83.0,43.4 85.4,42.0 87.2,40.2C89.1,38.5 90.7,36.1 91.6,33.7C92.5,31.4 93.0,28.6 92.9,26.1C92.8,23.5 91.9,20.8 90.8,18.5C89.7,16.2 88.2,13.9 86.3,12.1C84.5,10.4 82.0,8.9 79.7,8.1C77.2,7.2 74.4,7.0 71.8,7.2Z';

export const COMITE = { academic: 'Academic', social: 'Events &amp; Culture', media: 'Communication &amp; Media', sport: 'Sports' };

export const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// ── small pieces (inputs here are trusted site text unless escaped first) ──
export const en = (t, cls = '') => `<p class="traduccion ${cls}"><span aria-hidden="true">EN → </span>${t}</p>`;
export const mark = (name, color = 'rojo', cls = '') => `<img class="mark ${cls}" src="/brand/${name}-${color}.svg" alt="" aria-hidden="true" loading="lazy">`;
export const ext = (href) => (/^https?:|^mailto:/.test(href) ? ' target="_blank" rel="noopener"' : '');
export const btn = (href, label, kind = '') => `<a class="btn ${kind}" href="${href}"${ext(href)}>${label}<span aria-hidden="true" class="btn-a">→</span></a>`;
export const tag = (kind, label) => `<span class="comite ${kind}"><i></i>${label}</span>`;
export const titular = (text, tagName = 'h2', cls = '') => `<${tagName} class="titular ${cls}" lang="es">${text}</${tagName}>`;
export const lista = (items, cls = '') => `<ul class="lista ${cls}">${items.map((i) => `<li><svg viewBox="0 0 100 52" aria-hidden="true"><path d="${PUNTITOS}"/></svg><span>${i}</span></li>`).join('')}</ul>`;

// Big poster type. With `join`, the word runs on one line on wide screens and splits on phones.
export function cartel(lines, { cls = '', tagName = 'h1', label, join = false } = {}) {
  const longest = Math.max(1, ...lines.map((l) => [...l].length));
  const total = Math.max(1, lines.reduce((sum, l) => sum + [...l].length, 0));
  const aria = label ? ` aria-label="${label}"` : '';
  return `<${tagName} class="cartel ${join ? 'unida' : ''} ${cls}" style="--n:${join ? total : longest};--n-m:${longest}" lang="es"${aria}>${lines.map((l) => `<span>${l}</span>`).join('')}</${tagName}>`;
}

export function fotoTag(src, alt, cls = '', { cap = '', eager = false } = {}) {
  return `<figure class="foto ${cls}"><div class="foto-in"><img src="${src}" alt="${alt}" loading="${eager ? 'eager' : 'lazy'}" decoding="async"></div>${cap ? `<figcaption>${cap}</figcaption>` : ''}</figure>`;
}

export const FLAG_CHILE = `<div class="flag-peg" role="img" aria-label="Bandera de Chile"><svg viewBox="0 0 200 200"><polygon points="196,100 177,121 183,148 157,157 148,183 121,177 100,196 79,177 52,183 43,157 17,148 23,121 4,100 23,79 17,52 43,43 52,17 79,23 100,4 121,23 148,17 157,43 183,52 177,79" fill="#E8322B"/><g transform="rotate(6 100 100)"><rect x="32" y="52" width="136" height="96" rx="4" fill="#F6F3EC" stroke="#111111" stroke-width="2"/><rect x="40" y="60" width="120" height="40" fill="#F6F3EC"/><rect x="40" y="100" width="120" height="40" fill="#E8322B"/><rect x="40" y="60" width="40" height="40" fill="#2B3FE0"/><polygon points="60,67 63.06,75.79 72.36,75.98 64.95,81.61 67.64,90.52 60,85.2 52.36,90.52 55.05,81.61 47.64,75.98 56.94,75.79" fill="#F6F3EC"/><rect x="40" y="60" width="120" height="80" fill="none" stroke="#111111" stroke-width="1.5"/></g></svg></div>`;

// ── dates ─────────────────────────────────────────────────────────────
const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const MESES_LARGOS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

export function todayInHague() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Amsterdam', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

export function shortDay(iso) {
  const [y, m, d] = String(iso).slice(0, 10).split('-').map(Number);
  if (!y || !m || !d) return '';
  const wd = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return `${DIAS[wd]} ${d} ${MESES[m - 1]}`;
}

export function longDate(iso) {
  const [y, m, d] = String(iso).slice(0, 10).split('-').map(Number);
  return y && m && d ? `${d} de ${MESES_LARGOS[m - 1]} de ${y}` : '';
}

// ── data shapes ───────────────────────────────────────────────────────
const lines = (s) => String(s || '').split('\n').map((x) => x.trim()).filter(Boolean);
const paras = (s) => String(s || '').split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean);

export function imgSrc(src) {
  if (!src) return '';
  if (/^https:\/\//.test(src) || src.startsWith('/')) return src;
  return `/img/${src}`;
}

// One shape for events, whether they come from content/site.mjs or the database.
export function normEvent(r) {
  const fromDb = 'register_url' in r || 'cartel_small' in r;
  const e = fromDb ? {
    date: r.date, time: r.time, place: r.place, title: r.title, lead: r.lead, en: r.en,
    cartel: lines(r.cartel), cartelSmall: r.cartel_small, committee: r.committee, register: r.register_url,
    text: paras(r.body), list: lines(r.list_items), listTitle: r.list_title,
    img: r.image_url, imgAlt: r.image_alt, imgCap: r.image_caption, flag: r.flag,
    article: r.article_url ? { href: r.article_url, source: r.article_source, title: r.article_title } : null,
  } : { ...r, cartel: r.cartel || [], text: r.text || [], list: r.list || [], article: r.article || null };
  e.date = String(e.date || '').slice(0, 10);
  e.day = e.day || shortDay(e.date);
  return e;
}

export function splitEvents(events, today = todayInHague()) {
  const all = events.map(normEvent).filter((e) => e.date);
  return {
    next: all.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date)),
    past: all.filter((e) => e.date < today).sort((a, b) => b.date.localeCompare(a.date)),
  };
}

export function normPost(r) {
  return {
    slug: r.slug, title: r.title, excerpt: r.excerpt || '', body: r.body || '', author: r.author || '',
    cover: r.cover_url || '', coverAlt: r.cover_alt || '', date: String(r.published_at || r.created_at || '').slice(0, 10),
  };
}

// A short fingerprint, so the live page only redraws when something changed.
export function fingerprint(value) {
  const s = JSON.stringify(value);
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

// ── events ────────────────────────────────────────────────────────────
function ticketFacts(ev, paper, notch) {
  return `<div class="ticket" data-suelo="${paper}" style="--notch:${notch}">
    <dl class="ticket-cuerpo">
      <div><dt>Día</dt><dd>${esc(ev.day)}</dd></div>
      <div><dt>Hora</dt><dd>${esc(ev.time)}</dd></div>
      <div><dt>Sitio</dt><dd>${esc(ev.place)}</dd></div>
    </dl>
    <div class="talon"><span>${COMITE[ev.committee] || 'CLÜSS'}</span></div>
  </div>`;
}

export function eventPoster(ev, { headTag = 'h2', moreLink = true, showText = false, instagram = '' } = {}) {
  const words = ev.cartel.length ? ev.cartel : String(ev.title).toUpperCase().split(/\s+/).slice(0, 2);
  const cl = words.map(esc);
  const label = esc(`${ev.lead || ''} ${words.join('')} ${ev.cartelSmall || ''}`.trim());
  return `<section class="evento" data-suelo="azul">
    <div class="evento-in">
      ${ev.lead ? `<p class="subtitular evento-lead" lang="es">${esc(ev.lead)}</p>` : ''}
      ${cartel(cl, { join: true, tagName: headTag, label })}
      <div class="evento-fila">
        ${ev.cartelSmall ? `<p class="evento-small" lang="es" aria-hidden="true"><span class="sub-mark">${esc(ev.cartelSmall)}${mark('subrayado', 'blanco', 'draw wipe')}</span></p>` : ''}
        ${ev.flag === 'chile' ? FLAG_CHILE : ''}
      </div>
      <div class="evento-base">
        <div class="evento-txt">
          ${ev.en ? en(esc(ev.en)) : ''}
          ${COMITE[ev.committee] ? tag(ev.committee, COMITE[ev.committee]) : ''}
          ${showText ? ev.text.map((t) => `<p>${esc(t)}</p>`).join('') : ''}
          ${ev.register ? `<div class="fila-btn">${btn(esc(ev.register), 'Apúntate', 'papel')}</div>` : ''}
          ${showText && !ev.register && instagram ? `<div class="fila-btn">${btn(instagram, 'Instagram', 'papel')}</div>` : ''}
          ${moreLink ? `<div class="fila-btn">${btn('/events/', 'Todos los eventos', 'papel')}</div>` : ''}
        </div>
        ${ticketFacts(ev, 'dia', 'var(--cobalto)')}
      </div>
    </div>
  </section>`;
}

export function pastEvent(ev) {
  return `<article class="pasado">
    ${ev.img ? fotoTag(esc(imgSrc(ev.img)), esc(ev.imgAlt || ev.title), 'pasado-f', { cap: esc(ev.imgCap) }) : ''}
    <div class="pasado-t">
      <p class="dato">${esc(ev.day)} · ${esc(ev.place)}</p>
      <h3 class="medio titular">${esc(ev.title)}</h3>
      ${ev.text.map((t) => `<p>${esc(t)}</p>`).join('')}
      ${ev.list.length ? `${ev.listTitle ? `<p>${esc(ev.listTitle)}</p>` : ''}${lista(ev.list.map(esc))}` : ''}
      ${ev.article ? `<div class="pasado-art"><p>${esc(ev.article.source || 'The press')} wrote about this: “${esc(ev.article.title || ev.title)}”.</p>${btn(esc(ev.article.href), 'Leer el artículo', 'papel')}</div>` : ''}
    </div>
  </article>`;
}

export const noNextEvents = `<section class="seccion"><div class="wrap prosa"><p>Nothing is announced right now. Check the calendar below or follow @clussthehague.</p></div></section>`;

// ── blog ──────────────────────────────────────────────────────────────
// A small, safe Markdown: paragraphs, ## headings, lists, **bold**, *italics*, [links](https://…).
export function md(src) {
  const inline = (t) => esc(t)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[\s(])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+|\/[^\s)]*)\)/g, (m, text, url) => `<a href="${url}"${ext(url)}>${text}</a>`);
  const out = [];
  for (const block of String(src || '').replace(/\r/g, '').split(/\n\s*\n/)) {
    const b = block.trim();
    if (!b) continue;
    const rows = b.split('\n');
    if (/^#{2,3}\s/.test(b) && rows.length === 1) {
      const level = b.startsWith('###') ? 3 : 2;
      out.push(`<h${level}>${inline(b.replace(/^#{2,3}\s+/, ''))}</h${level}>`);
    } else if (rows.every((r) => /^\s*[-*]\s+/.test(r))) {
      out.push(`<ul>${rows.map((r) => `<li>${inline(r.replace(/^\s*[-*]\s+/, ''))}</li>`).join('')}</ul>`);
    } else if (rows.every((r) => /^\s*\d+[.)]\s+/.test(r))) {
      out.push(`<ol>${rows.map((r) => `<li>${inline(r.replace(/^\s*\d+[.)]\s+/, ''))}</li>`).join('')}</ol>`);
    } else if (rows.every((r) => /^>\s?/.test(r))) {
      out.push(`<blockquote><p>${rows.map((r) => inline(r.replace(/^>\s?/, ''))).join('<br>')}</p></blockquote>`);
    } else {
      out.push(`<p>${rows.map(inline).join('<br>')}</p>`);
    }
  }
  return out.join('\n');
}

export function postCard(p, i = 0) {
  const href = `/blog/${encodeURIComponent(p.slug)}/`;
  return `<article class="entrada">
    <a class="entrada-a" href="${href}">
      ${p.cover ? fotoTag(esc(imgSrc(p.cover)), esc(p.coverAlt || p.title), `entrada-f ${i % 2 ? 'alt' : ''}`) : ''}
      <span class="dato entrada-d">${esc(longDate(p.date))}${p.author ? ` · ${esc(p.author)}` : ''}</span>
      <h2 class="entrada-t">${esc(p.title)}</h2>
      ${p.excerpt ? `<p class="entrada-x">${esc(p.excerpt)}</p>` : ''}
    </a>
  </article>`;
}

export const noPosts = `<p class="cuerpo vacio-blog">No posts yet. The first one is on its way.</p>`;

export function postArticle(p) {
  return `<article class="articulo">
    <header class="articulo-cab wrap">
      <p class="dato">${esc(longDate(p.date))}${p.author ? ` · ${esc(p.author)}` : ''}</p>
      <h1 class="titular grande articulo-t">${esc(p.title)}</h1>
      ${p.excerpt ? `<p class="subtitular articulo-x">${esc(p.excerpt)}</p>` : ''}
    </header>
    ${p.cover ? `<div class="wrap articulo-f">${fotoTag(esc(imgSrc(p.cover)), esc(p.coverAlt || p.title), '', { eager: true })}</div>` : ''}
    <div class="wrap"><div class="articulo-cuerpo">${md(p.body)}</div>
    <div class="fila-btn">${btn('/blog/', 'Más del blog', 'linea')}</div></div>
  </article>`;
}
