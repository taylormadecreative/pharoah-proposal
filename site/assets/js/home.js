/* Home: the film (after the poster, paused offscreen, never for reduced motion or Save-Data), the roster strip, new in. */
(() => {
  const section = document.querySelector('.h-film');
  const video = document.querySelector('[data-film]');
  const toggle = document.querySelector('[data-film-toggle]');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const conn = navigator.connection;
  if (video && !reduce && !(conn && (conn.saveData || /2g$/.test(conn.effectiveType || '')))) {
    const src = window.matchMedia('(max-width: 767px)').matches ? video.dataset.phone : video.dataset.wide;
    let userPaused = false;
    let inView = true;
    const show = (paused) => {
      toggle.hidden = false;
      section.classList.toggle('is-paused', paused);
      toggle.setAttribute('aria-label', paused ? 'Play the film' : 'Pause the film');
    };
    const play = () => { if (userPaused || !inView) return; const p = video.play(); if (p && p.catch) p.catch(() => show(true)); };
    video.addEventListener('playing', () => { section.classList.add('is-playing'); show(false); });
    video.addEventListener('pause', () => { if (userPaused) show(true); });
    toggle.addEventListener('click', () => { if (video.paused) { userPaused = false; play(); } else { userPaused = true; video.pause(); } });
    new IntersectionObserver(([e]) => { inView = e.isIntersecting; if (inView) play(); else if (!video.paused) video.pause(); }, { threshold: 0.05 }).observe(section);
    let begun = false;
    const begin = () => { if (begun) return; begun = true; video.src = src; play(); };
    if (document.readyState === 'complete') begin(); else { window.addEventListener('load', begin, { once: true }); window.setTimeout(begin, 1200); }
  }

  // The film opens: the veil (his name cut out of the paper) grows and fades as the pinned film is scrolled
  const fsec = document.querySelector('[data-filmscroll]');
  const veil = fsec && fsec.querySelector('[data-film-veil]');
  const frame = fsec && fsec.querySelector('[data-film-frame]');
  if (fsec && veil && frame) {
    if (reduce) {
      fsec.classList.add('is-static');
    } else {
      let queued = false;
      const run = () => {
        queued = false;
        const headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 64;
        const stickH = window.innerHeight - headerH;
        const span = Math.max(1, fsec.offsetHeight - stickH);
        const p = Math.min(1, Math.max(0, (headerH - fsec.getBoundingClientRect().top) / span));
        const a = Math.min(1, p / 0.62);                  // the opening takes the first 62% of the pin
        const eased = 1 - Math.pow(1 - a, 3);             // ease-out: fast at first, settling
        // Grow the letters themselves (mask size), never the layer: a 17x-scaled layer is only partly drawn by the
        // browser and leaves a box behind on the way back up.
        const base = Math.min(window.innerWidth * (window.innerWidth < 768 ? 0.94 : 0.86), 1400);
        const size = `${Math.round(base * (1 + eased * 16))}px auto, 100% 100%`;
        veil.style.webkitMaskSize = size;
        veil.style.maskSize = size;
        const o = 1 - Math.min(1, Math.max(0, (a - 0.25) / 0.45));
        veil.style.opacity = o.toFixed(3);
        veil.style.visibility = o < 0.005 ? 'hidden' : 'visible';
        frame.style.transform = `scale(${(1.12 - eased * 0.12).toFixed(4)})`;
        fsec.classList.toggle('is-open', a > 0.85);
      };
      const ask = () => { if (!queued) { queued = true; requestAnimationFrame(run); } };
      window.addEventListener('scroll', ask, { passive: true });
      window.addEventListener('resize', ask, { passive: true });
      run();
    }
  }

  // Ready-to-wear rail: arrows step one tile, and dim at either end
  const rail = document.querySelector('[data-rail]');
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  if (rail && prev && next) {
    const step = () => (rail.querySelector('.h-cat')?.getBoundingClientRect().width || 300) + 14;
    const sync = () => { prev.disabled = rail.scrollLeft < 4; next.disabled = rail.scrollLeft + rail.clientWidth > rail.scrollWidth - 4; };
    const smooth = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    prev.addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: smooth }));
    next.addEventListener('click', () => rail.scrollBy({ left: step(), behavior: smooth }));
    rail.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync, { passive: true });
    sync();
  }

  // The roster: each man's best look
  const strip = document.querySelector('[data-strip]');
  strip.innerHTML = PH.players.slice(0, 9).map((p) => `
    <a href="player.html?p=${p.slug}" class="rv">
      <img src="${p.thumbs[p.best - 1]}" alt="${p.name}, game-day look" width="400" height="560" loading="lazy">
      <span class="card__name">${p.name}</span>
      <span class="card__price">${p.role}</span>
    </a>`).join('');

  // New in: the house line first
  const ids = ['teal-db-suit', 'black-db-suit', 'zip-jacket', 'pinstripe-db-suit'];
  document.querySelector('[data-new]').innerHTML = ids.map((id) => PH.cardHTML(PH.product(id), { cls: 'rv' })).join('');
  PH.reveal();
})();
