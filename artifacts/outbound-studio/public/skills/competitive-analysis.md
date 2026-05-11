# Competitive Analysis

## Overview

The Competitive Analysis skill maps the competitive landscape for a target vertical and geography, identifying which businesses are winning in AI search, what content strategies they use, and where gaps exist that the built site can exploit.

## What it does

1. Identifies the top 3–5 competitors in the vertical+geo being targeted
2. Audits each competitor's AEO presence across ChatGPT, Perplexity, and Gemini
3. Analyzes what schema types and content structures are cited by AI engines
4. Maps the gap between the target's current presence and the winning competitors
5. Produces a prioritized opportunity list for the Builder

## Competitive discovery

Competitors are identified by:

- Ranking position in Google Maps "Local Pack" for the primary service query
- Frequency of citation in AI search responses for 10 local intent queries
- Review count and score as a proxy for market authority
- Domain authority and backlink profile as an SEO signal

## AI citation mapping

For each competitor, the skill records:

- Which AI engines cite them
- For which queries
- What content/page is cited (homepage, service page, FAQ)
- What schema types are present on the cited page
- The exact snippet or excerpt that appears in the AI response

This produces a "citation blueprint" showing exactly what content structure wins citations in the target vertical+geo.

## Gap analysis output

```
{
  targetBusiness: string,
  vertical: string,
  geo: string,
  competitors: [
    {
      name: string,
      domain: string,
      aeoScore: number,
      citedBy: ["ChatGPT", "Perplexity"],
      citedForQueries: string[],
      citationDrivers: ["FAQPage schema", "LocalBusiness with hours"],
      reviewScore: 4.8,
      reviewCount: 312
    }
  ],
  targetGaps: [
    "No FAQPage schema — competitor A has 12 FAQ items",
    "No ServiceOffering schema — competitor B has 6 services defined",
    "Missing 'service area' entity — competitor C explicitly lists 14 neighborhoods"
  ],
  opportunityScore: 78,
  primaryCitationStrategy: "FAQ-first with explicit service area list"
}
```

## Integration

The Competitive Analysis skill is called within the Strategist agent and feeds directly into the `SiteBlueprint.competitorGaps` field, which the Builder uses to prioritize schema injection and content structure choices.
