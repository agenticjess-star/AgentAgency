# Invoice Generator

**Agent:** 07 · Outreach  
**Category:** Outreach · Claim Offer  
**Status:** Production

---

## What It Does

Invoice Generator creates the financial component of every claim package — a transparent, personalized pricing sheet that tells the prospect exactly what they're getting, what it costs, and why the 7-day window matters. It's the conversion artifact that turns curiosity into a signed deal.

---

## Package Components

| Component | Description |
|---|---|
| **Claim Offer** | One-page PDF with site preview, scope, and price |
| **Pricing Sheet** | Itemized service breakdown with line-item justification |
| **Urgency Notice** | 7-day expiry terms with release clause |
| **Comparison Block** | Side-by-side: current site vs. built site metrics |

---

## Pricing Logic

Base price is set by tier, then adjusted by:

| Factor | Adjustment |
|---|---|
| Page count | +$50 per page above 5 |
| Schema complexity | +$100 for multi-service schema |
| Competitor rank gap | +$150 if top competitor ranks page 1 |
| Urgency tier | Standard (7-day), Rush (48-hr +$200) |

---

## Invoice Schema

```json
{
  "invoice_id": "INV-2026-0142",
  "business_name": "Texas Comfort Systems",
  "offer_expires": "2026-05-18",
  "line_items": [
    { "item": "AEO-Optimized Website (7 pages)", "price": 897 },
    { "item": "LocalBusiness Schema Implementation", "price": 150 },
    { "item": "Google Business Profile Sync", "price": 75 }
  ],
  "total": 1122,
  "payment_terms": "50% on claim, 50% on go-live"
}
```

---

## Personalization Signals

Every invoice is personalized using:
- Business name and owner's first name (from deep research)
- Audit score comparison ("Your current site scores 31/100. We built you an 87.")
- Local competitor callout ("Top competitor in your area: [name], currently ranking #1")
- Specific service pages included in the build
