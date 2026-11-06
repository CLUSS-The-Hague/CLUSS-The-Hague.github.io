// CLÜSS site behaviour. Everything is readable with this file switched off.
(() => {
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // ── menu ───────────────────────────────────────────────
  const top = document.querySelector('[data-top]');
  const burger = document.querySelector('[data-burger]');
  const menu = document.getElementById('menu');
  const setMenu = (open) => {
    burger.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (open) top?.classList.remove('oculto');
  };
  burger?.addEventListener('click', () => setMenu(menu.hidden));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu && !menu.hidden) { setMenu(false); burger.focus(); } });

  // ── "Iniciar sesión" becomes "Área de miembros" for people already signed in ──
  try {
    if (Object.keys(localStorage).some((k) => /^sb-.+-auth-token$/.test(k))) {
      for (const a of $$('[data-sesion]')) a.textContent = 'Área de miembros';
    }
  } catch { /* storage blocked: keep the default label */ }

  // ── top bar steps aside on the way down ────────────────
  let last = scrollY;

  // ── sellos turn as you scroll ──────────────────────────
  const spins = $$('[data-spin] .giro');

  let ticking = false;
  const frame = () => {
    ticking = false;
    const y = scrollY;
    if (top && menu?.hidden) {
      if (y > last + 6 && y > 200) top.classList.add('oculto');
      else if (y < last - 6 || y <= 200) top.classList.remove('oculto');
    }
    last = y;
    if (calm) return;
    for (const g of spins) g.style.setProperty('--giro-s', `${y * 0.16}deg`);
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  frame();

  // ── la línea draws itself the first time you see it ────
  if (!calm && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.remove('pre'); io.unobserve(e.target); }
    }, { rootMargin: '0px 0px -12% 0px' });
    for (const el of $$('.draw')) {
      if (el.getBoundingClientRect().top > innerHeight * 0.88) { el.classList.add('pre'); io.observe(el); }
    }
  }

  // ── stickers can be peeled off and moved ───────────────
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    for (const el of $$('[data-drag]')) {
      let sx = 0, sy = 0, dx = 0, dy = 0, on = false;
      el.addEventListener('pointerdown', (e) => { on = true; sx = e.clientX - dx; sy = e.clientY - dy; el.setPointerCapture(e.pointerId); el.classList.add('agarrado'); });
      el.addEventListener('pointermove', (e) => { if (!on) return; dx = e.clientX - sx; dy = e.clientY - sy; el.style.translate = `${dx}px ${dy}px`; });
      const end = () => { on = false; el.classList.remove('agarrado'); };
      el.addEventListener('pointerup', end);
      el.addEventListener('pointercancel', end);
    }
  } else {
    for (const el of $$('[data-drag]')) { el.removeAttribute('data-drag'); }
  }

  // ── copy the email address ─────────────────────────────
  for (const b of $$('[data-copy]')) {
    b.addEventListener('click', async () => {
      const label = b.querySelector('[data-copy-l]');
      try { await navigator.clipboard.writeText(b.dataset.copy); label.textContent = '¡Copiado!'; }
      catch { label.textContent = b.dataset.copy; }
      setTimeout(() => { label.textContent = 'Copiar'; }, 2000);
    });
  }
})();
