# Astro Paradigm: Complete Reference Guide

> **Purpose**: This guide consolidizes official Astro documentation with real-world industry practices. It is the authoritative reference for how Astro projects should be structured, styled, scripted, and optimized. Every decision in this repo should align with these principles.

---

## Table of Contents

1. [How Astro Works](#1-how-astro-works)
2. [Folder Structure](#2-folder-structure)
3. [CSS & Styling](#3-css--styling)
4. [JavaScript & Scripts](#4-javascript--scripts)
5. [Layouts](#5-layouts)
6. [Assets: Images, Fonts, Media](#6-assets-images-fonts-media)
7. [Performance Checklist](#7-performance-checklist)
8. [Anti-Patterns to Avoid](#8-anti-patterns-to-avoid)

---

## 1. How Astro Works

### The Core Idea: Multi-Page App (MPA) with Islands

Astro is **not** a Single-Page Application (SPA) framework. It is a **Multi-Page Application (MPA)** framework that generates static HTML at build time (SSG) or on-demand (SSR). The key differentiator is **Islands Architecture**.

```
┌─────────────────────────────────────────────────────┐
│                    ASTRO PAGE                        │
│                                                     │
│  ┌──────────────────────────────────────────────┐   │
│  │  STATIC HTML (zero JS, rendered at build)    │   │
│  │  ┌────────┐  ┌────────┐  ┌────────┐         │   │
│  │  │ Header │  │  Main  │  │ Footer │         │   │
│  │  │ (HTML) │  │ (HTML) │  │ (HTML) │         │   │
│  │  └────────┘  └────────┘  └────────┘         │   │
│  │                                              │   │
│  │     🏝️ Island 1        🏝️ Island 2          │   │
│  │  ┌─────────────┐    ┌─────────────┐         │   │
│  │  │  Carousel   │    │  Search Bar │         │   │
│  │  │ (JS loaded  │    │ (JS loaded  │         │   │
│  │  │  on:visible)│    │  on:load)   │         │   │
│  │  └─────────────┘    └─────────────┘         │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
│  Browser receives: HTML + CSS immediately           │
│  JS loads ONLY for islands, when needed             │
└─────────────────────────────────────────────────────┘
```

### What This Means Practically

| Concept | What Happens |
|---------|-------------|
| **Astro components** (`.astro`) | Render to **pure HTML** at build time. Zero JS sent to browser. |
| **UI framework components** (React, Svelte, etc.) | Render to HTML by default. JS **stripped** unless you add `client:*` directive. |
| **`client:load`** | JS hydrates immediately on page load. Use for above-fold interactive elements. |
| **`client:idle`** | JS hydrates when browser is idle. Use for below-fold, non-critical interactivity. |
| **`client:visible`** | JS hydrates only when element scrolls into viewport. Use for carousels, animations. |
| **`client:media`** | JS hydrates at a specific CSS media query breakpoint. Use for mobile-only widgets. |
| **`client:only`** | Skips SSR entirely, renders only on client. Use for client-only libraries. |

### The Golden Rule

> **Every `.astro` component is static HTML by default. You must explicitly opt in to client-side JavaScript.** If you find yourself adding JS to every component, you're fighting the framework.

### SSG vs SSR

```
SSG (Static Site Generation)          SSR (Server-Side Rendering)
─────────────────────────────         ─────────────────────────────
Build time: HTML generated once       Request time: HTML generated per visit
Deploy: Static files to CDN           Deploy: Server process needed
Speed: Instant (cached)               Speed: Depends on server
Use: Marketing sites, blogs           Use: Personalized content, dashboards

THIS PROJECT = SSG (deployed to Cloudflare Workers as static assets)
```

---

## 2. Folder Structure

### Official Astro Convention

```
my-astro-project/
├── src/
│   ├── components/        Reusable UI pieces (Header.astro, Button.astro, Card.astro)
│   ├── layouts/           Page shells (BaseLayout.astro, PostLayout.astro)
│   ├── pages/             **REQUIRED** — each file = a route
│   │   ├── index.astro           → /
│   │   ├── about.astro           → /about/
│   │   ├── [...slug].astro       → dynamic catch-all route
│   │   └── blog/
│   │       └── [post].astro      → /blog/:post/
│   ├── styles/            CSS files (global.css, page-specific.css)
│   ├── scripts/           Client-side JS files (menu.js, analytics.js)
│   ├── data/              TypeScript data exports (copy, pricing, FAQs)
│   ├── content/           Content collections (Markdown, MDX)
│   │   ├── pages/
│   │   └── config.ts
│   └── assets/            Images to be optimized by Astro (NOT public/)
│       └── images/
├── public/                Static files, copied as-is (favicon, robots.txt, fonts)
│   ├── favicon.svg
│   ├── robots.txt
│   └── assets/            Per-page static assets (if needed)
├── astro.config.mjs       Astro configuration
├── tsconfig.json          TypeScript config
└── package.json
```

### Key Rules

1. **`src/pages/` is the ONLY required directory.** Everything else is convention.
2. **Files in `src/` are processed** — bundled, optimized, transformed by Astro/Vite.
3. **Files in `public/` are NOT processed** — copied verbatim to build output.
4. **Images that need optimization go in `src/`** (use `<Image />` component).
5. **Images that don't need processing go in `public/`** (favicons, OG images referenced by URL).

### Where Things Go — Decision Table

| Asset Type | Location | Why |
|-----------|----------|-----|
| Page templates | `src/pages/` | Required — creates routes |
| Reusable components | `src/components/` | Convention, importable |
| Layout shells | `src/layouts/` | Convention, importable |
| Global CSS | `src/styles/` | Imported in layouts, bundled by Astro |
| Page-specific CSS | `src/styles/` or scoped `<style>` | Scoped is preferred |
| Client JS | `src/scripts/` | Processed, bundled, tree-shaken |
| Content data | `src/data/` | TypeScript exports |
| Markdown content | `src/content/` | Content collections |
| Optimized images | `src/assets/` | Processed by `<Image />` |
| Static images | `public/assets/` | No processing, direct URL |
| Fonts (local) | `src/assets/fonts/` | Via Astro Fonts API |
| Favicon, robots.txt | `public/` | Must be at root |

---

## 3. CSS & Styling

Astro provides **6 distinct ways** to include CSS. Understanding when to use each is critical.

### Method Comparison

```
┌──────────────────────────────────────────────────────────────────────┐
│                      CSS INCLUSION METHODS                          │
├────────────────────────┬─────────────┬──────────┬───────────────────┤
│ Method                 │ Scoped?     │ Bundled? │ When to Use       │
├────────────────────────┼─────────────┼──────────┼───────────────────┤
│ <style> in .astro      │ YES (auto)  │ YES      │ Component styles  │
│ <style is:global>      │ NO          │ YES      │ Rare overrides    │
│ import '../style.css'  │ NO          │ YES      │ Shared/global CSS │
│ <link> to public/      │ NO          │ NO       │ External CDN CSS  │
│ <style is:inline>      │ NO          │ NO       │ Escape hatch      │
│ Tailwind classes       │ N/A         │ YES      │ Utility-first     │
└────────────────────────┴─────────────┴──────────┴───────────────────┘
```

### 3.1 Scoped Styles (DEFAULT — Use This Most)

```astro
<!-- src/components/Hero.astro -->
<section class="hero">
  <h1>Welcome</h1>
</section>

<style>
  /* These styles ONLY apply to this component. Auto-scoped. */
  .hero { padding: 4rem 2rem; }
  h1 { font-size: 3rem; }
</style>
```

**Why this is the default**: No CSS leaks. No class name collisions. Each component owns its styles.

### 3.2 Global Styles

```astro
<!-- src/layouts/BaseLayout.astro -->
<style is:global>
  /* Applies to ALL pages using this layout */
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; font-family: var(--font-body); }
</style>
```

**When to use**: Resets, base typography, CSS custom properties. Import ONCE in your base layout.

### 3.3 Imported Stylesheets

```astro
---
// Imported in frontmatter — bundled and optimized by Astro
import '../styles/global.css';
import '../styles/canvassing-app.css';
---
```

**When to use**: Large shared stylesheets, page-specific CSS files, CSS from npm packages.

**Cascading order** (lowest to highest precedence):
1. `<link>` tags in `<head>`
2. Imported stylesheets (in import order)
3. Scoped `<style>` tags (highest)

### 3.4 External Stylesheets via `<link>`

```astro
<head>
  <!-- Local file in public/ — NOT processed -->
  <link rel="stylesheet" href="/styles/legacy.css" />
  <!-- External CDN — NOT processed -->
  <link rel="stylesheet" href="https://cdn.example.com/lib.css" />
</head>
```

**When to use**: Third-party CSS (font CDNs, widget stylesheets). Avoid for your own CSS.

### 3.5 Inline Styles (Escape Hatch)

```astro
<style is:inline>
  /* Rendered as-is, no processing, no bundling */
  .specific-override { color: red !important; }
</style>
```

**When to use**: Almost never. Only when you need to bypass Astro's CSS pipeline entirely.

### 3.6 Tailwind CSS (v4 via Vite Plugin)

```astro
---
import '../styles/global.css'; // contains @import "tailwindcss";
---
<div class="flex items-center gap-4 p-6 bg-white rounded-lg shadow-md">
  <h2 class="text-2xl font-bold">Hello</h2>
</div>
```

**Setup**: `@tailwindcss/vite` plugin in `astro.config.mjs` + `@import "tailwindcss"` in a CSS file.

### Industry Best Practice: CSS Strategy for This Project

```
RECOMMENDED APPROACH:
─────────────────────
1. Global resets + base typography  →  src/styles/global.css (imported in BaseLayout)
2. Tailwind utilities               →  Used directly in templates via classes
3. Component-specific styles        →  Scoped <style> in each .astro component
4. Page-specific custom CSS         →  src/styles/{page-name}.css (imported in page)
5. Third-party CSS                  →  <link> in <head> only when unavoidable

AVOID:
- Putting all CSS in one massive file
- Using <style is:global> for component styles
- Loading CSS from public/ unless it's truly static/third-party
- Inline styles for layout/spacing (use Tailwind or scoped CSS)
```

### CSS Precedence Diagram

```
Browser evaluates CSS in this order (last wins for same specificity):

  ┌─────────────────────────────────┐
  │  1. <link> tags (lowest)        │  ← External/CDN CSS
  │  2. Imported stylesheets        │  ← import '../styles/x.css'
  │  3. Scoped <style> (highest)    │  ← <style> in .astro files
  └─────────────────────────────────┘

  Within same level: last imported / last declared wins.
  Higher specificity ALWAYS wins regardless of order.
```

---

## 4. JavaScript & Scripts

Astro gives you **4 ways** to include JavaScript. The choice dramatically impacts performance.

### Method Comparison

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        JS INCLUSION METHODS                                 │
├──────────────────────────┬───────────┬───────────┬─────────────────────────┤
│ Method                   │ Bundled?  │ Deferred? │ When to Use             │
├──────────────────────────┼───────────┼───────────┼─────────────────────────┤
│ <script> in .astro       │ YES       │ YES*      │ Per-component behavior  │
│ <script src="../x.js">   │ YES       │ YES*      │ External local scripts  │
│ <script is:inline>       │ NO        │ NO        │ Third-party snippets    │
│ client:* on framework    │ YES       │ VARIES    │ Interactive islands     │
└──────────────────────────┴───────────┴───────────┴─────────────────────────┘

* Astro processes <script> tags as type="module" with automatic deferring.
  ES modules are deferred by default in browsers.
```

### 4.1 Processed `<script>` Tags (DEFAULT)

```astro
<!-- src/components/MobileMenu.astro -->
<button id="menu-toggle">Menu</button>
<nav id="mobile-nav" hidden>
  <slot />
</nav>

<script>
  // This is TypeScript by default, bundled, tree-shaken, deduplicated
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('mobile-nav');
  toggle?.addEventListener('click', () => {
    nav?.toggleAttribute('hidden');
  });
</script>
```

**Key behaviors**:
- Automatically `type="module"` (deferred by browser spec)
- TypeScript support out of the box
- Can `import` from npm packages and local files
- **Deduplicated**: if component used 5x on page, script runs once
- **Auto-inlined** if small enough (< 4KB by default)

### 4.2 External Local Scripts

```astro
<!-- Reference a .js/.ts file from src/ -->
<script src="../scripts/analytics.js"></script>
```

Same processing rules as inline `<script>`. Good for keeping complex JS separate from templates.

### 4.3 Unprocessed / Inline Scripts (`is:inline`)

```astro
<script is:inline src="/my-script.js"></script>          <!-- from public/ -->
<script is:inline src="https://cdn.example.com/lib.js"></script>  <!-- CDN -->
<script is:inline>
  // Raw JS, no processing, no TypeScript, duplicated per component instance
  console.log('I am raw JS');
</script>
```

**When to use**: Third-party scripts (analytics, chat widgets, ad tags). These bypass Astro's bundler entirely.

**Performance warning**: `is:inline` scripts are **render-blocking** unless you add `defer` or `async` attributes:

```astro
<!-- Non-blocking third-party script -->
<script is:inline defer src="https://cdn.example.com/analytics.js"></script>
<!-- Async: doesn't block parsing, fires when ready -->
<script is:inline async src="https://cdn.example.com/chat-widget.js"></script>
```

### 4.4 Client Directives on Framework Components (Islands)

```astro
---
import SearchBar from '../components/SearchBar.jsx';
import Carousel from '../components/Carousel.svelte';
import ChatWidget from '../components/ChatWidget.jsx';
---

<!-- Hydrate immediately (above-fold interactive) -->
<SearchBar client:load />

<!-- Hydrate when browser is idle (below-fold) -->
<Carousel client:idle />

<!-- Hydrate only when scrolled into view -->
<ChatWidget client:visible />

<!-- Hydrate only on mobile -->
<MobileMenu client:media="(max-width: 768px)" />
```

### Script Loading Timeline

```
Page Load Sequence:
═══════════════════

1. HTML parsed
   ├── CSS <link> tags → start downloading (non-blocking)
   ├── <style> tags → applied immediately
   └── <script type="module"> → deferred (waits for HTML parse)

2. HTML parsing complete (DOMContentLoaded)
   ├── Processed <script> tags execute (deferred by default)
   ├── client:load islands hydrate
   └── client:idle islands wait for browser idle

3. User scrolls
   └── client:visible islands hydrate on intersection

4. Media query matches
   └── client:media islands hydrate

THIRD-PARTY SCRIPTS (is:inline):
  <script is:inline>          → RENDER-BLOCKING (bad!)
  <script is:inline defer>    → Non-blocking, executes after parse
  <script is:inline async>    → Non-blocking, executes when ready
```

### Industry Best Practice: JS Strategy

```
RECOMMENDED APPROACH:
─────────────────────
1. Prefer ZERO client JS. Use Astro components (static HTML) whenever possible.
2. For interactivity: use <script> tags (processed, bundled, deferred).
3. For framework islands: use the MOST LAZY client:* directive possible:
   - client:visible > client:idle > client:load
4. For third-party scripts: always use is:inline + defer or async.
5. Keep JS in src/scripts/ for complex logic, import from <script src="...">.

NEVER:
- Put large JS bundles in public/ and load via <script is:inline src="...">
- Use client:load for below-fold components
- Add JS for things CSS can handle (hover effects, transitions, accordions via <details>)
- Use inline event handlers (onclick="...") — use addEventListener in <script>
```

### Passing Server Data to Client Scripts

```astro
---
const { apiKey, userId } = Astro.props;
---

<!-- Store server data in data-* attributes -->
<div id="widget" data-api-key={apiKey} data-user-id={userId}>
  <button>Load</button>
</div>

<script>
  const widget = document.getElementById('widget');
  const apiKey = widget?.dataset.apiKey;
  const userId = widget?.dataset.userId;
  // Use apiKey and userId in client-side code
</script>
```

---

## 5. Layouts

Layouts are Astro components that provide a **reusable page shell** — the `<html>`, `<head>`, and `<body>` structure shared across pages.

### Layout Architecture

```
┌─────────────────────────────────────────────────────────┐
│  BaseLayout.astro                                       │
│  ┌───────────────────────────────────────────────────┐  │
│  │  <html>                                           │  │
│  │    <head>                                         │  │
│  │      - Meta tags, SEO, fonts, global CSS          │  │
│  │    </head>                                        │  │
│  │    <body>                                         │  │
│  │      ┌─────────────────────────────────────────┐  │  │
│  │      │  <Header />                             │  │  │
│  │      ├─────────────────────────────────────────┤  │  │
│  │      │                                         │  │  │
│  │      │  <slot />  ← PAGE CONTENT INJECTED HERE │  │  │
│  │      │                                         │  │  │
│  │      ├─────────────────────────────────────────┤  │  │
│  │      │  <Footer />                             │  │  │
│  │      └─────────────────────────────────────────┘  │  │
│  │    </body>                                        │  │
│  │  </html>                                          │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
         ▲                    ▲                    ▲
         │                    │                    │
   ┌─────┴─────┐      ┌──────┴──────┐     ┌──────┴──────┐
   │ index.astro│      │ about.astro │     │[...slug].astro│
   │            │      │             │     │              │
   │ <BaseLayout│      │ <BaseLayout │     │ <BaseLayout  │
   │   title="">│      │   title=""> │     │   title="">  │
   │   <Hero/>  │      │   <Content/>│     │   <Content/> │
   │ </BaseLayout│      │ </BaseLayout│     │ </BaseLayout │
   └────────────┘      └─────────────┘     └──────────────┘
```

### Basic Layout Example

```astro
---
// src/layouts/BaseLayout.astro
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import SEO from '../components/SEO.astro';
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <SEO title={title} description={description} />
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

### Using a Layout in a Page

```astro
---
// src/pages/about.astro
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="About Us" description="Learn about our company">
  <h1>About Us</h1>
  <p>Page content goes here. This is injected into the <slot />.</p>
</BaseLayout>
```

### Nested Layouts

Layouts can wrap other layouts for shared sub-structure:

```
BaseLayout.astro          ← Full page shell (<html>, <head>, <body>)
  └── BlogLayout.astro    ← Blog-specific structure (sidebar, post meta)
        └── post.md       ← Individual blog post content
```

```astro
---
// src/layouts/BlogLayout.astro
import BaseLayout from './BaseLayout.astro';
const { frontmatter } = Astro.props;
---

<BaseLayout title={frontmatter.title}>
  <article>
    <h1>{frontmatter.title}</h1>
    <time>{frontmatter.publishDate}</time>
    <slot />
  </article>
</BaseLayout>
```

### Named Slots (Multiple Content Areas)

```astro
---
// src/layouts/PageLayout.astro
---
<html>
  <body>
    <header>
      <slot name="header" />
    </header>
    <main>
      <slot />  <!-- default slot -->
    </main>
    <aside>
      <slot name="sidebar" />
    </aside>
  </body>
</html>
```

```astro
---
// src/pages/contact.astro
import PageLayout from '../layouts/PageLayout.astro';
---

<PageLayout>
  <h1 slot="header">Contact Us</h1>
  <p>Default slot content — the main page body.</p>
  <nav slot="sidebar">
    <a href="/faq/">FAQ</a>
    <a href="/support/">Support</a>
  </nav>
</PageLayout>
```

### Layout Rules

1. **One layout per page.** A page imports exactly one layout component.
2. **Layouts are just Astro components.** They accept props, import other components, and can have scoped styles.
3. **The `<html>` element must be the root** of any layout that provides a full page shell.
4. **Global CSS is imported in the layout**, not in individual pages (unless page-specific).
5. **`<slot />` is where page content goes.** Use named slots for multiple content areas.

---

## 6. Assets: Images, Fonts, Media

### 6.1 Images

Astro has a built-in image optimization pipeline. The key decision is **where to store** and **which component to use**.

#### Storage Decision

```
┌─────────────────────────────────────────────────────────────┐
│                    IMAGE STORAGE                            │
├──────────────────┬──────────────────────────────────────────┤
│ src/assets/      │ public/assets/                           │
├──────────────────┼──────────────────────────────────────────┤
│ Processed by     │ Copied as-is, NO processing              │
│ Astro's image    │                                          │
│ optimizer        │ Direct URL: /assets/my-image.jpg         │
│                  │                                          │
│ Import required: │ No import needed:                        │
│ import img from  │ <img src="/assets/my-image.jpg" />       │
│   '../assets/    │                                          │
│    img.jpg'      │ Use for: favicons, OG images,            │
│                  │   images referenced in meta tags,        │
│ Use for:         │   images that must NOT be transformed    │
│   Content images │                                          │
│   Hero images    │                                          │
│   Anything that  │                                          │
│   benefits from  │                                          │
│   optimization   │                                          │
└──────────────────┴──────────────────────────────────────────┘
```

#### Component Decision

| Component | Output | Optimized? | When to Use |
|-----------|--------|-----------|-------------|
| `<Image />` | Single `<img>` | YES | Most images. Auto width/height, lazy loading, WebP/AVIF. |
| `<Picture />` | `<picture>` with `<source>` | YES | Art direction, multiple formats (AVIF + WebP + fallback). |
| `<img>` | Raw `<img>` | NO | When you need raw control, unsupported formats, or public/ images. |

#### `<Image />` Example

```astro
---
import { Image } from 'astro:assets';
import heroImage from '../assets/hero.jpg';
---

<!-- Optimized: auto WebP/AVIF, width/height inferred, lazy loaded -->
<Image src={heroImage} alt="Hero description" width={800} height={400} />

<!-- Output: -->
<!-- <img src="/_astro/hero.hash.webp" width="800" height="400"
        decoding="async" loading="lazy" alt="Hero description" /> -->
```

#### `<Picture />` Example

```astro
---
import { Picture } from 'astro:assets';
import heroImage from '../assets/hero.jpg';
---

<Picture src={heroImage} formats={['avif', 'webp']} alt="Hero" width={800} height={400} />

<!-- Output: -->
<!-- <picture>
       <source srcset="/_astro/hero.hash.avif" type="image/avif" />
       <source srcset="/_astro/hero.hash.webp" type="image/webp" />
       <img src="/_astro/hero.hash.jpg" width="800" height="400"
            decoding="async" loading="lazy" alt="Hero" />
     </picture> -->
```

#### Responsive Images

```astro
<!-- Constrained: resizes within container, generates srcset automatically -->
<Image src={heroImage} alt="Hero" layout="constrained" width={800} height={400} />

<!-- Full-width: stretches to viewport width -->
<Image src={heroImage} alt="Hero" layout="full-width" />

<!-- Fixed: exact dimensions, no resizing -->
<Image src={heroImage} alt="Hero" layout="fixed" width={800} height={400} />
```

#### Image Rules

1. **Always use `<Image />` for content images** — it prevents CLS (Cumulative Layout Shift).
2. **Always provide `alt` text** — required by the component, critical for accessibility.
3. **Store images in `src/assets/`** for optimization. Use `public/` only for unprocessed assets.
4. **Use `<Picture />` when you need multiple formats** (AVIF for modern browsers, WebP fallback).
5. **Set `loading="eager"` for above-fold images** (hero images) to improve LCP.

### 6.2 Fonts

Astro has a built-in **Fonts API** that handles downloading, caching, preloading, and fallback optimization.

#### Configuration

```js
// astro.config.mjs
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  fonts: [
    {
      provider: fontProviders.fontsource(),  // or .google(), .local(), etc.
      name: 'Manrope',
      cssVariable: '--font-manrope',
      weights: [400, 500, 600, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
    },
  ],
});
```

#### Usage in Layout

```astro
---
// src/layouts/BaseLayout.astro
import { Font } from 'astro:assets';
---

<html lang="en">
  <head>
    <Font cssVariable="--font-manrope" preload />
  </head>
  <body>
    <slot />
  </body>
</html>

<style is:global>
  body {
    font-family: var(--font-manrope);
  }
</style>
```

#### Font Rules

1. **Use Astro's Fonts API** — it handles preloading, caching, and optimized fallbacks automatically.
2. **Prefer variable fonts** — one file covers all weights (smaller payload).
3. **Preload only critical fonts** — pass `preload` to `<Font />` for above-fold fonts only.
4. **Specify only weights/styles actually used** — don't download 900 weight if you never use it.
5. **Use `@fontsource-variable/*` packages** via Fontsource provider for self-hosted fonts.

### 6.3 Other Media

| Media Type | Approach |
|-----------|----------|
| **Video** | Use a hosted video service (Cloudflare Stream, Mux, YouTube embed). Never self-host video in `public/`. |
| **SVG icons** | Use `lucide-astro` or import `.svg` files as Astro components (inline SVG). |
| **SVG illustrations** | Import as Astro components or use `<img>` if no interactivity needed. |
| **PDFs, downloads** | Place in `public/` — direct URL, no processing needed. |

---

## 7. Performance Checklist

### The Astro Performance Hierarchy

```
                    MOST IMPORTANT
                    ═════════════
                         ▲
                         │
         ┌───────────────┼───────────────┐
         │  1. Ship ZERO JavaScript      │  ← Use .astro components
         ├───────────────────────────────┤
         │  2. Lazy-load what you must   │  ← client:visible > client:idle
         ├───────────────────────────────┤
         │  3. Optimize images           │  ← <Image />, WebP/AVIF, srcset
         ├───────────────────────────────┤
         │  4. Minimize CSS              │  ← Scoped styles, Tailwind purge
         ├───────────────────────────────┤
         │  5. Defer third-party scripts │  ← is:inline + defer/async
         ├───────────────────────────────┤
         │  6. Preload critical assets   │  ← Fonts, hero images
         └───────────────────────────────┘
```

### Core Web Vitals Targets

| Metric | Target | How Astro Helps |
|--------|--------|----------------|
| **LCP** (Largest Contentful Paint) | < 2.5s | SSG = instant HTML. `<Image loading="eager">` for hero. Preload fonts. |
| **INP** (Interaction to Next Paint) | < 200ms | Minimal JS = fast interactions. Use CSS for hover/transition effects. |
| **CLS** (Cumulative Layout Shift) | < 0.1 | `<Image />` auto-sets width/height. Font fallbacks prevent text shift. |

### Per-Page Optimization Checklist

```
Before shipping any page:
─────────────────────────
□ Does it use <Image /> for all content images?
□ Are above-fold images set to loading="eager"?
□ Are below-fold images lazy loaded (default)?
□ Is JS limited to only interactive elements?
□ Are third-party scripts loaded with defer/async?
□ Is CSS scoped to components (not global)?
□ Are fonts preloaded (only critical weights)?
□ Does the layout provide proper <head> meta tags?
□ Is mobile viewport tested? (Tailwind responsive classes)
□ No render-blocking resources in <head>?
```

---

## 8. Anti-Patterns to Avoid

### CSS Anti-Patterns

| Anti-Pattern | Why It's Bad | Do This Instead |
|-------------|-------------|-----------------|
| One giant `global.css` with all styles | No scoping, specificity wars, huge payload | Scoped `<style>` per component + Tailwind |
| `<style is:global>` for component styles | Leaks to all pages, naming collisions | Scoped `<style>` (default) |
| CSS in `public/` loaded via `<link>` | Not bundled, not optimized, render-blocking | Import CSS in `src/` via frontmatter |
| `!important` everywhere | Specificity nightmare | Fix specificity with proper selectors |
| Inline `style=""` for layout | Not maintainable, not responsive | Tailwind classes or scoped CSS |

### JavaScript Anti-Patterns

| Anti-Pattern | Why It's Bad | Do This Instead |
|-------------|-------------|-----------------|
| `client:load` on everything | Massive JS payload, blocks main thread | `client:visible` or `client:idle` |
| `<script is:inline>` for your own JS | No bundling, no TypeScript, render-blocking | Processed `<script>` tags |
| jQuery or heavy DOM libraries | Astro's philosophy is minimal JS | Vanilla JS, Web Components, or framework islands |
| JS for CSS-only effects | Unnecessary JS, slower | CSS `:hover`, `:focus`, `<details>`, transitions |
| Global event listeners on `document` | Memory leaks, hard to debug | Scope to component with `this.querySelector()` or data attributes |

### Layout Anti-Patterns

| Anti-Pattern | Why It's Bad | Do This Instead |
|-------------|-------------|-----------------|
| No layout, repeat `<html>` in every page | DRY violation, inconsistent `<head>` | One BaseLayout, import everywhere |
| Multiple layouts with different `<head>` | SEO inconsistency | One base layout, nest specialized layouts |
| Layout with hardcoded content | Not reusable | Props + `<slot />` |
| Importing global CSS in every page | Duplicate imports, cascade confusion | Import once in base layout |

### Asset Anti-Patterns

| Anti-Pattern | Why It's Bad | Do This Instead |
|-------------|-------------|-----------------|
| All images in `public/` | No optimization, no WebP, no responsive | Store in `src/assets/`, use `<Image />` |
| `<img>` without width/height | CLS (layout shift) | Use `<Image />` which auto-sets dimensions |
| External image URLs in CSS `background-image` | Can break, no optimization, CORS issues | Download to `src/assets/`, use CSS variables |
| Self-hosting video files | Huge payload, no adaptive streaming | Use Cloudflare Stream, Mux, or YouTube embed |
| Loading all font weights | Unnecessary payload | Specify only weights actually used |

---

## Quick Reference: "What Goes Where"

```
┌─────────────────────────────────────────────────────────────────────┐
│                     ANATOMY OF AN ASTRO PAGE                        │
│                                                                     │
│  src/pages/my-page.astro                                            │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ ---                                                           │  │
│  │ import BaseLayout from '../layouts/BaseLayout.astro';         │  │
│  │ import Hero from '../components/Hero.astro';                  │  │
│  │ import '../styles/my-page.css';  // page-specific CSS         │  │
│  │ ---                                                           │  │
│  │                                                               │  │
│  │ <BaseLayout title="My Page">                                  │  │
│  │   <Hero />                                                    │  │
│  │   <section>                                                   │  │
│  │     <h1>Content</h1>                                          │  │
│  │   </section>                                                  │  │
│  │ </BaseLayout>                                                 │  │
│  │                                                               │  │
│  │ <script>                                                      │  │
│  │   // Page-specific JS (processed, bundled, deferred)          │  │
│  │ </script>                                                     │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  src/layouts/BaseLayout.astro                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ ---                                                           │  │
│  │ import '../styles/global.css';  // global styles ONCE         │  │
│  │ import Header from '../components/Header.astro';              │  │
│  │ import Footer from '../components/Footer.astro';              │  │
│  │ import { Font } from 'astro:assets';                          │  │
│  │ ---                                                           │  │
│  │ <html>                                                        │  │
│  │   <head>                                                      │  │
│  │     <Font cssVariable="--font-body" preload />                │  │
│  │   </head>                                                     │  │
│  │   <body>                                                      │  │
│  │     <Header />                                                │  │
│  │     <slot />                                                  │  │
│  │     <Footer />                                                │  │
│  │   </body>                                                     │  │
│  │ </html>                                                       │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  src/components/Hero.astro                                          │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ ---                                                           │  │
│  │ import { Image } from 'astro:assets';                         │  │
│  │ import heroImg from '../assets/hero.jpg';                     │  │
│  │ ---                                                           │  │
│  │ <section class="hero">                                        │  │
│  │   <Image src={heroImg} alt="Hero" loading="eager" />          │  │
│  │   <h1>{Astro.props.title}</h1>                                │  │
│  │ </section>                                                    │  │
│  │ <style>                                                       │  │
│  │   .hero { /* scoped to this component */ }                    │  │
│  │ </style>                                                      │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Sources

- [Astro Docs: Why Astro](https://docs.astro.build/en/concepts/why-astro/)
- [Astro Docs: Islands Architecture](https://docs.astro.build/en/concepts/islands/)
- [Astro Docs: Project Structure](https://docs.astro.build/en/basics/project-structure/)
- [Astro Docs: Layouts](https://docs.astro.build/en/basics/layouts/)
- [Astro Docs: Styles and CSS](https://docs.astro.build/en/guides/styling/)
- [Astro Docs: Client-Side Scripts](https://docs.astro.build/en/guides/client-side-scripts/)
- [Astro Docs: Images](https://docs.astro.build/en/guides/images/)
- [Astro Docs: Fonts](https://docs.astro.build/en/guides/fonts/)
- [Astro Docs: Framework Components & Client Directives](https://docs.astro.build/en/guides/framework-components/)
- [Web.dev: Core Web Vitals](https://web.dev/vitals/)
- [Jason Miller: Islands Architecture](https://jasonformat.com/islands-architecture/)
