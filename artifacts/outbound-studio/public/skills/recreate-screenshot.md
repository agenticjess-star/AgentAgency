# Recreate Screenshot

**Agent:** 03 · Builder  
**Category:** Build · Visual-to-Code  
**Status:** Production

---

## What It Does

Recreate Screenshot converts reference screenshots — competitor sites, design mockups, or archived snapshots — into clean, production-ready HTML/CSS layouts. It gives the Builder agent a fast path to high-quality spec sites without starting from a blank template.

---

## Input Types

| Source | Description |
|---|---|
| **Competitor screenshot** | Top-ranking local competitor captured by the Prospector |
| **Reference design** | A pre-approved layout template from the skill library |
| **Archived snapshot** | Wayback Machine capture of target's previous site |
| **Manual upload** | Operator-provided design file or screenshot |

---

## Process

1. Screenshot is analyzed for layout regions: header, hero, services, contact, footer
2. Each region is classified: nav, CTA, card grid, text block, form, map embed
3. Semantic HTML5 structure is generated matching the visual layout
4. Tailwind CSS classes are applied for spacing, typography, and color
5. Business-specific content (name, phone, services) is injected from the lead record
6. AEO schema is added on top of the visual structure

---

## Output Quality Standards

- ✓ Valid HTML5 with semantic elements (`<header>`, `<main>`, `<section>`, `<footer>`)
- ✓ Mobile-responsive at 375px, 768px, 1280px
- ✓ Lighthouse performance score ≥ 85
- ✓ No inline styles (all Tailwind utility classes)
- ✓ All images use descriptive `alt` text

---

## Example Transformation

**Input:** Screenshot of competitor HVAC site  
**Output:** Clean HTML/CSS layout with:
- Identical visual hierarchy
- Replaced brand colors and business name
- Added `LocalBusiness` + `Service` JSON-LD
- Converted nav to semantic `<nav>` with skip link
- Replaced low-res hero with optimized WebP placeholder
