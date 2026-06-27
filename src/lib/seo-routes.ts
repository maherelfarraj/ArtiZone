/**
 * Agent-editable registry of publicly-crawlable routes. Consumed by the
 * /sitemap.xml handler in src/server/entry.ts.
 *
 * Guidelines for maintaining this file:
 * - Static public paths are synced automatically from src/routes.tsx.
 * - Do not include dynamic-param routes like "/products/:id" directly.
 *   Instead, enumerate real values (e.g. "/products/desk-pro") or skip.
 * - `path` MUST start with "/".
 * - Priorities are between 0.0 and 1.0. Home = 1.0, main sections = 0.8,
 *   deep pages = 0.5.
 * - Dev-only or auth-required routes MUST NOT be listed.
 */

export interface SeoRoute {
  path: string;
  changefreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
  lastmod?: string;
}

export const seoRoutes: SeoRoute[] = [
  { path: "/", changefreq: "weekly", priority: 1.0, lastmod: "2026-06-13" },
  { path: "/services", changefreq: "monthly", priority: 0.9, lastmod: "2026-06-13" },
  { path: "/mens-services", changefreq: "monthly", priority: 0.8, lastmod: "2026-06-13" },
  { path: "/packages", changefreq: "monthly", priority: 0.8, lastmod: "2026-06-13" },
  { path: "/before-after", changefreq: "monthly", priority: 0.7, lastmod: "2026-06-13" },
  { path: "/about", changefreq: "monthly", priority: 0.8, lastmod: "2026-06-13" },
  { path: "/booking", changefreq: "monthly", priority: 0.9, lastmod: "2026-06-13" },
  { path: "/contact", changefreq: "yearly", priority: 0.7, lastmod: "2026-06-13" },
  { path: "/special-offers", changefreq: "weekly", priority: 0.9, lastmod: "2026-06-13" },
  { path: "/newsletter-analytics", changefreq: "monthly", priority: 0.8 },
  { path: "/reviews-admin", changefreq: "monthly", priority: 0.8 },
  { path: "/admin", changefreq: "monthly", priority: 0.8 },
  { path: "/admin/newsletter", changefreq: "monthly", priority: 0.5 },
  { path: "/admin/reviews", changefreq: "monthly", priority: 0.5 },
  { path: "/admin/review-requests", changefreq: "monthly", priority: 0.5 },
  { path: "/admin/support", changefreq: "monthly", priority: 0.5 },
  { path: "/blog", changefreq: "weekly", priority: 0.8, lastmod: "2026-06-13" },
  { path: "/services/face-skin-care", changefreq: "monthly", priority: 0.8, lastmod: "2026-06-13" },
  { path: "/services/laser-hair-removal", changefreq: "monthly", priority: 0.8, lastmod: "2026-06-13" },
  { path: "/services/hair-removal", changefreq: "monthly", priority: 0.8, lastmod: "2026-06-13" },
  { path: "/services/nails-foot-care", changefreq: "monthly", priority: 0.8, lastmod: "2026-06-13" },
  { path: "/services/body-slimming", changefreq: "monthly", priority: 0.8, lastmod: "2026-06-13" },
  { path: "/services/mens-grooming", changefreq: "monthly", priority: 0.8, lastmod: "2026-06-13" },
  { path: "/laser-hair-removal-amman", changefreq: "monthly", priority: 0.9, lastmod: "2026-06-13" },
  { path: "/laser-hair-removal-amman-b", changefreq: "monthly", priority: 0.7, lastmod: "2026-06-13" },
  { path: "/best-facial-amman", changefreq: "monthly", priority: 0.9, lastmod: "2026-06-13" },
  { path: "/best-facial-amman-b", changefreq: "monthly", priority: 0.7, lastmod: "2026-06-13" },
  { path: "/body-slimming-amman", changefreq: "monthly", priority: 0.9, lastmod: "2026-06-13" },
  { path: "/body-slimming-amman-b", changefreq: "monthly", priority: 0.7, lastmod: "2026-06-13" },
  { path: "/nail-salon-amman", changefreq: "monthly", priority: 0.9, lastmod: "2026-06-13" },
  { path: "/mens-grooming-amman", changefreq: "monthly", priority: 0.9, lastmod: "2026-06-13" },
  { path: "/summer-skincare-amman", changefreq: "monthly", priority: 0.9, lastmod: "2026-06-13" },
  { path: "/winter-treatments-amman", changefreq: "monthly", priority: 0.9, lastmod: "2026-06-13" },
  { path: "/hydrafacial-amman", changefreq: "monthly", priority: 0.9, lastmod: "2026-06-13" },
  { path: "/bridal-package-amman", changefreq: "monthly", priority: 0.9, lastmod: "2026-06-13" },
  { path: "/skin-tightening-amman", changefreq: "monthly", priority: 0.9, lastmod: "2026-06-13" },
  { path: "/acne-scar-removal-amman", changefreq: "monthly", priority: 0.9, lastmod: "2026-06-13" },
  { path: "/popular-packages", changefreq: "monthly", priority: 0.9, lastmod: "2026-06-13" },
  { path: "/offers-deals", changefreq: "weekly", priority: 0.9, lastmod: "2026-06-13" },
  { path: "/client/signup", changefreq: "monthly", priority: 0.5 },
  { path: "/client/login", changefreq: "monthly", priority: 0.5 },
  { path: "/client/dashboard", changefreq: "monthly", priority: 0.5 },
  { path: "/client/portal", changefreq: "monthly", priority: 0.5 },
  { path: "/client/portal/bookings", changefreq: "monthly", priority: 0.5 },
  { path: "/client/portal/rewards", changefreq: "monthly", priority: 0.5 },
  { path: "/client/portal/packages", changefreq: "monthly", priority: 0.5 },
  { path: "/client/portal/refer", changefreq: "monthly", priority: 0.5 },
  { path: "/client/portal/profile", changefreq: "monthly", priority: 0.5 },
  { path: "/packages-amman", changefreq: "monthly", priority: 0.9, lastmod: "2026-06-13" },
  { path: "/admin/ab-results", changefreq: "monthly", priority: 0.5 },
  { path: "/admin/bookings", changefreq: "monthly", priority: 0.5 },
  { path: "/admin/scheduling", changefreq: "monthly", priority: 0.5 },
  { path: "/admin/users", changefreq: "monthly", priority: 0.5 },
  { path: "/admin/setup", changefreq: "monthly", priority: 0.5 },
  { path: "/admin/login", changefreq: "monthly", priority: 0.5 },
  { path: "/admin/loyalty", changefreq: "monthly", priority: 0.5 },
  { path: "/loyalty", changefreq: "monthly", priority: 0.8, lastmod: "2026-06-13" },
  { path: "/mobile-landing", changefreq: "monthly", priority: 0.8 },
  { path: "/brochure", changefreq: "yearly", priority: 0.6, lastmod: "2026-06-13" },
  { path: "/embed/booking", changefreq: "monthly", priority: 0.5 },
  { path: "/reviews", changefreq: "monthly", priority: 0.8 },
  { path: "/leave-a-review", changefreq: "monthly", priority: 0.8 },
];
