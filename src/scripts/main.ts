// Shared site-wide behaviour: ported from the original theme's main.js,
// with the dead AJAX/portfolio/blog/masonry/lightbox code removed since
// those sections were never linked from the live site.

function initGlobalUI() {
  const html = document.documentElement;

  html.classList.remove('no-js');
  html.classList.add('ready');

  window.addEventListener('load', () => {
    html.classList.add('loaded');
  });

  // ------------------------------
  // SEARCH TOGGLE
  const searchToggle = document.querySelector('.search-toggle');
  if (searchToggle) {
    searchToggle.addEventListener('click', () => {
      html.classList.toggle('is-search-toggled-on');
      const input = document.querySelector<HTMLInputElement>('.header-search input');
      input?.focus();
    });
  }
  // ------------------------------

  // ------------------------------
  // BACK TO TOP
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    const scrollTrigger = window.innerHeight - 400;
    const updateVisibility = () => {
      if (window.scrollY > scrollTrigger) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    };
    updateVisibility();
    window.addEventListener('scroll', updateVisibility);
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  // ------------------------------

  // ------------------------------
  // MOUSE CLICK RIPPLE EFFECT
  if (html.dataset.clickRippleAnimation === 'yes') {
    const ripple = document.createElement('i');
    ripple.className = 'ripple';
    html.appendChild(ripple);

    html.addEventListener('mousedown', (e) => {
      ripple.classList.add('active');
      ripple.style.left = `${e.pageX}px`;
      ripple.style.top = `${e.pageY}px`;
    });

    ripple.addEventListener('transitionend', () => {
      ripple.classList.remove('active');
    });
  }
  // ------------------------------
}

initGlobalUI();
