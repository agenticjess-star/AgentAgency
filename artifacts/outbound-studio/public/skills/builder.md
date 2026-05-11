# Builder

## Overview

The Builder agent consumes the `SiteBlueprint` from the Strategist and generates a complete, production-ready website for the target business — built on spec, at no charge to the prospect until they claim it.

## What it does

1. Scaffolds a multi-page website from the SiteBlueprint specification
2. Injects all required schema.org structured data markup
3. Generates AEO-optimized copy for each page
4. Builds responsive, mobile-first layouts with Core Web Vitals targets
5. Deploys to a staging URL for the Auditor to evaluate
6. Emits a `BuildArtifact` including the staging URL and build metadata

## Inputs

- `SiteBlueprint` from Strategist
- `design_style` — one of: `professional`, `modern`, `minimal`, `bold` (default: `professional`)
- `color_scheme` — auto-derived from vertical unless overridden
- `tone` — content tone: `authoritative`, `friendly`, `urgent` (default: `authoritative`)

## Output: BuildArtifact

- `siteUrl` — staging deployment URL
- `pages` — list of generated pages with word counts and schema types applied
- `buildScore` — internal pre-audit self-assessment (0–100)
- `schemaInventory` — list of all schema.org types injected
- `lighthouse` — automated Lighthouse scores at build time

## Generated pages (standard set)

### Homepage
- Hero with primary value proposition and local signal
- Services overview grid
- Trust signals (years in business, reviews, certifications)
- FAQ section (drives AEO citation)
- Contact CTA with embedded map

### Services pages (1 per service)
- Detailed service description
- Local pricing context
- Before/after or process walkthrough
- Service-specific FAQ
- ServiceOffering schema

### About page
- Company story and team (placeholder for actual content)
- Awards and credentials
- LocalBusiness schema with full NAP

### Contact / Location page
- Embedded Google Map
- Click-to-call phone number
- Service area list
- ContactPage schema

## AEO injection checklist

Every generated site includes:

- `LocalBusiness` schema with `@type`, `name`, `address`, `telephone`, `openingHours`
- `FAQPage` schema with minimum 5 Q&A pairs targeting local intent queries
- `BreadcrumbList` schema on all interior pages
- `Review` aggregate schema (placeholder stars, awaiting real data claim)
- `Organization` schema on homepage
- OpenGraph `og:type`, `og:title`, `og:description`, `og:image` on all pages
- Canonical URL on every page
- Hreflang if multi-location

## Feedback loop

If the Auditor returns a score below 70/100, the Builder receives a structured feedback payload identifying failing criteria and regenerates the affected sections. The Builder will loop up to 3 times before escalating to a human review flag.
