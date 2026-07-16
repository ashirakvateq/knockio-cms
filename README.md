# xyz-astro-site

Marketing site built with [Astro](https://astro.build), deployed to Cloudflare Workers.

## Prerequisites

- [Bun](https://bun.sh) (package manager — do not use npm/yarn/pnpm)
- Node.js 22+ (Astro 7 requires `>=22.12.0`)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) (installed as a dev dependency)

## Getting started

```bash
bun install
bun run dev
```

The site runs at `http://localhost:4321` by default.

### Environment variables

| Variable | Purpose | Required |
|---|---|---|
| `PUBLIC_GTM_ID` | Google Tag Manager container ID | No — analytics component is silent without it |

Create a `.env` file for local development:

```
PUBLIC_GTM_ID=GTM-XXXXXXX
```

## Adding a new page

1. Create a markdown (`.md`) or MDX (`.mdx`) file in `src/content/pages/`:

   ```markdown
   ---
   title: "My New Page"
   slug: "my-new-page"
   metaDescription: "A short description for search engines."
   draft: false
   ---

   # My New Page

   Your content here.
   ```

2. The `slug` field determines the URL: `https://yourdomain.com/my-new-page/`
3. Set `draft: true` to keep the page out of the production build.
4. Commit the file and deploy — the sitemap updates automatically.

## Deploying

```bash
bun run deploy
```

This runs `astro build` then `wrangler deploy` in one step. The first deploy
requires Wrangler authentication:

```bash
bunx wrangler login
```

### One-time setup

After the first deploy, configure DNS and Routes in the Cloudflare dashboard
(separate from this repo). The Worker is deployed to `<name>.workers.dev` by
default.

## Project structure

```
src/
├── content/
│   ├── config.ts          # Content collection schemas (zod)
│   ├── pages/             # Marketing pages as markdown/MDX
│   └── blog/              # Blog posts (structure only, not published yet)
├── components/
│   ├── Analytics.astro    # GTM / tracking, env-gated
│   └── SEO.astro          # Meta tags, canonical, OG tags
├── layouts/
│   └── BaseLayout.astro   # Shared shell: <head>, header, footer, Analytics
├── pages/
│   ├── index.astro        # Placeholder homepage
│   └── [...slug].astro    # Dynamic route from content/pages collection
└── styles/
```

## Stack

- **Framework:** Astro (static output / SSG)
- **Deploy target:** Cloudflare Workers (static assets)
- **Package manager:** Bun
- **CMS-ready:** Content lives in markdown files with frontmatter — ready for TinaCMS or any git-based CMS
