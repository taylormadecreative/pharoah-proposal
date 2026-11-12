/* Pharoah · Who Wears Pharoah: the roster (players.html) and the ambassador page (player.html?p=slug).
   Names, roles and photo counts come only from PH.players; a look is named in alt text only when PH.products
   lists that exact photo as worn by him. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pad = (n) => String(n).padStart(2, '0');
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const looksText = (n) => `${n} ${n === 1 ? 'look' : 'looks'}`;
  const groupOf = (pl) => {
    if (/College/.test(pl.role)) return 'college';
    if (/NFL Network|Front Office/.test(pl.role)) return 'air';
    return 'players';
  };
  const wornAt = (pl, i) => PH.products.find((p) => p.worn === pl.slug && p.images[0] === pl.photos[i]);
  const article = (w) => (/^[aeiou]/i.test(w) ? 'an' : 'a');
  const altFor = (pl, i) => {
    const p = wornAt(pl, i);
    return p
      ? `${pl.name} arriving in ${article(p.color)} ${p.color.toLowerCase()} ${p.name.toLowerCase()}`
      : `${pl.name}, game-day look ${i + 1}`;
  };
  // Full-size tunnel photos are mostly 714px wide; the -sm thumbs are 400px
  const srcset = (pl, i) => `${pl.thumbs[i]} 400w, ${pl.photos[i]} 714w`;
  const SIZES = '(max-width: 767px) 50vw, 25vw';
  const LEAD_SIZES = '(max-width: 767px) 100vw, 50vw';
  const photo = (pl, i, { alt = '', sizes = SIZES, eager = false, on = false } = {}) =>
    `<img${on ? ' class="is-on"' : ''} src="${pl.thumbs[i]}" srcset="${srcset(pl, i)}" sizes="${sizes}" alt="${esc(alt)}" width="400" height="560" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
  const arrowL = '<svg viewBox="0 0 16 10" aria-hidden="true"><path d="M16 5H1M5 1L1 5l4 4"/></svg>';
  const arrowR = '<svg viewBox="0 0 16 10" aria-hidden="true"><path d="M0 5h15M11 1l4 4-4 4"/></svg>';

  /* A player card. The lead card (roster only) stacks all his photos and turns through them;
     every other card swaps to his next photo on hover. */
  const media = (pl, lead, eager) => {
    const b = pl.best - 1;
    if (lead && pl.count > 1 && !reduce) {
      const order = Array.from({ length: pl.count }, (_, k) => (b + k) % pl.count);
      return `<span class="pc__media" data-cycle>${order.map((i, k) => photo(pl, i, { alt: k === 0 ? altFor(pl, i) : '', sizes: LEAD_SIZES, eager: eager && k === 0, on: k === 0 })).join('')}<span class="pc__tick" aria-hidden="true"><span data-tick>01</span> / ${pad(pl.count)}</span></span>`;
    }
    const sizes = lead ? LEAD_SIZES : SIZES;
    const swap = pl.count > 1 ? photo(pl, pl.best % pl.count, { sizes }) : '';
    return `<span class="pc__media">${photo(pl, b, { alt: altFor(pl, b), sizes, eager })}${swap}</span>`;
  };
  const card = (pl, i, { lead = false, eager = false } = {}) => `
    <li class="pc rv${lead ? ' is-lead' : ''}" data-slug="${pl.slug}" data-group="${groupOf(pl)}" style="--i:${i % 4}">
      <a class="pc__link" href="player.html?p=${pl.slug}">
        ${media(pl, lead, eager)}
        <span class="pc__body">
          <span class="pc__row"><span class="pc__name">${esc(pl.name)}</span> <span class="pc__count">${looksText(pl.count)}</span></span>
          <span class="pc__role">${esc(pl.role)}</span>
        </span>
      </a>
    </li>`;

  /* ---------- players.html ---------- */
  const rosterEl = $('[data-roster]');
  if (rosterEl) {
    const LEAD_MIN = 5; // a lead needs four cards beside it to fill its two rows
    rosterEl.innerHTML = PH.players.map((pl, i) => card(pl, i, { lead: i === 0 && PH.players.length >= LEAD_MIN, eager: i === 0 })).join('');
    let leadEl = $('.pc.is-lead', rosterEl);

    // Lead cycle: only while on screen, the tab is visible, and nobody is pointing at or focused on it
    let inView = false;
    let hold = false;
    const io = 'IntersectionObserver' in window ? new IntersectionObserver(([en]) => { inView = en.isIntersecting; }, { threshold: 0.3 }) : null;
    const watchLead = () => {
      if (!io) { inView = true; return; }
      io.disconnect();
      inView = false;
      if (leadEl) io.observe(leadEl);
    };
    const step = () => {
      if (!leadEl || hold || !inView || document.hidden) return;
      const m = $('.pc__media[data-cycle]', leadEl);
      if (!m) return;
      const imgs = $$('img', m);
      const cur = Math.max(0, imgs.findIndex((x) => x.classList.contains('is-on')));
      const next = (cur + 1) % imgs.length;
      imgs[cur].classList.remove('is-on');
      imgs[next].classList.add('is-on');
      const tick = $('[data-tick]', m);
      if (tick) tick.textContent = pad(next + 1);
    };
    if (!reduce) window.setInterval(step, 3200);
    watchLead();
    const holdFrom = (e) => { hold = !!leadEl && leadEl.contains(e.target); };
    rosterEl.addEventListener('pointerover', holdFrom);
    rosterEl.addEventListener('pointerleave', () => { hold = false; });
    rosterEl.addEventListener('focusin', holdFrom);
    rosterEl.addEventListener('focusout', () => { hold = false; });

    const setLead = (el) => {
      if (el === leadEl) return;
      if (leadEl) {
        leadEl.classList.remove('is-lead');
        $('.pc__media', leadEl).outerHTML = media(PH.player(leadEl.dataset.slug), false, false);
      }
      leadEl = el;
      if (el) {
        el.classList.add('is-lead');
        $('.pc__media', el).outerHTML = media(PH.player(el.dataset.slug), true, false);
      }
      watchLead();
    };

    // Role filters
    const chips = $$('[data-filter]');
    const status = $('[data-roster-status]');
    const counts = { all: PH.players.length, players: 0, college: 0, air: 0 };
    PH.players.forEach((pl) => { counts[groupOf(pl)] += 1; });
    $$('[data-n]').forEach((el) => { el.textContent = counts[el.dataset.n]; });
    const apply = (group) => {
      const cards = $$('.pc', rosterEl);
      const shown = cards.filter((el) => group === 'all' || el.dataset.group === group);
      cards.forEach((el) => { el.hidden = !shown.includes(el); });
      setLead(shown.length >= LEAD_MIN ? shown[0] : null);
      shown.forEach((el, k) => {
        el.classList.add('in');
        if (reduce) return;
        el.style.setProperty('--d', `${Math.min(k, 8) * 30}ms`);
        el.classList.remove('is-shown');
        void el.offsetWidth;
        el.classList.add('is-shown');
      });
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.filter === group)));
      if (status) status.textContent = `Showing ${shown.length} of ${cards.length}`;
    };
    chips.forEach((c) => c.addEventListener('click', () => apply(c.dataset.filter)));
    PH.reveal(rosterEl);
  }

  /* ---------- player.html ---------- */
  const main = $('[data-player]');
  if (main) {
    const pl = PH.player(new URLSearchParams(location.search).get('p')) || PH.players[0];
    const at = PH.players.indexOf(pl);
    const b = pl.best - 1;
    const others = [1, 2, 3, 4].map((k) => PH.players[(at + k) % PH.players.length]);
    const pieces = PH.products.filter((p) => p.worn === pl.slug);
    document.title = `${pl.name} · Who Wears Pharoah · Pharoah, New York`;

    const shop = pieces.length
      ? `<ul class="pcards">${pieces.map((p, i) => `<li class="rv" style="--i:${i % 4}">${PH.cardHTML(p)}</li>`).join('')}</ul>`
      : `<p class="shl__empty">Pieces from his looks are added as the catalog loads.</p>
         <h3 class="title shl__sub">Shop the collection</h3>
         <ul class="pcards">${PH.products.slice(0, 4).map((p, i) => `<li class="rv" style="--i:${i}">${PH.cardHTML(p)}</li>`).join('')}</ul>`;

    main.innerHTML = `
      <section class="ph" aria-labelledby="ph-name">
        <a class="ph__back" href="players.html">${arrowL}<span>Who Wears Pharoah</span></a>
        <div class="ph__media"><img src="${pl.photos[b]}" srcset="${srcset(pl, b)}" sizes="(max-width: 767px) 100vw, 50vw" alt="${esc(altFor(pl, b))}" width="1000" height="1400" fetchpriority="high" decoding="async"></div>
        <div class="ph__id">
          <p class="label label--2 ph__role">${esc(pl.role)}</p>
          <h1 class="ph__name" id="ph-name">${pl.name.split(' ').map((w, k) => `<span class="w" style="--i:${k}">${esc(w)}</span>`).join(' ')}</h1>
          <p class="ph__count">${looksText(pl.count)}</p>
          <a class="btn" href="#shop">Shop his looks</a>
        </div>
      </section>

      <section class="sec" aria-labelledby="gd-title">
        <div class="wrap gd__head">
          <h2 class="sec__title" id="gd-title">Game Day</h2>
          <div class="gd__ctrl" data-strip-ctrl hidden>
            <p class="gd__count" aria-hidden="true"><span data-strip-now>01</span> / ${pad(pl.count)}</p>
            <button class="rbtn" type="button" data-strip-prev aria-controls="strip" aria-label="Previous photos">${arrowL}</button>
            <button class="rbtn" type="button" data-strip-next aria-controls="strip" aria-label="Next photos">${arrowR}</button>
          </div>
        </div>
        <ul class="strip" id="strip" tabindex="0" aria-label="${esc(pl.name)}, game-day photos">
          ${pl.photos.map((src, i) => {
            const p = wornAt(pl, i);
            return `
            <li class="strip__item rv" style="--i:${Math.min(i, 4)}">
              <figure>
                <div class="strip__media"><img src="${pl.thumbs[i]}" srcset="${srcset(pl, i)}" sizes="(max-width: 767px) 84vw, (max-width: 1023px) 42vw, 28vw" alt="${esc(altFor(pl, i))}" width="1000" height="1400" loading="lazy" decoding="async"></div>
                <figcaption class="strip__cap">
                  <span class="label">Look ${pad(i + 1)}</span>
                  ${p ? `<a class="link" href="product.html?id=${p.id}">Shop<span class="vh"> the ${esc(p.color.toLowerCase())} ${esc(p.name.toLowerCase())}</span></a> <span class="strip__name">${esc(p.color)} ${esc(p.name)}</span>` : ''}
                </figcaption>
              </figure>
            </li>`;
          }).join('')}
        </ul>
      </section>

      <section class="sec" aria-labelledby="bts-title">
        <div class="wrap">
          <header class="sec__head"><h2 class="sec__title" id="bts-title">Behind the Scenes</h2></header>
          <div class="frame rv wipe">
            <img src="assets/img/detail-cuff.jpg" alt="" width="985" height="437" loading="lazy" decoding="async">
            <span class="tag">Placeholder</span>
            <p class="frame__label">Fitting and BTS footage from Pharoah’s team goes here</p>
          </div>
        </div>
      </section>

      <section class="sec" id="shop" aria-labelledby="shop-title">
        <div class="wrap">
          <header class="sec__head">
            <h2 class="sec__title" id="shop-title">Shop His Looks</h2>
            ${pieces.length ? `<p class="sec__note">${pieces.length} ${pieces.length === 1 ? 'piece' : 'pieces'} from his game-day looks</p>` : ''}
          </header>
          ${shop}
        </div>
      </section>

      <section class="sec sec--last" aria-labelledby="more-title">
        <div class="wrap">
          <header class="sec__head">
            <h2 class="sec__title" id="more-title">More from the Roster</h2>
            <a class="link" href="players.html">View the roster</a>
          </header>
          <ul class="pcards">${others.map((o, i) => card(o, i)).join('')}</ul>
        </div>
      </section>`;

    // Game-day strip: prev/next by one photo, counter = last photo fully in view
    const strip = $('#strip', main);
    const ctrl = $('[data-strip-ctrl]', main);
    const prev = $('[data-strip-prev]', main);
    const next = $('[data-strip-next]', main);
    const now = $('[data-strip-now]', main);
    const items = $$('.strip__item', strip);
    const update = () => {
      const max = strip.scrollWidth - strip.clientWidth;
      ctrl.hidden = max <= 2;
      const r = strip.getBoundingClientRect();
      let last = 0;
      items.forEach((it, i) => {
        const box = it.getBoundingClientRect();
        if (box.left >= r.left - 2 && box.right <= r.right + 2) last = i;
      });
      now.textContent = pad(last + 1);
      prev.setAttribute('aria-disabled', String(strip.scrollLeft <= 2));
      next.setAttribute('aria-disabled', String(strip.scrollLeft >= max - 2));
    };
    // Step to the neighbouring photo (not a fixed distance: the end of the strip is not a snap point,
    // so a fixed step back from the end would skip one)
    const by = (dir) => {
      const edge = parseFloat(getComputedStyle(strip).paddingLeft) || 0;
      const first = items.findIndex((it) => it.offsetLeft - edge >= strip.scrollLeft - 2);
      const target = items[Math.min(items.length - 1, Math.max(0, (first < 0 ? items.length - 1 : first) + dir))];
      strip.scrollTo({ left: target.offsetLeft - edge, behavior: reduce ? 'auto' : 'smooth' });
    };
    prev.addEventListener('click', () => { if (prev.getAttribute('aria-disabled') !== 'true') by(-1); });
    next.addEventListener('click', () => { if (next.getAttribute('aria-disabled') !== 'true') by(1); });
    let raf = 0;
    const later = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    strip.addEventListener('scroll', later, { passive: true });
    window.addEventListener('resize', later, { passive: true });
    update();

    PH.reveal(main);
  }
})();
