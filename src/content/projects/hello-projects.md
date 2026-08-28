---
title: "Welcome to Projects"
excerpt: "What this section is for, and how to add a new post — it's just a markdown file."
category: "Update"
pubDate: 2026-08-28
---

This is the first entry in the Projects section — a mix of project write-ups
and shorter notes, sorted newest first on the [listing page](/projects).

## Adding a new post

Every entry here is one markdown file in `src/content/projects/`. To publish
a new one:

1. Create a new `.md` file in that folder (the filename becomes the URL slug).
2. Add frontmatter at the top:

```yaml
---
title: "Your post title"
excerpt: "One or two sentences shown on the listing card."
category: "Project"
pubDate: 2026-09-01
cover: "./some-image.jpg"   # optional
coverAlt: "Description"     # optional
---
```

3. Write the body in normal markdown below the frontmatter.
4. Save. That's it — the dev server picks it up immediately, and it ships
   the next time the site builds.

`category` is a free-text label (Project, Guide, Note, Update — whatever fits)
shown next to the date on both the card and the post page. `cover` is
optional; posts without one fall back to a plain dark panel instead of a
broken image.
