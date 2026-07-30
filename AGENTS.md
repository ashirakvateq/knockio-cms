# AGENTS.md — Knockio CMS

> **THIS FILE IS LAW.** Every LLM, agent, or human contributor MUST read and follow these instructions. Violations result in broken builds, slow pages, and wasted time. No exceptions.

---

## ⚠️ MANDATORY FIRST STEP: Codebase Knowledge Graph (codebase-memory-mcp)

> **BEFORE writing a single line of code, BEFORE reading any file, BEFORE making any changes — you MUST orient yourself using the codebase knowledge graph.**

When starting a **new session** (no prior conversation history), you MUST run these MCP tools **in this exact order** before doing anything else:

1. **`get_architecture`** — understand the project structure, clusters, entry points, and hotspots at a glance
2. **`search_graph`** — find the functions, components, layouts, pages, and patterns relevant to your task
3. **`trace_path`** — understand who calls what, what depends on what, before touching any file
4. **`get_code_snippet`** — read the actual source of key functions/components to learn conventions

**Why this is non-negotiable:**
- Prevents duplicating existing components or patterns
- Reveals the real dependency graph (not just folder structure)
- Surfaces hotspots, dead code, and refactor candidates immediately
- Ensures you follow existing conventions instead of inventing new ones

**Example — before migrating a page:**
```
1. get_architecture(project="knockio-cms")           → see all clusters, entry points
2. search_graph(query="BaseLayout", project=...)     → find the layout component
3. search_graph(query="Header Footer", project=...)  → find shared components
4. trace_path(function_name="BaseLayout", ...)       → see what it imports/calls
5. get_code_snippet(qualified_name="BaseLayout")     → read the actual code
```

**Example — before adding a new component:**
```
1. search_graph(query="similar component name")      → check if it already exists
2. search_graph(label="Function", query="...")       → find related functions
3. get_code_snippet(...)                             → study existing patterns
```

> **NEVER skip this step. NEVER assume you know the codebase from file names alone. The graph is the source of truth.**

---

## Project Identity

**Knockio.com** — marketing site and CMS for a field service software platform.

- **Framework**: Astro 7 (SSG mode)
- **Deployment**: Cloudflare Workers (static assets only)
- **Package Manager**: Bun (never npm/yarn/pnpm)
- **Goal**: Migrate WordPress/ Vanilla HTML CSS pages to high-performance, SEO-optimized Astro pages

---

## Commands

```bash
bun install          # install deps
bun run dev          # dev server at localhost:4321
bun run build        # astro build → dist/
bun run deploy       # build + wrangler deploy (production)
bun run preview      # build + wrangler dev (local Worker preview)
```

No lint, typecheck, or test scripts exist. Run `bunx astro check` manually if needed.

---

## Core Philosophy: HTML First, JavaScript Last

This project builds **content-driven marketing pages** optimized for Google Core Web Vitals. Every decision must prioritize:

1. **Zero JavaScript** for static content (text, images, lists, FAQs)
2. **CSS-first interactions** (hover, focus, transitions, accordions via `<details>`)
3. **Deferred JavaScript** only when absolutely necessary (forms, calendars, analytics)
4. **No render-blocking resources** (all scripts use `defer` or `async`)

### The Golden Rule

> **If it can be HTML, it MUST be HTML. If it can be CSS, it MUST be CSS. JavaScript is a last resort.**

---

## CRITICAL: What NOT to Do

### NEVER Generate HTML as JavaScript Strings

```astro
❌ WRONG — DO NOT DO THIS:
---
const html = `<section><h1>${title}</h1></section>`;
---
<div set:html={html} />

❌ WRONG — DO NOT DO THIS:
---
const faqItems = faqs.map(faq => `<details><summary>${faq.q}</summary><p>${faq.a}</p></details>`).join('');
---
<div set:html={faqItems} />
```

**Why this is forbidden:**
- Bypasses Astro's HTML optimization
- No automatic escaping (XSS risk)
- No component composition
- Breaks scoped styles
- Slower rendering

```astro
✅ CORRECT — Write HTML directly:
---
const { faqs } = Astro.props;
---
<section>
  <h1>{title}</h1>
  {faqs.map(faq => (
    <details>
      <summary>{faq.q}</summary>
      <p>{faq.a}</p>
    </details>
  ))}
</section>
```

### NEVER Put Static Content in Data Files

```typescript
❌ WRONG — src/data/faqs.ts:
export const faqs = [
  { q: "How much does it cost?", a: "$20-$60 per user/month..." },
  { q: "How long to set up?", a: "Same day..." },
];

❌ WRONG — Then looping in Astro:
{faqs.map(faq => <details>...</details>)}
```

**Why this is wrong:**
- FAQs, feature lists, pricing tables are **static content**
- They belong in HTML, not TypeScript arrays
- Data files are for **dynamic data** (API responses, user input)

```astro
✅ CORRECT — Write static content directly in HTML:
<section class="faq">
  <h2>Frequently Asked Questions</h2>
  
  <details>
    <summary>How much does it cost?</summary>
    <p>$20-$60 per user/month. Every feature on every plan.</p>
  </details>
  
  <details>
    <summary>How long to set up?</summary>
    <p>Same day. Import customers, invite crew, book first job.</p>
  </details>
</section>
```

### NEVER Use JavaScript for CSS-Only Effects

```astro
❌ WRONG — Using JS for hover effects:
<script>
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', () => card.classList.add('hover'));
    card.addEventListener('mouseleave', () => card.classList.remove('hover'));
  });
</script>

✅ CORRECT — Use CSS:
<style>
  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  }
</style>
```

### NEVER Use `client:load` Unless Absolutely Necessary

```astro
❌ WRONG — Loading a static carousel immediately:
<Carousel client:load />

✅ CORRECT — Load only when visible:
<Carousel client:visible />

✅ CORRECT — Load when browser is idle:
<Analytics client:idle />
```

---

## Astro Paradigm: Mandatory Rules

### 1. Components Render to HTML, Not JavaScript

Every `.astro` component compiles to **pure HTML** at build time. Zero JavaScript sent to browser unless you explicitly add:
- `<script>` tags (processed, bundled, deferred)
- `client:*` directives on framework components (React, Svelte, etc.)

**Default behavior:**
```astro
<!-- This component sends ZERO JavaScript to the browser -->
<Header />
<Hero />
<Features />
<FAQ />
<Footer />
```

### 2. Islands Architecture: Opt In to JavaScript

Only add JavaScript when you need **interactivity** (clicks, form submissions, API calls):

| Directive | When to Use | Example |
|-----------|-------------|---------|
| `client:load` | Above-fold, critical interactivity | Search bar, login form |
| `client:idle` | Below-fold, non-critical | Analytics, chat widget |
| `client:visible` | Loads when scrolled into view | Carousel, video player |
| `client:media` | Conditional on screen size | Mobile-only menu |
| `client:only` | Client-only libraries (no SSR) | Map library, WebGL |

**Rule:** Use the **most lazy** directive possible. `client:visible` > `client:idle` > `client:load`.

### 3. CSS Inclusion Methods (in order of preference)

1. **Scoped `<style>` in `.astro` components** (default, auto-scoped)
2. **Imported CSS in frontmatter** (`import '../styles/page.css'`)
3. **Tailwind utility classes** (for rapid prototyping)
4. **Global `<style is:global>`** (only in BaseLayout for resets)
5. **External `<link>` tags** (only for third-party CDNs)

**Cascading order** (lowest to highest):
```
<link> tags → Imported CSS → Scoped <style>
```

### 4. JavaScript Inclusion Methods

| Method | Bundled? | Deferred? | Use For |
|--------|----------|-----------|---------|
| `<script>` in `.astro` | YES | YES | Component behavior |
| `<script src="../x.js">` | YES | YES | External local scripts |
| `<script is:inline defer>` | NO | YES | Third-party scripts |
| `client:*` on framework | YES | VARIES | Interactive islands |

**Rule:** Third-party scripts (analytics, chat, calendars) MUST use `<script is:inline defer>`.

### 5. Layouts: One Shell, Many Pages

```astro
---
// src/layouts/BaseLayout.astro
import '../styles/global.css';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';

const { title, description } = Astro.props;
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
  </head>
  <body>
    <Header />
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

**Rules:**
- One layout per page
- Global CSS imported ONCE in layout
- `<slot />` for page content injection
- Named slots for multiple content areas

### 6. Images: Optimize Everything

| Storage | Component | Use For |
|---------|-----------|---------|
| `src/assets/` | `<Image />` | Content images, hero images |
| `public/assets/` | `<img>` | Favicons, OG images, unprocessed |

**Rules:**
- Always use `<Image />` for content images (auto WebP/AVIF, lazy loading, CLS prevention)
- Always provide `alt` text
- Set `loading="eager"` for above-fold images
- Use `<Picture />` for art direction (multiple formats)

### 7. Fonts: Use Astro's Fonts API

```js
// astro.config.mjs
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  fonts: [{
    provider: fontProviders.fontsource(),
    name: 'Manrope',
    cssVariable: '--font-manrope',
    weights: [400, 500, 600, 700],
    styles: ['normal'],
  }],
});
```

**Rules:**
- Prefer variable fonts (one file, all weights)
- Preload only critical fonts
- Specify only weights actually used

---

## Folder Structure

```
knockio-cms/
├── src/
│   ├── components/        Reusable .astro components (Header, Footer, SEO)
│   ├── layouts/           Page shells (BaseLayout.astro)
│   ├── pages/             **REQUIRED** — each file = a route
│   │   ├── index.astro
│   │   ├── canvassing-app.astro
│   │   └── [...slug].astro
│   ├── styles/            CSS files (global.css, page-specific.css)
│   ├── scripts/           Client-side JS (cal-inline.js, reveal-on-scroll.js)
│   ├── data/              TypeScript data exports (ONLY for dynamic data)
│   ├── content/           Markdown content collections
│   └── assets/            Images to be optimized by Astro
├── public/                Static files (favicon, robots.txt, unprocessed images)
│   └── assets/            Per-page static assets
├── resources/
│   ├── legacy-src/        WordPress source files (HTML, CSS, JS)
│   ├── plans/             Implementation plans and guides
│   ├── sprints/           Sprint walkthrough docs
│   └── scripts/           One-time utility scripts
├── astro.config.mjs
├── tsconfig.json
└── package.json
```

**Rules:**
- `src/pages/` is the ONLY required directory
- Files in `src/` are processed (bundled, optimized)
- Files in `public/` are copied as-is (no processing)
- Images needing optimization go in `src/assets/`
- Static images (favicons, OG) go in `public/assets/`
- **Shared images** (used across multiple pages) go in `public/assets/cfw/` — this includes logos, app store buttons, and any asset referenced by more than one page. Always source from `/assets/cfw/`, never duplicate shared images into per-page asset folders.

---

## Migration Workflow: WordPress → Astro

> **STOP — Have you queried the knowledge graph yet?** Before migrating ANY page, you MUST run `get_architecture` and `search_graph` to find existing layouts, components, and patterns. Skipping this causes duplicated code and broken conventions.

### Source Files Location

```
resources/legacy-src/
├── pages/         HTML files from WordPress
├── css/           CSS files (same name as HTML file)
└── js/            JavaScript files (same name as HTML file)
```

### Conversion Process

1. **Read the legacy HTML** from `resources/legacy-src/pages/{page-name}.html`
2. **Read the legacy CSS** from `resources/legacy-src/css/{page-name}.css`
3. **Read the legacy JS** from `resources/legacy-src/js/{page-name}.js` (if exists)
4. **Create new Astro page** at `src/pages/{page-name}.astro`
5. **Create page-specific CSS** at `src/styles/{page-name}.css`
6. **Download all images** referenced in CSS/HTML to `public/assets/{page-name}/`
7. **Convert HTML to Astro components** (static HTML, no JS strings)
8. **Convert CSS to Astro conventions** (scoped styles, Tailwind where appropriate)
9. **Convert JS to Astro scripts** (only if truly interactive)

### Critical Rules

- **Visual fidelity**: The Astro page must look identical to the WordPress page
- **Download all images**: Never use WordPress URLs in production code
- **Trailing slashes**: All internal links must end with `/` (matches WordPress permalinks)
- **No blocking resources**: All scripts use `defer` or `async`
- **Mobile-first**: Test on mobile viewport before shipping

---

## Performance Checklist

Before shipping ANY page, verify:

- [ ] All content images use `<Image />` component
- [ ] Above-fold images have `loading="eager"`
- [ ] Below-fold images are lazy-loaded (default)
- [ ] JavaScript limited to interactive elements only
- [ ] Third-party scripts use `<script is:inline defer>`
- [ ] CSS is scoped to components (not global)
- [ ] Fonts preloaded (only critical weights)
- [ ] Layout provides proper `<head>` meta tags
- [ ] Mobile viewport tested
- [ ] No render-blocking resources in `<head>`
- [ ] No HTML generated as JavaScript strings
- [ ] No static content in data files

### Core Web Vitals Targets

| Metric | Target | How |
|--------|--------|-----|
| **LCP** | < 2.5s | SSG + `<Image loading="eager">` + preload fonts |
| **INP** | < 200ms | Minimal JS + CSS interactions |
| **CLS** | < 0.1 | `<Image />` auto width/height + font fallbacks |

---

## Anti-Patterns: Instant Rejection

### CSS Anti-Patterns

| Anti-Pattern | Why It's Bad | Do This |
|-------------|-------------|---------|
| One giant `global.css` | No scoping, specificity wars | Scoped `<style>` per component |
| `<style is:global>` for components | Leaks to all pages | Scoped `<style>` (default) |
| CSS in `public/` via `<link>` | Not bundled, render-blocking | Import in `src/` via frontmatter |
| `!important` everywhere | Specificity nightmare | Proper selectors |
| Inline `style=""` for layout | Not maintainable | Tailwind or scoped CSS |

### JavaScript Anti-Patterns

| Anti-Pattern | Why It's Bad | Do This |
|-------------|-------------|---------|
| `client:load` on everything | Massive JS payload | `client:visible` or `client:idle` |
| `<script is:inline>` for your JS | No bundling, render-blocking | Processed `<script>` tags |
| jQuery or heavy DOM libraries | Astro = minimal JS | Vanilla JS or framework islands |
| JS for CSS-only effects | Unnecessary JS | CSS `:hover`, `<details>`, transitions |
| HTML as JS strings (`const html = \`...\``) | Bypasses optimization | Write HTML directly |
| Static content in data files | Unnecessary abstraction | Write HTML directly |

### Layout Anti-Patterns

| Anti-Pattern | Why It's Bad | Do This |
|-------------|-------------|---------|
| No layout, repeat `<html>` everywhere | DRY violation | One BaseLayout |
| Multiple layouts with different `<head>` | SEO inconsistency | One base, nest specialized |
| Layout with hardcoded content | Not reusable | Props + `<slot />` |
| Importing global CSS in every page | Duplicate imports | Import once in layout |

### Asset Anti-Patterns

| Anti-Pattern | Why It's Bad | MUST Do This |
|-------------|-------------|---------|
| All images in `public/` | No optimization | Store in `src/assets/`, use `<Image />` |
| `<img>` without width/height | CLS (layout shift) | Use `<Image />` |
| External URLs in CSS `background-image` | Can break, no optimization | Download to `src/assets/` |
| Self-hosting video files | Huge payload | Use Cloudflare Stream, Mux, YouTube |
| Loading all font weights | Unnecessary payload | Specify only weights used |
| Duplicating shared images per-page | Wasted bytes, stale copies | Store in `public/assets/cfw/`, source from `/assets/cfw/` |

---

## Key Conventions

> **Remember:** Use `search_graph` and `get_code_snippet` to discover existing patterns BEFORE implementing new features. The knowledge graph prevents reinventing the wheel.

- **Trailing slash always on**: `trailingSlash: 'always'` in `astro.config.mjs`. Every internal link must end with `/`.
- **Package manager is Bun**: Lockfile is `bun.lock`. Never generate `package-lock.json` or `yarn.lock`.
- **Tailwind CSS v4**: Via `@tailwindcss/vite` plugin. Import `@import "tailwindcss"` in a CSS file.
- **Icons**: `lucide-astro` — import individual icons, not the whole set.
- **Fonts**: Astro Fonts API — families registered in `astro.config.mjs` (`fonts:`), rendered via `<Font cssVariable="--font-manrope" preload />` in every layout's `<head>`. Reference in CSS as `var(--font-manrope)`. Never `import "@fontsource/*"` directly (that defers `@font-face` into external CSS and causes FOUT).
- **Draft pages**: Set `draft: true` in frontmatter to exclude from production build.
- **CSS images**: The css can have set images for backgrounds using  "URLs" as property values. e.g. "background-image:url(<https://knockio.com/wp-content/uploads/2026/07/blurb-bg-new.png>)" backegrounds, YOU MUST DOWNLOAD those files to the relevant per page assets folder, and use it from there, OLD urls for images cant be used !!
---

## Architecture

Two kinds of pages coexist:

| Type | Path | How It Works |
|------|------|--------------|
| Content collection | `src/content/pages/*.md` → `src/pages/[...slug].astro` | Markdown with frontmatter |
| Hand-crafted | `src/pages/canvassing-app.astro` | Full control, imports data from `src/data/` |

**Content schema** (`src/content.config.ts`): `title`, `slug`, `metaDescription` (max 160), `ogImage?`, `publishDate?`, `draft` (default false).

**Adding a content page**: Create `.md` in `src/content/pages/`, set `slug` in frontmatter. URL = `/{slug}/`.

**Adding a custom page**: Create `.astro` in `src/pages/`, import layout + data + styles directly.

---

## Wrangler / Deploy

`wrangler.jsonc` serves `dist/` as static assets only. No server-side endpoints yet.

First deploy requires `bunx wrangler login`.

---

## Future: TinaCMS Integration

This project will eventually integrate **TinaCMS** for content management. When that happens:

- Content collections will be managed by TinaCMS
- Markdown files will be edited via TinaCMS UI
- Schema definitions will live in `tina/config.ts`
- No changes to Astro component structure required

**For now:** Continue using manual Markdown files and hand-crafted `.astro` pages.

---

## Env Vars

| Variable | Purpose |
|----------|---------|
| `PUBLIC_GTM_ID` | Google Tag Manager container ID (optional, Analytics component is silent without it) |

---

## Sprint Walkthrough Docs

When asked to create a sprint walkthrough:

1. Create `resources/sprints/sprint-N-[short-task-name].md`
2. Increment N from highest existing sprint number
3. Include: Goal, Problem, Solution, Files Changed, Files NOT Changed, External Config Changes, Why This Works, Expected Impact, Architecture Decisions

---

## Final Reminder

**This project builds Google-optimized marketing pages.** Every line of code must serve one of these goals:

1. **Fast page load** (LCP < 2.5s)
2. **Fast interactivity** (INP < 200ms)
3. **Visual stability** (CLS < 0.1)
4. **SEO-friendly** (semantic HTML, proper meta tags)
5. **Accessible** (alt text, ARIA labels, keyboard navigation)

If your code doesn't serve these goals, **don't write it.**

---

## ⚠️ REMINDER: Always Start with the Knowledge Graph

**Every new session MUST begin with codebase-memory-mcp queries.** This is not optional. This is not a suggestion. This is required.

Before you:
- Write any code → `search_graph` to find existing patterns
- Read any file → `get_architecture` to understand context first
- Migrate any page → `trace_path` to understand dependencies
- Add any component → `search_graph` to check if it already exists

**The knowledge graph is your map. Never navigate blind.**

---

## Reference

Full Astro paradigm guide: `resources/plans/astro-paradigm-guide.md`

Migration playbook: `resources/plans/wordPress-to-tocloudflare-workers-one-page-a-time.md`
