(() => {
  const loading = document.querySelector('.loading');
  if (loading) {
    let seen = false;
    try { seen = sessionStorage.getItem('kit-loading') === '1'; sessionStorage.setItem('kit-loading', '1'); } catch (e) { /* 保存できない設定でも動く */ }
    if (window.__kitCheck || seen || matchMedia('(prefers-reduced-motion: reduce)').matches) loading.remove();
  }

  const header = document.querySelector('.header');
  const fv = document.querySelector('.fv');
  const onScroll = () => header.classList.toggle('is-scrolled', !fv || window.scrollY > fv.offsetHeight - header.offsetHeight);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const btn = document.querySelector('.menu-btn');
  const drawer = document.querySelector('.drawer');
  if (btn && drawer) {
    const set = (open) => {
      drawer.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
      document.documentElement.classList.toggle('is-locked', open);
    };
    const subs = [...drawer.querySelectorAll('.drawer__pm')];
    const setSub = (pm, open) => {
      pm.setAttribute('aria-expanded', String(open));
      pm.closest('.drawer__has-sub')?.classList.toggle('is-sub-open', open);
      const label = pm.getAttribute('aria-label') || '';
      pm.setAttribute('aria-label', open ? label.replace(/開く$/, '閉じる') : label.replace(/閉じる$/, '開く'));
    };
    subs.forEach((pm) => pm.addEventListener('click', () => setSub(pm, pm.getAttribute('aria-expanded') !== 'true')));
    btn.addEventListener('click', () => { const open = !drawer.classList.contains('is-open'); if (!open) subs.forEach((pm) => setSub(pm, false)); set(open); });
    drawer.addEventListener('click', (e) => { if (e.target.closest('a')) { subs.forEach((pm) => setSub(pm, false)); set(false); } });
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape') { subs.forEach((pm) => setSub(pm, false)); set(false); } });
  }

  const enHeads = [...new Set([...document.querySelectorAll('.mask')].map((m) => m.parentElement))];
  enHeads.forEach((t) => [...t.children].filter((c) => c.classList.contains('mask')).forEach((m, i) => m.style.setProperty('--m', i)));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      if (el.classList.contains('rv')) {
        const sibs = [...el.parentElement.children].filter((c) => c.classList.contains('rv'));
        el.style.setProperty('--rv-delay', `${sibs.indexOf(el) * 0.12}s`);
      }
      el.classList.add('is-on');
      io.unobserve(el);
    });
  }, { rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('.rv, .ttl__en').forEach((el) => io.observe(el));
  enHeads.forEach((el) => io.observe(el));

  document.querySelectorAll('form[data-todo]').forEach((f) => f.addEventListener('submit', (e) => e.preventDefault()));

  const fxs = [...document.querySelectorAll('[data-fx]')];
  fxs.filter((el) => el.dataset.fx === 'list').forEach((el) => [...el.children].forEach((c, i) => c.style.setProperty('--i', i)));
  const calm = window.__kitCheck || matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (calm) fxs.forEach((el) => el.classList.add('is-in'));
  else {
    const fio = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); fio.unobserve(en.target); } }), { rootMargin: '0px 0px -12% 0px' });
    fxs.forEach((el) => fio.observe(el));
    const px = [...document.querySelectorAll('.band img, .salon__pic img, [data-px]')];
    let ticking = false;
    const run = () => {
      const vh = innerHeight;
      px.forEach((el) => {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const k = parseFloat(el.dataset.px || '0.08');
        el.style.translate = '0 ' + ((r.top + r.height / 2 - vh / 2) * -k).toFixed(1) + 'px';
      });
      ticking = false;
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(run); } }, { passive: true });
    run();
  }
})();
