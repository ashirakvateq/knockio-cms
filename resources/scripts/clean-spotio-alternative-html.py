#!/usr/bin/env python3
"""Clean resources/legacy-src/pages/spotio-alternative.html — keep page content only."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "resources/legacy-src/pages/spotio-alternative.html"

HTML = SRC.read_text(encoding="utf-8", errors="replace")

article_start = HTML.find("<article")
article_end = HTML.find("</article>", article_start)
if article_start < 0 or article_end < 0:
    raise SystemExit("Could not find <article> block")
article = HTML[article_start:article_end]

# Split on et_pb_code_inner openings within article
inners = re.split(r'<div class="et_pb_code_inner">', article)[1:]
sections: list[str] = []
for chunk in inners:
    # Truncate at closing of this code_inner (next Divi wrapper after section)
    # Prefer content up to </div>\n\t\t\t</div><div class="et_pb_module
    m = re.search(
        r"(.*?)(?:</div>\s*\n\t\t\t</div><div class=\"et_pb_module|</div>\s*\n\t\t\t</div>\s*\n\t\t\t</div>)",
        chunk,
        re.DOTALL,
    )
    body = m.group(1).strip() if m else chunk.strip()
    # Only keep real page sections
    if "<section" in body or body.startswith("<!--"):
        # Trim trailing Divi noise after last </section>
        last = body.rfind("</section>")
        if last != -1:
            body = body[: last + len("</section>")].strip()
        sections.append(body)

# Testimonials live in footer template, not article
footer_start = HTML.find("<!-- TESTIMONIAL SECTION -->")
footer_cal = HTML.find("<!-- Cal.com Scheduling Section -->", footer_start)
testimonial = ""
if footer_start != -1 and footer_cal != -1:
    raw = HTML[footer_start:footer_cal]
    last = raw.rfind("</section>")
    if last != -1:
        testimonial = raw[: last + len("</section>")].strip()

REPLACEMENTS = [
    (
        "https://knockio.com/wp-content/uploads/2026/05/inner-industry-hero-bg.webp",
        "/assets/cfw/inner-industry-hero-bg.webp",
    ),
    (
        "https://knockio.com/wp-content/uploads/2026/05/g2-leader-badge-1.webp",
        "/assets/cfw/g2-leader-badge-1.webp",
    ),
    (
        "https://knockio.com/wp-content/uploads/2026/05/g2-high-performer-badge-1.webp",
        "/assets/cfw/g2-high-performer-badge-1.webp",
    ),
    (
        "https://knockio.com/wp-content/uploads/2026/05/g2-best-support-badge-1.webp",
        "/assets/cfw/g2-best-support-badge-1.webp",
    ),
    (
        "https://knockio.com/wp-content/uploads/2026/05/g2-best-roi-badge-1.webp",
        "/assets/cfw/g2-best-roi-badge-1.webp",
    ),
    (
        "https://knockio.com/wp-content/uploads/2026/05/lead-detail-mobile-full.webp",
        "/assets/cfw/lead-detail-mobile-full.webp",
    ),
    (
        "https://knockio.com/wp-content/uploads/2026/05/route-midpoint-mobile-full.webp",
        "/assets/cfw/route-midpoint-mobile-full.webp",
    ),
    (
        "https://knockio.com/wp-content/uploads/2026/05/google-5-star.webp",
        "/assets/cfw/google-5-star.webp",
    ),
    (
        "https://knockio.com/wp-content/uploads/2026/07/all-devices-view-knockio-1024x390.webp",
        "/assets/cfw/all-devices-view-knockio-1024x390.webp",
    ),
    (
        "https://lh3.googleusercontent.com/a/ACg8ocId1IkoE1t-ar3lqC29ee12_WQLVvnZek_ySrpB9ZIoQGXHcLQ=w40-h40-c-rp-mo-ba3-br100",
        "/assets/cfw/avatar-lacey-jackson.webp",
    ),
    (
        "https://lh3.googleusercontent.com/a/ACg8ocLlweG5QsNIRodIE_qY6_wcpgZAmhOueKzzroi4T8ZCumGjcg=w40-h40-c-rp-mo-br100",
        "/assets/cfw/avatar-ben-loveland.webp",
    ),
    (
        "https://lh3.googleusercontent.com/a/ACg8ocK_WvRfKm7Y7oUvEBypx1mjvcMFptvWvTQ0jX9WGAg-h-Atdw=w40-h40-c-rp-mo-ba2-br100",
        "/assets/cfw/avatar-bar-galanti.webp",
    ),
    (
        "https://lh3.googleusercontent.com/a/ACg8ocKA66zdCpxUw0n7RVizkZ0gCKF609Xpo-GCGgfWmti73l6h3w=w40-h40-c-rp-mo-br100",
        "/assets/cfw/avatar-georgia-hancocks.webp",
    ),
    (
        "https://lh3.googleusercontent.com/a/ACg8ocKSJsnf9lwFYUjQbnhFVtIrJ0XYdi6v5K_6tiTg_bec0n3C=w40-h40-c-rp-mo-br100",
        "/assets/cfw/avatar-sarah-bennett.webp",
    ),
    (
        "https://lh3.googleusercontent.com/a-/ALV-UjVUHu6ErzBhJd6Hyz_HgEivECY33TPOT3RLHCHu54k0L_ayj-B-=w40-h40-c-rp-mo-ba2-br100",
        "/assets/cfw/avatar-ayana-hall.webp",
    ),
]


def clean_chunk(text: str) -> str:
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    text = re.sub(r"\sdecoding=\"async\"", "", text)
    text = re.sub(
        r'<!-- Duplicate Set for loop -->\s*<div class="flex gap-4 sm:gap-6 card-set" aria-hidden="true"></div>',
        "",
        text,
    )
    # Drop aos animation class noise that was baked into markup
    text = re.sub(r"\s*aos-init", "", text)
    text = re.sub(r"\s*aos-animate", "", text)
    return text.strip()


sections = [clean_chunk(s) for s in sections]
testimonial = clean_chunk(testimonial) if testimonial else ""

# Deduplicate accidental empties / keep unique section starts
filtered: list[str] = []
seen_starts: set[str] = set()
for s in sections:
    key = s[:120]
    if key in seen_starts:
        continue
    seen_starts.add(key)
    filtered.append(s)
sections = filtered

json_ld = r"""{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://knockio.com/spotio-alternative/#webpage",
      "url": "https://knockio.com/spotio-alternative/",
      "name": "Spotio Alternative - Knockio",
      "description": "Knockio is a better SPOTIO alternative for businesses that want field sales software with deeper CRM functionality and better overall value.",
      "isPartOf": {
        "@id": "https://knockio.com/#website"
      }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://knockio.com/spotio-alternative/#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://knockio.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Spotio Alternative",
          "item": "https://knockio.com/spotio-alternative/"
        }
      ]
    },
    {
      "@type": "FAQPage",
      "@id": "https://knockio.com/spotio-alternative/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is Knockio a good alternative to SPOTIO?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Knockio is the ideal SPOTIO alternative for sales and service businesses. It provides the same robust territory mapping and live rep tracking, but natively includes the back-office tools (dispatching, estimates, and billing) that SPOTIO lacks."
          }
        },
        {
          "@type": "Question",
          "name": "What does SPOTIO do well?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "SPOTIO focuses strictly on routing and tracking outside sales reps, but that's where their platform ends. Because it is purely a sales tool, teams are forced to manually transfer closed-won deals into a completely separate operational platform just to schedule the job."
          }
        },
        {
          "@type": "Question",
          "name": "Why would a team switch from SPOTIO to Knockio?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Businesses switch to Knockio to consolidate their software expenses and eliminate data entry errors. Instead of paying for a standalone field sales app and a separate service CRM, Knockio provides a true all-in-one environment. A prospect pinned in the field can be sent a digital contract and scheduled for service without ever leaving the Knockio app."
          }
        },
        {
          "@type": "Question",
          "name": "Is Knockio better for companies that both sell and deliver services?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. If your company relies on reps to hunt for business in the field and technicians to fulfill the work (like solar, roofing, or HVAC), Knockio is custom-built for your workflow. It perfectly bridges the gap between the initial handshake and the final invoice."
          }
        },
        {
          "@type": "Question",
          "name": "What makes Knockio a stronger alternative to SPOTIO?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "SPOTIO caters only to the front lines, meaning it stops working the moment the contract is signed. Knockio is stronger because it carries the baton all the way to the finish line, combining elite prospecting features with a complete operational CRM."
          }
        }
      ]
    }
  ]
}"""

head = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Spotio Alternative - Knockio</title>
  <meta name="description" content="Knockio is a better SPOTIO alternative for businesses that want field sales software with deeper CRM functionality and better overall value.">
  <link rel="canonical" href="https://knockio.com/spotio-alternative/">
  <meta property="og:locale" content="en_US">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Spotio Alternative - Knockio">
  <meta property="og:description" content="Knockio is a better SPOTIO alternative for businesses that want field sales software with deeper CRM functionality and better overall value.">
  <meta property="og:url" content="https://knockio.com/spotio-alternative/">
  <meta property="og:site_name" content="Knockio">
  <meta property="og:image" content="https://knockio.com/assets/cfw/all-devices-view-knockio-1024x390.webp">
  <meta property="og:image:secure_url" content="https://knockio.com/assets/cfw/all-devices-view-knockio-1024x390.webp">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Spotio Alternative - Knockio">
  <meta name="twitter:description" content="Knockio is a better SPOTIO alternative for businesses that want field sales software with deeper CRM functionality and better overall value.">
  <meta name="twitter:image" content="https://knockio.com/assets/cfw/all-devices-view-knockio-1024x390.webp">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">

  <script type="application/ld+json">
  {json_ld}
  </script>
</head>
<body>

  <main class="overflow-hidden bg-white">
"""

parts = sections[:]
if testimonial:
    parts.append(testimonial)

out = head + "\n\n".join(parts) + "\n\n  </main>\n\n</body>\n</html>\n"
SRC.write_text(out, encoding="utf-8")

print(f"Wrote {SRC}")
print(f"Sections: {len(sections)}")
print(f"Testimonial: {bool(testimonial)}")
print(f"Lines: {out.count(chr(10))}")
# Sanity
remain = re.findall(r"wp-content/uploads|et_pb_|jquery|gtm\.js|xmlrpc", out)
print(f"Bloat leftovers: {len(remain)}")
if remain:
    print(set(remain))
