// This file makes the site feel like it's "wiping" from one page to the
// next, using the black/blue curtain defined in Curtain.astro.
//
// Astro's client router (astro:transitions, turned on in BaseHead.astro)
// is what makes this possible: when you click an internal link, Astro
// fetches the new page in the background and swaps its content into the
// current document, WITHOUT the browser doing a real reload. That's
// different from normal websites, and it's the reason background music
// and fullscreen mode survive "navigating" to a different page — the
// browser tab never actually leaves the current page, so nothing gets
// reset. See BaseHead.astro and index.astro/PageLayout.astro's <audio>
// tags for the other two pieces of that puzzle.
//
// This file's only job: play the curtain wipe at the right moments during
// that swap, so it still *feels* like a page transition even though,
// technically, nothing ever unloaded.

// How long the "cover" animation takes, in milliseconds. We wait this long
// before letting Astro actually swap in the new page, so the curtain has
// fully closed and the swap happens invisibly behind it.
const COVER_MS = 550; // must comfortably exceed the CSS transition + stagger

// Slides the curtain closed. Returns a Promise — think of a Promise as an
// IOU for a value that isn't ready yet. Here, the "value" is just "done
// waiting"; whoever calls coverCurtain() can `await` it to pause until the
// 550ms animation has had time to finish.
function coverCurtain(): Promise<void> {
  // querySelector finds the first element matching a CSS selector — here,
  // the single <div class="curtain"> from Curtain.astro.
  const curtain = document.querySelector<HTMLElement>('.curtain');
  if (!curtain) return Promise.resolve(); // nothing to animate, resolve immediately

  curtain.classList.remove('curtain-instant');
  curtain.classList.remove('curtain-reveal');
  curtain.classList.add('curtain-cover'); // triggers the CSS transition in Curtain.astro

  // setTimeout runs a function after a delay. Wrapping it in `new
  // Promise(...)` is what lets other code `await coverCurtain()` and pause
  // until that timer fires.
  return new Promise((resolve) => window.setTimeout(resolve, COVER_MS));
}

// Slides the curtain open again, revealing whatever page is now loaded.
function revealCurtain() {
  const curtain = document.querySelector<HTMLElement>('.curtain');
  if (!curtain) return;

  // requestAnimationFrame runs a function right before the browser's next
  // paint. Nesting two of them (rAF inside a rAF) forces the browser to
  // actually paint the "covered" state on screen for one frame first —
  // otherwise it might notice we add and remove classes in the same tick
  // and skip straight to the end state, and the wipe would never be seen.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      curtain.classList.remove('curtain-instant');
      curtain.classList.remove('curtain-cover');
      curtain.classList.add('curtain-reveal'); // triggers the CSS transition in Curtain.astro

      // Drives .close-page's slide-down entrance (see main.css) — its own
      // transition-delay staggers it just after the curtain finishes. Since
      // <html> persists across navigations but Astro resets its class
      // attribute to each page's server-rendered defaults on swap, this
      // has to be re-added on every page-load, not just the first.
      document.documentElement.classList.add('is-ajax-page-visible');
    });
  });
}

// `transitionInFlight` is a simple on/off flag shared by the two listeners
// below. Without it, clicking a second link (or the same one twice) while
// the curtain is still covering would try to start a second transition on
// top of the first one and throw an error — this just makes the site
// ignore extra clicks until the current transition has actually finished.
let transitionInFlight = false;

// astro:before-preparation is a custom event Astro fires the instant you
// click an internal link — before it has fetched anything. `event.loader`
// is the function Astro would normally run right away to fetch the new
// page; by replacing it with our own async function that awaits
// coverCurtain() first, we delay that fetch+swap until the curtain has
// finished closing. This exact pattern (wrap event.loader, call the
// original at the end) is Astro's documented way to hook into navigation.
document.addEventListener('astro:before-preparation', (event) => {
  if (transitionInFlight) return;
  transitionInFlight = true;

  const originalLoader = event.loader;
  event.loader = async () => {
    await coverCurtain();
    await originalLoader();
  };
});

// astro:after-swap fires right after the new page's content has replaced
// the old page's — this is where we allow the next transition to start.
document.addEventListener('astro:after-swap', () => {
  transitionInFlight = false;
});

// astro:page-load fires once everything has settled — on the very first
// visit to the site AND after every later swap. Using this one event for
// both cases (instead of also listening for the browser's own
// DOMContentLoaded) is what lets this same code correctly open the curtain
// whether it's the first page you ever loaded or your fifth click.
document.addEventListener('astro:page-load', revealCurtain);
