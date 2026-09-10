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
  { from: "/campaigns/", to: "/features/campaign-management/", status: 301 },
  { from: "/photo-and-video/", to: "/features/photo-and-media-management/", status: 301 },
  { from: "/route-mapping/", to: "/features/route-planning-and-dispatching/", status: 301 },
  { from: "/knockio-roles/", to: "/features/user-management-software/", status: 301 },
  { from: "/territories/", to: "/features/territory-management-software/", status: 301 },
  { from: "/workflow-automation/", to: "/features/business-automation-software/", status: 301 },
  { from: "/window-cleaning-business-software/", to: "/industry/window-cleaning-business-software/", status: 301 },
  { from: "/job-scheduling-software/", to: "/features/business-automation-software/", status: 301 },
  { from: "/sales-rep-tracking-software/", to: "/features/gps-tracking-software/", status: 301 },
  { from: "/sales-rep-tracking-app/", to: "/features/gps-tracking-software/", status: 301 },
  { from: "/salesrep-tracking-app/", to: "/features/gps-tracking-software/", status: 301 },
  { from: "/hvac-sales-software/", to: "/hvac-sales-app-crm-software/", status: 301 },
  { from: "/case-study/", to: "/case-studies/modern-roofing/", status: 301 },
  { from: "/case-study/modern-roofing/", to: "/case-studies/modern-roofing/", status: 301 },
];

export const redirectMap = new Map<string, RedirectRule>(
  redirects.map((r) => [r.from.replace(/\/+$/, "") || "/", r]),
);
