// Drives the page-transition curtain (see Curtain.astro): reveals it on
// load, and covers it again before following any internal link, so every
// navigation across the site gets the same wipe in/out the original
// one-page AJAX router had.

const COVER_MS = 550; // must comfortably exceed the CSS transition + stagger

function initCurtain() {
  const curtain = document.querySelector<HTMLElement>('.curtain');
  if (!curtain) return;

  // Reveal shortly after the covered state has actually painted, so the
  // browser doesn't collapse the instant-cover + animated-reveal into one
  // frame (which would skip the wipe entirely).
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      curtain.classList.remove('curtain-instant');
      curtain.classList.remove('curtain-cover');
      curtain.classList.add('curtain-reveal');
      // Drives .close-page's slide-down entrance (see main.css) — its own
      // transition-delay staggers it just after the curtain finishes.
      document.documentElement.classList.add('is-ajax-page-visible');
    });
  });

  let navigating = false;

  document.addEventListener('click', (event) => {
    if (navigating) return;

    const target = event.target as HTMLElement;
    const link = target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || !href.startsWith('/')) return; // only real internal routes
    if (link.target === '_blank' || link.hasAttribute('download')) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const destination = new URL(href, window.location.href);
    if (destination.pathname === window.location.pathname) return;

    event.preventDefault();
    navigating = true;

    curtain.classList.remove('curtain-reveal');
    curtain.classList.add('curtain-cover');

    window.setTimeout(() => {
      window.location.href = destination.href;
    }, COVER_MS);
  });
}

initCurtain();
