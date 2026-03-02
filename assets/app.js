(() => {
  const body = document.body;

  const langWraps = document.querySelectorAll('[data-lang-wrap]');
  langWraps.forEach((wrap) => {
    const trigger = wrap.querySelector('[data-lang-trigger]');
    trigger?.addEventListener('click', () => {
      const open = wrap.classList.toggle('open');
      trigger.setAttribute('aria-expanded', String(open));
    });
  });

  document.addEventListener('click', (e) => {
    langWraps.forEach((wrap) => {
      if (!wrap.contains(e.target)) {
        wrap.classList.remove('open');
        const trigger = wrap.querySelector('[data-lang-trigger]');
        trigger?.setAttribute('aria-expanded', 'false');
      }
    });
  });

  const drawer = document.querySelector('[data-drawer]');
  const openBtn = document.querySelector('[data-open-drawer]');
  const closeBtn = document.querySelector('[data-close-drawer]');
  const backdrop = document.querySelector('[data-backdrop]');
  let lastFocus = null;

  const focusables = () => drawer?.querySelectorAll('a,button,[tabindex]:not([tabindex="-1"])');

  function openDrawer() {
    if (!drawer) return;
    lastFocus = document.activeElement;
    body.classList.add('menu-open');
    drawer.setAttribute('aria-hidden', 'false');
    const first = focusables()?.[0];
    first?.focus();
  }
  function closeDrawer() {
    if (!drawer) return;
    body.classList.remove('menu-open');
    drawer.setAttribute('aria-hidden', 'true');
    lastFocus?.focus();
  }

  openBtn?.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  backdrop?.addEventListener('click', closeDrawer);

  drawer?.addEventListener('click', (e) => {
    if (e.target.matches('a')) closeDrawer();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      closeModal();
    }
    if (e.key === 'Tab' && body.classList.contains('menu-open')) {
      const nodes = Array.from(focusables() || []);
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq-trigger');
    btn?.addEventListener('click', () => {
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-trigger')?.setAttribute('aria-expanded', 'false');
        }
      });
      const open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  const modal = document.querySelector('[data-modal]');
  const openModalBtn = document.querySelectorAll('[data-open-privacy]');
  const closeModalBtns = document.querySelectorAll('[data-close-privacy]');

  function openModal() {
    modal?.classList.add('open');
    modal?.setAttribute('aria-hidden', 'false');
    body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal?.classList.remove('open');
    modal?.setAttribute('aria-hidden', 'true');
    if (!body.classList.contains('menu-open')) body.style.overflow = '';
  }

  openModalBtn.forEach((btn) => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  }));
  closeModalBtns.forEach((btn) => btn.addEventListener('click', closeModal));
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('show');
    });
  }, { threshold: 0.16 });
  document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
})();
