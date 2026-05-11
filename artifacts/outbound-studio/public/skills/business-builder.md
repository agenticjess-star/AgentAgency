# Business Builder

Take a target SMB from zero to a full production-ready web presence — site, copy, schema, and offer package — using the full Outbound Studio agent stack. This skill coordinates all 7 agents toward a single business deliverable.

## When to Use

- Building a replacement site for a prospected SMB target
- Launching a new outbound sequence for a specific vertical + geo
- Scaling the pipeline with parallel build runs across multiple targets
- Creating spec sites to use as proof-of-concept in sales conversations

## Phase 1: Discovery & Targeting

Before building anything, the Prospector must qualify the target:

### Qualification Checklist

| Signal | Source | Minimum Bar |
|--------|--------|-------------|
| Weak/no AEO | Audit | Score < 60/100 |
| Local search intent | Google Maps | Listed in target geo |
| AI invisibility | Perplexity/ChatGPT | Not cited for top query |
| Contact reachable | Exa / Maps | Email or phone found |
| Revenue fit | Headcount proxy | 1-20 employees |

### Target Verticals (Highest Win Rate)

- Power washing / exterior cleaning
- HVAC service and repair
- Plumbing (residential)
- Landscaping and lawn care
- Auto detailing
- Roofing and gutters
- Pest control
- Locksmith services

## Phase 2: Strategist Dossier

The Strategist builds the full context package before any code is written:

```
dossier.md structure:
- Business name, domain, location, services
- Existing site audit score + gap list
- Top 3 local competitors + their scores
- Brand voice (tone, formality, local signals)
- Review themes (most praised / most complained)
- Target query list (5-10 high-intent local searches)
- AEO opportunity score
```

## Phase 3: Builder Output Requirements

Every spec build must include:

### Technical Requirements
- LocalBusiness schema (full, with @type matching vertical)
- Service schema for each service offered
- FAQPage schema (minimum 5 questions)
- BreadcrumbList on every page
- `llms.txt` in root (agent crawler allowlist)
- Robots.txt allowing OAI-SearchBot, Googlebot, PerplexityBot
- Sitemap.xml with all page URLs

### Page Structure (Minimum 5 pages)
1. **Home** — hero, services overview, trust signals, CTA
2. **Services** — individual service pages per offering
3. **About** — business story, team, local roots
4. **Reviews** — structured testimonials with schema
5. **Contact** — NAP (Name, Address, Phone), map embed, form

### Content Requirements
- Primary keyword in H1, first 100 words, and meta title
- Location signals in copy (city, neighborhood, service area)
- Specific service language (not generic — "residential power washing" not "cleaning")
- Trust signals: years in business, certifications, review count

## Phase 4: Audit Gate

The Auditor scores against 40+ criteria before the build advances:

```
Audit categories:
- AEO score (schema completeness, llms.txt, crawler allowlist)
- Technical SEO (meta tags, canonicals, sitemap, robots)
- Content quality (keyword placement, local signals, depth)
- Performance (LCP < 2.5s, CLS < 0.1, INP < 200ms)
- Mobile readiness (responsive, tap targets, no horizontal scroll)
- Trust signals (NAP, reviews, credentials)

Pass threshold: 85/100 overall, no category below 70
Fail → fix list returned to Builder with specific gaps
```

## Phase 5: Offer Package

The Packager assembles the claim offer:

```
Claim package contents:
- Live preview URL (business-name.vercel.app)
- Audit score comparison: old vs new (e.g., 23 → 94)
- Competitor gap visualization
- Price: $1,997 (core) or $2,497 (premium)
- 7-day claim window with urgency framing
- Video walkthrough (30-60 seconds, generated from HTML)
- Maintenance retainer upsell ($97/mo)
```

## Pricing Reference

| Offer | Price | Positioning |
|-------|-------|-------------|
| Core build (5 pages) | $1,997 | Most businesses |
| Premium build (conversion-focused) | $2,497–$4,997 | High-revenue verticals |
| Maintenance retainer | $97/mo | Every deal |
| SEO retainer | $297/mo | Upsell at close |
| AEO Growth retainer | $497/mo | Ongoing AI visibility |

## AEO Pitch Script

> Right now, when someone asks ChatGPT for the best [service] in [city], your website is structurally invisible — dynamic-loading, no schema, no crawler allowlist, no llms.txt. We built this new site so AI agents can read it cleanly. The goal is to get you recommended first. It's a race, it takes time, reviews matter — but right now, you're not even on the track. This puts you on the track.

## Asset Reuse Protocol

- Generate brand assets (palette, logo, hero image) once per target business
- Reuse across the spec site, email package, and video walkthrough
- Store all assets in Cloudinary with standardized naming: `os-[business-slug]-[asset-type]`

## Parallel Build Strategy

For pipeline scale, run 5 builds in parallel:
1. Target 1: Vertical A, Geo X
2. Target 2: Vertical A, Geo Y (same vertical, new location)
3. Target 3: Vertical B, Geo X (new vertical, same location)
4. Target 4: Lookalike to Target 1 (similar business profile)
5. Target 5: Priority target from failed previous cycle

Each agent handoff runs sequentially within a build, but builds run in parallel across the 5 tracks.

## Quality Differentiator

> We didn't stop building this until agent simulations of your typical customer ranked it ahead of every competitor. Here's the link.

## Limitations

- Builder never free-codes — always uses templates + design systems
- Packager never sends without Persona Tester sign-off
- Conductor never sends without operator approval (you must confirm)
- All offers expire in 7 days — system enforces this, no extensions
