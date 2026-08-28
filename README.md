# Aurameow — Astro rebuild

This is a 1:1 rebuild of the original jQuery/PHP resume site in [Astro](https://astro.build).
Same look, same pages, same interactions — different, modern engine underneath.

## Getting started

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # outputs static site to dist/
npm run preview   # preview the production build locally
```

The output of `npm run build` is a fully static site (`dist/`) — deploy it to
Vercel, Netlify, Cloudflare Pages, GitHub Pages, or any static host.

Content (About page copy, client logos, project count, contact email) was
checked against the live site at resume-aurameow.vercel.app and matches it
exactly — the originally-supplied zip had some stale/in-progress edits that
diverged from what's actually deployed; live was treated as the source of
truth.

## What changed vs. the original

- **Framework**: plain jQuery-templated HTML → Astro components/pages. No client-side
  framework runtime is shipped — pages are static HTML with small islands of vanilla
  TypeScript for the interactive bits.
- **Page transitions**: the original's one-page-layout AJAX router (hash URLs,
  content injected over a persistent home page) is reproduced as a black/blue
  "curtain" wipe on every navigation — see `src/components/Curtain.astro` and
  `src/scripts/transitions.ts`. Every internal link click wipes the curtain
  closed, does a real navigation to the destination page (so every page still
  has its own shareable URL — `/about`, `/resume`, `/contact` — instead of
  hash routes), then wipes open again on arrival. Visually it reads the same
  as the original; technically it's real page loads instead of AJAX fragment
  swaps, which is more robust and SEO-friendly.
- **Contact form**: the old `send-mail.php` script needed a PHP server, which most
  modern static hosts don't provide. The form now posts to
  [Web3Forms](https://web3forms.com) (free, no backend required).
  **You must sign up at web3forms.com, grab your access key, and paste it into
  the hidden `access_key` input in `src/pages/contact.astro`** — until then the
  form will show an error on submit. (The *displayed* contact email on the
  page — `nanayaw @ skiff.com` — is just copied text, same as the live site;
  it doesn't have to be where Web3Forms actually delivers submissions to.)
- **Home intro animation**: rebuilt with modern [GSAP](https://gsap.com) (the
  spiritual successor to the old TweenMax/TimelineMax the original used).
- **Dropped dead code**: the original theme shipped a full portfolio grid (isotope
  masonry + magnific-popup lightbox), a blog, sticky sidebars, NProgress, and
  search — none of which were ever linked from the live site (portfolio/blog
  nav items were commented out, and no page had a `#secondary` sidebar).
  None of that is in the port.
- **Trimmed unused assets**: the original repo shipped ~19MB of images and
  8MB of audio, most of it belonging to that unused portfolio/blog section
  or leftover template photos (`case.jpg`, `macro.jpg`, `server.jpg`, an
  unused alternate music track, etc.). Only the assets actually referenced
  by the four live pages are included here (the 8 "Proud to work with"
  client logos included, since those are genuinely live).
- **Skill bars**: now rendered server-side from data at build time instead
  of being filled in by JavaScript after page load (same visual result,
  works even if JS fails to load, and no layout flash).

## Notes on things left as-is

- `about.jpg` and `testo-01.jpg` are placeholder graphics in the live site
  too (not a bug introduced by this port) — swap in real photos whenever
  you have them, at `public/images/site/`.
- The "Search" toggle in the header is decorative, exactly like the
  original (there's no blog/search index to query).
- Social links (Facebook/Twitter/LinkedIn/Instagram) still point to `#`
  as placeholders, same as the source. The "Download Cover Letter" button
  on the Resume page is also a dead `#` link on the live site — add a real
  file/href whenever you have one.
- The contact email display (`nanayaw @ skiff.com`, including the stray
  space before `@`) is copied verbatim from the live site.

## Project structure

```
src/
  components/    Curtain.astro (page-transition overlay)
  layouts/       Base <head> + the shared header/footer chrome for inner pages
  pages/         index.astro (home), about.astro, resume.astro, contact.astro, 404.astro
  scripts/       main.ts (site-wide UI), home.ts (intro animation + music player),
                 contact.ts (form submission), transitions.ts (curtain wipe on navigation)
public/
  css/           normalize/bootstrap/main/768 css, ported unchanged, plus fonts
  images/, audio/
```
