// This file defines the "shape" of every blog post in src/content/projects/.
// It's how Astro's Content Collections feature turns a folder of markdown
// files into type-checked data you can loop over in a page (see
// src/pages/projects/index.astro for that part).
//
// Nothing here is optional magic — every .md file in that folder MUST have
// frontmatter (the --- fenced block at the top) matching this schema, or
// Astro will fail the build with a clear error telling you what's missing.
// That's the whole point: a typo'd date or a missing title gets caught
// immediately instead of silently breaking the live site.
import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  // "content" = markdown/MDX files that live in this project (as opposed to
  // "data" collections, which are JSON/YAML — not used here).
  type: 'content',

  // `z` is Zod, a small library for describing what a valid piece of data
  // looks like. Each line below is one frontmatter field a post can have.
  schema: ({ image }) =>
    z.object({
      title: z.string(), // required — the big headline
      excerpt: z.string(), // required — the one-line summary on the card
      // Free-form tag, shown in the meta row — e.g. "Project", "Guide", "Note".
      // Mixed content lives in one collection, distinguished by this label.
      category: z.string(),
      pubDate: z.date(), // required — controls sort order, newest first
      cover: image().optional(), // optional cover photo (Astro validates + optimizes it)
      coverAlt: z.string().optional(), // alt text for the cover photo
      repoUrl: z.string().url().optional(), // optional "view source" link
      // .optional() = the field can be left out of a post's frontmatter entirely.
      // .default(false) = if left out, Astro treats it as `false` automatically.
      draft: z.boolean().default(false), // set draft: true to hide a post without deleting it
    }),
});

// Astro looks for this exact export name. The key "projects" here is what
// matches the folder name src/content/projects/ and what you pass to
// getCollection('projects') elsewhere in the code.
export const collections = { projects };
