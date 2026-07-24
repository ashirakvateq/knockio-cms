# Sprint 2: Features & Industries Pages with KnockioHomeLayout

## Goal

Convert two legacy WordPress HTML pages (`features.html` and `industries.html`) into Astro pages sharing a new common layout (`KnockioHomeLayout.astro`) separate from `BaseLayout.astro`.

## Problem

The features and industries pages share an identical visual structure (directory-style card grids, breadcrumbs, cross-link banners, CTAs) but need a different layout shell than the existing `BaseLayout.astro`. The header and footer for this new layout will be provided later.

## Solution

Created a new layout component with named slots for header/footer injection, a shared CSS file for the common directory-page styles, and two Astro pages that produce zero JavaScript for fully static content.

## Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `src/layouts/KnockioHomeLayout.astro` | Created | New layout shell with named `header` and `footer` slots, imports global CSS + shared knockio-home CSS, SEO, Analytics, and JSON-LD support |
| `src/styles/knockio-home.css` | Created | Shared styles for directory card grids, breadcrumbs, hero sections, cross-link banners, CTAs, and buttons |
| `src/pages/features.astro` | Created | Features directory page (15 feature cards with inline SVG icons, cross-link to industries) |
| `src/pages/industries.astro` | Created | Industries directory page (15 industry cards with inline SVG icons, cross-link to features) |

## Files NOT Changed

- `src/layouts/BaseLayout.astro` — untouched, still serves existing pages
- `src/styles/global.css` — no modifications needed
- All existing pages and components — no regressions

## Images

None required. Both legacy pages use only inline SVGs for icons — no external images or CSS background images to download.

## Why This Works

1. **KnockioHomeLayout** uses Astro's named slots (`slot="header"`, `slot="footer"`) so header/footer components can be injected later without modifying the layout structure
2. **Shared CSS** (`knockio-home.css`) is imported once in the layout, not duplicated per page — both pages inherit identical styles
3. **Zero JavaScript** — all content is static HTML with inline SVGs, no `client:*` directives, no `<script>` tags beyond Analytics
4. **JSON-LD** structured data (BreadcrumbList + ItemList) passed via props and rendered with `set:html` in the layout `<head>`
5. **Internal links** use trailing slashes (`/features/`, `/industries/`) matching `trailingSlash: 'always'` config

## Architecture Decisions

- **Separate layout from BaseLayout**: The features/industries pages belong to a "home navigation" section of the site with their own header/footer, distinct from the landing pages that use BaseLayout
- **One shared CSS file**: Both pages share identical class names and visual patterns — a single `knockio-home.css` avoids duplication
- **No data files**: Card content is written directly in HTML (per AGENTS.md convention — static content belongs in markup, not TypeScript arrays)
- **Named slots over props for header/footer**: Allows full component composition when header/footer are provided, rather than string props

## Expected Impact

- `/features/` and `/industries/` routes now serve as SEO-optimized, zero-JS directory pages
- Both pages include proper meta tags, canonical URLs, OG tags, and structured data
- Layout is ready for header/footer injection — just fill the named slots when components are ready

## Build Verification

```
bun run build → 9 page(s) built in 4.26s
├─ /features/index.html
├─ /industries/index.html
```
