---
title: "Rebuilding This Site in Astro"
excerpt: "Same look, same interactions, a modern engine underneath — porting a jQuery/AJAX one-page theme to Astro without losing the feel."
category: "Project"
pubDate: 2026-08-20
---

The site you're looking at started life as a jQuery-templated WordPress
theme: one real page, with About/Resume/Contact swapped in over an AJAX
router using hash URLs. It worked, but it meant no shareable page URLs, no
SEO for inner pages, and a pile of jQuery plugins doing work a modern
framework gives you for free.

## What stayed the same

- The black/blue curtain wipe on every navigation
- The floating close button on inner pages
- The GSAP-powered home intro animation
- The overall visual language — same fonts, same layout, same feel

## What changed

- **Real routes.** `/about`, `/resume`, and `/contact` are now actual pages
  instead of AJAX fragments — shareable links, working browser back button,
  and search engines can actually index them.
- **No client framework runtime.** Pages ship as static HTML with small
  islands of vanilla TypeScript for the interactive bits — no React/Vue
  bundle weight for a resume site.
- **Server-rendered skill bars.** The resume page's progress bars render
  from data at build time instead of being filled in by JavaScript after
  the page loads.

The trickiest part wasn't the framework swap — it was making sure every
small interaction detail (the exact timing of the curtain wipe, the close
button's slide-down entrance) survived the move from "AJAX overlay on a
persistent page" to "real page, every time."
