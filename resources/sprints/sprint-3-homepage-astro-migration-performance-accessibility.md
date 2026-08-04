# Sprint 3 — Homepage Astro Migration, Deferred Runtime Work & Accessibility Baseline

## Goal

Use the Knockio homepage as the reference migration for turning a large legacy WordPress/HTML document into a fast, crawlable, accessible Astro marketing page.

This document is deliberately both a walkthrough and a release checklist. It explains what made the homepage expensive, how the Astro architecture separates concerns, how expensive work is delayed without breaking conversion paths, and what must be verified before another legacy page is called ready.

The reference legacy file is [knockio-home.html](../legacy-src/pages/knockio-home.html). The production route is implemented by [index.astro](../../src/pages/index.astro), its homepage layout, components, styles, and page-specific client scripts.

## Executive Summary

The legacy homepage is a single 4,880-line document that combines content, visual styling, WordPress-hosted assets, schema, and several blocks of browser JavaScript. It contains 94 unique absolute URLs, including WordPress media URLs and third-party assets. That structure makes it easy for a single page change to add blocking work, external dependencies, or invalid interactive controls.

The Astro version separates the page into a static document, a reusable shell, shared components, CSS files, and small behaviour modules. Static marketing content is delivered as HTML. JavaScript is reserved for the product demo, scrolling interactions, calculation, FAQ behaviour, analytics, and booking.

The most important performance rule is:

> Render the marketing page first. Load optional systems only when the visitor reaches or asks for them.

The most important accessibility rule is:

> A control must either be a real link, a real button with a meaningful name, or not be interactive at all.

## Problem

The legacy page makes all concerns arrive together: static content, external assets, interactive mock-app code, third-party booking, analytics, and visual styling. The browser cannot know which work is essential to the first screen and which work is only needed after a visitor chooses to interact.

That creates four recurring migration failures:

- third-party scripts and full icon/font libraries delay rendering;
- heavyweight embeds load for visitors who never use them;
- fake links and icon-only buttons fail crawler and accessibility audits;
- a good local/Lighthouse result is mistaken for a completed real-user performance result.

## Solution

The solution is a layered Astro page: static HTML and CSS first, narrowly scoped browser behaviour second, and third-party systems only after an explicit user or viewport trigger. The implementation combines a shared document layout, SEO component, local font configuration, one-time calendar visibility gate, deferred tag loaders, and semantic demo controls.

The detailed implementation and the release conditions are documented below. They are intentionally together: a migration is not complete merely because the content looks correct.

## Measured Context: Lab Scores Are Not Field Core Web Vitals

The recent page test recorded a **95 Desktop Performance** lab score. That is a very good diagnostic result: it means the test browser found little initial render-blocking work after the deferral changes.

It is not, by itself, proof that real-user Core Web Vitals have passed. The same report showed a 28-day real-user view with approximately:

| Field metric shown in the report | Value | Interpretation |
|---|---:|---|
| LCP | 4.2 s | Poor; the largest visible element is arriving or rendering too late for real users. |
| INP | 124 ms | Good; interactions were responsive for the measured population. |
| CLS | 0.18 | Needs improvement; something is moving after first paint. |

The gap is normal immediately after a performance change. Lighthouse is a short, synthetic test on one device and network profile. Chrome UX Report data is collected from real users over a rolling 28-day period.

Treat the lab score as a strong release signal, then use the post-deployment checks in this document to confirm the field result. Do not claim Core Web Vitals have passed until the field data has caught up.

## Legacy-to-Astro Comparison

| Concern | Legacy document | Astro homepage approach | Why the Astro approach is safer |
|---|---|---|---|
| Document shell | One large page contains everything. | `index.astro` supplies page content; `KnockioHomeLayout.astro` owns the document, head, header, footer, global CSS, and global integrations. | Each concern has one owner. New pages do not duplicate metadata or navigation. |
| Static content | HTML sits beside script-heavy mock application markup. | Static headings, paragraphs, lists, feature sections, testimonials, pricing, and FAQs render at build time. | Search engines and users receive usable HTML without waiting for JavaScript. |
| SEO | Legacy schema and metadata live inside the page document. | Page passes title, description, and JSON-LD to the layout and `SEO.astro`. | Canonical URL, Open Graph tags, Twitter tags, and schema remain consistent. |
| Assets | Many absolute WordPress/CDN media URLs. | Shared static assets use `/assets/cfw/`; content images should live in `src/assets/` and use Astro `<Image />`. | Fewer external origins, stable asset ownership, image dimensions, and image-format optimisation. |
| Fonts | Font and icon resources can be external and render blocking. | Manrope is registered through Astro Fonts and preloaded once in the document head. | The browser knows the exact critical font file early and has a system fallback. |
| Interactive demo | Inline scripts construct and mutate the demo. | Homepage interactions reside in a page-specific module; static visual structure remains in Astro markup. | Behaviour can be measured, deferred, and changed without rewriting content. |
| Booking | Third-party calendar can load its full iframe and script on initial paint. | A small local loader waits for a meaningful scroll boundary or an explicit booking action. | The heavy Cal.com work does not compete with LCP for visitors who never reach booking. |
| Analytics | Tags can easily be injected more than once or fired on first paint. | GTM preserves its official head + body installation, but its network request is delayed until interaction or idle time. | Analytics remains functional while initial rendering remains the priority. |
| Demo navigation | `href="javascript:void(0)"` creates fake, uncrawlable links. | Controls that trigger an action are generated as `<button type="button">`. | Keyboard users get correct behaviour and crawlers no longer discover invalid destinations. |
| Icon-only controls | Screen readers announce only “button”. | A shared helper supplies contextual `aria-label` values for the demo controls. | The control communicates its purpose instead of its shape. |

## Target Homepage Architecture

```text
src/pages/index.astro
│
├── page-specific metadata and JSON-LD
├── static homepage sections
│   ├── hero and primary calls to action
│   ├── product-demo markup
│   ├── capability/workflow/pricing/FAQ sections
│   └── reserved Cal.com booking container
│
└── KnockioHomeLayout.astro
    ├── <head>
    │   ├── Astro Font preload (Manrope)
    │   ├── SEO.astro: title, description, canonical, social metadata
    │   ├── JSON-LD from the page
    │   └── Analytics head branch: query forwarding + deferred GTM loader
    └── <body>
        ├── KnockioHomeHeader
        ├── page <slot />
        ├── KnockioHomeFooter
        ├── Analytics body branch: GTM <noscript> iframe
        └── only the homepage scripts that this route actually needs
```

The important boundary is between **HTML that can be rendered at build time** and **behaviour that needs a browser**. A new developer should start from the left side of that boundary: write the section in Astro first, add CSS second, and add JavaScript only for a real interaction.

## Runtime Loading Sequence

```text
1. Browser receives static Astro HTML, CSS, critical font declaration, and hero content.
2. Browser paints the page and identifies the LCP candidate.
3. Small local homepage modules initialise necessary interactions.
4. GTM waits for first meaningful interaction or an idle deadline.
5. Talkgenie/Facebook, if mounted for the route, wait until the load event and idle time.
6. Cal.com remains absent until either:
   a. the visitor crosses the end of the second top-level page section; or
   b. the visitor clicks a booking link / lands directly at #cal-sec.
7. Only then are Cal.com preconnects, embed script, iframe, and booking tracking activated.
```

This sequence protects initial paint without withholding a user-requested action. In particular, a person who clicks “Book a Demo” should not have to wait for an arbitrary idle timeout before the booking UI starts loading.

## What Was Implemented

### 1. Static-first Astro page and shared layout

`index.astro` keeps the homepage body in declarative Astro markup. The layout imports CSS once, renders header/footer once, receives metadata through props, and renders JSON-LD as an `application/ld+json` script.

The homepage JSON-LD covers the organisation, web site, web application, offers, reviews, and FAQ content. This is structured data for search engines; it must stay aligned with visible on-page claims. If a price, rating, or FAQ answer changes, update both the displayed content and the JSON-LD in the same pull request.

### 2. Correct Google Tag Manager installation without blocking initial rendering

GTM's official installation has two different pieces:

| Placement | What it contains | Why it exists |
|---|---|---|
| Document `<head>` | Data layer setup and the GTM JavaScript loader. | Loads tags for browsers with JavaScript. |
| Immediately inside `<body>` | A `<noscript>` iframe. | Provides the official fallback when JavaScript is disabled. |

Rendering `<Analytics />` in the head and `<Analytics placement="body" />` in the body is therefore **one complete GTM installation**, not duplicate tracking.

The head branch also renders `QueryForwarder` exactly once. It stores campaign query parameters in a first-party cookie and forwards them to appropriate links. Rendering it in both placements would rewrite links twice and is incorrect.

The GTM loader listens for `pointerdown`, `keydown`, `scroll`, and `touchstart`, then falls back to `requestIdleCallback` with a 15-second deadline (or an 8-second timeout in browsers without idle callbacks). The HTML needed for GTM is inexpensive; the costly `gtm.js` download is delayed.

### 3. Calendar loading at the end of the second section

Cal.com's inline embed is valuable for conversion but expensive for initial loading because it brings a third-party script, additional requests, and an iframe. The local [cal-inline.js](../../src/scripts/cal-inline.js) now uses a one-time `IntersectionObserver` strategy.

How it works:

1. It finds `#my-cal-inline`. If the container is absent, the script does nothing.
2. It collects direct `<section>` children of the document body.
3. It takes the second section and adds a visually inert, 1px boundary immediately after it.
4. It observes that boundary, not every scroll event.
5. When the boundary enters the viewport, the observer disconnects and calls `loadCalendar()` exactly once.
6. `loadCalendar()` adds Cal.com preconnects only at that moment, queues the Cal API, initialises the inline embed, and binds booking tracking.

The booking container reserves vertical space before the iframe arrives. Reserving space prevents the calendar from pushing the page down and increasing CLS.

Two fast paths remain deliberately enabled:

- A visitor who clicks an `href="#cal-sec"` booking CTA starts the calendar immediately.
- A visitor arriving directly at `#cal-sec` starts the calendar immediately.

Pages that use the shared calendar script but do not have the homepage's direct top-level section structure retain the safe idle fallback. This makes the homepage optimisation reusable without silently breaking an existing booking page.

### 4. Semantic demo navigation and accessible icon controls

The product demo is a visual simulation of the app. Its sidebar previously generated many anchors whose destination was `javascript:void(0)`. That creates three problems:

- Search engines report uncrawlable links.
- Browser and assistive-technology semantics say “navigation” even though no navigation occurs.
- Keyboard behaviour is less explicit than a normal action button.

The generated items are now buttons because they perform an in-place demo action. Existing event listeners already target `[data-nav]`, so changing the element type preserves the visual behaviour and click handler while removing the false URL.

The shared [demo-accessibility.js](../../src/scripts/demo-accessibility.js) gives the demo's icon-only controls meaningful names. It covers, among others:

- notifications and search;
- lead-map pins, using the lead name when available;
- map layer, satellite, centring, and fullscreen controls;
- call, email, and note controls, including the relevant card subject;
- activity history, close-panel, more-actions, and add-action controls;
- the one-letter account avatar and compact display selector.

The helper runs once for the initial demo markup and again after the demo script creates its sidebar. It does not attach a perpetual observer, a scroll handler, or a polling timer.

For a new page, prefer putting the accessible name directly in HTML:

```astro
<button type="button" aria-label="Open map layers">
  <Layers aria-hidden="true" />
</button>
```

The helper is appropriate here because this existing demo creates some controls dynamically. It is not permission to rely on client JavaScript for ordinary page semantics.

### 5. Deferred third-party widgets

`ThirdPartyWidgets.astro` defers Talkgenie until after the browser load event and then until first interaction or an idle deadline. `FbAnalytics.astro` follows the same principle for Facebook Pixel: it waits until the page load event, then uses idle time (with a timeout fallback) before bootstrapping `fbevents.js` and sending `PageView`.

This isolates third-party parse, evaluation, and network work from the first render. It also makes ownership explicit: the Facebook Pixel belongs in `FbAnalytics.astro`, while Talkgenie remains in `ThirdPartyWidgets.astro`.

**External configuration requirement:** if Facebook Pixel or Talkgenie is also configured as a GTM tag, remove the duplicate GTM tag before enabling the code-owned loader. Otherwise page views and conversions can be double counted.

### 6. Font and icon decisions

The layout uses Astro's Fonts API:

```astro
<Font cssVariable="--font-manrope" preload />
```

`astro.config.mjs` registers Manrope as a variable range (`200 800`) with Latin subset and system fallbacks. That gives the browser one critical font declaration and avoids separate imports for several weights.

For new work, use individual `lucide-astro` imports for icons. They are SVG components that can receive `aria-hidden="true"` when a button supplies the readable label. Do not add a full Font Awesome CDN stylesheet merely to display a handful of icons.

## Performance Decision Matrix

| Decision | Initial render cost | Visitor experience | Correct implementation |
|---|---|---|---|
| Static text, cards, FAQs, pricing | None beyond HTML/CSS | Immediate and crawlable. | Write direct Astro markup. |
| Decorative hover/fade effects | No JavaScript required. | Smooth where supported. | CSS transitions; respect reduced motion where appropriate. |
| Icon used inside labelled control | Tiny inline SVG. | Screen reader gets action name, not icon name. | `aria-label` on button, `aria-hidden` on icon. |
| Product demo tabs | Small local script. | Works after initial paint. | Initialise only the demo subtree; pause when not visible. |
| Smooth scrolling | Can become constant CPU work. | Should feel smooth without an endless animation loop. | Start animation frames only while scrolling, stop when settled, honour `prefers-reduced-motion`. |
| Cal.com booking UI | Heavy third-party script + iframe. | Available when the visitor reaches/requests it. | One-shot intersection gate plus direct-CTA fast path. |
| GTM | Potential third-party tag work. | Still records normal sessions. | Official head/body split; defer JavaScript request to interaction/idle. |
| Facebook/Talkgenie | Third-party script parse and long tasks. | Available later in a session. | Load after `window.load` and idle/interaction. |
| Hero image | Can become LCP. | Must appear quickly. | Use optimised local asset with dimensions and eager loading; preload only after measurement proves it is the LCP resource. |

## CSS and Asset Strategy

### CSS ownership

The homepage uses three levels of styling:

| File | Responsibility |
|---|---|
| `src/styles/global.css` | Site-wide tokens, base styles, and shared utilities. |
| `src/styles/knockio-home.css` | Shared home-navigation layout styles and components. |
| `src/styles/homepage.css` | Homepage-specific demo, workflow, and FAQ styles. |

Keep global CSS small. A selector that only belongs to a section should live with that section or in the page CSS, not in `global.css`. This avoids accidental visual changes on unrelated routes.

Use CSS for visual state whenever it is sufficient: hover, focus, transitions, responsive layout, and non-interactive reveal effects. JavaScript should change a state only when it represents a real user action or a measurement-based viewport transition.

### Image rules

The legacy source references WordPress-hosted images directly. During a migration:

1. Inventory every image, background image, logo, app-store badge, and avatar.
2. Download assets that the page owns. Do not ship a new Astro page that depends on the old WordPress media library.
3. Put shared static assets in `public/assets/cfw/` and reference them with `/assets/cfw/...`.
4. Put content images needing transformation in `src/assets/` and use Astro `<Image />` or `<Picture />`.
5. Give images meaningful `alt` text, or use `alt=""` only for purely decorative imagery.
6. Ensure dimensions/aspect ratio are known before the image loads to avoid layout shift.
7. Set only the actual above-the-fold/LCP image to `loading="eager"`; allow all below-the-fold images to stay lazy.

Do not preload every image. A preload tells the browser “download this before other discovered work.” Preloading too many images can delay the actual LCP image, CSS, or font.

### LCP image procedure

Before adding an image preload, use a performance trace to identify the actual LCP element. Then:

- If the LCP is an `<img>`, make it locally served, appropriately sized, eager, and dimensioned.
- If it is a CSS background, consider replacing it with a semantic `<Image />` when visually possible, or preload only that exact background asset.
- If it is text, investigate server response time, font loading, render-blocking CSS, and main-thread work instead of preloading images.

## Required Pre-Migration Workflow for Future Legacy Pages

### 1. Inventory before writing code

Make a short migration inventory from the legacy HTML, CSS, and JavaScript:

| Inventory item | Questions to answer |
|---|---|
| Content | Which headings, paragraphs, links, tables, FAQs, and CTAs are truly static? |
| Images | Which assets are visible above the fold? Which are shared? Which are decorative? |
| CSS | Which rules are page-specific versus layout/global? |
| JavaScript | Which behaviour is necessary for conversion, and which is visual only? |
| External scripts | Which vendors load, when, and who owns each tag? |
| SEO | What title, description, canonical URL, schema, internal links, and redirects are needed? |
| Accessibility | Which controls are links, buttons, inputs, dialogs, tabs, accordions, or only decorative? |

Do not begin by copying all legacy scripts. First prove that the interaction cannot be HTML or CSS.

### 2. Design the Astro shape

```text
Legacy source
   │
   ├── static content ───────────────► direct Astro HTML
   ├── reusable site shell ───────────► layout + shared components
   ├── page-only presentation ───────► page CSS / scoped component CSS
   ├── real interaction ─────────────► focused deferred script
   ├── third-party widget ───────────► explicit deferred loader
   └── content images ───────────────► local assets + Astro image pipeline
```

Use a page-specific layout only when the page really has a different shell. Otherwise use the existing layout and keep the route thin.

### 3. Build HTML before behaviour

Build the first complete version with static Astro markup. That gives reviewers a crawlable, accessible baseline and lets them verify visual fidelity before adding moving parts.

Use semantic elements:

- `<a href="/real-destination/">` for navigation.
- `<button type="button">` for an in-page action.
- `<details>` and `<summary>` for simple disclosure/FAQ behaviour when the visual design permits it.
- `<label>` for every form field.
- headings in a sensible hierarchy.

Never use `javascript:` URLs. Never use a clickable `<div>` where a button describes the interaction. Never hide an interactive button from screen readers with `aria-hidden="true"`.

### 4. Add the smallest possible JavaScript

When code is necessary, place it in `src/scripts/` and scope selectors to the page or component root. A script should:

- exit immediately if its root element is absent;
- use event delegation where it avoids many listeners;
- use passive scroll listeners and `requestAnimationFrame` batching only when scroll work is unavoidable;
- prefer `IntersectionObserver` for visibility-based work;
- honour `prefers-reduced-motion` for animation;
- stop timers and animation frames when the feature is inactive;
- avoid injecting static HTML strings; write static markup in Astro instead;
- never import a page-specific module from a global layout unless every page needs it.

### 5. Put third parties behind a reasoned trigger

Ask four questions for every vendor:

1. Is it legally/contractually required on first paint?
2. Does it have to record the first page view immediately, or can it use interaction/idle loading?
3. Is there a user gesture that naturally requests it?
4. Is it already loading through GTM or another tag manager?

There must be one owner per vendor. If code owns Facebook Pixel, GTM must not also own Facebook Pixel.

## Current Production Acceptance Items

This section intentionally prevents a future developer from mistaking a good lab result for a finished migration. These are source-level acceptance items for the root homepage before it is called fully optimised.

| Item | Current evidence | Required resolution |
|---|---|---|
| Font Awesome CDN | `index.astro` still passes `fAwsm={true}`, and `KnockioHomeLayout.astro` conditionally loads the full Font Awesome CDN stylesheet. | Replace the used Font Awesome icons with individual `lucide-astro` icons, remove `fAwsm` from the homepage, then remove the conditional CDN link once no route requires it. This avoids a render-blocking third-party stylesheet and font payload. |
| Lenis animation frame loop | `src/scripts/home.js` still starts `requestAnimationFrame(raf)` and schedules another frame forever. | Refactor to a lifecycle-controlled loop: start for wheel/touch/keyboard movement, stop when scrolling settles, pause for reduced motion and background tabs. Do not claim this benefit until the root script has changed. |
| Homepage module scope | `home.js` is loaded by the homepage layout, which can affect every route using that layout. | Split behaviour by feature or load it only on pages containing its root element. Every module must be absent from pages that do not use the demo, calculator, workflow, or FAQ. |
| Static HTML generated in JavaScript | The legacy-derived demo script still constructs pieces of HTML as JavaScript strings. | Preserve the current behaviour where necessary, but migrate static demo structure into Astro components over time. This improves escaping, maintainability, CSS scoping, and accessibility review. |
| Facebook component mounting | `FbAnalytics.astro` exists as the dedicated owner of Facebook Pixel. | Mount it once at the end of the correct marketing layout, after confirming the GTM Pixel tag has been removed. |
| Images and LCP | The legacy source contains many WordPress-hosted media references. | Verify every production image is local/owned, optimised, dimensioned, and has correct loading priority. Use a trace before preloading. |

These are not cosmetic concerns. Any one of them can make scores vary from one route or device class to another.

## Files Changed

| File | Role in this case study |
|---|---|
| `src/pages/index.astro` | Homepage content, SEO schema, CTAs, calendar container, semantic page markup. |
| `src/layouts/KnockioHomeLayout.astro` | Root document shell, font preload, CSS imports, header/footer, Analytics placement, homepage scripts. |
| `src/components/SEO.astro` | Canonical, description, Open Graph, Twitter, and optional robots metadata. |
| `src/components/Analytics.astro` | Official GTM head/body split, interaction-or-idle GTM loading, and one-time query forwarding. |
| `src/components/QueryForwarder.astro` | Campaign parameter persistence and forwarding. |
| `src/components/ThirdPartyWidgets.astro` | Deferred Talkgenie ownership. |
| `src/components/FbAnalytics.astro` | Dedicated deferred Facebook Pixel ownership. |
| `src/scripts/cal-inline.js` | One-time second-section calendar gate, direct CTA fast path, Cal embed initialisation, and booking event handling. |
| `src/scripts/home.js` | Homepage demo/workflow/calculator/FAQ behaviour; also contains technical debt that must be split and lifecycle-controlled. |
| `src/scripts/demo-accessibility.js` | Shared accessible names for icon-only, dynamically generated demo controls. |
| `src/styles/global.css` | Site-wide styling foundations. |
| `src/styles/knockio-home.css` | Shared homepage-layout styles. |
| `src/styles/homepage.css` | Homepage-specific visual behaviour. |
| `astro.config.mjs` | Site URL, trailing slash policy, sitemap, Tailwind Vite plugin, and Astro Fonts configuration. |
| `public/assets/cfw/` | Shared static image and badge assets. |

## Files NOT Changed

- `resources/legacy-src/pages/knockio-home.html` — retain as a read-only visual/content reference; do not “fix” the legacy file.
- `src/layouts/BaseLayout.astro` — do not modify it just to make a homepage-specific page work.
- Unrelated routes — new page CSS and scripts must not leak into them.
- The content collection schema — a hand-built application-like landing page does not need a schema change merely because it has many sections.

## External Configuration Checklist

| System | Required action |
|---|---|
| GTM | Set `PUBLIC_GTM_ID` in the deployment environment when the default container is not correct. Keep the official GTM body `<noscript>` branch. Remove any tags now explicitly owned by code. |
| Facebook Pixel | Confirm the correct pixel ID. Remove duplicate GTM pixel configuration before mounting `FbAnalytics.astro`. Validate one `PageView` in browser network/debug tools. |
| Talkgenie | Confirm widget UID and whether the widget is needed on the route. Do not also load it through GTM. |
| Cal.com | Confirm event slug, booking URL, allowed origins, success event handling, and attribution requirements. Test direct `#cal-sec` visits and booking CTA clicks. |
| Cloudflare | Ensure static assets receive long-lived immutable caching appropriate to fingerprinted assets and that HTML remains revalidatable. |
| Search Console / analytics | Revalidate after release; field CWV data will need time to reflect the new code. |

## Before Deploy: Definition of Done

### Functional and visual

- [ ] Desktop, tablet, and mobile layouts match the approved legacy appearance where fidelity is required.
- [ ] Header, footer, internal links, external links, app-store links, CTAs, pricing, calculator, FAQ, and booking flows work.
- [ ] Every internal link uses a trailing slash.
- [ ] Direct links to page anchors, especially `#cal-sec`, work without an empty booking region.
- [ ] Reduced-motion users do not receive forced smooth scrolling or nonessential animation.

### HTML, SEO, and assets

- [ ] One `h1`; headings follow a meaningful order.
- [ ] Title, meta description, canonical URL, Open Graph image, Twitter metadata, and JSON-LD match visible content.
- [ ] Every content image is local, has dimensions, and has suitable alt text.
- [ ] No old WordPress image URL remains in production markup or CSS.
- [ ] Only the actual LCP image is eager/preloaded after measurement.
- [ ] No page-specific external font or icon CDN is added without a trace-backed reason.

### Accessibility

- [ ] Every link has a real destination.
- [ ] Every action is a native button with a discernible accessible name.
- [ ] Icon-only controls have `aria-label` or visible text; their decorative icon is `aria-hidden`.
- [ ] Inputs have labels, error messages, and keyboard focus states.
- [ ] Tab, accordion, dialog, and menu patterns expose their state with the correct native semantics or ARIA.
- [ ] Keyboard navigation works in logical order and focus remains visible.
- [ ] Colour is never the only signal of a control’s state.

### Performance

- [ ] Static content requires no client JavaScript.
- [ ] Local scripts are deferred modules and scoped to their own root.
- [ ] No permanent `requestAnimationFrame` loop is left running.
- [ ] Visibility work uses `IntersectionObserver`, not a high-frequency scroll handler.
- [ ] Third-party assets are not part of the critical request chain unless truly essential.
- [ ] There is exactly one owner for every analytics/widget vendor.
- [ ] The generated initial HTML does not contain Cal.com's heavy embed script or iframe before the calendar trigger.

### Build verification

```bash
bun run build
bunx astro check
git diff --check
```

For this sprint, the production build completed successfully with 19 static routes and `astro check` reported zero errors. Existing hints/warnings should still be tracked separately; a zero-error check is not a substitute for browser testing.

## After Deploy: Validation Plan

### 1. Test the actual deployed route

Run PageSpeed Insights for both mobile and desktop. Record the date, route, device profile, and score so later changes can be compared fairly.

Use Chrome DevTools Performance to answer these specific questions:

- What is the LCP element?
- Is any render-blocking stylesheet or script delaying first paint?
- Does Cal.com appear in the network log before the second-section trigger or a booking CTA?
- Does GTM load only on interaction/idle as designed?
- Are Font Awesome/CDN requests still present?
- Does a long task come from first-party code, GTM, Pixel, Talkgenie, or Cal.com?

### 2. Verify booking behaviour

Test all three paths:

1. Load the page and do not scroll: Cal.com should not load.
2. Scroll beyond the end of the second top-level section: calendar loading should begin once.
3. Click a booking CTA or load the URL with `#cal-sec`: calendar should begin immediately.

Confirm a successful booking produces exactly one tracking event with intended campaign parameters.

### 3. Verify tracking ownership

Use the network panel and vendor debug tools to confirm:

- one GTM container request;
- one Facebook Pixel bootstrap/PageView, if enabled;
- one Talkgenie widget request, if enabled;
- no duplicate vendor injected through both GTM and code.

### 4. Verify crawlability and accessibility

Run Lighthouse accessibility and the agentic-browser/crawlability audit. Check specifically for:

- buttons without discernible text;
- `javascript:` URLs or other uncrawlable links;
- missing labels;
- duplicate IDs;
- low-contrast text;
- missing focus indicators;
- invalid document landmarks or headings.

Then tab through the page manually. Automated tools cannot tell whether a keyboard user can understand the sequence of a complex demo.

### 5. Watch field data, not only the lab score

Monitor Search Console and Chrome UX Report over the following 28 days. Compare field LCP and CLS by device class before and after the release. If field LCP remains high while Lighthouse is good, investigate real-device images, slow networks, cache behaviour, consent/third-party timing, and any layout shift that occurs after the audit window.

## Architecture Decisions and Rationale

| Decision | Rationale |
|---|---|
| Static Astro markup is the default. | It is the smallest, most crawlable, most accessible, and easiest-to-review output. |
| Layout owns document-wide concerns. | Fonts, metadata, header/footer, Analytics placement, and global CSS must not drift per page. |
| Page owns page-specific content. | A future page can be migrated without copying a second HTML document shell. |
| CSS before JavaScript. | Hover, responsive layouts, visual transitions, and simple disclosure should not cost main-thread work. |
| Local asset ownership. | A site should not depend on an old WordPress host for production visuals. |
| Deferred third parties. | They serve analytics/conversion/support, but should not be allowed to determine LCP. |
| Direct user request beats delay. | A CTA click loads Cal.com immediately, even though passive initial loading is deferred. |
| Native semantics over fake links. | A button is an action; a link is a destination. Correct semantics improve accessibility and crawler results simultaneously. |
| Field data is the final performance authority. | A high lab score is useful, but actual users determine Core Web Vitals. |

## Why This Works

The browser can render static HTML and CSS immediately because the expensive systems are no longer required to construct the first screen. The calendar waits for meaningful intent, the analytics/tag requests wait for interaction or idle time, and semantic controls communicate their action to both assistive technology and crawlers.

The design does not remove conversion features. It changes their loading moment: a passive visitor gets a fast landing page, while a visitor who scrolls toward or clicks booking receives the booking system as soon as it is relevant.

## Expected Impact

When this approach is applied completely, a legacy page should achieve:

- a smaller critical request chain;
- a faster first render and more stable LCP candidate;
- no off-screen calendar iframe during initial testing;
- lower risk of third-party long tasks affecting TBT/INP;
- fewer layout shifts through reserved image/embed dimensions;
- semantic, crawlable controls rather than fake links;
- a consistent metadata, font, header/footer, and tracking foundation for every migrated route;
- a clear checklist that prevents a “looks correct locally” page from shipping with invisible performance or accessibility debt.

The homepage is the reference pattern, not an excuse to duplicate it mechanically. Each legacy page must still be measured, given only the behaviour it truly needs, and verified on the deployed route.
