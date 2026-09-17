import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

const pages = [
  {
    file: "src/pages/features/index.astro",
    schemaPath: "/features/",
    importPath: "../../data/schemas",
  },
  {
    file: "src/pages/industries-.astro",
    schemaPath: "/industries/",
    importPath: "../data/schemas",
  },
  {
    file: "src/pages/comparisons/index.astro",
    schemaPath: "/comparisons/",
    importPath: "../../data/schemas",
  },
  {
    file: "src/pages/comparisons/knockio-vs-jobber.astro",
    schemaPath: "/comparisons/knockio-vs-jobber/",
    importPath: "../../data/schemas",
  },
  {
    file: "src/pages/comparisons/knockio-vs-spotio.astro",
    schemaPath: "/comparisons/knockio-vs-spotio/",
    importPath: "../../data/schemas",
  },
  {
    file: "src/pages/comparisons/knockio-vs-jobnimbus.astro",
    schemaPath: "/comparisons/knockio-vs-jobnimbus/",
    importPath: "../../data/schemas",
  },
  {
    file: "src/pages/comparisons/knockio-vs-servicetitan.astro",
    schemaPath: "/comparisons/knockio-vs-servicetitan/",
    importPath: "../../data/schemas",
  },
  {
    file: "src/pages/comparisons/knockio-vs-housecall-pro.astro",
    schemaPath: "/comparisons/knockio-vs-housecall-pro/",
    importPath: "../../data/schemas",
  },
  {
    file: "src/pages/comparisons/knockio-vs-fieldpulse.astro",
    schemaPath: "/comparisons/knockio-vs-fieldpulse/",
    importPath: "../../data/schemas",
  },
  {
    file: "src/pages/pricing.astro",
    schemaPath: "/pricing/",
    importPath: "../data/schemas",
  },
  {
    file: "src/pages/snow-removal-software.astro",
    schemaPath: "/snow-removal-software/",
    importPath: "../data/schemas",
  },
  {
    file: "src/pages/book-a-demo.astro",
    schemaPath: "/book-a-demo/",
    importPath: "../data/schemas",
  },
  {
    file: "src/pages/privacy-policy.astro",
    schemaPath: "/privacy-policy/",
    importPath: "../data/schemas",
  },
  {
    file: "src/pages/terms-and-conditions.astro",
    schemaPath: "/terms-and-conditions/",
    importPath: "../data/schemas",
  },
];

const importLine = (importPath) =>
  `import { getPageSchema } from "${importPath}";`;

for (const { file, schemaPath, importPath } of pages) {
  const fullPath = join(root, file);
  let content = readFileSync(fullPath, "utf8");

  const jsonLdPattern = /const jsonLd = (?:\[[\s\S]*?\]|{[\s\S]*?});\r?\n/;
  if (!jsonLdPattern.test(content)) {
    console.error(`No jsonLd block found in ${file}`);
    process.exit(1);
  }

  content = content.replace(
    jsonLdPattern,
    `const jsonLd = getPageSchema("${schemaPath}");\n`,
  );

  const importStatement = importLine(importPath);
  if (!content.includes(importStatement)) {
    content = content.replace(
      /^---\n([\s\S]*?\n)---/,
      (match, frontmatter) => {
        if (frontmatter.includes('from "../data/schemas"') ||
            frontmatter.includes('from "../../data/schemas"')) {
          return match;
        }
        return `---\n${frontmatter}${importStatement}\n---`;
      },
    );
  }

  writeFileSync(fullPath, content);
  console.log(`Updated ${file}`);
}

console.log("Done.");
