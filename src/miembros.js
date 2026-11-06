// CLÜSS members area. Sign in by email; what each person can do is decided by their role,
// and the database enforces the same rules (supabase/schema.sql), so hiding a button is only a courtesy.
import { esc, shortDay, longDate, imgSrc, md } from '/render.mjs';

const app = document.getElementById('app');
const meta = document.querySelector('meta[name="cluss-db"]');

const ROLES = { member: 1, collaborator: 2, editor: 3, admin: 4 };
const ROLE_LABEL = { member: 'Member', collaborator: 'Collaborator', editor: 'Editor', admin: 'Admin' };
const ROLE_HELP = {
  member: 'Sees tasks and links, and updates their own tasks.',
  collaborator: 'Also creates tasks and writes event and blog drafts.',
  editor: 'Also publishes to the website and manages links.',
  admin: 'Also adds people and changes roles.',
};
const COMMITTEES = { '': 'Sin comité', academic: 'Académico', social: 'Eventos y Cultura', media: 'Comunicación y Medios', sport: 'Deportes' };
const STATUS = { todo: 'Por hacer', doing: 'En curso', done: 'Hecho' };

const S = { session: null, me: null, members: [], tab: 'tareas', notice: null, editing: null, taskFilter: 'mine' };
let sb;

// ── helpers ───────────────────────────────────────────────────────────
const can = (min) => !!S.me && ROLES[S.me.role] >= ROLES[min];
const isMe = (email) => !!email && !!S.me && email.toLowerCase() === S.me.email.toLowerCase();
const memberName = (email) => S.members.find((m) => m.email.toLowerCase() === String(email || '').toLowerCase())?.name || email || '';
const opts = (map, value) => Object.entries(map).map(([k, v]) => `<option value="${esc(k)}"${k === (value ?? '') ? ' selected' : ''}>${esc(v)}</option>`).join('');
const slugify = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);

function friendly(error) {
  const m = String(error?.message || error || '');
  if (/not_a_member|Database error saving new user|Signups not allowed/i.test(m)) return 'This email isn’t on the members list. Ask an admin to add you.';
  if (/rate limit|too many|429/i.test(m)) return 'Too many emails were sent. Wait a few minutes and try again.';
  if (/at least one admin/i.test(m)) return 'There must always be at least one admin.';
  if (/only change the status/i.test(m)) return 'You can only change the status of your own tasks.';
  if (/duplicate key.*slug/i.test(m)) return 'Another post already uses that web address. Change the “dirección” field.';
  if (/row-level security|permission denied|violates row-level/i.test(m)) return 'Your role doesn’t allow that. Ask an editor or admin.';
  if (/check constraint/i.test(m)) return 'One of the fields isn’t valid. Links must start with https://';
  if (/Invalid login credentials/i.test(m)) return 'Wrong email or password. No password yet, or forgot it? Use “Send me a link” and set one in Cuenta.';
  if (/Email not confirmed/i.test(m)) return 'This account isn’t confirmed yet. Use “Send me a link” once.';
  if (/should be different from the old/i.test(m)) return 'The new password must be different from the old one.';
  if (/Password should|weak|pwned|leaked/i.test(m)) return 'Choose a stronger password: at least 8 characters, and not one that’s common or has leaked online.';
  if (/reauthentication|nonce/i.test(m)) return 'For safety, sign in again with a link before changing your password.';
  if (/Token has expired|invalid/i.test(m)) return 'That code or link has expired. Ask for a new one.';
  return m || 'Something went wrong. Try again.';
}

function say(text, kind = 'ok') {
  S.notice = { text, kind };
  const box = app.querySelector('[data-notice]');
  if (box) box.outerHTML = noticeHtml();
}
const noticeHtml = () => S.notice
  ? `<div class="m-aviso ${S.notice.kind}" data-notice role="status">${esc(S.notice.text)}<button type="button" class="m-x" data-act="close-notice" aria-label="Cerrar">×</button></div>`
  : '<div data-notice role="status"></div>';

const head = (title, enLine, extra = '') => `
  <section class="cabecera m-cab" data-suelo="dia"><div class="cabecera-in">
    <p class="micro cabecera-k">Área de miembros</p>
    <h1 class="titular grande" lang="es">${title}</h1>
    <p class="traduccion"><span aria-hidden="true">EN → </span>${enLine}</p>
    ${extra}
  </div></section>`;

// Shrinks big phone photos before uploading.
async function uploadImage(file, folder) {
  if (!file || !file.size) return null;
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) throw new Error('Use a JPG, PNG or WebP image.');
  let blob = file;
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, 1800 / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext('2d').drawImage(bmp, 0, 0, canvas.width, canvas.height);
    blob = await new Promise((r) => canvas.toBlob(r, 'image/jpeg', 0.85));
  } catch { /* keep the original file */ }
  if (blob.size > 8 * 1024 * 1024) throw new Error('The image is too large (8 MB maximum).');
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
  const { error } = await sb.storage.from('media').upload(path, blob, { contentType: 'image/jpeg', upsert: false });
  if (error) throw error;
  return sb.storage.from('media').getPublicUrl(path).data.publicUrl;
}

// ── sign in ───────────────────────────────────────────────────────────
function loginView(sentTo = '') {
  app.innerHTML = `
    ${head('entra.', 'Sign in with the email the board has on the members list.')}
    <section class="seccion m-login"><div class="wrap">
      ${noticeHtml()}
      ${sentTo ? `
        <div class="m-caja">
          <h2 class="titular medio" lang="es">revisa tu correo.</h2>
          <p class="cuerpo">We sent a sign-in link to <b>${esc(sentTo)}</b>. Open it on this device. It can take a minute, and may land in spam.</p>
          <form class="m-form" data-form="code">
            <input type="hidden" name="email" value="${esc(sentTo)}">
            <label class="campo"><span>If the email shows a 6-digit code, you can type it here instead</span><input name="token" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" maxlength="6" required></label>
            <div class="fila-btn"><button class="btn" type="submit">Entrar<span aria-hidden="true" class="btn-a">→</span></button>
            <button class="btn linea" type="button" data-act="restart">Usar otro email</button></div>
          </form>
        </div>` : `
        <form class="m-form m-caja" data-form="login">
          <label class="campo"><span>Email</span><input name="email" type="email" autocomplete="username" required placeholder="nombre@ejemplo.com"></label>
          <label class="campo"><span>Contraseña</span><input name="password" type="password" autocomplete="current-password"></label>
          <div class="fila-btn">
            <button class="btn" type="submit" data-mode="password">Entrar<span aria-hidden="true" class="btn-a">→</span></button>
            <button class="btn linea" type="submit" data-mode="link">Enviarme un enlace</button>
          </div>
          <p class="m-nota">First time, or forgot your password? Leave it empty and press <b>Enviarme un enlace</b>, then set a password in <b>Cuenta</b>. Only people on the members list can sign in.</p>
        </form>`}
    </div></section>`;
}

// ── main screen ───────────────────────────────────────────────────────
const TABS = [
  ['tareas', 'Tareas', 'member'],
  ['enlaces', 'Enlaces', 'member'],
  ['eventos', 'Eventos', 'collaborator'],
  ['blog', 'Blog', 'collaborator'],
  ['miembros', 'Miembros', 'member'],
  ['cuenta', 'Cuenta', 'member'],
];

async function render() {
  const tabs = TABS.filter(([, , min]) => can(min));
  if (!tabs.some(([k]) => k === S.tab)) S.tab = 'tareas';
  const body = await ({ tareas: tasksView, enlaces: linksView, eventos: eventsView, blog: postsView, miembros: membersView, cuenta: accountView }[S.tab])();
  app.innerHTML = `
    <section class="cabecera m-cab" data-suelo="dia"><div class="cabecera-in m-top">
      <div>
        <p class="micro cabecera-k">Área de miembros</p>
        <h1 class="titular grande" lang="es">hola, ${esc((S.me.name || S.me.email).split(' ')[0].toLowerCase())}.</h1>
        <p class="traduccion"><span aria-hidden="true">EN → </span>Members area · ${esc(ROLE_LABEL[S.me.role])}</p>
      </div>
      <div class="m-acciones">
        <a class="btn" href="/miembros/firmas/">Firmas de correo<span aria-hidden="true" class="btn-a">→</span></a>
        <button class="btn linea" type="button" data-act="logout">Salir</button>
      </div>
    </div>
    <nav class="m-tabs wrap" aria-label="Secciones">${tabs.map(([k, label]) => `<a href="#${k}"${k === S.tab ? ' aria-current="page"' : ''}>${label}</a>`).join('')}</nav>
    </section>
    <section class="seccion m-cuerpo"><div class="wrap">${noticeHtml()}${body}</div></section>`;
  app.querySelector('[data-focus]')?.focus();
}

// ── tasks ─────────────────────────────────────────────────────────────
async function tasksView() {
  const { data, error } = await sb.from('tasks').select('*').order('due', { nullsFirst: false }).order('created_at', { ascending: false });
  if (error) return `<p>${esc(friendly(error))}</p>`;
  const order = { doing: 0, todo: 1, done: 2 };
  data.sort((a, b) => order[a.status] - order[b.status]);
  const f = S.taskFilter;
  const shown = data.filter((t) => (f === 'done' ? t.status === 'done' : t.status !== 'done') && (f !== 'mine' || isMe(t.assignee)));
  const editing = S.editing?.type === 'task' ? S.editing : null;
  const task = editing ? data.find((t) => t.id === editing.id) || {} : null;
  return `
    <div class="m-barra">
      <div class="m-filtro" role="group" aria-label="Filtro">
        ${[['mine', 'Mis tareas'], ['all', 'Todas'], ['done', 'Hechas']].map(([k, l]) => `<button type="button" class="chip${f === k ? ' on' : ''}" data-act="task-filter" data-v="${k}">${l}</button>`).join('')}
      </div>
      ${can('collaborator') ? '<button class="btn" type="button" data-act="task-new">Nueva tarea<span aria-hidden="true" class="btn-a">+</span></button>' : ''}
    </div>
    ${task ? taskForm(task) : ''}
    ${shown.length ? `<ul class="m-lista">${shown.map(taskRow).join('')}</ul>` : `<p class="m-vacio">${f === 'mine' ? 'Nothing assigned to you right now.' : 'No tasks here.'}</p>`}`;
}

function taskRow(t) {
  const mayStatus = can('collaborator') || isMe(t.assignee);
  const late = t.due && t.status !== 'done' && t.due < new Date().toISOString().slice(0, 10);
  return `<li class="m-fila tarea ${t.status}">
    <div class="m-fila-t">
      <h3>${esc(t.title)}</h3>
      ${t.notes ? `<p>${esc(t.notes)}</p>` : ''}
      <p class="m-meta">${t.assignee ? `${esc(memberName(t.assignee))}` : 'Sin asignar'}${t.due ? ` · <span class="${late ? 'tarde' : ''}">${esc(shortDay(t.due))}</span>` : ''}${t.committee ? ` · ${esc(COMMITTEES[t.committee] || t.committee)}` : ''}</p>
    </div>
    <div class="m-fila-a">
      <label class="sr" for="st-${t.id}">Estado</label>
      <select id="st-${t.id}" data-act="task-status" data-id="${t.id}"${mayStatus ? '' : ' disabled'}>${opts(STATUS, t.status)}</select>
      ${can('collaborator') ? `<button class="m-link" type="button" data-act="task-edit" data-id="${t.id}">Editar</button>` : ''}
      ${can('editor') || isMe(t.created_by) ? `<button class="m-link peligro" type="button" data-act="task-delete" data-id="${t.id}">Borrar</button>` : ''}
    </div>
  </li>`;
}

function taskForm(t) {
  const who = { '': 'Sin asignar', ...Object.fromEntries(S.members.map((m) => [m.email, m.name || m.email])) };
  return `<form class="m-form m-caja" data-form="task" data-id="${t.id || ''}">
    <h2 class="titular medio" lang="es">${t.id ? 'editar tarea.' : 'nueva tarea.'}</h2>
    <label class="campo"><span>Tarea</span><input name="title" required maxlength="200" value="${esc(t.title)}" data-focus></label>
    <label class="campo"><span>Notas</span><textarea name="notes" rows="3" maxlength="4000">${esc(t.notes)}</textarea></label>
    <div class="m-dos">
      <label class="campo"><span>Para</span><select name="assignee">${opts(who, t.assignee || '')}</select></label>
      <label class="campo"><span>Fecha límite</span><input name="due" type="date" value="${esc(t.due)}"></label>
    </div>
    <label class="campo"><span>Comité</span><select name="committee">${opts(COMMITTEES, t.committee || '')}</select></label>
    <div class="fila-btn"><button class="btn" type="submit">Guardar</button><button class="btn linea" type="button" data-act="cancel">Cancelar</button></div>
  </form>`;
}

// ── links ─────────────────────────────────────────────────────────────
async function linksView() {
  const { data, error } = await sb.from('links').select('*').order('category').order('sort').order('title');
  if (error) return `<p>${esc(friendly(error))}</p>`;
  const groups = {};
  for (const l of data) (groups[l.category] ||= []).push(l);
  const editing = S.editing?.type === 'link' ? S.editing : null;
  const link = editing ? data.find((l) => l.id === editing.id) || { category: 'Drive' } : null;
  const cats = [...new Set(['Drive', 'Formularios', 'Herramientas', ...data.map((l) => l.category)])];
  return `
    <div class="m-barra"><p class="m-nota">Drive folders, forms and tools for the team.</p>
      ${can('editor') ? '<button class="btn" type="button" data-act="link-new">Nuevo enlace<span aria-hidden="true" class="btn-a">+</span></button>' : ''}</div>
    ${link ? `<form class="m-form m-caja" data-form="link" data-id="${link.id || ''}">
      <h2 class="titular medio" lang="es">${link.id ? 'editar enlace.' : 'nuevo enlace.'}</h2>
      <label class="campo"><span>Nombre</span><input name="title" required maxlength="120" value="${esc(link.title)}" data-focus></label>
      <label class="campo"><span>Dirección (https://…)</span><input name="url" type="url" required value="${esc(link.url)}" placeholder="https://drive.google.com/…"></label>
      <div class="m-dos">
        <label class="campo"><span>Grupo</span><input name="category" list="cats" required value="${esc(link.category)}"><datalist id="cats">${cats.map((c) => `<option value="${esc(c)}">`).join('')}</datalist></label>
        <label class="campo"><span>Orden</span><input name="sort" type="number" value="${esc(link.sort ?? 0)}"></label>
      </div>
      <label class="campo"><span>Descripción</span><input name="description" maxlength="200" value="${esc(link.description)}"></label>
      <div class="fila-btn"><button class="btn" type="submit">Guardar</button><button class="btn linea" type="button" data-act="cancel">Cancelar</button></div>
    </form>` : ''}
    ${data.length ? Object.entries(groups).map(([cat, items]) => `
      <h2 class="micro m-grupo">${esc(cat)}</h2>
      <ul class="m-enlaces">${items.map((l) => `<li>
        <a href="${esc(l.url)}"${/^https?:/.test(l.url) ? ' target="_blank" rel="noopener"' : ''}><b>${esc(l.title)}</b>${l.description ? `<span>${esc(l.description)}</span>` : ''}</a>
        ${can('editor') ? `<div class="m-fila-a"><button class="m-link" type="button" data-act="link-edit" data-id="${l.id}">Editar</button><button class="m-link peligro" type="button" data-act="link-delete" data-id="${l.id}">Borrar</button></div>` : ''}
      </li>`).join('')}</ul>`).join('') : '<p class="m-vacio">No links yet.</p>'}`;
}

// ── events ────────────────────────────────────────────────────────────
async function eventsView() {
  const { data, error } = await sb.from('events').select('*').order('date', { ascending: false });
  if (error) return `<p>${esc(friendly(error))}</p>`;
  const editing = S.editing?.type === 'event' ? S.editing : null;
  if (editing) return eventForm(data.find((e) => e.id === editing.id) || { committee: '', status: 'draft' });
  const today = new Date().toISOString().slice(0, 10);
  return `
    <div class="m-barra"><p class="m-nota">${can('editor') ? 'Published events appear on the website straight away.' : 'Your events are saved as drafts. An editor publishes them.'}</p>
      <button class="btn" type="button" data-act="event-new">Nuevo evento<span aria-hidden="true" class="btn-a">+</span></button></div>
    ${data.length ? `<ul class="m-lista">${data.map((e) => {
      const mayEdit = can('editor') || (e.status === 'draft' && isMe(e.created_by));
      return `<li class="m-fila">
        <div class="m-fila-t">
          <p class="m-meta"><span class="estado ${e.status}">${e.status === 'published' ? 'Publicado' : 'Borrador'}</span> ${esc(shortDay(e.date))}${e.date < today ? ' · ya pasó' : ''}</p>
          <h3>${esc(e.title)}</h3>
          <p class="m-meta">${esc(e.place)}${e.committee ? ` · ${esc(COMMITTEES[e.committee])}` : ''}</p>
        </div>
        <div class="m-fila-a">
          ${can('editor') ? `<button class="m-link" type="button" data-act="event-toggle" data-id="${e.id}" data-v="${e.status === 'published' ? 'draft' : 'published'}">${e.status === 'published' ? 'Retirar' : 'Publicar'}</button>` : ''}
          ${mayEdit ? `<button class="m-link" type="button" data-act="event-edit" data-id="${e.id}">Editar</button><button class="m-link peligro" type="button" data-act="event-delete" data-id="${e.id}">Borrar</button>` : ''}
        </div>
      </li>`;
    }).join('')}</ul>` : '<p class="m-vacio">No events yet.</p>'}`;
}

function eventForm(e) {
  return `<form class="m-form m-caja ancho" data-form="event" data-id="${e.id || ''}">
    <h2 class="titular medio" lang="es">${e.id ? 'editar evento.' : 'nuevo evento.'}</h2>
    <fieldset><legend class="micro">Lo básico</legend>
      <label class="campo"><span>Título (en inglés, para listas y buscadores)</span><input name="title" required maxlength="160" value="${esc(e.title)}" placeholder="Visit to the Embassy of Chile" data-focus></label>
      <div class="m-tres">
        <label class="campo"><span>Fecha</span><input name="date" type="date" required value="${esc(e.date)}"></label>
        <label class="campo"><span>Hora</span><input name="time" maxlength="40" value="${esc(e.time)}" placeholder="15:00"></label>
        <label class="campo"><span>Comité</span><select name="committee">${opts(COMMITTEES, e.committee || '')}</select></label>
      </div>
      <label class="campo"><span>Lugar</span><input name="place" required maxlength="120" value="${esc(e.place)}" placeholder="Embajada de Chile, La Haya"></label>
      <label class="campo"><span>Enlace para apuntarse (opcional)</span><input name="register_url" type="url" value="${esc(e.register_url)}" placeholder="https://docs.google.com/forms/…"></label>
    </fieldset>
    <fieldset><legend class="micro">El cartel (lo que se ve en grande)</legend>
      <div class="m-tres">
        <label class="campo"><span>Línea de arriba</span><input name="lead" maxlength="60" value="${esc(e.lead)}" placeholder="Visita a la"></label>
        <label class="campo"><span>Palabras grandes, una por línea</span><textarea name="cartel" rows="2" maxlength="60" placeholder="EMBA&#10;JADA">${esc(e.cartel)}</textarea></label>
        <label class="campo"><span>Línea de abajo</span><input name="cartel_small" maxlength="40" value="${esc(e.cartel_small)}" placeholder="de Chile"></label>
      </div>
      <label class="campo"><span>Frase en inglés</span><input name="en" maxlength="200" value="${esc(e.en)}" placeholder="Visit to the Embassy of Chile in The Hague."></label>
      <p class="m-nota">Keep the big words short: one or two words, split long ones across lines. Empty = the title’s first two words.</p>
    </fieldset>
    <fieldset><legend class="micro">Más información (sale en Eventos)</legend>
      <label class="campo"><span>Descripción (deja una línea en blanco entre párrafos)</span><textarea name="body" rows="4">${esc(e.body)}</textarea></label>
      <div class="m-dos">
        <label class="campo"><span>Título de la lista</span><input name="list_title" maxlength="120" value="${esc(e.list_title)}" placeholder="During the visit, students learned about:"></label>
        <label class="campo"><span>Lista, una cosa por línea</span><textarea name="list_items" rows="3">${esc(e.list_items)}</textarea></label>
      </div>
    </fieldset>
    <fieldset><legend class="micro">Foto y prensa (para cuando ya pasó)</legend>
      ${imageField('image', e.image_url)}
      <div class="m-dos">
        <label class="campo"><span>Qué se ve en la foto (para personas ciegas)</span><input name="image_alt" maxlength="200" value="${esc(e.image_alt)}"></label>
        <label class="campo"><span>Pie de foto</span><input name="image_caption" maxlength="160" value="${esc(e.image_caption)}"></label>
      </div>
      <div class="m-tres">
        <label class="campo"><span>Artículo (https://…)</span><input name="article_url" type="url" value="${esc(e.article_url)}"></label>
        <label class="campo"><span>Medio</span><input name="article_source" maxlength="80" value="${esc(e.article_source)}" placeholder="Diplomat Magazine"></label>
        <label class="campo"><span>Título del artículo</span><input name="article_title" maxlength="200" value="${esc(e.article_title)}"></label>
      </div>
    </fieldset>
    ${saveButtons(e)}
  </form>`;
}

// ── blog ──────────────────────────────────────────────────────────────
async function postsView() {
  const { data, error } = await sb.from('posts').select('*').order('created_at', { ascending: false });
  if (error) return `<p>${esc(friendly(error))}</p>`;
  const editing = S.editing?.type === 'post' ? S.editing : null;
  if (editing) return postForm(data.find((p) => p.id === editing.id) || { status: 'draft', author: S.me.name });
  return `
    <div class="m-barra"><p class="m-nota">${can('editor') ? 'Published posts appear on cluss.nl/blog straight away.' : 'Your posts are saved as drafts. An editor publishes them.'}</p>
      <button class="btn" type="button" data-act="post-new">Nueva entrada<span aria-hidden="true" class="btn-a">+</span></button></div>
    ${data.length ? `<ul class="m-lista">${data.map((p) => {
      const mayEdit = can('editor') || (p.status === 'draft' && isMe(p.created_by));
      return `<li class="m-fila">
        <div class="m-fila-t">
          <p class="m-meta"><span class="estado ${p.status}">${p.status === 'published' ? 'Publicado' : 'Borrador'}</span> ${esc(longDate(p.published_at || p.created_at))}${p.author ? ` · ${esc(p.author)}` : ''}</p>
          <h3>${esc(p.title)}</h3>
          ${p.status === 'published' ? `<p class="m-meta"><a href="/blog/${esc(p.slug)}/" target="_blank" rel="noopener">cluss.nl/blog/${esc(p.slug)}</a></p>` : ''}
        </div>
        <div class="m-fila-a">
          ${can('editor') ? `<button class="m-link" type="button" data-act="post-toggle" data-id="${p.id}" data-v="${p.status === 'published' ? 'draft' : 'published'}">${p.status === 'published' ? 'Retirar' : 'Publicar'}</button>` : ''}
          ${mayEdit ? `<button class="m-link" type="button" data-act="post-edit" data-id="${p.id}">Editar</button><button class="m-link peligro" type="button" data-act="post-delete" data-id="${p.id}">Borrar</button>` : ''}
        </div>
      </li>`;
    }).join('')}</ul>` : '<p class="m-vacio">No posts yet. Write the first one.</p>'}`;
}

function postForm(p) {
  return `<form class="m-form m-caja ancho" data-form="post" data-id="${p.id || ''}">
    <h2 class="titular medio" lang="es">${p.id ? 'editar entrada.' : 'nueva entrada.'}</h2>
    <label class="campo"><span>Título</span><input name="title" required maxlength="160" value="${esc(p.title)}" data-focus data-slug-from></label>
    <div class="m-dos">
      <label class="campo"><span>Dirección: cluss.nl/blog/…</span><input name="slug" required maxlength="80" pattern="[a-z0-9]+(-[a-z0-9]+)*" value="${esc(p.slug)}" data-slug${p.slug ? ' data-touched' : ''}></label>
      <label class="campo"><span>Autor</span><input name="author" maxlength="80" value="${esc(p.author)}"></label>
    </div>
    <label class="campo"><span>Resumen (una o dos frases)</span><textarea name="excerpt" rows="2" maxlength="400">${esc(p.excerpt)}</textarea></label>
    <label class="campo"><span>Texto</span><textarea name="body" rows="14" class="m-texto">${esc(p.body)}</textarea></label>
    <p class="m-nota">Blank line = new paragraph. <code>## Título</code> for a heading, <code>**negrita**</code>, <code>*cursiva*</code>, <code>- </code> for a list, <code>[texto](https://…)</code> for a link.</p>
    <details class="m-previa"><summary>Vista previa</summary><div class="articulo-cuerpo" data-preview>${md(p.body)}</div></details>
    ${imageField('cover', p.cover_url)}
    <label class="campo"><span>Qué se ve en la foto (para personas ciegas)</span><input name="cover_alt" maxlength="200" value="${esc(p.cover_alt)}"></label>
    ${saveButtons(p)}
  </form>`;
}

function imageField(name, url) {
  return `<div class="campo m-imagen">
    <span>Foto (JPG o PNG)</span>
    ${url ? `<img src="${esc(imgSrc(url))}" alt="" class="m-mini"><label class="m-check"><input type="checkbox" name="${name}_remove"> Quitar esta foto</label>` : ''}
    <input name="${name}_file" type="file" accept="image/jpeg,image/png,image/webp">
  </div>`;
}

// The first submit button is what Enter presses, so on drafts it is always "save draft".
function saveButtons(row) {
  const published = row.status === 'published';
  return `<div class="fila-btn">
    ${published
      ? `<button class="btn" type="submit" data-status="published">Guardar</button>`
      : `<button class="btn${can('editor') ? ' linea' : ''}" type="submit" data-status="draft">Guardar borrador</button>${can('editor') ? '<button class="btn" type="submit" data-status="published">Publicar</button>' : ''}`}
    <button class="btn linea" type="button" data-act="cancel">Cancelar</button>
  </div>`;
}

// ── account ───────────────────────────────────────────────────────────
function accountView() {
  return `
    <div class="m-barra"><p class="m-nota">Signed in as <b>${esc(S.me.email)}</b> · ${esc(ROLE_LABEL[S.me.role])}</p></div>
    <form class="m-form m-caja" data-form="password">
      <h2 class="titular medio" lang="es">tu contraseña.</h2>
      <p class="m-nota">Set one to sign in with email and password next time. Forgot it later? Sign in with a link and set a new one here.</p>
      <input type="email" name="username" autocomplete="username" value="${esc(S.me.email)}" hidden>
      <label class="campo"><span>Nueva contraseña (mínimo 8 caracteres)</span><input name="password" type="password" autocomplete="new-password" minlength="8" required data-focus></label>
      <label class="campo"><span>Repítela</span><input name="confirm" type="password" autocomplete="new-password" minlength="8" required></label>
      <div class="fila-btn"><button class="btn" type="submit">Guardar contraseña</button></div>
    </form>`;
}

// ── members ───────────────────────────────────────────────────────────
async function membersView() {
  await loadMembers();
  const admin = can('admin');
  return `
    <div class="m-barra"><p class="m-nota">${admin ? 'Add someone here and they can sign in with that email.' : 'Who has access. Admins can change roles.'}</p></div>
    ${admin ? `<form class="m-form m-caja" data-form="member">
      <h2 class="titular medio" lang="es">añadir persona.</h2>
      <div class="m-dos">
        <label class="campo"><span>Email</span><input name="email" type="email" required></label>
        <label class="campo"><span>Nombre</span><input name="name" maxlength="80"></label>
      </div>
      <div class="m-dos">
        <label class="campo"><span>Permiso</span><select name="role">${opts(ROLE_LABEL, 'member')}</select></label>
        <label class="campo"><span>Comité</span><select name="committee">${opts(COMMITTEES, '')}</select></label>
      </div>
      <div class="fila-btn"><button class="btn" type="submit">Añadir</button></div>
    </form>` : ''}
    <dl class="m-roles">${Object.keys(ROLE_LABEL).reverse().map((r) => `<div><dt>${ROLE_LABEL[r]}</dt><dd>${ROLE_HELP[r]}</dd></div>`).join('')}</dl>
    <ul class="m-lista">${S.members.map((m) => `<li class="m-fila">
      <div class="m-fila-t"><h3>${esc(m.name || m.email)}${isMe(m.email) ? ' <span class="m-meta">(tú)</span>' : ''}</h3>
        <p class="m-meta">${esc(m.email)}${m.committee ? ` · ${esc(COMMITTEES[m.committee] || m.committee)}` : ''}</p></div>
      <div class="m-fila-a">
        ${admin ? `<label class="sr" for="r-${esc(m.email)}">Permiso</label><select id="r-${esc(m.email)}" data-act="member-role" data-email="${esc(m.email)}">${opts(ROLE_LABEL, m.role)}</select>
          ${isMe(m.email) ? '' : `<button class="m-link peligro" type="button" data-act="member-delete" data-email="${esc(m.email)}">Quitar</button>`}`
        : `<span class="estado">${esc(ROLE_LABEL[m.role])}</span>`}
      </div>
    </li>`).join('')}</ul>`;
}

async function loadMembers() {
  const { data } = await sb.from('members').select('*').order('name');
  S.members = data || [];
}

// ── saving ────────────────────────────────────────────────────────────
const val = (fd, k) => String(fd.get(k) ?? '').trim();

async function saveForm(form, submitter) {
  const kind = form.dataset.form;
  const id = form.dataset.id || null;
  const fd = new FormData(form);
  const button = submitter || form.querySelector('[type=submit]');
  button && (button.disabled = true);
  try {
    if (kind === 'login') {
      const email = val(fd, 'email').toLowerCase();
      const password = String(fd.get('password') || '');
      if (submitter?.dataset.mode !== 'link') {
        if (!password) throw new Error('Type your password, or press “Enviarme un enlace”.');
        const { error } = await sb.auth.signInWithPassword({ email, password });
        if (error) throw error;
        S.notice = null;
        return; // onAuthStateChange takes over
      }
      const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: `${location.origin}/miembros/`, shouldCreateUser: true } });
      if (error) throw error;
      S.notice = null;
      return loginView(email);
    }
    if (kind === 'code') {
      const { error } = await sb.auth.verifyOtp({ email: val(fd, 'email'), token: val(fd, 'token'), type: 'email' });
      if (error) throw error;
      S.notice = null;
      return; // onAuthStateChange takes over
    }
    if (kind === 'password') {
      const password = String(fd.get('password') || '');
      if (password.length < 8) throw new Error('Password should be at least 8 characters.');
      if (password !== String(fd.get('confirm') || '')) throw new Error('The two passwords don’t match.');
      const { error } = await sb.auth.updateUser({ password });
      if (error) throw error;
      form.reset();
      say('Password saved. Next time, sign in with your email and this password.');
      button && (button.disabled = false);
      return;
    }
    if (kind === 'task') {
      const row = { title: val(fd, 'title'), notes: val(fd, 'notes'), assignee: val(fd, 'assignee') || null, due: val(fd, 'due') || null, committee: val(fd, 'committee') };
      const q = id ? sb.from('tasks').update(row).eq('id', id) : sb.from('tasks').insert(row);
      const { error } = await q;
      if (error) throw error;
      S.editing = null; say(id ? 'Task updated.' : 'Task created.');
    }
    if (kind === 'link') {
      const row = { title: val(fd, 'title'), url: val(fd, 'url'), category: val(fd, 'category') || 'Drive', description: val(fd, 'description'), sort: Number(val(fd, 'sort')) || 0 };
      const { error } = await (id ? sb.from('links').update(row).eq('id', id) : sb.from('links').insert(row));
      if (error) throw error;
      S.editing = null; say('Link saved.');
    }
    if (kind === 'event' || kind === 'post') {
      const status = submitter?.dataset.status === 'published' && can('editor') ? 'published' : 'draft';
      const imgKey = kind === 'event' ? 'image' : 'cover';
      const row = {};
      for (const [k] of fd.entries()) if (!k.endsWith('_file') && !k.endsWith('_remove')) row[k] = val(fd, k);
      const uploaded = await uploadImage(fd.get(`${imgKey}_file`), kind === 'event' ? 'events' : 'blog');
      if (uploaded) row[`${imgKey}_url`] = uploaded;
      else if (fd.get(`${imgKey}_remove`)) row[`${imgKey}_url`] = '';
      row.status = status;
      if (kind === 'post') row.slug = slugify(row.slug || row.title);
      const table = kind === 'event' ? 'events' : 'posts';
      const { error } = await (id ? sb.from(table).update(row).eq('id', id) : sb.from(table).insert(row));
      if (error) throw error;
      S.editing = null;
      say(status === 'published' ? 'Saved and published. It’s on the website now.' : 'Draft saved. An editor can publish it.');
    }
    if (kind === 'member') {
      const row = { email: val(fd, 'email').toLowerCase(), name: val(fd, 'name'), role: val(fd, 'role'), committee: val(fd, 'committee') };
      const { error } = await sb.from('members').insert(row);
      if (error) throw error;
      say(`${row.name || row.email} can now sign in with ${row.email}.`);
    }
    await render();
  } catch (err) {
    button && (button.disabled = false);
    say(friendly(err), 'error');
    if (kind === 'login' || kind === 'code') return;
    app.querySelector('[data-notice]')?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }
}

async function act(el) {
  const a = el.dataset.act;
  const id = el.dataset.id;
  const run = async (promise, okText) => {
    const { error } = await promise;
    if (error) return say(friendly(error), 'error');
    if (okText) S.notice = { text: okText, kind: 'ok' };
    await render();
  };
  // Confirm destructive actions inside the page, by asking for a second click.
  const confirmTwice = () => {
    if (el.dataset.armed) return true;
    const label = el.textContent;
    el.dataset.armed = '1';
    el.textContent = '¿Seguro? Pulsa otra vez';
    setTimeout(() => { if (el.isConnected) { delete el.dataset.armed; el.textContent = label; } }, 4000);
    return false;
  };
  switch (a) {
    case 'close-notice': S.notice = null; app.querySelector('[data-notice]').outerHTML = noticeHtml(); break;
    case 'restart': S.notice = null; loginView(); break;
    case 'logout': await sb.auth.signOut(); break;
    case 'cancel': S.editing = null; S.notice = null; await render(); break;
    case 'task-filter': S.taskFilter = el.dataset.v; await render(); break;
    case 'task-new': S.editing = { type: 'task', id: null }; await render(); break;
    case 'task-edit': S.editing = { type: 'task', id }; await render(); break;
    case 'task-delete': if (confirmTwice()) await run(sb.from('tasks').delete().eq('id', id), 'Task deleted.'); break;
    case 'link-new': S.editing = { type: 'link', id: null }; await render(); break;
    case 'link-edit': S.editing = { type: 'link', id }; await render(); break;
    case 'link-delete': if (confirmTwice()) await run(sb.from('links').delete().eq('id', id), 'Link deleted.'); break;
    case 'event-new': S.editing = { type: 'event', id: null }; S.notice = null; await render(); break;
    case 'event-edit': S.editing = { type: 'event', id }; S.notice = null; await render(); break;
    case 'event-toggle': await run(sb.from('events').update({ status: el.dataset.v }).eq('id', id), el.dataset.v === 'published' ? 'Published. It’s on the website now.' : 'Taken off the website.'); break;
    case 'event-delete': if (confirmTwice()) await run(sb.from('events').delete().eq('id', id), 'Event deleted.'); break;
    case 'post-new': S.editing = { type: 'post', id: null }; S.notice = null; await render(); break;
    case 'post-edit': S.editing = { type: 'post', id }; S.notice = null; await render(); break;
    case 'post-toggle': await run(sb.from('posts').update({ status: el.dataset.v }).eq('id', id), el.dataset.v === 'published' ? 'Published. It’s on cluss.nl/blog now.' : 'Taken off the website.'); break;
    case 'post-delete': if (confirmTwice()) await run(sb.from('posts').delete().eq('id', id), 'Post deleted.'); break;
    case 'member-delete': if (confirmTwice()) await run(sb.from('members').delete().eq('email', el.dataset.email), 'Removed. They can no longer see the members area.'); break;
    default:
  }
}

// ── wiring ────────────────────────────────────────────────────────────
app.addEventListener('submit', (e) => { e.preventDefault(); saveForm(e.target, e.submitter); });
app.addEventListener('click', (e) => { const el = e.target.closest('[data-act]'); if (el && el.tagName !== 'SELECT') { e.preventDefault(); act(el); } });
app.addEventListener('change', async (e) => {
  const el = e.target;
  if (el.dataset.act === 'task-status') {
    const { error } = await sb.from('tasks').update({ status: el.value }).eq('id', el.dataset.id);
    if (error) say(friendly(error), 'error'); else await render();
  }
  if (el.dataset.act === 'member-role') {
    const { error } = await sb.from('members').update({ role: el.value }).eq('email', el.dataset.email);
    if (error) { say(friendly(error), 'error'); await render(); } else { S.notice = { text: 'Role updated.', kind: 'ok' }; await boot(); }
  }
});
app.addEventListener('input', (e) => {
  const el = e.target;
  if (el.matches('[data-slug-from]')) {
    const slug = el.form.querySelector('[data-slug]');
    if (slug && !slug.dataset.touched) slug.value = slugify(el.value);
  }
  if (el.matches('[data-slug]')) el.dataset.touched = '1';
  if (el.name === 'body' && el.form?.dataset.form === 'post') {
    const box = el.form.querySelector('[data-preview]');
    if (box) box.innerHTML = md(el.value);
  }
});
addEventListener('hashchange', () => {
  const tab = location.hash.slice(1);
  if (S.me && TABS.some(([k]) => k === tab)) { S.tab = tab; S.editing = null; S.notice = null; render(); }
});

async function boot() {
  const { data: { session } } = await sb.auth.getSession();
  S.session = session;
  if (!session) return loginView();
  const { data: me } = await sb.from('members').select('*').eq('email', session.user.email.toLowerCase()).maybeSingle();
  if (!me) {
    await sb.auth.signOut();
    S.notice = { text: 'This email isn’t on the members list any more. Ask an admin.', kind: 'error' };
    return loginView();
  }
  S.me = me;
  await loadMembers();
  const tab = location.hash.slice(1);
  if (TABS.some(([k]) => k === tab)) S.tab = tab;
  await render();
}

async function start() {
  for (let i = 0; i < 50 && !window.supabase; i++) await new Promise((r) => setTimeout(r, 100));
  if (!meta || !window.supabase) {
    app.querySelector('.cuerpo').textContent = 'The members area could not load. Check your connection and refresh.';
    return;
  }
  const [url, key] = meta.content.split('|');
  sb = window.supabase.createClient(url, key, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'implicit' } });
  const params = new URLSearchParams(location.hash.slice(1));
  if (params.get('error_description')) S.notice = { text: friendly(params.get('error_description')), kind: 'error' };
  sb.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_IN' && !S.me) { S.notice = null; boot(); }
    if (event === 'SIGNED_OUT') { S.me = null; S.session = null; loginView(); }
  });
  await boot();
}

start();
