/* Pharoah · Product page (Tom Ford and Saint Laurent conventions).
   ?id= product id (falls back to the first piece). Desktop: every photo stacked full width, buying panel sticky.
   Phone: swipe gallery with a counter, bottom bar with price and Add to bag. Fabric, origin, care and policy are
   never written here: those lines say where his real details load from. */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const p = PH.product(new URLSearchParams(location.search).get('id')) || PH.products[0];
  const top = PH.menu.shoes.items.some(([k]) => k === p.cat) ? 'shoes' : 'rtw';
  const menu = PH.menu[top];
  const catLabel = PH.catName(p.cat) || menu.label;
  const player = p.worn ? PH.player(p.worn) : null;
  const tone = p.color.toLowerCase();
  const n = p.images.length;
  document.title = `${p.name}, ${p.color} · Pharoah`;

  /* Photo sizes, so every frame reserves its space before the photo arrives. Unlisted files follow their
     folder's ratio: his studio and editorial photos are 2:3, the game-day photos 5:7. */
  const DIMS = {
    'detail-brooch': [900, 400], 'detail-buttons': [925, 411], 'detail-cuff': [985, 437], 'detail-zip': [985, 438],
    'look-01': [685, 1800], 'look-02': [670, 1800], 'look-03': [770, 1800],
    'kirk-street': [1500, 2000], 'kirk-velvet': [1440, 1920], 'kirk-field': [608, 760],
  };
  const dims = (src) => {
    const file = src.split('/').pop().replace(/\.\w+$/, '');
    return DIMS[file] || (src.includes('/nfl/') ? [1000, 1400] : [1333, 2000]);
  };
  const kind = ([w, h]) => (w / h > 1.2 ? 'wide' : w / h < 0.5 ? 'tall' : 'std');
  const altOf = (i) => {
    const file = p.images[i].split('/').pop();
    if (i === 0) return player ? `${player.name} wearing the ${p.name} in ${tone}` : `${p.name} in ${tone}`;
    if (file.startsWith('detail-')) return `${p.name} in ${tone}, detail`;
    return `${p.name} in ${tone}, view ${i + 1} of ${n}`;
  };

  /* ---------- Gallery ---------- */
  const track = $('[data-track]');
  const counter = $('[data-counter]');
  track.innerHTML = p.images.map((src, i) => {
    const [w, h] = dims(src);
    const load = i === 0 ? 'loading="eager" fetchpriority="high"' : 'loading="lazy" decoding="async"';
    return `<figure class="pdp-fig is-${kind([w, h])}"><button type="button" class="pdp-zoom" data-zoom="${i}"><span class="vh">Enlarge: </span><img src="${src}" alt="${esc(altOf(i))}" width="${w}" height="${h}" ${load}></button></figure>`;
  }).join('');
  track.classList.toggle('is-single', n === 1);
  if (n > 1) {
    counter.hidden = false;
    counter.innerHTML = `<span data-i>1</span> / ${n}`;
    const iEl = $('[data-i]', counter);
    let raf = 0;
    track.addEventListener('scroll', () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const w = track.firstElementChild.getBoundingClientRect().width + 2 || 1;
        iEl.textContent = String(Math.min(n, Math.round(track.scrollLeft / w) + 1));
      });
    }, { passive: true });
  }

  /* ---------- Panel ---------- */
  $('[data-crumbs]').innerHTML = [[`collection.html?c=${top}`, menu.label], [`collection.html?c=${p.cat}`, catLabel]]
    .map(([href, label]) => `<li><a href="${href}">${esc(label)}</a></li>`).join('');
  $('[data-name]').textContent = p.name;
  $('[data-price]').textContent = PH.money(p.price);
  if (p.concept) { // a concept render standing in for his photography
    const note = document.createElement('p');
    note.className = 'pdp-concept';
    note.textContent = 'Concept image. His own photography replaces it.';
    $('[data-price]').after(note);
  }

  const colorName = $('[data-color-name]');
  colorName.textContent = p.color;
  const soon = p.colors.filter((x) => x.soon);
  $('[data-colors]').innerHTML = p.colors.map((x) => `
    <label class="pdp-sw${x.soon ? ' is-soon' : ''}" title="${esc(x.color)}${x.soon ? ', photos coming' : ''}">
      <input type="radio" name="color" value="${esc(x.color)}"${x.color === p.color ? ' checked' : ''}${x.soon ? ' disabled' : ''}>
      <span class="pdp-sw__dot" style="--sw:${x.hex}"></span><span class="vh">${esc(x.color)}${x.soon ? ', photos coming' : ''}</span>
    </label>`).join('') + (soon.length ? `<p class="pdp-soon">${esc(soon.map((x) => x.color).join(', '))}: Photos coming</p>` : '');
  $('[data-colors]').addEventListener('change', (e) => {
    if (e.target.name !== 'color') return;
    const c = p.colors.find((x) => x.color === e.target.value);
    if (c && c.id && c.id !== p.id) { location.href = `product.html?id=${c.id}`; return; } // each colorway has its own page
    colorName.textContent = e.target.value;
  });

  const sizesEl = $('[data-sizes]');
  sizesEl.innerHTML = p.sizes.map((s) => `<label class="pdp-size"><input type="radio" name="size" value="${s}"><span>${s}</span></label>`).join('');

  /* ---------- Add to bag ---------- */
  const form = $('[data-form]');
  const err = $('[data-err]');
  const addBtn = $('[data-add]');
  const barEl = $('[data-bar]');
  const barAdd = $('[data-bar-add]');
  const barSize = $('[data-bar-size]');
  const live = $('[data-live]');
  const sizeOf = () => { const r = $('input[name="size"]:checked', form); return r ? r.value : ''; };
  const syncBar = () => { barSize.textContent = sizeOf() ? `Size ${sizeOf()}` : 'Select a size'; };

  const showErr = (fromBar) => {
    err.textContent = 'Select a size.';
    sizesEl.classList.add('is-err');
    if (fromBar) $('[data-size-fs]').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    const first = $('input', sizesEl);
    if (first) first.focus({ preventScroll: true });
  };
  sizesEl.addEventListener('change', () => { err.textContent = ''; sizesEl.classList.remove('is-err'); syncBar(); sgMark(); });

  const flash = (btn) => {
    window.clearTimeout(btn.phT);
    btn.textContent = 'Added';
    btn.phT = window.setTimeout(() => { btn.textContent = 'Add to bag'; }, 1600);
  };

  /* Confirmation panel */
  const added = $('[data-added]');
  const addedImg = $('[data-added-img]');
  addedImg.loading = 'lazy';
  addedImg.src = p.images[0];
  $('[data-added-name]').textContent = p.name;
  let hideT = 0;
  let hovering = false;
  const hideAdded = (force) => {
    window.clearTimeout(hideT);
    if (!force && (hovering || added.contains(document.activeElement))) { hideT = window.setTimeout(() => hideAdded(), 1500); return; }
    if (added.contains(document.activeElement)) addBtn.focus({ preventScroll: true });
    added.classList.remove('is-on');
    added.inert = true;
  };
  const showAdded = (size) => {
    $('[data-added-meta]').textContent = `${p.color} · Size ${size} · ${PH.money(p.price)}`;
    added.inert = false;
    added.classList.add('is-on');
    window.clearTimeout(hideT);
    hideT = window.setTimeout(() => hideAdded(), 5000);
  };
  added.addEventListener('pointerenter', () => { hovering = true; });
  added.addEventListener('pointerleave', () => { hovering = false; });
  added.addEventListener('click', (e) => { if (e.target.closest('[data-added-close]')) { hovering = false; hideAdded(true); } });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && added.classList.contains('is-on')) hideAdded(true); });

  const add = (fromBar) => {
    const size = sizeOf();
    if (!size) { showErr(fromBar); return; }
    PH.addToBag();
    flash(addBtn);
    flash(barAdd);
    showAdded(size);
    live.textContent = '';
    window.setTimeout(() => { live.textContent = `Added to your bag: ${p.name}, ${p.color}, size ${size}.`; }, 60);
  };
  form.addEventListener('submit', (e) => { e.preventDefault(); add(false); });
  barAdd.addEventListener('click', () => add(true));

  /* Phone bar: shows whenever the panel's own button is out of view */
  $('[data-bar-name]').textContent = p.name;
  $('[data-bar-price]').textContent = PH.money(p.price);
  syncBar();
  const setBar = (on) => {
    barEl.classList.toggle('is-on', on);
    barEl.inert = !on;
    document.body.classList.toggle('has-bar', on);
  };
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([en]) => setBar(!en.isIntersecting), { rootMargin: '0px 0px -72px 0px' }).observe(addBtn);
  }

  /* Desktop: the panel sticks under the header; when it is taller than the window it sticks by its foot. */
  const panel = $('[data-panel]');
  const fitPanel = () => {
    const hdr = document.querySelector('[data-hdr]');
    const h = hdr ? hdr.offsetHeight : 64;
    panel.style.setProperty('--panel-top', `${Math.min(h, window.innerHeight - panel.offsetHeight)}px`);
  };
  if ('ResizeObserver' in window) new ResizeObserver(fitPanel).observe(panel);
  window.addEventListener('resize', fitPanel, { passive: true });
  fitPanel();

  /* ---------- Dialogs: size guide drawer and image viewer (native, focus trapped and returned) ---------- */
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const modal = (dlg, { first, ms }) => {
    let opener = null;
    const open = () => {
      if (dlg.open) return;
      opener = document.activeElement;
      dlg.showModal();
      document.documentElement.classList.add('is-locked');
      $(first, dlg).focus();
      requestAnimationFrame(() => requestAnimationFrame(() => dlg.classList.add('is-open')));
    };
    const close = () => {
      if (!dlg.open) return;
      dlg.classList.remove('is-open');
      window.setTimeout(() => { if (dlg.open) dlg.close(); }, reduce ? 0 : ms);
    };
    dlg.addEventListener('cancel', (e) => { e.preventDefault(); close(); });
    dlg.addEventListener('close', () => {
      dlg.classList.remove('is-open');
      document.documentElement.classList.remove('is-locked');
      if (opener && opener.isConnected) opener.focus({ preventScroll: true });
    });
    dlg.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) close(); });
    dlg.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const f = $$(FOCUSABLE, dlg).filter((el) => el.getClientRects().length);
      if (!f.length) return;
      const a = f[0];
      const z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    });
    return { open, close };
  };

  /* Size guide: a sample chart, clearly labeled as one */
  const sgDlg = $('[data-sizeguide]');
  const sgRows = $('[data-sg-rows]');
  sgRows.innerHTML = p.sizes.map((s) => {
    const v = Number(s);
    return `<tr data-s="${s}"><td>${s}</td><td>${v + 10}</td><td>${v}</td><td>${Math.round(v * 2.54)}</td></tr>`;
  }).join('');
  const sgMark = () => $$('tr', sgRows).forEach((tr) => tr.classList.toggle('is-on', tr.dataset.s === sizeOf()));
  const guide = modal(sgDlg, { first: '.dr__x', ms: 280 });
  $$('[data-guide]').forEach((b) => b.addEventListener('click', () => { sgMark(); guide.open(); }));

  /* Viewer: one photo at a time, contained, with arrows and keys */
  const vDlg = $('[data-viewer]');
  const vImg = $('[data-viewer-img]');
  const vCount = $('[data-viewer-count]');
  vImg.loading = 'lazy';
  let vi = 0;
  const vShow = (i) => {
    vi = (i + n) % n;
    const [w, h] = dims(p.images[vi]);
    const swap = () => {
      vImg.width = w;
      vImg.height = h;
      vImg.src = p.images[vi];
      vImg.alt = altOf(vi);
      vCount.textContent = n > 1 ? `${vi + 1} / ${n}` : '';
      vImg.classList.remove('is-swap');
    };
    if (!vDlg.open || reduce) { swap(); return; }
    vImg.classList.add('is-swap');
    window.setTimeout(swap, 140);
  };
  $$('.viewer__nav', vDlg).forEach((b) => { b.hidden = n < 2; b.addEventListener('click', () => vShow(vi + Number(b.dataset.viewerStep))); });
  vDlg.addEventListener('keydown', (e) => {
    if (n < 2) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); vShow(vi + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); vShow(vi - 1); }
  });
  const viewer = modal(vDlg, { first: '.viewer__x', ms: 220 });
  track.addEventListener('click', (e) => {
    const b = e.target.closest('[data-zoom]');
    if (!b) return;
    vShow(Number(b.dataset.zoom));
    viewer.open();
  });

  /* ---------- Worn on game day ---------- */
  if (player) {
    const used = new Set(PH.products.flatMap((x) => x.images));
    const pool = player.photos.map((src, k) => ({ src, thumb: player.thumbs[k] })).filter((x) => !p.images.includes(x.src));
    const picks = [...pool.filter((x) => !used.has(x.src)), ...pool.filter((x) => used.has(x.src))].slice(0, 3);
    const href = `player.html?p=${player.slug}`;
    const worn = $('[data-worn]');
    worn.innerHTML = `
      <div class="pdp-worn__head">
        <div>
          <p class="label">Worn on game day</p>
          <h2 class="pdp-worn__name" id="worn-title">${esc(player.name)}</h2>
          <p class="label label--2 pdp-worn__role">${esc(player.role)}</p>
        </div>
        <a class="link" href="${href}">See his looks</a>
      </div>
      ${picks.length ? `<ul class="pdp-worn__photos">${picks.map((x) => `
        <li><a href="${href}" tabindex="-1" aria-hidden="true"><img src="${x.thumb}" alt="" width="400" height="560" loading="lazy" decoding="async"></a></li>`).join('')}</ul>` : ''}`;
    // Fewer than three other photos: the words take the empty columns beside them, so the block still composes.
    if (picks.length && picks.length < 3) {
      worn.classList.add('is-short', `is-n${picks.length}`);
      worn.append($('.pdp-worn__head', worn));
    }
    worn.style.setProperty('--n', String(picks.length || 1));
    worn.classList.add('rv');
    worn.hidden = false;
  }

  /* ---------- You may also like ---------- */
  const inTop = (x) => (top === 'shoes' ? PH.menu.shoes : PH.menu.rtw).items.some(([k]) => k === x.cat);
  const others = PH.products.filter((x) => x.id !== p.id);
  const more = [...others.filter((x) => x.cat === p.cat), ...others.filter((x) => x.cat !== p.cat && inTop(x)), ...others.filter((x) => !inTop(x))].slice(0, 4);
  $('[data-more]').innerHTML = more.map((x) => PH.cardHTML(x)).join('');
  const moreLink = $('[data-more-link]');
  moreLink.href = `collection.html?c=${p.cat}`;
  moreLink.textContent = `View ${catLabel}`;
  $('.pdp-more__head').classList.add('rv');

  PH.reveal();
})();
