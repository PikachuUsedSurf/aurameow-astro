---
title: "Building This Projects Section"
excerpt: "Borrowing a card-grid layout from pianos.pub's blog and reskinning it in this site's own black/blue/Anton identity, backed by Astro Content Collections."
category: "Project"
pubDate: 2026-08-29
---

The page you're reading this on didn't exist a day ago. The brief was simple
to say and a little fuzzy to execute: take the editorial card-grid style from
[pianos.pub's blog](https://pianos.pub/blog) — hairline borders, a meta row
of category/date/read-time, a big headline, an underlined "Read article"
link — and make it feel like it always belonged on this site.

## Structure vs. skin

The trick was separating what to borrow from what to translate:

- **Borrowed**: the grid of bordered cards, the meta-row format, the
  breadcrumb-free minimal post layout.
- **Translated**: pianos.pub's neutral grays became this site's black
  (`#111`), its accent color became the same blue (`#1851f1`) already used
  for the curtain wipe and the home menu's hover state, and category tags
  without a cover image fall back to a black panel set in Anton — the same
  font the home page's ABOUT / RESUME / CONTACT menu uses.

That last detail matters more than it sounds: it means a project post
without a photo doesn't look like a broken placeholder, it looks like a
deliberate design choice that ties back to the rest of the site.

## Content without a CMS

Posts are plain markdown files read through
[Astro Content Collections](https://docs.astro.build/en/guides/content-collections/) —
no headless CMS, no extra account, no dependency that can go down. A schema
in `src/content/config.ts` type-checks each post's frontmatter at build
time, so a typo'd date or a missing title fails the build instead of
shipping silently broken.

The whole section — grid, cards, individual post pages, the fallback panel —
is three new files and one schema. Adding the next post is just a markdown
file away.
