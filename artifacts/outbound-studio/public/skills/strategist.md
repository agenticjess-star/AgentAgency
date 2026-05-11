# Strategist

## Overview

The Strategist agent receives a lead record from the Prospector and performs a deep audit of the target business's existing web presence. It produces a competitive analysis and a structured site blueprint that the Builder will use to construct the replacement site.

## What it does

1. Crawls and audits the existing target website (if any) across 60+ technical and content criteria
2. Queries AI search engines (ChatGPT, Perplexity, Gemini) to check whether the business is cited for relevant local queries
3. Identifies the top 3 competitors in the same vertical+geo that are successfully cited in AI search
4. Produces a gap analysis and positioning strategy
5. Emits a structured `SiteBlueprint` to the Builder

## Inputs

- Lead record from Prospector
- `competitive_depth` — how many competitors to analyze (default: 3)
- `aeo_queries` — list of local intent queries to test for AI citation (auto-generated from vertical+geo)

## Output: SiteBlueprint

```
{
  businessName: string,
  vertical: string,
  geo: string,
  targetAudience: string,
  primaryValueProp: string,
  pages: PageSpec[],
  schemaTypes: string[],
  faqItems: { question: string, answer: string }[],
  competitorGaps: string[],
  auditFindings: AuditFinding[]
}
```

## Audit criteria

### Technical (40 points)
- HTTPS and valid SSL certificate
- Mobile-first responsive layout
- PageSpeed Insights score (mobile + desktop)
- Core Web Vitals: LCP, FID, CLS
- Valid canonical tags
- XML sitemap present
- Robots.txt configured

### AEO / Structured Data (40 points)
- LocalBusiness schema present and valid
- FAQPage schema for common local queries
- Review/Rating aggregate schema
- OpenGraph and Twitter Card meta tags
- Entity disambiguation (NAP consistency)
- FAQ content answers local intent queries

### Content (20 points)
- Service pages exist for each core offering
- Location page with geo-specific content
- About/Trust signals present
- Contact information machine-readable

## AI citation testing

The Strategist submits 5–10 local intent queries to each AI engine and checks whether the target business appears in responses. Examples:

- "best [vertical] in [city]"
- "[vertical] near [neighborhood]"
- "top rated [vertical] [city] reviews"

Citation presence/absence is recorded and drives the AEO optimization strategy.
