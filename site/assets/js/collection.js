/* Pharoah · Collection page (product listing, Saint Laurent conventions).
   ?c= rtw | shoes | a subcategory key from PH.menu. Filters (color, price, size), sort and grid density apply
   instantly and mirror into the URL. One editorial tile joins the grid after the sixth piece, placed so the grid
   never shows a hole. Empty categories show placeholder frames and say where his pieces load from; no product
   is ever invented here. */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const slug = (s) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const qs = new URLSearchParams(location.search);
  const M = PH.menu;
  const TOPS = ['rtw', 'shoes'];

  /* ---------- Category ---------- */
  const topOf = (k) => (TOPS.includes(k) ? k : TOPS.find((t) => M[t].items.some(([key]) => key === k)));
  let c = qs.get('c') || 'rtw';
  if (!topOf(c)) c = 'rtw';
  const top = topOf(c);
  const menu = M[top];
  const isTop = c === top;
  const subKeys = menu.items.map(([k]) => k);
  const name = isTop ? menu.label : PH.catName(c);
  const base = PH.products.filter((p) => (isTop ? subKeys.includes(p.cat) : p.cat === c));
  document.title = `${name} · Pharoah`;

  const plp = $('[data-plp]');
  const grid = $('[data-grid]');
  const bar = $('[data-bar]');
  const countEl = $('[data-count]');

  /* ---------- Head: breadcrumb, title, subcategory row ---------- */
  const crumbs = isTop ? [['index.html', 'Home'], [null, menu.label]] : [[`collection.html?c=${top}`, menu.label], [null, name]];
  $('[data-crumbs]').innerHTML = crumbs
    .map(([href, label]) => `<li>${href ? `<a href="${href}">${esc(label)}</a>` : `<span aria-current="page">${esc(label)}</span>`}</li>`)
    .join('');
  $('[data-title]').textContent = name;

  const subnav = $('[data-subnav]');
  subnav.innerHTML = [[top, 'View All'], ...menu.items]
    .map(([k, label]) => `<li><a href="collection.html?c=${k}" data-k="${k}"${k === c ? ' aria-current="page"' : ''}>${esc(label)}</a></li>`)
    .join('');
  // Phones: bring the current subcategory to the start of the row (never a word cut at the left edge),
  // and fade the right edge while more remains.
  const current = $('[aria-current]', subnav);
  const pad = () => parseFloat(getComputedStyle(subnav).paddingLeft) || 0;
  if (current && subnav.scrollWidth > subnav.clientWidth && current.parentElement !== subnav.firstElementChild) {
    subnav.scrollLeft += current.getBoundingClientRect().left - subnav.getBoundingClientRect().left - pad();
  }
  const edge = () => {
    const more = subnav.scrollLeft + subnav.clientWidth < subnav.scrollWidth - 2;
    subnav.classList.toggle('is-more', more);
    subnav.classList.toggle('is-scrolled', subnav.scrollLeft > 2);
  };
  subnav.addEventListener('scroll', edge, { passive: true });
  window.addEventListener('resize', edge, { passive: true });
  edge();

  /* ---------- Empty category: frames waiting for his photos ---------- */
  if (!base.length) {
    const NOUN = {
      'leather-jackets': 'leather jackets', shirts: 'shirts', denim: 'denim', 'pants-shorts': 'pants and shorts',
      sneakers: 'sneakers', loafers: 'loafers', boots: 'boots', 'lace-ups': 'lace-ups', 'monk-straps': 'monk straps', 'evening-shoes': 'evening shoes',
    };
    const noun = NOUN[c] || (name || '').toLowerCase().replace(/&/g, 'and');
    const line = c === 'shoes'
      ? 'His 15 to 20 shoe styles load here from his product sheet and Google Drive.'
      : `His ${noun} ${c === 'denim' ? 'loads' : 'load'} here from his product sheet and Google Drive.`;
    const note = document.createElement('div');
    note.className = 'plp-note';
    note.innerHTML = `<div class="plp-note__in"><p>${esc(line)}</p><a class="link" href="collection.html?c=rtw">View Ready-to-Wear</a></div>`;
    bar.replaceWith(note);
    countEl.hidden = true;
    grid.dataset.anim = reduce ? '0' : '1';
    grid.setAttribute('aria-hidden', 'true');
    grid.innerHTML = Array.from({ length: 4 }, (_, i) => `
      <div class="ph" style="--i:${i}">
        <div class="ph__media"><span class="label label--2">Photo coming</span></div>
        <div class="ph__lines"><i></i><i></i></div>
      </div>`).join('');
    return;
  }

  /* ---------- Filter options, derived from the pieces in this category ---------- */
  const shown = (p) => p.colors.filter((x) => !x.soon); // a color without photos yet is not offered as a filter
  const colorOpts = [];
  base.forEach((p) => shown(p).forEach((x) => {
    const k = slug(x.color);
    if (!colorOpts.some((o) => o.k === k)) colorOpts.push({ k, label: x.color, hex: x.hex });
  }));

  // Price ranges in $500 steps, kept only where pieces exist: sample data gives Under $1,500 / $1,500 and up.
  const STEP = 500;
  const floorTo = (n) => Math.floor(n / STEP) * STEP;
  const mins = [...new Set(base.map((p) => floorTo(p.price)))].sort((a, b) => a - b);
  const priceOpts = mins.map((min, i) => {
    const max = min + STEP;
    const first = i === 0;
    const last = i === mins.length - 1;
    return {
      k: first ? `under-${max}` : last ? `${min}-up` : `${min}-${max}`,
      label: first ? `Under ${PH.money(max)}` : last ? `${PH.money(min)} and up` : `${PH.money(min)} to ${PH.money(max)}`,
      min,
    };
  });
  const priceKey = (p) => (priceOpts.find((o) => o.min === floorTo(p.price)) || {}).k;
  const usePrice = priceOpts.length > 1;

  const sizeOpts = [...new Set(base.flatMap((p) => p.sizes))].sort((a, b) => parseFloat(a) - parseFloat(b));

  /* ---------- State (from the URL) ---------- */
  const pick = (key, keys) => new Set((qs.get(key) || '').split(',').filter((v) => keys.includes(v)));
  const SORTS = ['featured', 'price-asc', 'price-desc'];
  const state = {
    color: pick('color', colorOpts.map((o) => o.k)),
    price: usePrice ? pick('price', priceOpts.map((o) => o.k)) : new Set(),
    size: pick('size', sizeOpts),
    sort: SORTS.includes(qs.get('sort')) ? qs.get('sort') : 'featured',
    view: qs.get('view') === 'large' ? 'large' : 'default',
  };
  const GROUPS = ['color', 'price', 'size'];
  const optHas = {
    color: (p, k) => shown(p).some((x) => slug(x.color) === k),
    price: (p, k) => priceKey(p) === k,
    size: (p, k) => p.sizes.includes(k),
  };
  // Within a group: any. Across groups: all. `skip` leaves one group out for facet counts.
  const matches = (p, skip) => GROUPS.every((g) => g === skip || !state[g].size || [...state[g]].some((k) => optHas[g](p, k)));
  const facet = (g, k) => base.filter((p) => matches(p, g) && optHas[g](p, k)).length;
  const activeCount = () => GROUPS.reduce((n, g) => n + state[g].size, 0);
  const results = () => {
    const list = base.filter((p) => matches(p));
    if (state.sort === 'featured') return list;
    const dir = state.sort === 'price-asc' ? 1 : -1;
    return list.map((p, i) => [p, i]).sort((a, b) => (a[0].price - b[0].price) * dir || a[1] - b[1]).map(([p]) => p);
  };

  /* ---------- Editorial tile placement ----------
     Simulates CSS grid auto-placement for each candidate (position x size) and keeps the one with no holes
     inside the grid, closest to "after the sixth piece", two columns wide, two rows tall when it can be. */
  const simulate = (n, cols, idx, w, h) => {
    const taken = new Set();
    const tileRows = [];
    let row = 0;
    let col = 0;
    const fits = (r0, c0, sw, sh) => {
      if (c0 + sw > cols) return false;
      for (let y = r0; y < r0 + sh; y += 1) for (let x = c0; x < c0 + sw; x += 1) if (taken.has(`${y},${x}`)) return false;
      return true;
    };
    const place = (sw, sh) => {
      while (!fits(row, col, sw, sh)) {
        col += 1;
        if (col + sw > cols) { col = 0; row += 1; }
      }
      for (let y = row; y < row + sh; y += 1) for (let x = col; x < col + sw; x += 1) taken.add(`${y},${x}`);
      const at = row;
      col += sw;
      return at;
    };
    for (let i = 0; i <= n; i += 1) {
      if (i === idx) { const at = place(w, h); for (let k = 0; k < h; k += 1) tileRows.push(at + k); } else place(1, 1);
    }
    const rows = Math.max(...[...taken].map((key) => Number(key.split(',')[0]))) + 1;
    const holes = (y) => { let m = 0; for (let x = 0; x < cols; x += 1) if (!taken.has(`${y},${x}`)) m += 1; return m; };
    let interior = 0;
    for (let y = 0; y < rows - 1; y += 1) if (!tileRows.includes(y)) interior += holes(y);
    const tileHoles = tileRows.reduce((s, y) => s + holes(y), 0);
    const last = tileRows.includes(rows - 1) ? 0 : holes(rows - 1);
    return { interior, tileHoles, last };
  };
  const planTile = (n, cols) => {
    const pref = Math.min(6, n);
    const wide = Math.min(2, cols);
    const spans = [[2, 2], [2, 1], [1, 1]].filter(([w, h]) => w <= cols && !(w === cols && h > 1));
    let best = null;
    for (let idx = pref; idx >= 0; idx -= 1) {
      spans.forEach(([w, h]) => {
        const s = simulate(n, cols, idx, w, h);
        const score = s.interior * 100 + s.tileHoles * 8 + (idx === pref ? 0 : 10 + (pref - idx))
          + (w === wide ? 0 : 5) + (h === 2 ? 0 : 3) + s.last;
        if (!best || score < best.score) best = { score, index: idx, w, h, full: w === cols };
      });
    }
    return best;
  };
  const tileHTML = (t) => `
    <a class="plp-edit${t.full ? ' is-full' : ''}" href="highlights.html" style="--c:${t.w};--r:${t.h}">
      <img src="assets/img/look-teal-mirror.jpg" alt="" width="1333" height="2000" loading="lazy" decoding="async">
      <span class="plp-edit__txt"><span class="label">Fall-Winter 2026</span><span class="link">Discover the collection</span></span>
    </a>`;

  /* ---------- Rendering ---------- */
  const colsNow = () => parseInt(getComputedStyle(grid).getPropertyValue('--cols'), 10) || 4;
  let lastCols = 0;

  const wireImages = () => $$('.card__media img:first-child, .plp-edit img', grid).forEach((img) => {
    const show = () => img.classList.add('is-in');
    if (img.complete && img.naturalWidth) show();
    else {
      img.addEventListener('load', show, { once: true });
      img.addEventListener('error', show, { once: true });
    }
  });

  const activeEl = $('[data-active]');
  const fcount = $('[data-fcount]');
  const openBtn = $('[data-open-filters]');
  const renderActive = () => {
    const chip = (g, k, label, pre = '') => `<li><button type="button" class="plp-chip" data-rm="${g}:${k}" aria-label="Remove filter: ${esc(label)}">${pre}${esc(label)}<span class="x" aria-hidden="true"></span></button></li>`;
    const out = [];
    colorOpts.forEach((o) => { if (state.color.has(o.k)) out.push(chip('color', o.k, o.label, `<span class="swatch" style="--sw:${o.hex}"></span>`)); });
    priceOpts.forEach((o) => { if (state.price.has(o.k)) out.push(chip('price', o.k, o.label)); });
    sizeOpts.forEach((s) => { if (state.size.has(s)) out.push(chip('size', s, `Size ${s}`)); });
    if (out.length) out.push('<li><button type="button" class="plp-clear" data-clear>Clear all</button></li>');
    activeEl.innerHTML = out.join('');
    const n = activeCount();
    fcount.textContent = n ? `(${n})` : '';
  };

  /* Drawer controls: built once, then only their states change (focus is never lost while choosing). */
  const form = $('[data-fform]');
  const group = (g, title, body) => `
    <fieldset class="fd__group" data-g="${g}">
      <legend class="fd__legend"><span>${title}</span><span class="fd__sel" data-sel></span></legend>
      ${body}
    </fieldset>`;
  form.innerHTML = [
    group('color', 'Color', `<div class="fd__colors">${colorOpts.map((o) => `
      <label class="fopt"><input type="checkbox" name="color" value="${o.k}"><span class="swatch" style="--sw:${o.hex}"></span><span class="fopt__n">${esc(o.label)}</span><span class="fopt__c" data-n aria-hidden="true"></span></label>`).join('')}</div>`),
    usePrice ? group('price', 'Price', `<div class="fd__boxes">${priceOpts.map((o) => `
      <label class="fbox"><input type="checkbox" name="price" value="${o.k}"><span>${o.label}</span><span class="fbox__c" data-n data-paren aria-hidden="true"></span></label>`).join('')}</div>`) : '',
    group('size', 'Size', `<div class="fd__boxes">${sizeOpts.map((s) => `
      <label class="fbox"><input type="checkbox" name="size" value="${s}" aria-label="Size ${s}"><span aria-hidden="true">${s}</span></label>`).join('')}</div>`),
  ].join('');

  const showBtn = $('[data-show]');
  const fclear = $('[data-fclear]');
  const updateDrawer = (total) => {
    $$('input', form).forEach((inp) => {
      const g = inp.name;
      const on = state[g].has(inp.value);
      const n = facet(g, inp.value);
      inp.checked = on;
      inp.disabled = !n && !on;
      const nEl = $('[data-n]', inp.parentElement);
      if (nEl) nEl.textContent = 'paren' in nEl.dataset ? `(${n})` : String(n);
    });
    $$('.fd__group', form).forEach((fs) => {
      const n = state[fs.dataset.g].size;
      $('[data-sel]', fs).textContent = n ? `${n} selected` : '';
    });
    showBtn.textContent = total ? `Show ${total} ${total === 1 ? 'result' : 'results'}` : 'No results';
    fclear.disabled = !activeCount();
  };

  const syncURL = () => {
    const u = new URLSearchParams();
    u.set('c', c);
    GROUPS.forEach((g) => { if (state[g].size) u.set(g, [...state[g]].join(',')); });
    if (state.sort !== 'featured') u.set('sort', state.sort);
    if (state.view !== 'default') u.set('view', state.view);
    try { history.replaceState(null, '', `${location.pathname}?${u.toString().replace(/%2C/gi, ',')}`); } catch (e) { /* some file:// contexts refuse; state still works */ }
  };

  const render = ({ animate = true } = {}) => {
    const list = results();
    countEl.textContent = `${list.length} ${list.length === 1 ? 'Item' : 'Items'}`;
    grid.dataset.anim = animate && !reduce ? '1' : '0';
    if (!list.length) {
      grid.innerHTML = '<div class="plp-none"><p class="title">No pieces match these filters</p><button type="button" class="btn btn--ghost" data-clear>Clear all</button></div>';
    } else {
      const t = planTile(list.length, colsNow());
      const html = list.map((p) => PH.cardHTML(p));
      html.splice(t.index, 0, tileHTML(t));
      grid.innerHTML = html.join('');
      [...grid.children].forEach((el, i) => el.style.setProperty('--i', String(Math.min(i, 10))));
      const tile = $('.plp-edit', grid);
      if (tile) tile.classList.toggle('is-land', tile.offsetWidth > tile.offsetHeight * 1.05); // keep his face in a wide crop
      wireImages();
    }
    lastCols = colsNow();
    renderActive();
    updateDrawer(list.length);
    syncURL();
  };

  /* ---------- Controls ---------- */
  const clearAll = () => GROUPS.forEach((g) => state[g].clear());

  form.addEventListener('change', (e) => {
    const inp = e.target;
    if (!inp.name || !state[inp.name]) return;
    state[inp.name][inp.checked ? 'add' : 'delete'](inp.value);
    render();
  });

  activeEl.addEventListener('click', (e) => {
    const rm = e.target.closest('[data-rm]');
    if (rm) {
      const [g, k] = rm.dataset.rm.split(':');
      state[g].delete(k);
      render();
      (activeEl.querySelector('.plp-chip') || openBtn).focus();
      return;
    }
    if (e.target.closest('[data-clear]')) { clearAll(); render(); openBtn.focus(); }
  });
  grid.addEventListener('click', (e) => {
    if (e.target.closest('[data-clear]')) { clearAll(); render(); openBtn.focus(); }
  });
  fclear.addEventListener('click', () => { clearAll(); render(); showBtn.focus(); });

  const sortEl = $('[data-sort]');
  sortEl.value = state.sort;
  sortEl.addEventListener('change', () => { state.sort = sortEl.value; render(); });

  const densityBtns = $$('[data-density]', bar);
  const setView = (v) => {
    state.view = v;
    plp.dataset.view = v;
    densityBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.density === v)));
    $$('a[data-k]', subnav).forEach((a) => { a.href = `collection.html?c=${a.dataset.k}${v === 'large' ? '&view=large' : ''}`; });
  };
  densityBtns.forEach((b) => b.addEventListener('click', () => {
    if (state.view === b.dataset.density) return;
    setView(b.dataset.density);
    render();
  }));

  let rq = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(rq);
    rq = requestAnimationFrame(() => { if (colsNow() !== lastCols) render({ animate: false }); });
  }, { passive: true });

  /* ---------- Filter drawer: native modal dialog, animated, focus trapped and returned ---------- */
  const dlg = $('[data-drawer]');
  const panel = $('.fd__panel', dlg);
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
  let opener = null;
  const openDrawer = () => {
    if (dlg.open) return;
    opener = document.activeElement;
    dlg.showModal();
    document.documentElement.classList.add('is-locked');
    openBtn.setAttribute('aria-expanded', 'true');
    $('.fd__x', dlg).focus();
    requestAnimationFrame(() => requestAnimationFrame(() => dlg.classList.add('is-open')));
  };
  const closeDrawer = () => {
    if (!dlg.open) return;
    dlg.classList.remove('is-open');
    window.setTimeout(() => { if (dlg.open) dlg.close(); }, reduce ? 0 : 280);
  };
  openBtn.addEventListener('click', openDrawer);
  dlg.addEventListener('cancel', (e) => { e.preventDefault(); closeDrawer(); });
  dlg.addEventListener('close', () => {
    dlg.classList.remove('is-open');
    document.documentElement.classList.remove('is-locked');
    openBtn.setAttribute('aria-expanded', 'false');
    const back = opener && opener.isConnected ? opener : openBtn;
    back.focus();
  });
  dlg.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) closeDrawer(); });
  dlg.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const f = $$(FOCUSABLE, panel).filter((el) => el.getClientRects().length);
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  setView(state.view);
  render();
  PH.reveal();
})();
