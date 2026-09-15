import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const htmlPath = join(root, "resources/schema/schema-dev-reference.5.html");
const outDir = join(root, "src/data/schemas");

const html = readFileSync(htmlPath, "utf8");
const entryRegex =
  /<details class="page-entry">[\s\S]*?<span class="page-path">([^<]+)<\/span>[\s\S]*?<pre><code id="[^"]+">([\s\S]*?)<\/code><\/pre>/g;

function decodeHtmlEntities(text) {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x27;/g, "'")
    .replace(/&ndash;/g, "–");
}

const schemas = {};
let match;
while ((match = entryRegex.exec(html)) !== null) {
  const path = match[1].trim();
  const rawJson = decodeHtmlEntities(match[2].trim());
  try {
    schemas[path] = JSON.parse(rawJson);
  } catch (error) {
    console.error(`Failed to parse schema for ${path}:`, error.message);
    process.exit(1);
  }
}

mkdirSync(outDir, { recursive: true });

const skipPaths = new Set([
  "/campaigns/",
  "/knockio-integrations/",
  "/photo-and-video/",
  "/route-mapping/",
]);

const astroPaths = Object.keys(schemas).filter((path) => {
  if (skipPaths.has(path)) return false;
  if (path.startsWith("/blog")) return false;
  if (path === "/support/") return false;
  return true;
});

writeFileSync(
  join(outDir, "page-schemas.json"),
  `${JSON.stringify(schemas, null, 2)}\n`,
);

const indexLines = [
  'import pageSchemas from "./page-schemas.json";',
  "",
  "export type SchemaPath = keyof typeof pageSchemas;",
  "",
  "/**",
  " * JSON-LD @graph blocks from resources/schema/schema-dev-reference.5.html",
  " * Excludes feature detail pages (separate schema file) and WordPress-only routes.",
  " */",
  "export function getPageSchema(path: string): unknown | undefined {",
  "  const normalized = path.endsWith('/') ? path : `${path}/`;",
  "  return pageSchemas[normalized as SchemaPath];",
  "}",
  "",
  "export { pageSchemas };",
  "",
  `export const astroSchemaPaths = ${JSON.stringify(astroPaths, null, 2)} as const;`,
  "",
];

writeFileSync(join(outDir, "index.ts"), indexLines.join("\n"));

console.log(`Extracted ${Object.keys(schemas).length} schemas`);
console.log(`Astro-ready paths (${astroPaths.length}):`);
for (const path of astroPaths) console.log(`  ${path}`);
