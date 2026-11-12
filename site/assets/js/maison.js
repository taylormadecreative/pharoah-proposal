/* Pharoah · Maison mockup: shared header (mega menu), footer, reveals. Every page includes catalog.js, then this.
   <body data-page="home|rtw|shoes|highlights|players|mtm|product" data-header="film"?> */
(() => {
  const root = document.documentElement;
  root.classList.remove('no-js');
  const body = document.body;
  const page = body.dataset.page || '';
  const film = body.dataset.header === 'film';
  const M = PH.menu;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const col = (title, items, href) => `
    <div class="mega__col">
      <h3 class="label">${title}</h3>
      <ul>${items.map(([k, label]) => `<li><a href="${href(k)}">${label}</a></li>`).join('')}</ul>
    </div>`;
  const cat = (k) => `collection.html?c=${k}`;
  const megaHTML = `
    <div class="mega" data-mega id="mega" role="region" aria-label="Menu">
      <div class="mega__grid">
        ${col('Ready-to-Wear', [['rtw', 'View All'], ...M.rtw.items], cat)}
        ${col('Shoes', [['shoes', 'View All'], ...M.shoes.items], cat)}
        ${col('Highlights', M.highlights.items, (k) => k)}
        ${col('Made to Measure', M.mtm.items, (k) => k)}
        <div class="mega__feature">
          <a href="highlights.html"><img src="assets/img/look-teal-mirror.jpg" alt="" loading="lazy" width="600" height="800"><span class="label">Fall-Winter 2026</span></a>
          <a href="players.html"><img src="assets/nfl/kendrick-bourne-10-sm.webp" alt="" loading="lazy" width="600" height="800"><span class="label">Who Wears Pharoah</span></a>
        </div>
      </div>
    </div>`;
  const cur = (k) => (k === page || (k === 'highlights' && page === 'players') ? ' aria-current="page"' : '');
  const header = `
    <a class="skip" href="#main">Skip to content</a>
    <header class="hdr${film ? ' hdr--film' : ''}" data-hdr>
      <div class="hdr__row">
        <nav aria-label="Main">
          <ul class="hdr__nav">
            <li data-mega-trigger><button type="button" aria-expanded="false" aria-controls="mega"${cur('rtw')}>Ready-to-Wear</button></li>
            <li data-mega-trigger><button type="button" aria-expanded="false" aria-controls="mega"${cur('shoes')}>Shoes</button></li>
            <li data-mega-trigger><button type="button" aria-expanded="false" aria-controls="mega"${cur('highlights')}>Highlights</button></li>
            <li><a href="made-to-measure.html"${cur('mtm')}>Made to Measure</a></li>
          </ul>
          <button class="hdr__burger label" type="button" data-burger aria-expanded="false" aria-controls="mnav">Menu</button>
        </nav>
        <a class="hdr__logo" href="index.html" aria-label="Pharoah, New York, home"><i class="logo" aria-hidden="true"></i><small>New York</small></a>
        <div class="hdr__tools">
          <a class="hide-sm" href="collection.html?c=rtw">Search</a>
          <a class="hide-sm" href="made-to-measure.html#request">Appointments</a>
          <a href="#bag" data-bag>Bag (<span data-bag-count>0</span>)</a>
        </div>
      </div>
      ${megaHTML}
    </header>
    <div class="scrim" data-scrim></div>
    <nav class="mnav" id="mnav" data-mnav aria-label="Menu">
      <details><summary>Ready-to-Wear</summary><ul>${[['rtw', 'View All'], ...M.rtw.items].map(([k, l]) => `<li><a href="${cat(k)}">${l}</a></li>`).join('')}</ul></details>
      <details><summary>Shoes</summary><ul>${[['shoes', 'View All'], ...M.shoes.items].map(([k, l]) => `<li><a href="${cat(k)}">${l}</a></li>`).join('')}</ul></details>
      <details><summary>Highlights</summary><ul>${M.highlights.items.map(([k, l]) => `<li><a href="${k}">${l}</a></li>`).join('')}</ul></details>
      <a href="made-to-measure.html">Made to Measure</a>
      <a href="made-to-measure.html#request">Request a Private Appointment</a>
    </nav>`;
  const footer = `
    <footer class="ftr">
      <div class="ftr__news">
        <div><h2 class="title">The Pharoah Letter</h2><p class="lede" style="margin-top:8px">New collections, runway shows and where the house will be next.</p></div>
        <form data-news novalidate><label class="vh" for="news-email">Email</label><input id="news-email" type="email" placeholder="Email address" autocomplete="email"><button type="submit">Subscribe</button></form>
      </div>
      <div class="ftr__cols">
        <div><h3 class="label">Client Services</h3><ul><li><a href="#">Contact Us</a></li><li><a href="#">Shipping &amp; Returns</a></li><li><a href="#">Size Guide</a></li><li><a href="#">FAQ</a></li></ul></div>
        <div><h3 class="label">Made to Measure</h3><ul><li><a href="made-to-measure.html#request">Request a Private Appointment</a></li><li><a href="made-to-measure.html#events">Upcoming Events</a></li><li><a href="made-to-measure.html#process">The Process</a></li></ul></div>
        <div><h3 class="label">The House</h3><ul><li><a href="#">About Pharoah</a></li><li><a href="players.html">Who Wears Pharoah</a></li><li><a href="#">Press</a></li><li><a href="#">Community</a></li></ul></div>
        <div><h3 class="label">Follow</h3><ul><li><a href="https://www.instagram.com/pharoahofficial/">Instagram @pharoahofficial</a></li><li><a href="https://www.instagram.com/pharoahkirk/">Instagram @pharoahkirk</a></li><li><a href="#">TikTok</a></li></ul></div>
      </div>
      <div class="ftr__sig" aria-hidden="true"><picture><source srcset="assets/img/stallions-still.png" media="(prefers-reduced-motion: reduce)"><img src="assets/img/stallions-run.gif" alt="" width="160" height="159" loading="lazy" decoding="async"></picture></div>
      <div class="ftr__base"><span>© 2026 Pharoah, New York</span><span>Mockup for discussion · sample products and prices</span></div>
    </footer>
    <p class="sample-flag" aria-hidden="true">Mockup · sample products</p>`;

  const slotH = document.querySelector('[data-site-header]');
  const slotF = document.querySelector('[data-site-footer]');
  if (slotH) slotH.outerHTML = header;
  if (slotF) slotF.outerHTML = footer;

  /* Mega menu: one panel, opened by any of the three triggers; hover with intent on desktop, click everywhere. */
  const hdr = document.querySelector('[data-hdr]');
  const mega = document.querySelector('[data-mega]');
  const scrim = document.querySelector('[data-scrim]');
  const triggers = [...document.querySelectorAll('[data-mega-trigger]')];
  let closeT = 0;
  const setMega = (open, li) => {
    window.clearTimeout(closeT);
    mega.classList.toggle('is-open', open);
    scrim.classList.toggle('is-on', open);
    hdr.classList.toggle('is-menu', open);
    triggers.forEach((t) => { const on = open && t === li; t.classList.toggle('is-open', on); t.firstElementChild.setAttribute('aria-expanded', String(on)); });
  };
  triggers.forEach((li) => {
    li.firstElementChild.addEventListener('click', () => setMega(!li.classList.contains('is-open'), li));
    li.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') setMega(true, li); });
  });
  hdr.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') closeT = window.setTimeout(() => setMega(false), 160); });
  hdr.addEventListener('pointerenter', () => window.clearTimeout(closeT));
  scrim.addEventListener('click', () => setMega(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { setMega(false); setMnav(false); } });

  /* Mobile menu */
  const mnav = document.querySelector('[data-mnav]');
  const burger = document.querySelector('[data-burger]');
  const setMnav = (open) => { mnav.classList.toggle('is-open', open); burger.setAttribute('aria-expanded', String(open)); burger.textContent = open ? 'Close' : 'Menu'; hdr.classList.toggle('is-menu', open || mega.classList.contains('is-open')); };
  burger.addEventListener('click', () => setMnav(!mnav.classList.contains('is-open')));

  /* Film header: solid once the page moves past the first screen */
  if (film) {
    const onScroll = () => hdr.classList.toggle('is-solid', window.scrollY > window.innerHeight * 0.85);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* His stallions behind the name run on hover: desktop, motion allowed, solid header only. Each hover loads a fresh
     copy of the same file so it starts on the resting pose, which is the still, so the swap in is seamless. */
  const logoEl = document.querySelector('.hdr__logo');
  if (logoEl && !reduce && window.matchMedia('(hover: hover)').matches) {
    const run = document.createElement('img');
    run.className = 'hdr__run'; run.alt = ''; run.setAttribute('aria-hidden', 'true'); run.decoding = 'async';
    logoEl.prepend(run);
    const hdrEl = document.querySelector('[data-hdr]');
    let blob = null; let url = null; let over = false;
    logoEl.addEventListener('mouseenter', async () => {
      over = true;
      if (hdrEl && hdrEl.classList.contains('hdr--film') && !hdrEl.classList.contains('is-solid')) return;
      try { if (!blob) blob = await (await fetch('assets/img/stallions-head-run.gif')).blob(); } catch (e) { return; }
      if (!over) return;
      if (url) URL.revokeObjectURL(url);
      url = URL.createObjectURL(blob); run.src = url;
      try { await run.decode(); } catch (e) { /* show it anyway */ }
      if (over) logoEl.classList.add('is-running');
    });
    logoEl.addEventListener('mouseleave', () => { over = false; logoEl.classList.remove('is-running'); });
  }

  /* Bag count (demo): product pages add to it */
  const countEl = document.querySelector('[data-bag-count]');
  let n = 0;
  try { n = Number(sessionStorage.getItem('ph-bag') || 0); } catch (e) { /* private mode */ }
  countEl.textContent = n;
  PH.addToBag = () => { n += 1; countEl.textContent = n; try { sessionStorage.setItem('ph-bag', String(n)); } catch (e) { /* ignore */ } };

  /* Newsletter (demo) */
  const news = document.querySelector('[data-news]');
  if (news) news.addEventListener('submit', (e) => { e.preventDefault(); news.innerHTML = '<p class="label" style="padding:12px 0">Thank you. You are on the list.</p>'; });

  /* Reveals */
  PH.reveal = (scope = document) => {
    const els = [...scope.querySelectorAll('.rv:not(.in)')];
    if (reduce || !('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('in')); return; }
    const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });
    els.forEach((el) => io.observe(el));
  };
  PH.reveal();
})();
