# AGENTS.md — Knockio CMS

## What this is

Knockio.com marketing site and CMS. Astro 7 SSG deployed to Cloudflare Workers (static assets). Actively migrating pages from WordPress one URL at a time — see `resources/plans/` for the playbook.

## Commands

```bash
bun install          # install deps — never use npm/yarn/pnpm
bun run dev          # dev server at localhost:4321
bun run build        # astro build → dist/
bun run deploy       # build + wrangler deploy (production)
bun run preview      # build + wrangler dev (local Worker preview)
```

No lint, typecheck, or test scripts exist. Run `bunx astro check` manually if needed.

## Architecture

Two kinds of pages coexist:

| Type | Path | How it works |
|------|------|--------------|
| Content collection | `src/content/pages/*.md` → `src/pages/[...slug].astro` | Markdown with frontmatter, dynamic route renders them all |
| Hand-crafted | `src/pages/canvassing-app.astro` (and future `.astro` pages) | Full control, imports data from `src/data/` |

**Content schema** (`src/content.config.ts`): `title`, `slug`, `metaDescription` (max 160), `ogImage?`, `publishDate?`, `draft` (default false).

**Adding a content page**: create `.md` in `src/content/pages/`, set `slug` in frontmatter. URL = `/{slug}/`.

**Adding a custom page**: create `.astro` in `src/pages/`, import layout + data + styles directly.

## Key conventions

- **Trailing slash is always on.** `trailingSlash: 'always'` in `astro.config.mjs`. Every internal link and slug must end with `/`. This matches the WordPress permalink style — breaking it causes 404s on migrated URLs.
- **Package manager is Bun.** Lockfile is `bun.lock`. Do not generate `package-lock.json` or `yarn.lock`.
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin (not the old PostCSS setup). Import styles in components/pages as needed.
- **Icons**: `lucide-astro` — import individual icons, not the whole set.
- **Fonts**: `@fontsource-variable/manrope` imported in `BaseLayout.astro`.
- **Assets**: images live in `public/assets/canvassing-app/`. Reference as `/assets/canvassing-app/...`.
- **Data files**: `src/data/canvassingApp.ts` exports all copy, pricing, FAQs, feature lists. New pages should follow this pattern — keep content data separate from templates.
- **Draft pages**: set `draft: true` in frontmatter to exclude from production build.

## Wrangler / deploy

`wrangler.jsonc` serves `dist/` as static assets only. No server-side endpoints yet. Comment in config notes where to add `run_worker_first` if `/api/*` routes are needed later.

First deploy requires `bunx wrangler login`.

## Migration context

The site is being migrated from WordPress to Workers one page at a time. Each migrated page gets a Workers Route in the Cloudflare dashboard (`/page-slug*`). The homepage should be migrated last. See `resources/plans/wordPress-to-tocloudflare-workers-one-page-a-time.md` for the full checklist, rollback process, and pitfalls (trailing slash mismatch, stale cache, GTM domain-gating).

## IMPORTANT Migration & Redeisgn of Pages instrcutions:
- Must follow the users prompt, to  redesign the new astro counter part of an html page place at /resources/legacy-src/pages
- The css utilized by the html pages can be found  in /resources/legacy-src/css/ with the same file name as teh html file,  **The css must be followed and accomodated in astro css conventions, as the goal is to create an exactly visual duplicate of the old wordpress counterpart**.
- The css can have set images for backgrounds using  "URLs" as property values. e.g. "background-image:url(<https://knockio.com/wp-content/uploads/2026/07/blurb-bg-new.png>)" backegrounds, YOU MUST DOWNLOAD those files to the relevant per page assets folder, and use it fro there, OLD urls for images cant be used !!
- ALL other images mentioned in any leagacy-src/ css,html,js files,  relating to first party assets, should be downloaded and kept in per-page assets folder. so astro can access it from there
- The Javascript applied to the html pages can be found  in /resources/legacy-src/css/ with the same file name as teh html file,  **The javascript must be followed as the goal is to create an exactly visual duplicate of the old wordpress counterpart**.

## Env vars

| Variable | Purpose |
|----------|---------|
| `PUBLIC_GTM_ID` | Google Tag Manager container ID (optional, Analytics component is silent without it) |



## Sprint Walkthrough Docs

When the user asks to summarize, document, or create a sprint walkthrough:

1. Create a markdown file in `resources/sprints/` with naming convention: `sprint-N-[short-task-name].md` (e.g., `sprint-1-tbt-reduction-third-party-deferral.md`)
2. Increment N from the highest existing sprint number in `resources/sprints/`
3. The doc must include:
   - **Goal** — one-line objective
   - **Problem** — what was broken/slow/bad before
   - **Solution** — what was done and why
   - **Files Changed** — list every file with NEW/MODIFIED/DELETED tag and a brief description of significant changes
   - **Files NOT Changed (but relevant)** — files that benefit from changes without being edited
   - **External config changes** — GTM, Cloudflare dashboard, env vars, etc. (user actions outside code)
   - **Why This Works** — technical rationale for the approach
   - **Expected Impact** — before/after metrics if applicable
   - **Architecture Decisions** — any non-obvious choices (global vs per-page, library choice, etc.)
4. Add a `## Dir structure and File map` section entry for `resources/sprints/` if not already present

## Dir structure and File map

```
knockio-cms/
├
├─ public/
│  └─ assets/                           Assets for astro pages
│     ├─ canvassing-app/                Example of a per page asset folder
│     └─ storm-restoration-roofing/     Example of a per page assets folder
│
│
│
├─ resources/                           Resources for the project to be utilized by LLM
│  ├─ legacy-src/                       Files of Wordpress Source Project (LLM will use these)
│  │  ├─ css/                           Css files cherry picked from old wordpress
│  │  ├─ js/                            JS files cherry picked from old wordpress
│  │  └─ pages/                         Html files cherry picked from old wordpress
│  │
│  ├─ plans/                            Implementation plans for the new astro project
│  ├─ sprints/                          Sprint walkthrough docs (sprint-N-[name].md)
│  └─ scripts/                          Onetime run scripts and tools for the project
│
└─ src/
    ├── components/                     Analytics.astro, SEO.astro, ThirdPartyWidgets.astro
    ├── content/pages/                  Markdown marketing pages (content collection)
    ├── data/                           TypeScript data exports (copy, pricing, FAQs)
    ├── layouts/                        BaseLayout.astro (shared shell)
    ├── pages/                          index.astro, [...slug].astro, canvassing-app.astro
    ├── scripts/                        Client JS (canvassing-app.js)
    ├── styles/                         Tailwind CSS (global.css, canvassing-app.css)
    └── content.config.ts               Zod schemas for content collections

```
