---
title: "The Close Button That Wasn't There"
excerpt: "A quick note on a subtle porting bug: the inner pages had the wrong template entirely, and it took comparing live DOM trees to catch it."
category: "Note"
pubDate: 2026-08-28
---

Every inner page on the original site — About, Resume, Contact — is an
AJAX-injected fragment with no header or footer, just a floating black "X"
fixed at the top of the screen that closes back to home. Simple enough to
describe. Easy to miss entirely when porting.

The first pass at the Astro version used the theme's classic full-page
template instead — complete with a header, nav, and footer that never
actually appear on the live site. It looked plausible. It just wasn't what
was really there.

The fix was to stop trusting the ported code and pull the real DOM tree,
computed CSS, and the site's own JS bundle straight from the live page. That
surfaced the actual markup (`.close-page`, `.one-page-content`) and the exact
CSS driving the slide-down entrance — which dropped straight into the Astro
version with no guesswork.

**Takeaway**: when the goal is matching something that already exists, go
look at the thing that already exists. Reading the port in isolation will
only tell you whether it's internally consistent, not whether it's right.
