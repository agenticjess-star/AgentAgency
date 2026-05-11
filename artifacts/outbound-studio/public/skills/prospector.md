# Prospector

## Overview

The Prospector agent is the top-of-funnel entry point for the Outbound Studio pipeline. It discovers small-to-medium businesses (SMBs) with weak, missing, or non-AEO-optimized web presence across configurable verticals and geographic markets.

## What it does

Given a `vertical` and `geo` parameter pair, the Prospector:

1. Queries multiple business listing sources (Google Maps API, Yelp, local directories, LinkedIn) for active businesses
2. Scores each result against a weak-site heuristic model (missing HTTPS, no schema markup, low PageSpeed score, no structured contact data)
3. Filters to candidates meeting the minimum opportunity threshold
4. Emits a structured lead record to the next agent in the pipeline

## Inputs

- `vertical` — target business category (e.g., `power_washing`, `hvac`, `landscaping`, `dental`)
- `geo` — target geographic area (e.g., `Houston, TX` or `Chicago metro`)
- `limit` — max leads per run (default: 10)
- `min_opportunity_score` — minimum weakness score to qualify (0–100, default: 40)

## Output

A structured lead record containing:

- `businessName` — discovered business name
- `domain` — current website URL (or null if no website)
- `vertical` — normalized vertical category
- `geo` — normalized geographic identifier
- `opportunityTag` — one of: `no_website`, `weak_website`, `outdated`, `not_ai_citable`
- `contactEmail` — owner email if discoverable
- `contactPhone` — business phone
- `weaknessScore` — computed score (0–100)

## Opportunity Tags

- **no_website** — business has no discoverable web presence at all
- **weak_website** — has a website but scores below 40/100 on technical + AEO criteria
- **outdated** — site is technically present but last updated >18 months ago
- **not_ai_citable** — site exists and is modern, but has no schema markup, no FAQ/entity content, and won't appear in AI search responses

## Quality thresholds

The Prospector applies a multi-factor scoring model:

- No HTTPS: −20 points
- No mobile viewport: −15 points
- No schema.org markup: −25 points
- PageSpeed score < 50: −15 points
- No Google Business Profile: −10 points
- Last-modified header > 18mo: −10 points
- No FAQ or structured content: −5 points

Leads below 40/100 are emitted. Leads above 80/100 are discarded (too healthy to target).

## Feedback loops

The Prospector is re-invoked if the Auditor scores the final built site below 60/100 AND the source lead's `weaknessScore` was below 20 (indicating a prospecting targeting error).
