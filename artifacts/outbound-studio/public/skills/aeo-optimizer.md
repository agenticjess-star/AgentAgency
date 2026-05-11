# AEO Optimizer

## Overview

The AEO (Answer Engine Optimization) Optimizer skill transforms standard web content into machine-readable, AI-citable structured content that surfaces in ChatGPT, Perplexity, Gemini, and AI Overview responses.

## What it does

- Injects schema.org structured data markup (JSON-LD)
- Rewrites page copy to match AI search citation patterns
- Generates FAQ sections targeting local intent queries
- Optimizes entity relationships for AI knowledge graph inclusion
- Validates citation readiness against major AI search engines

## Why AEO matters

Traditional SEO optimizes for Google's 10-blue-links algorithm. AEO optimizes for AI engines that synthesize answers from the web. The two have overlapping but distinct requirements:

| Signal | SEO importance | AEO importance |
|---|---|---|
| Keyword density | High | Low |
| Schema.org markup | Medium | Critical |
| FAQ structured content | Medium | Critical |
| Entity disambiguation | Low | Critical |
| Backlink profile | Critical | Low |
| Page speed | High | Medium |
| Direct answer copy | Medium | Critical |

## Schema types injected

### For local service businesses

- `LocalBusiness` — core entity with NAP, hours, service area
- `ServiceOffering` — one per service, with `areaServed` and `priceRange`
- `FAQPage` — minimum 5 Q&A pairs per page
- `Review` / `AggregateRating` — trust signals for AI citation
- `BreadcrumbList` — navigation context
- `ContactPage` — phone, email, address in machine-readable form
- `GeoCoordinates` — precise location for local search

### Optional / vertical-specific

- `MedicalBusiness` — for healthcare verticals
- `HomeAndConstructionBusiness` — for home services
- `AutomotiveBusiness` — for auto verticals
- `ProfessionalService` — for B2B verticals

## FAQ optimization strategy

AI engines heavily weight FAQ content for local queries. The AEO Optimizer generates FAQs by:

1. Analyzing the top 20 "People Also Ask" results for the vertical+geo
2. Identifying which AI engines answer those queries and from which source
3. Writing direct, structured answers that outcompete the current cited source
4. Inserting FAQPage schema linking questions to answer anchors

## Citation validation

After optimization, the skill submits test queries to:

- ChatGPT (`gpt-4o` via API)
- Perplexity (via API)
- Gemini (via API)

And checks whether the target URL or business entity appears in responses. A passing grade is citation in at least 1 of 3 engines for the primary local intent query.
