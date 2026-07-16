# Sprint 1 — TBT Reduction & Third-Party Script Deferral

## Goal

Reduce Total Blocking Time (TBT) on `canvassing-app` and `storm-restoration-roofing` pages from **940ms → sub-200ms** by deferring all third-party scripts off the critical rendering path.

## Problem

Lighthouse reported TBT of 940ms on Desktop. Main-thread breakdown:

| Source | Duration |
|--------|----------|
| Google Tag Manager | 831ms |
| Unattributable | 300ms |
| Facebook Pixel (via GTM) | 258ms |
| talkgenie.ai widget (via GTM) | 138ms |
| canvassing-app.js (own code) | 68ms |

All third-party tags fired synchronously on page load via GTM "All Pages" trigger, blocking the main thread during FCP → TTI.

## Solution

Moved all third-party scripts out of GTM and into a single global deferred loader component that uses `requestIdleCallback` + user-interaction fallback.

## Files Changed

### `src/components/ThirdPartyWidgets.astro` (NEW)
- Global component loaded on every page via `BaseLayout.astro`
- Houses both **Talkgenie widget** and **Facebook Pixel** in a single deferred loader
- **Talkgenie**: sets `window.protoSettings`, dynamically injects `talkgeniejs.umd.js`
- **Facebook Pixel**: full `fbevents.js` bootstrap, `fbq('init', '985418843520178')` + `fbq('track', 'PageView')`
- **Deferred loading strategy**:
  - `requestIdleCallback(loadAll, { timeout: 8000 })` — fires after browser idle, post-TTI
  - `setTimeout(loadAll, 5000)` — fallback for browsers without idle callback
  - User interaction listeners (`pointerdown`, `keydown`, `scroll`, `touchstart`) as safety net
- `loaded` flags prevent double-init

### `src/components/Analytics.astro` (MODIFIED)
- GTM loading timeout increased: `requestIdleCallback` timeout 5s → **15s**, fallback `setTimeout` 3s → **8s**
- Gives browser more idle time before forcing GTM load

### `src/scripts/canvassing-app.js` (MODIFIED)
- All init calls (`bindCheckoutButtons`, `initLazyCalendar`, `initFaqAnalytics`) wrapped in `scheduleInit()` helper
- `scheduleInit` uses `requestIdleCallback` with 4s timeout — own code no longer blocks main thread at parse time

### `src/layouts/BaseLayout.astro` (MODIFIED)
- Added `import ThirdPartyWidgets` and `<ThirdPartyWidgets />` in body
- Added `<link rel="preconnect" href="https://connect.facebook.net" crossorigin />`
- Added `<link rel="dns-prefetch" href="https://unpkg.com" />`
- Warms DNS/TLS for Facebook CDN and unpkg before scripts load

## Files NOT Changed (but relevant)

- `src/pages/canvassing-app.astro` — No changes needed; benefits from global `BaseLayout.astro` updates
- `src/pages/storm-restoration-roofing.astro` — Same; benefits globally

## GTM Container Changes (user action required)

- Removed **talkgenie.ai** tag from GTM (now loaded in code)
- Removed **Facebook Pixel** tag from GTM (now loaded in code)
- GTM now only fires its own container script + any remaining tags

## Why This Works

`requestIdleCallback` schedules work during browser idle periods — which only occur **after** TTI. The 8s timeout ensures scripts fire even on pages with no idle gaps. All third-party main-thread work (Facebook ~258ms, Talkgenie ~138ms) runs entirely outside the FCP→TTI window that Lighthouse measures for TBT.

## Expected Impact

| Metric | Before | After |
|--------|--------|-------|
| TBT | 940ms | ~100-200ms |
| Performance Score | 64 | ~90+ |

## Architecture Decision: Global vs Per-Page

Chose **global** (`BaseLayout.astro`) over per-page for third-party widgets because:
1. Talkgenie and Facebook Pixel are needed on all marketing pages
2. Single deferred loader = one `requestIdleCallback` call instead of N
3. Future pages automatically inherit the optimization
4. Keeps page templates clean — no script boilerplate per page
