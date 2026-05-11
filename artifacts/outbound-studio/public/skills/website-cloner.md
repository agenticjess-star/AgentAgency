# Website Cloner

**Agent:** 03 · Builder  
**Category:** Build · Baseline Capture  
**Status:** Production

---

## What It Does

Website Cloner captures the target business's existing site — structure, assets, content, and metadata — as a complete baseline before the Builder agent constructs the spec replacement. This ensures the new site is a strict superset of the old one: every legitimate page and contact method is preserved, with everything else upgraded.

---

## What It Captures

| Asset | Detail |
|---|---|
| **Page structure** | All crawlable URLs up to depth 3 |
| **Content** | Headlines, body copy, service descriptions |
| **Contact data** | Phone, email, address, hours |
| **Images** | Logos, hero images, before/after photos |
| **Existing schema** | Any JSON-LD already present |
| **Meta tags** | Titles, descriptions, OG tags |

---

## How It Works

1. Crawl target domain starting from root
2. Build URL tree and classify each page by type (home, service, contact, about)
3. Extract structured content blocks via CSS selector heuristics
4. Screenshot each page at 1280px viewport for visual reference
5. Output a normalized site manifest JSON

---

## Site Manifest Output

```json
{
  "domain": "example-plumbing.com",
  "pages": [
    {
      "url": "/",
      "type": "home",
      "title": "Austin Plumbing Pros",
      "h1": "Fast, Reliable Plumbing in Austin TX",
      "phone": "(512) 555-0199"
    }
  ],
  "has_schema": false,
  "has_ssl": true,
  "mobile_responsive": false,
  "page_speed_score": 38
}
```

---

## Failure Modes

- **Blocked crawler**: falls back to Google Cache snapshot
- **JS-only site**: uses headless browser rendering (Playwright)
- **No existing site**: marks lead as `no_website`, skips to Builder template mode
