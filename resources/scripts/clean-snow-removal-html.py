#!/usr/bin/env python3
"""Extract and clean snow-removal-software.html content sections."""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "resources/legacy-src/pages/snow-removal-software.html"
OUT = SRC

HTML = SRC.read_text(encoding="utf-8")

# Extract JSON-LD from et_pb_code_7 block (FAQ schema)
json_ld_match = re.search(
    r'<div class="et_pb_code_inner"><script type="application/ld\+json">(.*?)</script></div>\s*</div>\s*</div>\s*\n\s*\n\s*\n\s*\n\s*\n\s*</div>\s*\n\s*\n\s*\n\s*</div>\s*\n\t\t\t\t\t</div>\s*\n\t</div>\s*\n\t\t\t\t\t\t</div>',
    HTML,
    re.DOTALL,
)
json_ld = json_ld_match.group(1).strip() if json_ld_match else ""

# Extract main content sections from et_pb_code_inner in article (codes 0-6)
section_pattern = re.compile(
    r'<div class="et_pb_code_inner">(.*?)</div>\s*\n\t\t\t</div><div class="et_pb_module et_pb_code',
    re.DOTALL,
)

# Find article content area
article_start = HTML.find('<article id="post-4116"')
article_end = HTML.find("</article>", article_start)
article = HTML[article_start:article_end]

sections = []
for m in section_pattern.finditer(article):
    chunk = m.group(1).strip()
    if chunk.startswith("<section") or chunk.startswith("  <section") or chunk.startswith("<!--"):
        sections.append(chunk)

# Extract testimonial section from footer
footer_start = HTML.find("<!-- TESTIMONIAL SECTION -->")
footer_end = HTML.find("<!-- Cal.com Scheduling Section -->", footer_start)
testimonial = HTML[footer_start:footer_end].strip() if footer_start != -1 else ""

# URL replacements
replacements = [
    (r"https://knockio\.com/wp-content/uploads/2026/05/google-5-star\.webp", "/assets/cfw/google-5-star.webp"),
    (r"https://knockio\.com/wp-content/uploads/2026/05/google-play-button\.webp", "/assets/cfw/google-play-button.webp"),
    (r"https://knockio\.com/wp-content/uploads/2026/05/apple-store-button\.webp", "/assets/cfw/apple-store-button.webp"),
    (r"https://knockio\.com/wp-content/uploads/2026/05/cta-mobile-app-screen\.webp", "/assets/cfw/cta-mobile-app-screen.webp"),
    (
        r"https://lh3\.googleusercontent\.com/a/ACg8ocId1IkoE1t-ar3lqC29ee12_WQLVvnZek_ySrpB9ZIoQGXHcLQ=w40-h40-c-rp-mo-ba3-br100",
        "/assets/cfw/avatar-lacey-jackson.webp",
    ),
    (
        r"https://lh3\.googleusercontent\.com/a/ACg8ocLlweG5QsNIRodIE_qY6_wcpgZAmhOueKzzroi4T8ZCumGjcg=w40-h40-c-rp-mo-br100",
        "/assets/cfw/avatar-ben-loveland.webp",
    ),
    (
        r"https://lh3\.googleusercontent\.com/a/ACg8ocK_WvRfKm7Y7oUvEBypx1mjvcMFptvWvTQ0jX9WGAg-h-Atdw=w40-h40-c-rp-mo-ba2-br100",
        "/assets/cfw/avatar-bar-galanti.webp",
    ),
    (
        r"https://lh3\.googleusercontent\.com/a/ACg8ocKA66zdCpxUw0n7RVizkZ0gCKF609Xpo-GCGgfWmti73l6h3w=w40-h40-c-rp-mo-br100",
        "/assets/cfw/avatar-georgia-hancocks.webp",
    ),
    (
        r"https://lh3\.googleusercontent\.com/a/ACg8ocKSJsnf9lwFYUjQbnhFVtIrJ0XYdi6v5K_6tiTg_bec0n3C=w40-h40-c-rp-mo-br100",
        "/assets/cfw/avatar-sarah-bennett.webp",
    ),
    (
        r"https://lh3\.googleusercontent\.com/a-/ALV-UjVUHu6ErzBhJd6Hyz_HgEivECY33TPOT3RLHCHu54k0L_ayj-B-=w40-h40-c-rp-mo-ba2-br100",
        "/assets/cfw/avatar-ayana-hall.webp",
    ),
    (r"https://knockio\.com/wp-content/uploads/2026/05/industry-snow-hero-bg\.webp", "/assets/cfw/industry-snow-hero-bg.webp"),
    (r"https://knockio\.com/wp-content/uploads/2026/05/industry-solar-new-image\.webp", "/assets/cfw/industry-solar-new-image.webp"),
    (r"https://knockio\.com/wp-content/uploads/2026/05/industry-inner-estimate\.webp", "/assets/cfw/industry-inner-estimate.webp"),
    (r"https://knockio\.com/wp-content/uploads/2026/05/industry-inner-route\.webp", "/assets/cfw/industry-inner-route.webp"),
    (r"https://knockio\.com/wp-content/uploads/2026/05/industry-inner-invoice-and-payment\.webp", "/assets/cfw/industry-inner-invoice-and-payment.webp"),
    (r"https://knockio\.com/wp-content/uploads/2026/05/feature-main-image-1\.webp", "/assets/cfw/feature-main-image-1.webp"),
    (r"https://knockio\.com/wp-content/uploads/2026/05/industry-snow-hero-bg\.webp", "/assets/cfw/industry-snow-hero-bg.webp"),
]

def clean_chunk(text: str) -> str:
    for old, new in replacements:
        text = re.sub(old, new, text)
    # Remove duplicate card-set placeholders (filled by JS on live site)
    text = re.sub(
        r'<!-- Duplicate Set for loop -->\s*<div class="flex gap-4 sm:gap-6 card-set" aria-hidden="true"></div>',
        "",
        text,
    )
    # Normalize whitespace on img tags
    text = re.sub(r"\sdecoding=\"async\"", "", text)
    return text.strip()

sections = [clean_chunk(s) for s in sections]
testimonial = clean_chunk(testimonial)

head = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>The #1 Snow Removal Software For Business Management</title>
  <meta name="description" content="Simplify operations with the #1 snow removal software for scheduling, routing, and team management—all in one easy dashboard.">
  <link rel="canonical" href="https://knockio.com/snow-removal-software/">
  <meta property="og:locale" content="en_US">
  <meta property="og:type" content="website">
  <meta property="og:title" content="The #1 Snow Removal Software For Business Management">
  <meta property="og:description" content="Simplify operations with the #1 snow removal software for scheduling, routing, and team management—all in one easy dashboard.">
  <meta property="og:url" content="https://knockio.com/snow-removal-software/">
  <meta property="og:site_name" content="Knockio">
  <meta property="og:image" content="https://knockio.com/assets/cfw/industry-solar-new-image.webp">
  <meta property="og:image:secure_url" content="https://knockio.com/assets/cfw/industry-solar-new-image.webp">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="The #1 Snow Removal Software For Business Management">
  <meta name="twitter:description" content="Simplify operations with the #1 snow removal software for scheduling, routing, and team management—all in one easy dashboard.">
  <meta name="twitter:image" content="https://knockio.com/assets/cfw/industry-solar-new-image.webp">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">

  <script type="application/ld+json">
  JSON_LD_PLACEHOLDER
  </script>
</head>
<body>

  <main class="overflow-hidden bg-white">
"""

head = head.replace("JSON_LD_PLACEHOLDER", json_ld)

body_parts = ["\n\n".join(sections)]
if testimonial:
    body_parts.append(f"  <section>\n{testimonial}\n  </section>")

footer = """
  </main>

</body>
</html>
"""

output = head + "\n".join(body_parts) + footer
OUT.write_text(output, encoding="utf-8")

print(f"Wrote {OUT}")
print(f"Sections extracted: {len(sections)}")
print(f"Testimonial included: {bool(testimonial)}")
print(f"JSON-LD included: {bool(json_ld)}")
