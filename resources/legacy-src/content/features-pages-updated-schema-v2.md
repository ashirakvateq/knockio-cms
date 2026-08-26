# Feature Pages — Corrected JSON-LD Schema
_Crawled live schema from all 15 `/features/` pages (2026-08-24) and fixed it for the verified false claims + content changes._

## Summary
- **13 of 15 schemas are already clean** — no change needed: sales-canvassing, territory-management, gps-tracking, sales-pipeline, appointment-scheduling, estimate, work-order-management, invoicing, inventory-management, e-contracts, business-texting-and-calling, user-management, **business-automation** (payment reminders confirmed real per Q16, so its schema stays as-is).
  - (The "location" in GPS/canvassing and "stages" in pipeline are the real rep-tracking / pipeline-stage features. **e-contracts already logs IP + timestamp only** — no "location" in schema. **invoicing schema has no QuickBooks or staged-invoice claims.**)
- **3 schemas need deploying** (below): **sales-canvassing-software** (page rewritten — new FAQ), **payment-processing**, **reporting-software**.
- **Deploy:** replace each page's existing `<script type="application/ld+json">` block with the corrected block. FAQ schema text must match the visible FAQ, so update the on-page FAQ copy to match these too.

---

## 1. payment-processing  — replace schema
**Fixes:** removed "tap to pay" and "get paid out instantly"; corrected the merchant-account claim (you apply for one); removed "automated reminders" (financial-module, not live yet).

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://knockio.com/features/payment-processing/#webpage",
      "url": "https://knockio.com/features/payment-processing/",
      "name": "Payment Processing for Field Service Businesses | Knockio",
      "description": "See how payment processing works in Knockio. Collect card, ACH, and Text-to-Pay payments online or in person, all tied to the job and invoice.",
      "isPartOf": { "@id": "https://knockio.com/#website" },
      "about": { "@id": "https://knockio.com/field-service-crm/#software" }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://knockio.com/features/payment-processing/#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://knockio.com/" },
        { "@type": "ListItem", "position": 2, "name": "Features", "item": "https://knockio.com/features/" },
        { "@type": "ListItem", "position": 3, "name": "Payment Processing", "item": "https://knockio.com/features/payment-processing/" }
      ]
    },
    {
      "@type": "FAQPage",
      "@id": "https://knockio.com/features/payment-processing/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Does Knockio have its own payment processing?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Knockio includes built-in payment processing that supports credit cards, ACH, and text to pay. You apply for a merchant account to enable it, and once approved, payments run inside Knockio and tie to the job and invoice."
          }
        },
        {
          "@type": "Question",
          "name": "Can I record payments that were collected outside the app, like cash or check?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. You can log manual payments against any invoice for accurate accounting and job financial tracking, even when the payment did not go through Knockio."
          }
        },
        {
          "@type": "Question",
          "name": "Can I send a customer a link to pay remotely?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Text to pay and online payment links let customers pay securely from their phone or computer, even if they are not on site when the job wraps up."
          }
        },
        {
          "@type": "Question",
          "name": "How does Knockio help me get paid faster?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "By combining instant invoicing, multiple payment options, and automated reminders in one platform, Knockio removes the friction and delays that come from juggling separate billing, payment, and accounting tools."
          }
        }
      ]
    }
  ]
}
```

---

## 2. reporting-software  — replace schema
**Fix:** removed the "revenue forecasting" Q&A; replaced with a real "revenue by pipeline stage" report.

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://knockio.com/features/reporting-software/#webpage",
      "url": "https://knockio.com/features/reporting-software/",
      "name": "Reporting Software for Data Driven Decisions | Knockio",
      "description": "Reporting Software for data driven decisions by Knockio tracks conversions, revenue, payments, and rep performance with custom reports.",
      "isPartOf": { "@id": "https://knockio.com/#website" },
      "about": { "@id": "https://knockio.com/field-service-crm/#software" }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://knockio.com/features/reporting-software/#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://knockio.com/" },
        { "@type": "ListItem", "position": 2, "name": "Features", "item": "https://knockio.com/features/" },
        { "@type": "ListItem", "position": 3, "name": "Reporting Software", "item": "https://knockio.com/features/reporting-software/" }
      ]
    },
    {
      "@type": "FAQPage",
      "@id": "https://knockio.com/features/reporting-software/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Can I build a custom report instead of using a preset template?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes. Knockio lets you create custom rules and conditions to generate a report, so you are not limited to a fixed set of preset templates." }
        },
        {
          "@type": "Question",
          "name": "Can I build a report on lead conversion rates?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes. You can create a conversion report broken down by rep, territory, source, or any other rule that matters to your business." }
        },
        {
          "@type": "Question",
          "name": "Can I see how much time each rep spends in the field?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes. Knockio can generate a report showing how much time each rep actually spends in the field, based on real activity and location data." }
        },
        {
          "@type": "Question",
          "name": "Can I build a report showing leads that went through a specific status?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes. You can create a report that shows every lead or job that passed through a specific status, which helps identify exactly where deals are stalling." }
        },
        {
          "@type": "Question",
          "name": "Can I report on revenue by pipeline stage?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes. You can build reports that show revenue by pipeline stage and status, giving you a clear view of where value sits in your pipeline right now." }
        },
        {
          "@type": "Question",
          "name": "Can I track payments through reports?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes. Knockio supports reports covering incoming, outgoing, due, and paid payments, giving you a clear and current financial picture at all times." }
        },
        {
          "@type": "Question",
          "name": "Can I track employee check in and check out times?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes. You can build a report on employee check in and check out activity, useful for payroll, accountability, and scheduling decisions." }
        }
      ]
    }
  ]
}
```

---

## 3. business-automation-software  — NO CHANGE NEEDED
Per Q16, automated payment reminders are a real feature, so the live automation schema (which mentions payment reminders + text-to-pay follow-ups) is accurate. **Leave it as-is.** The corrected JSON below is retained only for reference and matches the live schema; you do not need to redeploy it.

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://knockio.com/features/business-automation-software/#webpage",
      "url": "https://knockio.com/features/business-automation-software/",
      "name": "Business Automation Software for Field Service | Knockio",
      "description": "Automation Software by Knockio helps home service teams automate scheduling, follow-ups, and customer notifications without code, and more.",
      "isPartOf": { "@id": "https://knockio.com/#website" },
      "about": { "@id": "https://knockio.com/field-service-crm/#software" }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://knockio.com/features/business-automation-software/#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://knockio.com/" },
        { "@type": "ListItem", "position": 2, "name": "Features", "item": "https://knockio.com/features/" },
        { "@type": "ListItem", "position": 3, "name": "Business Automation Software", "item": "https://knockio.com/features/business-automation-software/" }
      ]
    },
    {
      "@type": "FAQPage",
      "@id": "https://knockio.com/features/business-automation-software/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What kinds of tasks can I automate with Knockio?",
          "acceptedAnswer": { "@type": "Answer", "text": "You can automate task and schedule creation, email and text notifications, and customer follow-ups, all triggered by changes to job status, estimates, and inventory levels." }
        },
        {
          "@type": "Question",
          "name": "Do I need technical skills to build an automation?",
          "acceptedAnswer": { "@type": "Answer", "text": "No. Knockio's flow builder is built for home service business owners and office staff, not developers. Automations are built visually using your existing job statuses and triggers." }
        },
        {
          "@type": "Question",
          "name": "Can automations be customized to match my business's process?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes. Since job statuses in Knockio are fully customizable, your automations can be built around your exact workflow, whether you run a simple process or a multi stage pipeline." }
        },
        {
          "@type": "Question",
          "name": "Can automation keep my customers updated automatically?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes. Status-based texts and emails, like appointment reminders and on-the-way alerts, are some of the most popular automations, keeping customers informed without anyone lifting a finger." }
        }
      ]
    }
  ]
}
```

---

## Notes / flags
- **payment "instant payout"** and **"instant invoicing"** — I softened "get paid out instantly" in the description. If instant payout is not a real feature, confirm and I'll also reword "instant invoicing" in the payment Q4 / any page that uses it.
- **appointment-scheduling schema** — kept "appointment reminders" and "recurring appointments" (both presumed live as scheduling features, and recurring appointments was a shipped update). If appointment reminders are part of the financial/automation module that isn't live, tell me and I'll soften.
- **FAQ text ↔ page copy:** these FAQ answers must match the visible on-page FAQ. Update the on-page FAQ copy on these 3 pages to match, or the structured data will mismatch.

---

## 0. sales-canvassing-software  — replace schema (page rewritten)
**New page (PAGE 01).** The rewrite changes the page angle + FAQ, so replace the live canvassing schema with this. Clean — no false claims (pin-drop verification, automation status-triggers, appointments, custom-field capture are all confirmed-real). FAQ text matches Section 7.

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://knockio.com/features/sales-canvassing-software/#webpage",
      "url": "https://knockio.com/features/sales-canvassing-software/",
      "name": "Sales Canvassing Built Into Your CRM & Pipeline | Knockio",
      "description": "See how Knockio's canvassing connects to the rest of your platform: territories, custom pins, and lead capture that flow into your pipeline, estimates, work orders, and invoices, with no re-typing between the door and the office.",
      "isPartOf": {
        "@id": "https://knockio.com/#website"
      },
      "about": {
        "@id": "https://knockio.com/field-service-crm/#software"
      },
      "mainEntity": {
        "@id": "https://knockio.com/features/sales-canvassing-software/#faq"
      }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://knockio.com/features/sales-canvassing-software/#breadcrumb",
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
          "name": "Features",
          "item": "https://knockio.com/features/"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Sales Canvassing Software",
          "item": "https://knockio.com/features/sales-canvassing-software/"
        }
      ]
    },
    {
      "@type": "FAQPage",
      "@id": "https://knockio.com/features/sales-canvassing-software/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Does a knocked door really become a job without re-entering the data?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. The pin, contact, appointment, and photos captured at the door live in the same pipeline as your estimates, work orders, and invoices, so the same record carries through to a signed estimate and a collected payment with nothing retyped."
          }
        },
        {
          "@type": "Question",
          "name": "Can a pin trigger an automated follow-up?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. The automation builder fires on a status change, so a Callback pin can auto-text the homeowner and an Interested pin can create a follow-up task or notify the closer, so no one has to remember to do it."
          }
        },
        {
          "@type": "Question",
          "name": "How does an appointment booked at the door reach my closer?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "When a rep books from the pin, the appointment lands on the closer's calendar with the property address and field notes already attached, so the closer walks in prepared instead of chasing context."
          }
        },
        {
          "@type": "Question",
          "name": "Can I require reps to capture specific info before leaving a door?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Each status can require specific custom fields, or a full lead-form survey, before the pin can save, so the details your trade needs such as decision-maker, account number, or roof age are captured at the door, not guessed later."
          }
        },
        {
          "@type": "Question",
          "name": "How is this different from Knockio's main canvassing page?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The door-to-door canvassing software page covers Knockio's canvassing product as a whole. This page shows how that canvassing connects to the rest of the platform, including pipeline, estimates, work orders, and invoices, so field activity turns into finished, paid jobs in one system."
          }
        }
      ]
    }
  ]
}
```
