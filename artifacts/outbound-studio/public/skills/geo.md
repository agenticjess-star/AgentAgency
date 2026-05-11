# Geo Targeting

**Agent:** 01 · Prospector  
**Category:** Prospecting · Geographic Segmentation  
**Status:** Production

---

## What It Does

Geo Targeting powers hyper-local market segmentation for every prospecting run. Rather than broad keyword sweeps, it scopes each discovery pass to a specific city, metro area, neighborhood, or radius — dramatically improving lead quality by ensuring every result is actually serviceable.

---

## Targeting Modes

| Mode | Description | Use Case |
|---|---|---|
| **City** | Single municipality | Tight local agency territory |
| **Metro** | DMA or combined statistical area | Regional scale |
| **Radius** | Miles/km from a coordinate | Mobile service businesses |
| **Multi-Geo** | Batch of cities in one run | Multi-market operators |

---

## Input Schema

```json
{
  "geo": {
    "type": "city",
    "value": "Austin, TX",
    "radius_mi": null
  },
  "verticals": ["plumbing", "hvac", "roofing"],
  "min_population": 50000
}
```

---

## How It Works

1. Geo is resolved to lat/lng bounding box via geocoding
2. Search queries are appended with city/neighborhood qualifiers
3. Results are filtered to businesses with verified local addresses
4. Duplicate suppression prevents cross-run redundancy

---

## Signals Used

- Google Maps place data (name, address, category, rating, review count)
- Website URL presence/absence
- Local citation consistency (NAP matching)
- Proximity to city center (density proxy for competition)

---

## Output

Each geo run appends scored leads to the pipeline with:
- Business name, address, phone, website (if any)
- Opportunity tag: `no_website`, `weak_website`, `outdated`, `not_ai_citable`
- Geo metadata: city, state, zip, lat/lng
