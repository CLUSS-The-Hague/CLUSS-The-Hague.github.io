// Keeps events and the blog current without waiting for a rebuild.
// Each live block carries the fingerprint of what the build drew; it is only redrawn when the database says something changed.
import {
  splitEvents, eventPoster, pastEvent, noNextEvents, normPost, postCard, noPosts, postArticle, fingerprint, todayInHague, esc,
} from '/render.mjs';

const meta = document.querySelector('meta[name="cluss-db"]');
if (meta) {
  const [url, key] = meta.content.split('|');
  const get = async (table, query) => {
    const res = await fetch(`${url}/rest/v1/${table}?${query}`, { headers: { apikey: key } });
    if (!res.ok) throw new Error(`${table} ${res.status}`);
    return res.json();
  };
  const swap = (el, fp, html) => {
    if (!el || el.dataset.fp === fp) return;
    el.innerHTML = html;
    el.dataset.fp = fp;
    // Lazy loading doesn't always start for content added after the page loaded.
    el.querySelectorAll('img[loading="lazy"]').forEach((img) => { img.loading = 'eager'; });
  };
  const instagram = document.querySelector('a[href*="instagram.com"]')?.href || '';
  const today = todayInHague();

  const home = document.querySelector('[data-live="home-event"]');
  const nextBox = document.querySelector('[data-live="next-events"]');
  const pastBox = document.querySelector('[data-live="past-events"]');
  if (home || nextBox || pastBox) {
    get('events', 'select=*&status=eq.published&order=date.asc').then((rows) => {
      const { next, past } = splitEvents(rows, today);
      swap(home, fingerprint([today, next[0] || null]), next[0] ? eventPoster(next[0]) : '');
      const fp = fingerprint([today, next, past]);
      swap(nextBox, fp, next.length ? next.map((ev) => eventPoster(ev, { moreLink: false, showText: true, headTag: 'h3', instagram })).join('') : noNextEvents);
      swap(pastBox, fp, past.map(pastEvent).join(''));
    }).catch(() => {});
  }

  const postsBox = document.querySelector('[data-live="posts"]');
  if (postsBox) {
    get('posts', 'select=*&status=eq.published&order=published_at.desc').then((rows) => {
      const posts = rows.map(normPost);
      swap(postsBox, fingerprint(posts), posts.length ? posts.map(postCard).join('') : noPosts);
    }).catch(() => {});
  }

  // A post published after the last build has no page yet, so the 404 page draws it.
  const postBox = document.querySelector('[data-live="post"]');
  const slug = location.pathname.match(/^\/blog\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/)?.[1];
  if (postBox && slug) {
    get('posts', `select=*&status=eq.published&slug=eq.${encodeURIComponent(slug)}&limit=1`).then((rows) => {
      if (!rows.length) return;
      const p = normPost(rows[0]);
      postBox.innerHTML = postArticle(p);
      document.querySelector('[data-perdido]')?.remove();
      document.title = `${p.title} · CLÜSS`;
      document.querySelector('meta[name="description"]')?.setAttribute('content', esc(p.excerpt || p.title));
    }).catch(() => {});
  }
}
