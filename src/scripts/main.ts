// Shared site-wide behaviour: ported from the original theme's main.js,
// with the dead AJAX/portfolio/blog/masonry/lightbox code removed since
// those sections were never linked from the live site.
//
// Runs on astro:page-load (fires on the first load AND every subsequent
// client-side navigation) rather than once at module scope, since Astro's
// router swaps the DOM in place instead of reloading the document — this
// script's own top-level code only ever runs once per session. See
// transitions.ts for a longer explanation of why that matters.

function initGlobalUI() {
  // document.documentElement is just the <html> tag itself. classList lets
  // you add/remove/check CSS classes on it without hand-editing a string.
  const html = document.documentElement;

  html.classList.remove('no-js'); // CSS can use .no-js to hide things that need JS to work
  html.classList.add('ready', 'loaded');

  // ------------------------------
  // SEARCH TOGGLE
  // Only exists on the home page's header — querySelector returns null if
  // it's not on the current page, so every block here starts with an
  // `if (thing)` check before touching it.
  const searchToggle = document.querySelector('.search-toggle');
  if (searchToggle) {
    searchToggle.addEventListener('click', () => {
      html.classList.toggle('is-search-toggled-on'); // toggle = on if off, off if on
      const input = document.querySelector<HTMLInputElement>('.header-search input');
      input?.focus(); // the "?." skips the call instead of erroring if input is null
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
    updateVisibility(); // run once immediately, in case the page loads already scrolled
    window.addEventListener('scroll', updateVisibility); // then keep checking as the user scrolls
    backToTop.addEventListener('click', (e) => {
      e.preventDefault(); // stop the link's default "jump to #top" behaviour
      window.scrollTo({ top: 0, behavior: 'smooth' }); // do a smooth animated scroll instead
    });
  }
  // ------------------------------

  // ------------------------------
  // BACKGROUND MUSIC CONTINUITY
  // The <audio> element is marked transition:persist (see PageLayout.astro
  // / index.astro), so Astro's router keeps this exact node — and its
  // playback — alive across navigations without any help from this script.
  // The sessionStorage save/restore below only matters as a fallback for
  // when persistence doesn't apply (e.g. the router falls back to a real
  // navigation). sessionStorage is a small key/value store the browser
  // keeps for one tab's lifetime — it survives page navigations but clears
  // when the tab is closed, which is exactly the lifetime we want here.
  //
  // The dataset flag (an element's `data-*` attributes, read/written via
  // `.dataset`) guards against re-binding every time this function re-runs
  // on a node that's already had this set up once — since initGlobalUI()
  // runs again on every page-load, without this check we'd try to restart
  // the same audio element repeatedly.
  const music = document.getElementById('bg-music') as HTMLAudioElement | null;
  if (music && !music.dataset.persistBound) {
    music.dataset.persistBound = 'true';

    const wasPlaying = sessionStorage.getItem('bgMusicPlaying') === 'true';
    const savedTime = sessionStorage.getItem('bgMusicTime');

    if (wasPlaying && music.paused) {
      music.volume = 0.5;
      if (savedTime) music.currentTime = parseFloat(savedTime);
      // .play() returns a Promise that rejects if the browser blocks
      // autoplay — .catch(() => {}) just means "and if that happens,
      // do nothing" rather than letting it log a scary console error.
      music.play().catch(() => {
        /* autoplay blocked on this page load; the home toggle can restart it */
      });
    }

    // pagehide fires when the browser is about to leave this page for real
    // (closing the tab, typing a new URL, etc — NOT an Astro client-side
    // swap, which never triggers it). We use it purely as a safety net to
    // remember where playback was, in case persistence above didn't apply.
    window.addEventListener('pagehide', () => {
      sessionStorage.setItem('bgMusicPlaying', String(!music.paused));
      sessionStorage.setItem('bgMusicTime', String(music.currentTime));
    });
  }
  // ------------------------------

  // ------------------------------
  // MOUSE CLICK RIPPLE EFFECT
  // Purely decorative: on click, briefly grows a circle from the cursor
  // position and fades it out (the actual animation is CSS, in main.css's
  // .ripple rules — this just creates the element and positions it).
  if (html.dataset.clickRippleAnimation === 'yes' && !html.querySelector(':scope > i.ripple')) {
    const ripple = document.createElement('i'); // makes a new, empty <i> element
    ripple.className = 'ripple';
    html.appendChild(ripple); // and adds it to the page, as a direct child of <html>

    html.addEventListener('mousedown', (e) => {
      ripple.classList.add('active'); // .active is what actually starts the CSS animation
      ripple.style.left = `${e.pageX}px`; // position it exactly where the click happened
      ripple.style.top = `${e.pageY}px`;
    });

    // transitionend fires when a CSS transition finishes — used here to
    // reset .active so the ripple is ready to animate again on the next click.
    ripple.addEventListener('transitionend', () => {
      ripple.classList.remove('active');
    });
  }
  // ------------------------------
}

document.addEventListener('astro:page-load', initGlobalUI);
