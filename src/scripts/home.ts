// Home page intro animation, background music player and fullscreen toggle.
// Ported from the original theme's homeAnimation()/homeMusic() (which used
// TweenMax/TimelineMax) to modern GSAP, and simplified since the AJAX
// one-page-layout routing (jquery-address + portfolio/blog ajax) isn't used.
//
// Everything in this file only matters on the home page — that's why the
// <script src="home.ts"> tag only appears in index.astro, not the other
// pages.

// GSAP ("GreenSock Animation Platform") is a small animation library — it's
// what smoothly moves/fades things over time, which plain CSS can do too,
// but GSAP makes chaining lots of small animations together (like the
// intro sequence below) much easier to read and control.
import { gsap } from 'gsap';

// The scrolling job-title/marquee text needs an exact pixel width to loop
// seamlessly — this measures the logo + text and applies that width. Runs
// once on load, and again on window resize (see init() below), since the
// right width depends on the viewport size.
function fixMarquee() {
  const logoCenter = document.querySelector<HTMLElement>('.home-logo-center');
  const textContainer = document.querySelector<HTMLElement>('.home-text-container');
  if (!logoCenter || !textContainer) return;

  const width = logoCenter.offsetWidth + textContainer.offsetWidth;
  document.querySelectorAll<HTMLElement>('.home-marquee, .home-job-title').forEach((el) => {
    el.style.width = `${width}px`;
  });
}

// The home page's intro sequence: background zooms in, the logo splits and
// slides apart, then the job title/marquee text fades in. Each `.to(...)`
// call below animates one CSS selector to some end state over some
// duration — GSAP's "timeline" (tl) is just a list of these animations
// with a shared, chainable schedule.
function homeAnimation() {
  // These are just CSS selectors, pulled into named variables so the
  // timeline below reads like a sentence instead of a wall of dot-strings.
  const bg = '.home-bg';
  const heading = '.home-heading';
  const logoInverted = '.home-bg-logo';
  const logoLeft = '.home-logo-left';
  const logoLeftInner = '.home-logo-left span';
  const logoRight = '.home-logo-right';
  const logoRightInner = '.home-logo-right span';
  const textContainer = '.home-text-container';
  const text = '.home-text';
  const marquee = '.home-marquee, .home-job-title';
  const social = '.home-social';
  const footer = '.home-footer';

  // gsap.timeline() creates a sequence you build up by chaining .to()/
  // .fromTo() calls onto it (that's why every line below ends without a
  // semicolon until the very last one — it's all one long chained
  // statement). onComplete runs once, after every animation in the
  // timeline has finished.
  const tl = gsap.timeline({
    onComplete: () => document.body.classList.add('is-animation-ended'),
  });

  // .addLabel(name) marks a point in time you can refer back to — e.g.
  // the third argument to .to(), 'start' or 'shiftRight' below, means
  // "begin this animation at that labelled moment" instead of strictly
  // one-after-another. '+=0.4' means "0.4s after that label", and
  // 'start-=0.4' means "0.4s before it" — this is what lets several
  // animations overlap instead of playing in strict sequence.
  tl.addLabel('start')
    .fromTo(bg, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: 'power3.out' }, 'start')
    .fromTo(bg, { scale: 2, xPercent: -70 }, { scale: 1, xPercent: 0, duration: 1.8, ease: 'power3.out' }, 'start')
    .to(heading, { y: 0, duration: 0.6, ease: 'power3.out' }, 'start-=0.4')

    .addLabel('shiftRight', '+=0.4')
    .to(logoInverted, { xPercent: 50, duration: 0.8, ease: 'power3.out' }, 'shiftRight')
    .to(bg, { xPercent: '-=7', duration: 1, ease: 'power3.out' }, 'shiftRight')
    .to(heading, { xPercent: '+=35', duration: 0.8, ease: 'power3.out' }, 'shiftRight')
    .to(logoRightInner, { xPercent: -100, duration: 0.8, ease: 'power3.out' }, 'shiftRight')
    .to(logoLeftInner, { xPercent: 100, duration: 0.8, ease: 'power3.out' }, 'shiftRight')
    .to([logoRight, logoLeft], { width: 0, padding: 0, duration: 0.8, ease: 'power3.out' }, 'shiftRight')
    .to(footer, { autoAlpha: 1, x: 0, duration: 1, ease: 'power3.out' }, 'shiftRight')

    .addLabel('shiftLeft')
    .to(heading, { xPercent: '-=50', duration: 0.8, ease: 'power3.out' }, 'shiftLeft')
    .to(textContainer, { scaleX: 1, duration: 0.8, ease: 'power3.out' }, 'shiftLeft')
    .to(text, { autoAlpha: 1, x: 0, duration: 1, ease: 'power3.out' }, 'shiftLeft')
    .to(marquee, { autoAlpha: 1, duration: 1, ease: 'none' }, 'shiftLeft')
    .to(social, { autoAlpha: 1, duration: 1, ease: 'none' }, 'shiftLeft')
    .to(bg, { xPercent: '-=5', duration: 8, ease: 'none' }, 'shiftLeft')
    .to(logoInverted, { xPercent: '-=2.5', duration: 6, ease: 'none' }, 'shiftLeft');
}

// Wires up the "Music on/off" toggle in the bottom-left corner: clicking it
// plays/pauses the shared <audio id="bg-music"> element (the same one
// main.ts persists across page navigations) and updates the button's
// text/animation to match.
function homeMusic() {
  const music = document.getElementById('bg-music') as HTMLAudioElement | null;
  const musicToggle = document.getElementById('play-music');
  const toggleBtn = document.getElementById('toggle');
  const musicAnimation = document.getElementById('music-animation');
  // Bail out entirely if any piece is missing — all four only exist
  // together on the home page, so this also protects against running on
  // a page that doesn't have them.
  if (!music || !musicToggle || !toggleBtn || !musicAnimation) return;

  let isPlaying = false;
  let userTurnedOffMusic = true;

  function togglePlay() {
    if (!music) return;
    if (isPlaying) {
      music.pause();
      userTurnedOffMusic = true;
    } else {
      music.volume = 0.5;
      music.play().catch(() => {
        /* autoplay was blocked; ignore */
      });
      userTurnedOffMusic = false;
    }
  }

  // .onplaying / .onpause are event handlers set as plain properties
  // (as opposed to .addEventListener) — functionally similar here, just a
  // shorter way to say "there's only ever one handler for this event".
  // They fire whenever the audio ACTUALLY starts/stops (whether that's
  // from our own togglePlay(), the browser blocking autoplay, or main.ts
  // resuming playback on load) — which is why the button's label is kept
  // in sync here rather than inside togglePlay() itself.
  music.onplaying = () => {
    isPlaying = true;
    toggleBtn.innerHTML = toggleBtn.getAttribute('data-on-text') ?? '';
    musicAnimation.classList.add('on');
  };
  music.onpause = () => {
    isPlaying = false;
    toggleBtn.innerHTML = toggleBtn.getAttribute('data-off-text') ?? '';
    musicAnimation.classList.remove('on');
  };

  musicToggle.addEventListener('click', togglePlay);

  // main.ts may have already resumed playback (from a previous page) before
  // this handler was attached — sync the toggle UI to the actual state
  // instead of assuming it starts paused.
  if (!music.paused) {
    isPlaying = true;
    userTurnedOffMusic = false;
    toggleBtn.innerHTML = toggleBtn.getAttribute('data-on-text') ?? '';
    musicAnimation.classList.add('on');
  }

  // pause the music when the tab is hidden, resume when it's focused again
  // (unless the user explicitly turned it off)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      music.pause();
    } else if (!userTurnedOffMusic) {
      music.play().catch(() => {});
    }
  });
}

// Wires up the small corner icon that toggles browser fullscreen mode.
//
// Why this looks more complicated than "just call requestFullscreen()":
// older/other browsers only ever shipped this feature with a vendor
// prefix (moz-, ms-, webkit-) before it became a standard, unprefixed API.
// Nothing here is site-specific logic — it's just trying the standard
// name first, then falling back through each prefixed version.
function fullScreenToggle() {
  const wrap = document.querySelector('.full-screen-wrap');
  if (!wrap) return;

  wrap.addEventListener('click', () => {
    wrap.classList.toggle('active'); // just the icon's own visual on/off state

    // TypeScript doesn't know about the old prefixed properties by
    // default, since they're not part of the modern standard — these two
    // casts just tell it "trust me, these might exist" so we can safely
    // check for them without a compile error.
    const doc = document as Document & {
      mozFullScreenElement?: Element;
      msFullscreenElement?: Element;
      webkitFullscreenElement?: Element;
      mozCancelFullScreen?: () => void;
      msExitFullscreen?: () => void;
      webkitExitFullscreen?: () => void;
    };
    const el = document.documentElement as HTMLElement & {
      mozRequestFullScreen?: () => void;
      msRequestFullscreen?: () => void;
      webkitRequestFullscreen?: (flags?: number) => void;
    };

    const isFullscreen =
      document.fullscreenElement ||
      doc.mozFullScreenElement ||
      doc.webkitFullscreenElement ||
      doc.msFullscreenElement;

    if (!isFullscreen) {
      // Try each version of "enter fullscreen" in order until one exists.
      if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
      else if (el.msRequestFullscreen) el.msRequestFullscreen();
      else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    } else {
      // Same idea, but for "leave fullscreen".
      if (document.exitFullscreen) document.exitFullscreen();
      else if (doc.msExitFullscreen) doc.msExitFullscreen();
      else if (doc.mozCancelFullScreen) doc.mozCancelFullScreen();
      else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
    }
  });
}

// Runs everything above, in order, every time the home page loads.
function init() {
  fixMarquee();
  window.addEventListener('resize', fixMarquee);

  homeAnimation();
  homeMusic();
  fullScreenToggle();

  document.documentElement.classList.add('home-loaded');
}

// astro:page-load fires on the first load and every subsequent client-side
// navigation back to this page — this script's own top-level code only
// ever runs once per session, so re-running the intro animation/music
// toggle/fullscreen binding on every visit to home happens here instead.
document.addEventListener('astro:page-load', init);
