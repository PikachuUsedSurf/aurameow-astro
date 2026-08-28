// Home page intro animation, background music player and fullscreen toggle.
// Ported from the original theme's homeAnimation()/homeMusic() (which used
// TweenMax/TimelineMax) to modern GSAP, and simplified since the AJAX
// one-page-layout routing (jquery-address + portfolio/blog ajax) isn't used.

import { gsap } from 'gsap';

function fixMarquee() {
  const logoCenter = document.querySelector<HTMLElement>('.home-logo-center');
  const textContainer = document.querySelector<HTMLElement>('.home-text-container');
  if (!logoCenter || !textContainer) return;

  const width = logoCenter.offsetWidth + textContainer.offsetWidth;
  document.querySelectorAll<HTMLElement>('.home-marquee, .home-job-title').forEach((el) => {
    el.style.width = `${width}px`;
  });
}

function homeAnimation() {
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

  const tl = gsap.timeline({
    onComplete: () => document.body.classList.add('is-animation-ended'),
  });

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

function homeMusic() {
  const music = document.getElementById('bg-music') as HTMLAudioElement | null;
  const musicToggle = document.getElementById('play-music');
  const toggleBtn = document.getElementById('toggle');
  const musicAnimation = document.getElementById('music-animation');
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

function fullScreenToggle() {
  const wrap = document.querySelector('.full-screen-wrap');
  if (!wrap) return;

  wrap.addEventListener('click', () => {
    wrap.classList.toggle('active');

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
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.msRequestFullscreen) el.msRequestFullscreen();
      else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (doc.msExitFullscreen) doc.msExitFullscreen();
      else if (doc.mozCancelFullScreen) doc.mozCancelFullScreen();
      else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
    }
  });
}

function init() {
  fixMarquee();
  window.addEventListener('resize', fixMarquee);

  homeAnimation();
  homeMusic();
  fullScreenToggle();

  document.documentElement.classList.add('home-loaded');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
