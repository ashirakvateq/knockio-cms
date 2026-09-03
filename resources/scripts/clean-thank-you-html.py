#!/usr/bin/env python3
"""Clean resources/legacy-src/pages/thank-you.html — keep page content only."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "resources/legacy-src/pages/thank-you.html"

HTML = SRC.read_text(encoding="utf-8", errors="replace")

# Thank you hero section
ty_start = HTML.find("<!-- THANK YOU PAGE SECTION -->")
if ty_start < 0:
    raise SystemExit("Thank you section not found")
ty_end = HTML.find("</section>", ty_start)
thank_you = HTML[ty_start : ty_end + len("</section>")].strip()

# Booking query script (important page behaviour)
script_match = re.search(
    r'<div class="et_pb_code_inner"><script>\s*(\(function\(\) \{.*?\}\)\(\);)\s*</script></div>',
    HTML[ty_start:],
    re.DOTALL,
)
booking_script = script_match.group(1).strip() if script_match else ""

# Testimonials from footer
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
    return text.strip()


thank_you = clean_chunk(thank_you)
testimonial = clean_chunk(testimonial) if testimonial else ""

# Fix internal links to use trailing slash where appropriate
thank_you = thank_you.replace('href="/"', 'href="/"')
thank_you = thank_you.replace('href="/pricing/"', 'href="/pricing/"')
thank_you = thank_you.replace('href="/blog/"', 'href="/blog/"')

json_ld = r"""{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://knockio.com/thank-you/#webpage",
      "url": "https://knockio.com/thank-you/",
      "name": "thank you - Knockio",
      "description": "We're excited to connect with you. Your meeting has been scheduled, and our team will meet you at the selected time.",
      "isPartOf": {
        "@id": "https://knockio.com/#website"
      }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://knockio.com/thank-you/#breadcrumb",
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
          "name": "Thank You",
          "item": "https://knockio.com/thank-you/"
        }
      ]
    }
  ]
}"""

script_block = ""
if booking_script:
    script_block = f"""
  <script>
{booking_script}
  </script>
"""

parts = [thank_you]
if testimonial:
    parts.append(testimonial)

main_body = "\n\n".join(parts)

out = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>thank you - Knockio</title>
  <meta name="description" content="We're excited to connect with you. Your meeting has been scheduled, and our team will meet you at the selected time.">
  <link rel="canonical" href="https://knockio.com/thank-you/">
  <meta property="og:locale" content="en_US">
  <meta property="og:type" content="website">
  <meta property="og:title" content="thank you - Knockio">
  <meta property="og:description" content="We're excited to connect with you. Your meeting has been scheduled, and our team will meet you at the selected time.">
  <meta property="og:url" content="https://knockio.com/thank-you/">
  <meta property="og:site_name" content="Knockio">
  <meta property="og:image" content="https://knockio.com/assets/cfw/all-devices-view-knockio-1024x390.webp">
  <meta property="og:image:secure_url" content="https://knockio.com/assets/cfw/all-devices-view-knockio-1024x390.webp">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="thank you - Knockio">
  <meta name="twitter:description" content="We're excited to connect with you. Your meeting has been scheduled, and our team will meet you at the selected time.">
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
{main_body}
{script_block}
  </main>

</body>
</html>
"""

SRC.write_text(out, encoding="utf-8")
print(f"Wrote {SRC}")
print(f"Thank you section: {bool(thank_you)}")
print(f"Testimonial: {bool(testimonial)}")
print(f"Booking script: {bool(booking_script)}")
print(f"Lines: {out.count(chr(10))}")
remain = re.findall(r"wp-content/uploads|et_pb_|jquery|xmlrpc|Cal\.com", out)
print(f"Bloat leftovers: {len(remain)} {set(remain) if remain else ''}")
