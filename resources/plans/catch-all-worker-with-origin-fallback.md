# Catch-All Worker with Hostinger Origin Fallback

> **Goal**: Replace per-page Workers Routes with a single catch-all route (`knockio.com/*`) that serves Astro static pages when matched, and transparently proxies to the Hostinger origin for all other paths.

---

## Table of Contents

1. [Current Architecture](#current-architecture)
2. [Target Architecture](#target-architecture)
3. [Approach Comparison](#approach-comparison)
4. [Recommended Approach: Worker Script + Origin Fetch](#recommended-approach-worker-script--origin-fetch)
5. [Request Flow Diagram](#request-flow-diagram)
6. [Implementation Steps](#implementation-steps)
7. [Origin Fetch Strategy](#origin-fetch-strategy)
8. [Caching Strategy](#caching-strategy)
9. [Decision: Why `run_worker_first: false`](#decision-why-run_worker_first-false-the-default-omitted-from-config)
10. [Cost Implications](#cost-implications)
11. [Migration Checklist](#migration-checklist)
12. [Rollback Plan](#rollback-plan)
13. [Pitfalls and Edge Cases](#pitfalls-and-edge-cases)
14. [Future: Full Cutover](#future-full-cutover)

---

## Current Architecture

```
                          knockio.com
                              │
                    ┌─────────┴─────────┐
                    │  Cloudflare DNS    │
                    │  (proxied/orange)  │
                    └─────────┬─────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
     Route: /pricing*   Route: /features*   Route: /canvassing-app*
              │               │               │
         ┌────┴────┐     ┌────┴────┐     ┌────┴────┐
         │ Worker  │     │ Worker  │     │ Worker  │
         │ (static)│     │ (static)│     │ (static)│
         └─────────┘     └─────────┘     └─────────┘

     All OTHER paths (no route match) ──► DNS ──► Hostinger Origin
```

### Current `wrangler.jsonc`

```jsonc
{
  "name": "xyz-astro-site",
  "compatibility_date": "2026-07-01",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "404-page"
  }
}
```

**No Worker script** (`main` is absent). Only static assets with per-page Routes added via the dashboard.

### Problems with Current Approach

| Problem | Impact |
|---------|--------|
| Must add a Route for every new page | Manual, error-prone, slows deployment |
| Easy to forget to add a Route | Page exists in build but is unreachable |
| Long list of Routes to maintain | Dashboard clutter, hard to audit |
| No single source of truth | Routes live in dashboard, not in code |
| Can't serve `knockio.com/*` catch-all | Some pages still need Hostinger |

---

## Target Architecture

```
                          knockio.com
                              │
                    ┌─────────┴─────────┐
                    │  Cloudflare DNS    │
                    │  (proxied/orange)  │
                    └─────────┬─────────┘
                              │
                 Route: knockio.com/*
                              │
                    ┌─────────┴─────────┐
                    │  Cloudflare Static │
                    │  Asset Router      │
                    │  (built-in, FREE)  │
                    └─────────┬─────────┘
                              │
              ┌───────────────┴───────────────┐
              │                               │
      Asset in ./dist?                 Not in ./dist
              │                               │
     ┌────────┴────────┐            ┌─────────┴─────────┐
     │  Serve Astro    │            │  Worker Script    │
     │  page/CSS/JS/   │            │  fetch() to       │
     │  images directly│            │  Hostinger Origin │
     │  (no Worker     │            │  (proxy pass)     │
     │   invocation)   │            │                   │
     └─────────────────┘            └───────────────────┘
```

### Key Difference

- **One route**: `knockio.com/*` catches ALL traffic
- **Static assets** (Astro pages, CSS, JS, images) served by Cloudflare's built-in asset router — **free, no Worker invocation**
- **Worker script** only runs when no static asset matches — proxies to Hostinger
- **Routes become declarative** (in `wrangler.jsonc`), not manual dashboard entries
- **Adding a new Astro page** = rebuild + deploy. No Route manipulation needed.

---

## Approach Comparison

Three approaches were evaluated. The table below compares them on critical dimensions.

| Dimension | A: Catch-all + Worker Origin Fetch | B: Catch-all + 302 Redirect | C: Keep Per-Page Routes + Add Catch-all |
|-----------|-----------------------------------|-----------------------------|---------------------------------------|
| **How it works** | Single `knockio.com/*` route. Worker tries assets, falls back to `fetch()` on Hostinger origin | Single route. Worker serves assets or issues HTTP 302 to Hostinger IP | Individual routes per migrated page + a catch-all Worker for the rest |
| **User sees URL change?** | No (transparent proxy) | Yes (URL changes to Hostinger IP/domain) | No |
| **SEO impact** | None (same URL, same content) | Negative (302 = temporary, confuses crawlers, dilutes link equity) | None |
| **Complexity** | Low (one route, one Worker script) | Low (one route, simpler Worker) | High (maintain N routes + catch-all) |
| **Cost per unmigrated page** | Worker invocation + origin fetch | Worker invocation only (redirect is cheap) | No Worker cost (falls through to origin) |
| **Headers/cookies preserved?** | Yes (proxy passes them) | Partial (redirect loses some headers) | N/A (no Worker involved) |
| **SSL/TLS** | End-to-end (Worker ↔ Hostinger) | Browser connects directly to Hostinger | N/A |
| **Caching of origin content** | Possible (Cloudflare cache in front of origin fetch) | Not applicable | Not applicable |
| **Scalability** | Excellent — add pages to build, zero config change | Good | Poor — N routes grow unbounded |
| **Rollback** | Remove one route, all traffic returns to Hostinger | Remove one route | Remove individual routes |
| **Recommendation** | **RECOMMENDED** | Not recommended (SEO + UX) | Status quo (acceptable short-term) |

### Verdict

**Approach A** is the clear winner. It provides:
- Transparent proxying (no URL change for users)
- Zero SEO impact
- Single route to maintain
- Caching opportunities for origin content
- Clean rollback path

---

## Recommended Approach: Worker Script + Origin Fetch

### Architecture Components

```
┌──────────────────────────────────────────────────────────────┐
│                      Cloudflare Edge                         │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐     │
│  │         Cloudflare Static Asset Router              │     │
│  │         (runs BEFORE Worker, always)                 │     │
│  │                                                     │     │
│  │  If path matches file in ./dist → serve it (FREE)   │     │
│  │  If no match → invoke Worker Script                 │     │
│  └─────────────────────────────────────────────────────┘     │
│                         │                                    │
│           ┌─────────────┴──────────────┐                     │
│           │                            │                     │
│  ┌────────┴────────┐       ┌──────────┴──────────┐          │
│  │  Static Assets   │       │  Worker Script      │          │
│  │  (./dist)        │       │  (origin proxy)     │          │
│  │                  │       │                     │          │
│  │  Astro pages     │       │  fetch() to         │          │
│  │  CSS, JS, fonts  │       │  content.knockio.com │          │
│  │  Images          │       │  (DNS-only)         │          │
│  │                  │       │                     │          │
│  │  Served FREE     │       │  WordPress pages    │          │
│  │  by Cloudflare   │       │  Blog, wp-admin     │          │
│  └──────────────────┘       │  WP CSS/JS/images   │          │
│                              └─────────────────────┘          │
└──────────────────────────────────────────────────────────────┘
```

---

## Request Flow Diagram

```
User requests: https://knockio.com/some-path/
                         │
                         ▼
              ┌─────────────────────┐
              │  Cloudflare DNS     │
              │  (proxied A record) │
              └─────────┬───────────┘
                        │
                        ▼
              ┌─────────────────────┐
              │  Route Match?       │
              │  knockio.com/*      │──── No match ──► Hostinger (DNS origin)
              └─────────┬───────────┘
                        │ Yes
                        ▼
              ┌─────────────────────────┐
              │  Cloudflare Static      │
              │  Asset Router (built-in)│
              │  Checks ./dist files    │
              └─────────┬───────────────┘
                        │
              ┌─────────┴───────────┐
              │                     │
        Asset Found           No Asset Match
        (FREE, no Worker)     (Worker invoked)
              │                     │
              ▼                     ▼
     ┌────────────────┐   ┌─────────────────────┐
     │ Serve Astro    │   │ Worker Script       │
     │ page/CSS/JS/   │   │ proxies to          │
     │ image directly  │   │ Hostinger Origin    │
     └────────────────┘   └─────────┬───────────┘
                                    │
                                    ▼
                          ┌─────────────────────┐
                          │ fetch(originUrl)    │
                          │ → content.knockio.com│
                          │ (DNS-only, no proxy)│
                          └─────────┬───────────┘
                                    │
                          ┌─────────┴───────────┐
                          │                     │
                    Origin responds        Origin error
                          │                     │
                          ▼                     ▼
                 ┌────────────────┐   ┌────────────────┐
                 │ Return origin  │   │ Return 502     │
                 │ response       │   │ Bad Gateway    │
                 └────────────────┘   └────────────────┘
```

---

## Implementation Steps

### Phase 1: Create the Worker Script

Create `src/worker.ts` — the Worker script invoked only when a request does NOT match a static asset (because `run_worker_first` is `false`, the default).

```typescript
// src/worker.ts

const HOSTINGER_ORIGIN = "https://content.knockio.com";

interface Env {
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Cloudflare's static asset router already ran and found no match.
    // The Worker is invoked because no file in ./dist matched this path.
    // Proxy the request to the Hostinger WordPress origin.

    const originUrl = new URL(url.pathname + url.search, HOSTINGER_ORIGIN);

    const originHeaders = new Headers(request.headers);
    originHeaders.set("Host", "knockio.com");
    originHeaders.set("X-Forwarded-For", request.headers.get("CF-Connecting-IP") || "");
    originHeaders.set("X-Real-IP", request.headers.get("CF-Connecting-IP") || "");

    try {
      const originResponse = await fetch(originUrl, {
        method: request.method,
        headers: originHeaders,
        body: request.method !== "GET" && request.method !== "HEAD"
          ? request.body
          : undefined,
        redirect: "follow",
      });

      const response = new Response(originResponse.body, originResponse);
      response.headers.set("X-Proxied-By", "knockio-astro-worker");

      return response;
    } catch (err) {
      console.error("Origin fetch failed:", err);
      return new Response("Bad Gateway", {
        status: 502,
        headers: { "Content-Type": "text/plain" },
      });
    }
  },
} satisfies ExportedHandler<Env>;
```

**Why this script is simpler than the original draft:**

The initial draft included an `isStaticAsset` early-return block that checked file extensions and called `env.ASSETS.fetch()` for static files, skipping the origin proxy. This was a **bug** discovered during review:

> When `/blog/` is served by Hostinger (WordPress), the HTML references assets like `/wp-content/themes/style.css`, `/blog/image.webp`, etc. Those subrequests hit the Worker too (catch-all route). If the Worker short-circuits static extensions with `return env.ASSETS.fetch(request)`, it returns a 404 instead of proxying to Hostinger. The blog page loads but every CSS file, image, and JS file is broken.

The fix: remove the extension check entirely. With `run_worker_first: false`, the Worker is only invoked for requests that **didn't match** a static asset. So every request reaching the Worker is something that needs to go to the origin — pages, WordPress CSS, WordPress images, everything. No filtering needed.

### Phase 2: Update `wrangler.jsonc`

```jsonc
{
  "name": "xyz-astro-site",
  "main": "src/worker.ts",
  "compatibility_date": "2026-07-01",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "none",
    "html_handling": "auto-trailing-slash"
  },
  "routes": [
    {
      "pattern": "knockio.com/*",
      "zone_name": "knockio.com"
    }
  ]
}
```

### Key Configuration Decisions Explained

| Setting | Value | Why |
|---------|-------|-----|
| `main` | `"src/worker.ts"` | Adds Worker script to handle origin fallback for non-matching paths |
| `assets.not_found_handling` | `"none"` | Returns a null-body 404 for non-matching assets. The Worker then receives the request and proxies to origin. We do NOT use `"404-page"` because we don't want to serve a 404 HTML page — we want the Worker to handle it. |
| `assets.html_handling` | `"auto-trailing-slash"` | Matches WordPress trailing-slash convention |
| `assets.run_worker_first` | `false` (default, omitted) | Worker only runs when no static asset matches. Astro pages, CSS, JS, images are served for free without Worker invocation. See decision rationale below. |
| `routes` | `knockio.com/*` | Single catch-all route replaces all per-page routes |

> **Note**: `assets.binding` is intentionally omitted. We don't need `env.ASSETS.fetch()` in the Worker because with `run_worker_first: false`, the Worker is only invoked for requests that already failed to match a static asset. There's nothing left to try in the asset store.

### Phase 3: Determine Hostinger Origin Address

The Worker needs to reach Hostinger without going through Cloudflare's proxy (which would create a loop). There are several strategies:

| Strategy | How | Pros | Cons |
|----------|-----|------|------|
| **A: resolveOverride** | Use `cf.resolveOverride` to resolve `knockio.com` to Hostinger IP | Same hostname, no SSL issues | Requires knowing Hostinger IP; only works if origin accepts the original Host header |
| **B: Direct IP** | Fetch `https://<HOSTINGER_IP>` directly | Simple, no DNS loop | SSL cert must match IP (unlikely); need to set Host header |
| **C: Proxied subdomain** | Create `content.knockio.com` DNS record (proxied/orange-cloud) pointing to Hostinger IP + Let's Encrypt cert | Clean separation; proper SSL; WAF on origin fetches; no loop risk (different hostname from route) | Requires DNS + Hostinger subdomain setup |
| **D: Hostinger direct hostname** | Use Hostinger's direct server hostname/IP with Host header override | Works if Hostinger responds to Host header | SSL verification may fail; need to handle |

**Recommended: Strategy C — Origin Subdomain**

```
1. In Cloudflare DNS, create:
   Type: A record
   Name: content
   Content: <HOSTINGER_SERVER_IP>
   Proxy status: Proxied (orange cloud) ← OK to keep proxied

2. In the Worker, set:
   const HOSTINGER_ORIGIN = "https://content.knockio.com";

3. Set Host header to "knockio.com" in the fetch() call
   so Hostinger serves the correct WordPress site.
```

**Why proxied (orange cloud) is acceptable:** The Worker route is `knockio.com/*`, which only matches requests to `knockio.com`. When the Worker calls `fetch("https://content.knockio.com/...")`, that's a different hostname — the route doesn't match, so no loop. The subrequest goes through Cloudflare's edge (adds negligible latency) and you get WAF protection on origin fetches for free.

### Phase 4: Remove Old Per-Page Routes

After the catch-all route is active and verified:

1. Go to Cloudflare Dashboard → Workers & Pages → `xyz-astro-site` → Settings → Domains & Routes
2. **Delete all individual path routes** (e.g., `knockio.com/pricing*`, `knockio.com/features*`, etc.)
3. The single `knockio.com/*` route now handles everything

> **Important**: Do this AFTER verifying the catch-all works. The old routes serve as a safety net during testing.

---

## Origin Fetch Strategy (Detailed)

### How `fetch()` Works Inside a Worker on a Route

When a Worker is configured on a Route (not Custom Domain), calling `fetch(request)` inside the Worker normally goes through Cloudflare's proxy again — creating a potential loop.

```
Worker receives request for knockio.com/foo
  └── fetch("https://knockio.com/foo") ──► Cloudflare proxy ──► Worker again (LOOP!)
```

### Breaking the Loop

```
Strategy C: content.knockio.com (proxied subdomain)

Worker receives request for knockio.com/foo
  └── fetch("https://content.knockio.com/foo")
        └── Different hostname from route (knockio.com/*) → no loop
        └── Goes through Cloudflare edge → Hostinger origin
        └── Host header set to "knockio.com" → WordPress serves correct site ✓
```

### Alternative: resolveOverride

If you don't want to create a subdomain:

```typescript
const originResponse = await fetch(new URL(url.pathname, "https://knockio.com"), {
  headers: { Host: "knockio.com" },
  cf: {
    resolveOverride: "knockio.com",  // resolve to origin IP
  },
});
```

**Caveat**: `resolveOverride` only works when the target hostname is within the same Cloudflare zone. It overrides DNS resolution to the zone's origin IP. This may or may not work depending on your Cloudflare plan and zone configuration.

---

## Caching Strategy

| Content Type | Cache Behavior | Configuration |
|-------------|----------------|---------------|
| Astro static pages | Cached by Cloudflare edge (automatic via static assets) | Built-in |
| Astro CSS/JS/images | Cached with long TTL (content-hashed filenames) | Built-in |
| Origin WordPress pages | Cached via `cf.cacheTtl` on the Worker's `fetch()` | `cf: { cacheTtl: 300, cacheEverything: true }` |
| Origin static assets (wp-content) | Cached via same `fetch()` cache settings | Same as above |
| `wp-admin`, `wp-login` | Should NOT be cached | Add path exclusion in Worker |

### Paths to Exclude from Origin Caching

```typescript
const NO_CACHE_PATHS = [
  '/wp-admin',
  '/wp-login',
  '/wp-json',
  '/xmlrpc.php',
  '/wp-cron.php',
];

const shouldCacheOrigin = !NO_CACHE_PATHS.some(p => url.pathname.startsWith(p));
```

---

## Migration Checklist

```
Phase 1: Prepare (no production impact)
  [ ] Determine Hostinger server IP address
  [ ] Create content.knockio.com DNS record (A record, proxied/orange cloud)
  [ ] Create content.knockio.com subdomain in Hostinger hPanel (pointing to same public_html/)
  [ ] Install Let's Encrypt SSL cert for content.knockio.com in Hostinger hPanel
  [ ] Verify content.knockio.com resolves to Hostinger and serves WordPress
      curl -sI https://content.knockio.com/ -H "Host: knockio.com"
  [ ] src/worker.ts already created with origin proxy logic
  [ ] wrangler.jsonc already updated with main, routes (knockio.com/* + www.knockio.com/*), not_found_handling
  [ ] Run `bun run build` and verify Astro pages build correctly
  [ ] Run `bun run preview` to test locally
      (origin proxy won't work locally without content.knockio.com resolving — expected)

Phase 2: Deploy and Test
  [ ] Deploy: `bun run deploy`
  [ ] Verify on workers.dev URL that Astro pages serve correctly
  [ ] Verify on workers.dev URL that non-Astro paths return origin content
      (or 502 if content.knockio.com DNS isn't set up yet — that's OK for now)
  [ ] Check that the catch-all route 'knockio.com/*' appears in dashboard
  [ ] DO NOT delete old per-page routes yet

Phase 3: Verify on Production Domain
  [ ] Test migrated Astro pages on knockio.com (they should still work via old routes)
  [ ] Test unmigrated paths on knockio.com (should now hit Worker → origin)
  [ ] Test WordPress blog paths and verify CSS/images load correctly
  [ ] Verify wp-admin still works: knockio.com/wp-admin/
  [ ] Check SSL certificates are valid
  [ ] Check response headers include `X-Proxied-By: knockio-astro-worker` for origin pages
  [ ] Verify Google Analytics / GTM fires correctly on proxied pages
  [ ] Check forms on WordPress pages still submit correctly

Phase 4: Clean Up
  [ ] Remove all old per-page routes from dashboard
  [ ] Verify all pages still work after route cleanup
  [ ] Monitor Cloudflare Workers logs for errors (first 24 hours)
  [ ] Monitor Hostinger access logs to confirm origin traffic is reaching WordPress
```

---

## Rollback Plan

| Scenario | Rollback Action | Time to Recover |
|----------|----------------|-----------------|
| Astro pages broken | Revert `wrangler.jsonc` to remove `main`, redeploy | 2 minutes |
| Origin proxy broken | Remove `knockio.com/*` route from dashboard | 30 seconds |
| Everything broken | Revert wrangler.jsonc + remove catch-all route + re-add per-page routes | 5 minutes |
| Partial failure (some paths) | Add specific route exclusion (see below) | 2 minutes |

### Emergency: Exclude Specific Paths from Worker

If certain paths should bypass the Worker entirely, add a "no Worker" route with higher specificity:

```
In Cloudflare Dashboard → Workers Routes:
  Pattern: knockio.com/wp-admin/*     Worker: None
  Pattern: knockio.com/wp-login.php   Worker: None
```

More specific routes take precedence over wildcard routes. This lets you carve out exceptions without touching the Worker code.

---

## Pitfalls and Edge Cases

### 1. Infinite Loop

**Risk**: Worker fetches `knockio.com/path` → Cloudflare proxy → Worker → fetch again → loop.

**Mitigation**: Use the `content.knockio.com` subdomain (proxied) so the fetch goes to a different hostname than the Worker route (`knockio.com/*`), avoiding any loop. The Host header is set to `knockio.com` so WordPress serves the correct site. Test with `curl -sI https://content.knockio.com/ -H "Host: knockio.com"` before going live.

### 2. SSL Certificate Mismatch

**Risk**: Fetching Hostinger by IP may fail SSL verification.

**Mitigation**: Use `content.knockio.com` with a Let's Encrypt cert installed on Hostinger (auto-provisioned, no manual copy-paste needed). The proxied subdomain approach gives you SSL + WAF + no loop risk.

### 3. POST/PUT/Form Submissions

**Risk**: WordPress forms POST to `/wp-admin/admin-ajax.php` or similar.

**Mitigation**: The Worker forwards request body for non-GET/HEAD methods. However, consider excluding `wp-admin/*` and `wp-login*` from the Worker entirely (see Rollback Plan above).

### 4. WebSocket Connections

**Risk**: WordPress plugins using WebSockets won't work through the Worker proxy.

**Mitigation**: If needed, exclude WebSocket paths from the Worker. For the marketing site, this is unlikely to be an issue.

### 5. Large File Downloads

**Risk**: WordPress media files (PDFs, large images) proxied through Worker consume Worker CPU time.

**Mitigation**: Cloudflare's static asset router handles Astro's own CSS/JS/images for free. Only WordPress-served files (which don't exist in `./dist`) hit the Worker. For large WordPress media, the Worker proxies the response stream — Cloudflare handles streaming efficiently. Monitor CPU usage if large file downloads become frequent.

### 6. Cookies and Sessions

**Risk**: WordPress login cookies are domain-scoped to `knockio.com`. Since the Worker preserves the Host header, cookies should pass through correctly.

**Mitigation**: Test login/logout flows on proxied paths before going live.

---

## Decision: Why `run_worker_first: false` (the default, omitted from config)

This was a deliberate decision made during implementation review. Here's the reasoning so future readers understand it was thought through, not overlooked.

### The `run_worker_first` options compared

| Value | What happens for each request | Cost per Astro asset request | Cost per origin proxy request |
|-------|-------------------------------|------------------------------|-------------------------------|
| `false` (default) | Cloudflare checks static assets first. Only invokes Worker if no match. | **FREE** (no Worker) | Worker invocation |
| `true` | Worker runs first for EVERY request, then calls `env.ASSETS.fetch()` | Worker invocation (billable) | Worker invocation |
| `["/", "/wp-content/*"]` | Worker runs for navigations + WP asset paths; everything else goes to static assets | **FREE** (no Worker) | Worker invocation |

### Why `false` is correct for this project

1. **Astro pages, CSS, JS, and images are already in `./dist`**. Cloudflare's built-in static asset router matches them and serves them for free — no Worker needed.

2. **WordPress content (blog, wp-admin, wp-content) is NOT in `./dist`**. These paths fail the asset match, so the Worker is invoked — which is exactly when we want to proxy to Hostinger.

3. **The `isStaticAsset` bug**: The original draft included a file-extension check (`if (path.endsWith('.css')) return env.ASSETS.fetch(request)`). This was wrong because when `/blog/` is served by Hostinger, WordPress HTML references `/wp-content/themes/style.css`, `/blog/image.webp`, etc. Those paths don't exist in `./dist`, so `env.ASSETS.fetch()` returns 404 — breaking every subresource on the blog. With `run_worker_first: false`, these requests never reach the Worker's extension logic; they fail the asset match and the Worker proxies them correctly.

4. **Cost**: With `false`, only unmigrated paths (WordPress content) trigger Worker invocations. Migrated Astro pages and their assets are completely free.

### When would `run_worker_first: true` be useful?

- Authentication middleware that must check every request (including CSS/JS)
- HTMLRewriter transformations on all responses
- Request logging/analytics that must capture every hit

None of these apply to Knockio CMS right now. If needed later, it's a one-line config change.

---

## Cost Implications

| Item | Before (per-page routes) | After (catch-all Worker, `run_worker_first: false`) |
|------|--------------------------|-----------------------------------------------------|
| Astro page requests | Free (static asset serving) | **Free** (static asset serving, no Worker) |
| Astro CSS/JS/images | Free (static asset serving) | **Free** (static asset serving, no Worker) |
| Origin proxy requests (WordPress pages) | N/A (direct to Hostinger via DNS) | Worker invocation + origin subrequest |
| Origin sub-assets (wp-content CSS/JS/img) | N/A (direct to Hostinger via DNS) | Worker invocation + origin subrequest |
| Workers Free Plan limit | 100k requests/day | 100k requests/day |

**Net effect**: Only WordPress-origin traffic incurs Worker costs. All Astro content remains free. This is the best possible cost profile during the migration period.

---

## Future: Full Cutover

Once all WordPress pages are migrated to Astro:

1. Remove the origin fetch logic from the Worker script
2. Set `not_found_handling: "404-page"` and remove `run_worker_first`
3. Switch from Route to Custom Domain (cleaner, Worker IS the origin)
4. Decommission Hostinger hosting

```jsonc
// Final state after full migration:
{
  "name": "xyz-astro-site",
  "compatibility_date": "2026-07-01",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "404-page"
  },
  "routes": [
    {
      "pattern": "knockio.com",
      "custom_domain": true
    }
  ]
}
```

---

## Appendix: Decision Matrix for run_worker_first Values

| Value | Worker runs for | Cost | Use Case |
|-------|----------------|------|----------|
| `false` (default) | Only non-matching requests | **Lowest** | SSG with origin fallback — our setup |
| `true` | ALL requests | Highest | Full middleware (auth, logging, HTMLRewriter on every response) |
| `["/"]` | Page navigations only | Low | SPA-style routing where nav requests need Worker logic |
| `["/", "/wp-content/*"]` | Navigations + WP assets | Medium | SSG where WP asset paths need explicit Worker handling |
| `["/api/*"]` | API paths only | Low | SPA with API endpoints |

**For Knockio CMS**: Use `false` (default, omitted from config). This is the deliberate choice — see the "Decision" section above. If full middleware control is needed later (e.g., auth on every request), switch to `true` or a pattern array. It's a one-line change.
