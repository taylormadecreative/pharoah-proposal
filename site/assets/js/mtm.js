/* Made to Measure: the request form qualifies by budget (the filter Pharoah asked for) and the event
   list prefills the city. Demo only: nothing is sent anywhere. */
(() => {
  const form = document.querySelector('[data-mtm]');
  const steer = document.querySelector('[data-steer]');
  const budget = document.querySelector('[data-budget]');
  const err = document.querySelector('[data-error]');
  const done = document.querySelector('[data-done]');
  const city = document.querySelector('[data-city]');

  const below = () => budget.value === 'low';
  budget.addEventListener('change', () => { steer.hidden = !below(); });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll('[required]').forEach((el) => {
      const bad = !el.value.trim() || (el.type === 'email' && !/^\S+@\S+\.\S+$/.test(el.value));
      el.closest('.m-field').classList.toggle('is-bad', bad);
      el.setAttribute('aria-invalid', String(bad));
      if (bad) ok = false;
    });
    err.hidden = ok;
    if (!ok) { form.querySelector('[aria-invalid="true"]').focus(); return; }
    if (below()) { steer.hidden = false; steer.scrollIntoView({ block: 'center' }); return; }
    form.hidden = true;
    done.hidden = false;
    done.focus();
  });
  form.addEventListener('input', (e) => {
    const f = e.target.closest('.m-field');
    if (f && f.classList.contains('is-bad') && e.target.value.trim()) { f.classList.remove('is-bad'); e.target.setAttribute('aria-invalid', 'false'); }
  });

  document.querySelectorAll('[data-pick]').forEach((b) => b.addEventListener('click', () => {
    city.value = b.dataset.pick;
    document.querySelector('#request').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    window.setTimeout(() => city.focus({ preventScroll: true }), 500);
  }));
})();
