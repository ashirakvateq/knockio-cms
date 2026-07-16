# WordPress → Cloudflare Workers: one-page-at-a-time migration playbook

This is the operational sequence for moving `xyz.com` off WordPress shared hosting,
one URL at a time, onto the new Astro-on-Workers project — without touching DNS,
without downtime, and with an instant rollback available at every step.

## The three moving parts

| Piece | What it is | Does it change during migration? |
|---|---|---|
| WordPress origin | Existing shared hosting, served via the current A records | No — untouched, stays live for every page not yet migrated |
| Astro Worker | The new project, deployed via `wrangler deploy` | Yes — you redeploy it every time you add or update a page |
| Workers Route | The switch that says "this specific path goes to the Worker instead of DNS" | Yes — this is the one thing you add, per page, when that page is ready to go live |

The Route is the only thing that actually redirects traffic. Deploying the Worker
by itself changes nothing on the live site — a page can exist in the Worker's build
output for days before it's reachable at `xyz.com`, because nothing points traffic
at it yet. This is what makes the process safe: build and verify first, flip the
switch second.

## Per-page migration workflow

Repeat this for every page. Treat it as a literal checklist.

**1. Build the page in the Astro project**
Add the content (markdown/MDX entry, or hand-written `.astro` page), matching the
current WordPress URL slug and trailing-slash style exactly.

**2. Deploy the Worker**
```
bun run deploy
```
This updates the live static assets bound to the Worker, but the page is only
reachable at its `workers.dev` preview URL so far — `xyz.com` traffic is unaffected.

**3. Verify on the preview URL**
Check the page renders correctly, GTM/tracking fires as expected, forms (if any)
submit correctly, images and fonts load, no console errors.

**4. Add the Workers Route**
Dashboard → your Worker → Settings → Domains & Routes → Add → Route:
```
xyz.com/the-page-slug*
```
This is the moment the page goes live on the real domain. Traffic to this specific
path now hits the Worker; every other path on `xyz.com`, and every subdomain,
continues exactly as before.

**5. Verify on the live domain**
Load `https://xyz.com/the-page-slug` directly (not the preview URL) and confirm:
- Correct page loads, not a WordPress version or a 404.
- No mixed content / cache weirdness (see pitfalls below).
- Analytics fires under the real domain, not the preview one.

**6. Housekeeping (optional, not required for functionality)**
- Update internal links elsewhere on the WordPress site that point to this URL, if
  any link structure changed.
- Note the migrated URL somewhere (a simple running list is enough) so you don't
  lose track of what's moved and what hasn't.
- You do not need to delete or unpublish the page in WordPress. It's still there,
  just unreachable via `xyz.com` because the Route intercepts before the request
  ever reaches the origin. This is actually convenient for rollback.

## Rollback

If anything is wrong with a migrated page, remove the Route (Settings → Domains &
Routes → delete the entry). Traffic to that path falls straight back through to DNS
and the still-intact WordPress page, immediately. No redeploy, no DNS change, no
waiting on propagation — Routes are evaluated at the edge on every request.

## The homepage is a special case — save it for last

Every other page you migrate is a path prefix (`/canvassing-app*`). The homepage is
the root of the domain itself. A few things to be careful about when that day comes:

- The Route pattern for the homepage is `xyz.com/` (exact), not a prefix — get this
  precise, since an overly broad pattern here would start intercepting *all* paths,
  including ones you haven't migrated yet.
- This is by far your highest-traffic, highest-risk page. Migrate it last, after
  you've run the per-page workflow above successfully several times on lower-stakes
  pages and trust the process.
- Double-check canonical tags, sitemap entries, and any hardcoded absolute URLs
  (e.g. Open Graph image paths) reference the new site correctly once this page
  moves, since the homepage is what most external links and search engines treat as
  the anchor for the whole domain.

## Common pitfalls

- **Trailing slash mismatch.** If WordPress serves `/canvassing-app/` (with slash)
  and Astro's `trailingSlash` config produces `/canvassing-app` (without), visitors
  and search engines hitting the old URL pattern will 404 instead of landing on the
  new page. Confirm this before the first real cutover, not after.
- **Cloudflare's own cache serving a stale WordPress page.** If the URL was
  previously cached at the edge (page rules, cache reserve, etc.), purge that
  specific URL's cache after adding the Route so visitors aren't served a stale
  cached copy of the old page instead of hitting the new Worker.
- **GTM firing twice or on the wrong container during testing.** Preview URLs
  (`workers.dev`) and the live domain are different origins — if GTM or any tag is
  domain-gated, verify it fires correctly specifically on `xyz.com`, not just on
  the preview URL, before considering the migration of that page complete.
- **Broken internal links from old WordPress pages.** If other still-live WordPress
  pages link to the migrated URL using an old slug or anchor structure that changed
  during the rewrite, fix those links — the Route doesn't know or care about
  WordPress's internal linking, only about the URL path itself.
- **Forgetting a page exists in the Worker's build but was never given a Route.**
  Harmless — it's just unreachable dead weight in the deploy until you add the
  Route. Not a security issue since these are public marketing pages, but worth
  cleaning up the running list so you know what's actually live.

## When to stop doing this one page at a time

Once most of `xyz.com`'s traffic and paths have migrated, maintaining a long list of
individual Routes becomes more overhead than it's worth. At that point, the natural
next step is a full cutover: point the Worker at the domain directly (Custom Domain)
instead of maintaining path-by-path Routes, and let WordPress serve only the small
remaining tail of unmigrated content — or retire it entirely. That's a decision for
later in the migration, not something to plan around now.