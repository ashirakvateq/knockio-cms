#!/usr/bin/env python3
"""Clean resources/legacy-src/pages/salesrabbit-alternatives.html — keep page content only."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "resources/legacy-src/pages/salesrabbit-alternatives.html"

HTML = SRC.read_text(encoding="utf-8", errors="replace")

article_start = HTML.find("<article")
article_end = HTML.find("</article>", article_start)
if article_start < 0 or article_end < 0:
    raise SystemExit("Could not find <article> block")
article = HTML[article_start:article_end]

inners = re.split(r'<div class="et_pb_code_inner">', article)[1:]
sections: list[str] = []
for chunk in inners:
    m = re.search(
        r"(.*?)(?:</div>\s*\n\t\t\t</div><div class=\"et_pb_module|</div>\s*\n\t\t\t</div>\s*\n\t\t\t</div>)",
        chunk,
        re.DOTALL,
    )
    body = m.group(1).strip() if m else chunk.strip()
    if "<section" in body or body.startswith("<!--"):
        last = body.rfind("</section>")
        if last != -1:
            body = body[: last + len("</section>")].strip()
        sections.append(body)

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
    (
        'href="https://knockio.com/blog/cost-of-separate-canvassing-and-field-service-software/"',
        'href="/blog/cost-of-separate-canvassing-and-field-service-software/"',
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
    text = re.sub(r"\s*aos-init", "", text)
    text = re.sub(r"\s*aos-animate", "", text)
    return text.strip()


sections = [clean_chunk(s) for s in sections]
testimonial = clean_chunk(testimonial) if testimonial else ""

filtered: list[str] = []
seen_starts: set[str] = set()
for s in sections:
    key = s[:120]
    if key in seen_starts:
        continue
    seen_starts.add(key)
    filtered.append(s)
sections = filtered

DESC = (
    "Knockio is a better SalesRabbit alternative for businesses that want "
    "field sales software with deeper CRM functionality at highly affordable pricing."
)

json_ld = f"""{{
  "@context": "https://schema.org",
  "@graph": [
    {{
      "@type": "WebPage",
      "@id": "https://knockio.com/salesrabbit-alternatives/#webpage",
      "url": "https://knockio.com/salesrabbit-alternatives/",
      "name": "SalesRabbit Alternative - Knockio",
      "description": "{DESC}",
      "isPartOf": {{
        "@id": "https://knockio.com/#website"
      }}
    }},
    {{
      "@type": "BreadcrumbList",
      "@id": "https://knockio.com/salesrabbit-alternatives/#breadcrumb",
      "itemListElement": [
        {{
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://knockio.com/"
        }},
        {{
          "@type": "ListItem",
          "position": 2,
          "name": "SalesRabbit Alternative",
          "item": "https://knockio.com/salesrabbit-alternatives/"
        }}
      ]
    }},
    {{
      "@type": "FAQPage",
      "@id": "https://knockio.com/salesrabbit-alternatives/#faq",
      "mainEntity": [
        {{
          "@type": "Question",
          "name": "Is Knockio a good alternative to SalesRabbit?",
          "acceptedAnswer": {{
            "@type": "Answer",
            "text": "Yes. Knockio provides the exact same high-performance territory mapping, GPS tracking, and lead capture as SalesRabbit, but natively hardwires it into a heavy-duty field service CRM. You get to keep your elite canvassing tools while ditching the extra software subscriptions for invoicing and dispatch"
          }}
        }},
        {{
          "@type": "Question",
          "name": "What does SalesRabbit do well?",
          "acceptedAnswer": {{
            "@type": "Answer",
            "text": "SalesRabbit is a good tool for knocking doors but that's where it stops. When a lead says 'yes,' your reps are forced to manually copy that data into a separate CRM to build a quote. Knockio gives you the exact same elite territory mapping and live-rep tracking as SalesRabbit, plus the ability to instantly dispatch a crew, send a contract, and collect payment."
          }}
        }},
        {{
          "@type": "Question",
          "name": "Why would a team switch from SalesRabbit to Knockio?",
          "acceptedAnswer": {{
            "@type": "Answer",
            "text": "Teams switch to Knockio to eliminate the \\"Duct-Tape Tax.\\" Instead of paying two expensive monthly subscriptions for a separate canvassing app and a service CRM, Knockio consolidates your tech stack into one highly cost-effective platform. A lead captured at the door instantly becomes a scheduled job, a signed contract, and a paid invoice with zero manual double-data entry."
          }}
        }},
        {{
          "@type": "Question",
          "name": "Is Knockio better for companies that need both sales and service workflows?",
          "acceptedAnswer": {{
            "@type": "Answer",
            "text": "Absolutely. If your business actually has to perform the work you sell (like roofing, HVAC, or pest control), Knockio is built specifically for you. It seamlessly hands off closed deals from your outside sales reps directly to your office scheduling and installation crews."
          }}
        }},
        {{
          "@type": "Question",
          "name": "What makes Knockio a stronger alternative to SalesRabbit?",
          "acceptedAnswer": {{
            "@type": "Answer",
            "text": "SalesRabbit only handles the front half of your business. Knockio handles the whole thing. By combining field sales execution with back-office management, Knockio closes the gap between your sales reps and your service crews."
          }}
        }}
      ]
    }}
  ]
}}"""

head = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>SalesRabbit Alternative - Knockio</title>
  <meta name="description" content="{DESC}">
  <link rel="canonical" href="https://knockio.com/salesrabbit-alternatives/">
  <meta property="og:locale" content="en_US">
  <meta property="og:type" content="website">
  <meta property="og:title" content="SalesRabbit Alternative - Knockio">
  <meta property="og:description" content="{DESC}">
  <meta property="og:url" content="https://knockio.com/salesrabbit-alternatives/">
  <meta property="og:site_name" content="Knockio">
  <meta property="og:image" content="https://knockio.com/assets/cfw/all-devices-view-knockio-1024x390.webp">
  <meta property="og:image:secure_url" content="https://knockio.com/assets/cfw/all-devices-view-knockio-1024x390.webp">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="SalesRabbit Alternative - Knockio">
  <meta name="twitter:description" content="{DESC}">
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
for i, s in enumerate(sections):
    first_line = next((ln.strip() for ln in s.splitlines() if ln.strip()), "")
    print(f"  [{i}] {first_line[:90]}")
print(f"Testimonial: {bool(testimonial)}")
print(f"Lines: {out.count(chr(10))}")
remain = re.findall(r"wp-content/uploads|et_pb_|jquery|gtm\.js|xmlrpc|Cal\.com", out)
print(f"Bloat leftovers: {len(remain)} {set(remain) if remain else ''}")
