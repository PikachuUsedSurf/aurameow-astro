// This file configures Astro itself (the framework/build tool), separately
// from anything about how the site looks. Astro reads this automatically
// every time you run `npm run dev` or `npm run build`.
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Astro uses this to generate correct absolute URLs (e.g. in the sitemap,
  // or canonical link tags) — update it to your real deployed domain.
  site: 'https://example.com',

  // "never" means routes never end in a slash: /about instead of /about/.
  // Purely a style choice — either works, this just keeps URLs consistent.
  trailingSlash: 'never',
});
