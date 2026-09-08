export type RedirectStatus = 301 | 302 | 307 | 308;

export interface RedirectRule {
  /** Incoming path to match, e.g. "/old-page/" or "/promo" */
  from: string;
  /** Destination: internal path "/new/" or absolute "https://example.com/x" */
  to: string;
  /**
   * Status code (configurable per rule):
   *  301 = permanent GET redirect (default, SEO-friendly)
   *  302 = temporary GET
   *  307 = temporary, PRESERVES method + body  -> use for POST redirects
   *  308 = permanent,   PRESERVES method + body  -> use for POST redirects
   */
  status?: RedirectStatus;
}

/**
 * Site redirects. Add a row here, commit, deploy. No Cloudflare dashboard needed.
 * Matching is exact on the path (trailing slash normalized).
 */
export const redirects: RedirectRule[] = [
  { from: "/old-page/", to: "/new-page/", status: 301 },
  { from: "/webhook-legacy", to: "https://api.knockio.com/new", status: 307 },
  { from: "/summer-sale", to: "https://partner.com/sale", status: 302 },
];

export const redirectMap = new Map<string, RedirectRule>(
  redirects.map((r) => [r.from.replace(/\/+$/, "") || "/", r]),
);
