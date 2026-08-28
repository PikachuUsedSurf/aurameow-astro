import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      excerpt: z.string(),
      // Free-form tag, shown in the meta row — e.g. "Project", "Guide", "Note".
      // Mixed content lives in one collection, distinguished by this label.
      category: z.string(),
      pubDate: z.date(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      repoUrl: z.string().url().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { projects };
