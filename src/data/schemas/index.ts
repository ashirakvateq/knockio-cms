import pageSchemas from "./page-schemas.json";

export type SchemaPath = keyof typeof pageSchemas;

/**
 * JSON-LD @graph blocks from resources/schema/schema-dev-reference.5.html
 * Excludes feature detail pages (separate schema file) and WordPress-only routes.
 */
export function getPageSchema(path: string): unknown | undefined {
  const normalized = path.endsWith('/') ? path : `${path}/`;
  return pageSchemas[normalized as SchemaPath];
}

export { pageSchemas };

export const astroSchemaPaths = [
  "/features/",
  "/industries/",
  "/comparisons/",
  "/comparisons/knockio-vs-jobber/",
  "/comparisons/knockio-vs-spotio/",
  "/comparisons/knockio-vs-jobnimbus/",
  "/comparisons/knockio-vs-servicetitan/",
  "/comparisons/knockio-vs-housecall-pro/",
  "/comparisons/knockio-vs-fieldpulse/",
  "/pricing/",
  "/snow-removal-software/",
  "/book-a-demo/",
  "/privacy-policy/",
  "/terms-and-conditions/"
] as const;
