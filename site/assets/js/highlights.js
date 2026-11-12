/* Pharoah · Highlights, Fall-Winter 2026: campaign film, sticky section tabs, shop-the-look drawer, lookbook "+"
   panels and the campaign grid. Reads window.PH (catalog.js); maison.js has already injected the header and footer
   and defined PH.reveal(). */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduce = () => reduceMQ.matches;
  const pad = (n) => String(n).padStart(2, '0');
  const file = (src) => src.split('/').pop();
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------- The looks ----------
     The photo folder holds five wood-room photographs, each saved under two names (night-navy-pinstripe.jpg is
     look-navy-stripe.jpg re-encoded, and so on). PH.looks lists both names, so each photograph is shown once. */
  const SAME = {
    'night-navy-pinstripe.jpg': 'look-navy-stripe.jpg',
    'opp-seated-db.jpg': 'look-blackdb-seated.jpg',
    'room-velvet-sofa.jpg': 'look-zip-sofa.jpg',
    'house-brown-db.jpg': 'look-brown-db.jpg',
    'cover-teal-mirror.jpg': 'look-teal-mirror.jpg',
  };
  // What each photograph shows, for alt text (only what is visible in the frame)
  const SCENE = {
    'look-teal-mirror.jpg': 'beside a gilt mirror in the wood-paneled room',
    'look-brown-db.jpg': 'standing in the wood-paneled room',
    'look-navy-stripe.jpg': 'fastening the jacket in the wood-paneled room',
    'look-blackdb-seated.jpg': 'seated on a wood cabinet',
    'look-zip-sofa.jpg': 'seated on a green velvet sofa',
  };
  const seen = new Set();
  const looks = PH.looks
    .filter((l) => {
      const key = SAME[file(l.img)] || file(l.img);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((l, i) => ({ ...l, n: pad(i + 1), pieces: l.items.map(PH.product).filter(Boolean) }));

  const pieceText = (p) => `${p.color.toLowerCase()} ${p.name.toLowerCase()}`;
  const pieceTitle = (p) => `${p.color} ${p.name}`;
  const countText = (n) => `${n} ${n === 1 ? 'piece' : 'pieces'}`;
  const lookAlt = (l) => {
    const scene = SCENE[file(l.img)];
    return `Look ${l.n}: ${l.pieces.map(pieceText).join(' and ')}${scene ? `, ${scene}` : ''}`;
  };
  const arrow = '<svg class="lb__arrow" viewBox="0 0 16 10" aria-hidden="true"><path d="M0 5h15M11 1l4 4-4 4"/></svg>';

  /* ---------- Film: autoplays muted unless reduced motion is on; pauses itself while off screen ---------- */
  const video = $('[data-film]');
  const toggle = $('[data-film-toggle]');
  if (video && toggle) {
    const word = $('[data-film-word]', toggle);
    let wanted = !reduce();
    const setUI = (playing) => {
      toggle.dataset.state = playing ? 'playing' : 'paused';
      toggle.setAttribute('aria-label', playing ? 'Pause the film' : 'Play the film');
      word.textContent = playing ? 'Pause' : 'Play';
    };
    const play = () => {
      if (!video.getAttribute('src')) {
        const small = window.matchMedia('(max-width: 767px)').matches;
        video.src = `assets/video/pharoah-hero${small ? '-720' : ''}.mp4`;
      }
      const p = video.play();
      if (p && p.catch) p.catch(() => { wanted = false; setUI(false); });
    };
    video.addEventListener('playing', () => { video.classList.add('is-on'); setUI(true); });
    video.addEventListener('pause', () => setUI(false));
    toggle.addEventListener('click', () => {
      if (video.paused) { wanted = true; play(); } else { wanted = false; video.pause(); }
    });
    setUI(false);
    if (wanted) play();
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([en]) => {
        if (!en.isIntersecting && !video.paused) video.pause();
        else if (en.isIntersecting && wanted && video.paused) play();
      }, { threshold: 0.15 }).observe(video.parentElement);
    }
  }

  /* ---------- Shop the Collection ---------- */
  const shopEl = $('[data-shop]');
  if (shopEl) {
    // A closing tile when it completes the last row on both the 3-column and the 2-column grid
    const tile = (looks.length + 1) % 6 === 0 ? `
      <li class="shop__item rv" style="--i:${looks.length % 3}">
        <div class="shop__note">
          <p class="label label--2">Ready-to-Wear</p>
          <p class="shop__note-title">The full collection.</p>
          <p class="shop__note-line">Suits, jackets, outerwear and evening.</p>
          <a class="link" href="collection.html?c=rtw">Shop all<span class="vh"> Ready-to-Wear</span></a>
        </div>
      </li>` : '';
    shopEl.innerHTML = looks.map((l, i) => `
      <li class="shop__item rv" style="--i:${i % 3}">
        <button class="shop__open" type="button" data-open="${i}" aria-haspopup="dialog" aria-label="Shop the look: look ${l.n}, ${esc(l.pieces.map(pieceText).join(' and '))}">
          <img src="${l.img}" alt="" width="1333" height="2000" loading="lazy" decoding="async">
          <span class="shop__cta">Shop the look</span>
        </button>
        <p class="shop__meta"><span class="label">Look ${l.n}</span> <span class="shop__pieces">${esc(l.pieces.map(pieceTitle).join(', '))}</span></p>
      </li>`).join('') + tile;
  }

  /* ---------- The Lookbook ---------- */
  const lbEl = $('[data-lookbook]');
  const setPanel = (btn, open) => {
    btn.setAttribute('aria-expanded', String(open));
    document.getElementById(btn.getAttribute('aria-controls')).classList.toggle('is-open', open);
    if (open) btn.classList.remove('is-hint');
  };
  if (lbEl) {
    lbEl.innerHTML = looks.map((l) => `
      <li class="lb__item" id="look-${l.n}">
        <figure class="lb__fig">
          <div class="lb__media rv wipe">
            <img src="${l.img}" alt="${esc(lookAlt(l))}" width="1333" height="2000" loading="lazy" decoding="async">
            <button class="lb__plus" type="button" aria-expanded="false" aria-controls="look-${l.n}-pieces"><span class="vh">The pieces in look ${l.n}</span><i aria-hidden="true"></i></button>
            <div class="lb__panel" id="look-${l.n}-pieces">
              <p class="lb__panel-head"><span class="label">In this look</span><span class="label label--2">${countText(l.pieces.length)}</span></p>
              <ul>${l.pieces.map((p, k) => `
                <li style="--k:${k}"><a class="lb__piece" href="product.html?id=${p.id}">
                  <img src="${p.images[0]}" alt="" width="1333" height="2000" loading="lazy" decoding="async">
                  <span class="lb__piece-text"><span class="lb__piece-name">${esc(p.name)}</span> <span class="lb__piece-meta">${esc(p.color)} · ${PH.money(p.price)}</span></span>
                  ${arrow}
                </a></li>`).join('')}</ul>
            </div>
          </div>
          <figcaption class="lb__cap"><span class="label">Look ${l.n}</span> <span class="lb__cap-name">${esc(l.pieces.map(pieceTitle).join(', '))}</span></figcaption>
        </figure>
      </li>`).join('');

    lbEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.lb__plus');
      if (btn) setPanel(btn, btn.getAttribute('aria-expanded') !== 'true');
    });
    // Esc inside an open look closes it and puts focus back on its button
    lbEl.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      const media = e.target.closest('.lb__media');
      const btn = media && $('.lb__plus', media);
      if (btn && btn.getAttribute('aria-expanded') === 'true') { e.stopPropagation(); setPanel(btn, false); btn.focus(); }
    });
    // First visit: the first "+" pings a few times so nobody misses it
    const first = $('.lb__plus', lbEl);
    if (first && !reduce() && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(([en]) => {
        if (!en.isIntersecting) return;
        io.disconnect();
        window.setTimeout(() => { if (first.getAttribute('aria-expanded') !== 'true') first.classList.add('is-hint'); }, 900);
      }, { threshold: 0.6 });
      io.observe(first.closest('.lb__media'));
      first.addEventListener('animationend', () => first.classList.remove('is-hint'));
    }
  }

  /* ---------- The Campaign: the five wood-room frames once each, with four detail crops from the same shoot ---------- */
  const CAMPAIGN = [
    ['look-teal-mirror.jpg', 1333, 2000, 'Teal double-breasted suit beside a gilt mirror in the wood-paneled room', '50% 0%'],
    ['detail-brooch.jpg', 900, 400, 'Detail: a jeweled brooch on a teal lapel', '50% 40%', true],
    ['look-navy-stripe.jpg', 1333, 2000, 'Navy pinstripe double-breasted suit with a pink tie in the wood-paneled room'],
    ['look-blackdb-seated.jpg', 1333, 2000, 'Black double-breasted suit with ivory buttons, seated on a wood cabinet'],
    ['detail-buttons.jpg', 925, 411, 'Detail: ivory buttons on a black double-breasted jacket', '50% 60%', true],
    ['look-brown-db.jpg', 1333, 2000, 'Brown double-breasted suit beside a green velvet sofa in the wood-paneled room'],
    ['look-zip-sofa.jpg', 1333, 2000, 'Black zip jacket over a cream shirt, seated on a green velvet sofa'],
    ['detail-cuff.jpg', 985, 437, 'Detail: a hand sets a white shirt cuff against the wood paneling', '50% 50%', true],
    ['detail-zip.jpg', 985, 438, 'Detail: hands at the zip of the black jacket', '50% 50%', true],
  ];
  const cgEl = $('[data-campaign]');
  if (cgEl) {
    cgEl.innerHTML = CAMPAIGN.map(([f, w, h, alt, pos, detail], i) => `
      <li class="cg__item rv wipe${detail ? ' cg__item--detail' : ''}" style="--i:${i % 3}${pos ? `;--pos:${pos}` : ''}">
        <img src="assets/img/${f}" alt="${esc(alt)}" width="${w}" height="${h}" loading="lazy" decoding="async">
      </li>`).join('');
  }

  /* ---------- Shop-the-look drawer: dialog with focus trap, Esc, scrim, focus return ---------- */
  const drawer = $('[data-drawer]');
  if (drawer && shopEl) {
    const panel = $('.drawer__panel', drawer);
    const list = $('[data-drawer-list]', drawer);
    const jump = $('[data-drawer-jump]', drawer);
    const root = document.documentElement;
    let opener = null;
    const isOpen = () => drawer.classList.contains('is-open');
    const setInert = (on) => [...document.body.children].forEach((el) => {
      if (el !== drawer && el.tagName !== 'SCRIPT') el.inert = on;
    });
    const openDrawer = (i, btn) => {
      const l = looks[i];
      $('[data-drawer-kicker]', drawer).textContent = `Look ${l.n} · ${countText(l.pieces.length)}`;
      list.classList.toggle('drawer__list--multi', l.pieces.length > 1);
      list.innerHTML = l.pieces.map((p) => `
        <li class="drawer__item">
          ${PH.cardHTML(p)}
          <a class="btn btn--ghost btn--block" href="product.html?id=${p.id}">View<span class="vh"> the ${esc(pieceText(p))}</span></a>
        </li>`).join('');
      jump.href = `#look-${l.n}`;
      jump.dataset.look = l.n;
      opener = btn;
      root.style.setProperty('--sbw', `${window.innerWidth - root.clientWidth}px`);
      root.classList.add('is-locked');
      setInert(true);
      $('[data-drawer-body]', drawer).scrollTop = 0;
      drawer.classList.add('is-open');
      panel.focus({ preventScroll: true });
    };
    const closeDrawer = (restore = true) => {
      if (!isOpen()) return;
      drawer.classList.remove('is-open');
      setInert(false);
      root.classList.remove('is-locked');
      if (restore && opener) opener.focus({ preventScroll: true });
    };

    shopEl.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-open]');
      if (btn) openDrawer(Number(btn.dataset.open), btn);
    });
    drawer.addEventListener('click', (e) => { if (e.target.closest('[data-drawer-close]')) closeDrawer(); });
    // "See this look in the lookbook": close, travel to the look, open its piece panel
    jump.addEventListener('click', (e) => {
      const item = document.getElementById(`look-${jump.dataset.look}`);
      if (!item) return;
      e.preventDefault();
      closeDrawer(false);
      item.scrollIntoView({ behavior: reduce() ? 'auto' : 'smooth', block: 'start' });
      const btn = $('.lb__plus', item);
      setPanel(btn, true);
      btn.focus({ preventScroll: true });
    });
    document.addEventListener('keydown', (e) => {
      if (!isOpen()) return;
      if (e.key === 'Escape') { e.preventDefault(); closeDrawer(); return; }
      if (e.key !== 'Tab') return;
      const f = $$('a[href], button:not([disabled])', panel);
      if (!f.length) return;
      const firstEl = f[0];
      const lastEl = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === firstEl || document.activeElement === panel)) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus(); }
    });
  }

  /* ---------- Sticky tabs: highlight the section crossing a line 40% down the screen ---------- */
  const tabsList = $('[data-tabs]');
  if (tabsList) {
    const tabs = $$('[data-tab]', tabsList);
    const bar = $('[data-tab-bar]', tabsList);
    const zones = $$('[data-tab-for]');
    const live = new Map();
    let current = '';
    let lockUntil = 0;
    const moveBar = (instant) => {
      const t = tabs.find((a) => a.hash === `#${current}`);
      if (!t) return;
      if (instant) bar.style.transition = 'none';
      bar.style.transform = `translateX(${t.offsetLeft}px) scaleX(${t.offsetWidth})`;
      if (instant) { void bar.offsetWidth; bar.style.transition = ''; }
    };
    const setActive = (id, instant) => {
      if (id === current) return;
      current = id;
      tabs.forEach((a) => {
        if (a.hash === `#${id}`) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
      moveBar(instant);
    };
    const pick = () => {
      const on = zones.filter((z) => live.get(z));
      if (on.length) setActive(on[on.length - 1].dataset.tabFor);
    };
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => live.set(en.target, en.isIntersecting));
        if (performance.now() > lockUntil) pick();
      }, { rootMargin: '-40% 0px -59% 0px' });
      zones.forEach((z) => io.observe(z));
    }
    // A tab click owns the highlight until its scroll lands, so the bar does not stutter through the sections between
    tabs.forEach((a) => a.addEventListener('click', () => {
      setActive(a.hash.slice(1));
      lockUntil = performance.now() + 1200;
      window.setTimeout(pick, 1250);
    }));
    window.addEventListener('scrollend', () => { lockUntil = 0; pick(); });
    setActive(tabs[0].hash.slice(1), true);
    let raf = 0;
    window.addEventListener('resize', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => moveBar(true)); }, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => moveBar(true));
  }

  PH.reveal(document);

  // Arriving on highlights.html#lookbook (mega menu, other pages): the grids were built after the first jump, so land again
  if (location.hash) {
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) {
      requestAnimationFrame(() => {
        const html = document.documentElement;
        html.style.scrollBehavior = 'auto';
        target.scrollIntoView({ block: 'start' });
        html.style.scrollBehavior = '';
      });
    }
  }
})();
