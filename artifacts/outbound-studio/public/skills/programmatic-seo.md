# Programmatic SEO

**Agent:** 03 · Builder  
**Category:** Build · Content at Scale  
**Status:** Production

---

## What It Does

Programmatic SEO generates location and service page templates at scale, giving each built site a complete URL structure from day one. Instead of a single homepage, every spec build includes a full set of city, service, and FAQ pages — all AEO-optimized and schema-tagged.

---

## Page Types Generated

| Type | Pattern | Example |
|---|---|---|
| **Service** | `/services/:slug` | `/services/emergency-plumbing` |
| **Location** | `/:city` | `/austin-tx` |
| **Service × Location** | `/:service/:city` | `/hvac-repair/round-rock-tx` |
| **FAQ** | `/faq/:topic` | `/faq/how-much-does-hvac-cost` |

---

## Template Schema

Each page is generated from a structured template:

```json
{
  "template": "service-city",
  "vars": {
    "service": "HVAC Repair",
    "city": "Round Rock, TX",
    "business_name": "Texas Comfort Systems",
    "phone": "(512) 555-0100"
  },
  "schema": ["LocalBusiness", "Service", "FAQPage"],
  "word_count_target": 800
}
```

---

## AEO Requirements

Every generated page must pass:
- ✓ `LocalBusiness` JSON-LD with full NAP
- ✓ `Service` schema with `areaServed`
- ✓ At least 3 `FAQPage` entries per page
- ✓ Conversational H2s structured for AI Overview extraction
- ✓ No duplicate `<title>` or `<meta description>` across the page set

---

## Scale

A typical spec build generates:
- 1 homepage
- 3–6 service pages
- 1–3 location pages
- 1 FAQ hub page

Total: 6–11 pages per site. All indexed via auto-generated `sitemap.xml`.
