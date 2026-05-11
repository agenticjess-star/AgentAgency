---
name: outbound-studio
description: Outbound Studio — a 7-agent autonomous outbound sales crew that finds SMBs with weak web presence, builds them a better site on spec, and sends targeted outreach. Use when the user asks about running the Outbound Studio pipeline, adding leads, triggering agent runs, or working with the prospect-to-close workflow. The system covers: Prospector (Maps + Exa), Strategist (SEO audit + dossier), Builder (site on Vercel), Auditor (quality gate), Packager (video + email), Persona Tester, and Conductor (notify + approve).
---

# Outbound Studio

An autonomous outbound sales crew that turns SMBs with weak web presence into paying clients — by building them a better site on spec before asking for anything.

## Core Mechanic

Build the best version of their site → show it to them → let them claim it within 7 days → recycle the asset if they pass (rerun for a similar business in a different location).

## The 7-Agent Crew

### 1. Prospector
- **Input**: vertical + geo (e.g., `power_washing` in `Houston, TX`)
- **Output**: Lead pack — businessName, domain, sector, contactEmail, contactPhone, opportunityTag
- **opportunityTag values**: `no_website` | `weak_website` | `outdated` | `not_ai_citable`
- **Tools**: Google Maps, Exa
- **Handoff**: scored lead JSONL → Strategist

### 2. Strategist
- **Input**: Lead JSON from Prospector
- **Output**: Target dossier — business info, services, brand voice, top review themes, competitor comparison table, gap inventory
- **Tools**: Firecrawl (full-site crawl), Exa (competitor research), Browserbase (JS-rendered sites)
- **Skills**: SEO Auditor
- **Handoff**: `dossier.md` + `competitor_comparison.json` → Builder

### 3. Builder
- **Input**: Target dossier from Strategist
- **Output**: Live Vercel URL, GitHub repo, asset manifest (schema + llms.txt baked in)
- **Deploy pattern**: `business-name.vercel.app`
- **Never free-code** — use templates + design systems + components
- **Tools**: GitHub, Vercel, Cloudinary, Pexels, GenerateImage
- **Design reference**: awesome-design-md repository (60+ brand DESIGN.md files — match archetype to vertical)
- **Handoff**: site URL + asset manifest → Auditor

### 4. Auditor
- **Input**: Site URL + dossier + competitor list
- **Output**: Audit report — gaps_closed per item, competitor scores, customer-journey grade (clarity/trust/ease/confidence), responsive check at 375/768/1440, AI-citability checklist
- **Quality gate**: Pass (all gaps closed + agent swarm grade > competitor set) OR Fail (fix list → Builder)
- **V2**: Monte Carlo customer-journey simulation — agent swarms of target customer, iterate until site wins
- **Tools**: Browserbase, Exa
- **Handoff**: pass-flag + audit report → Packager

### 5. Packager
- **Input**: Site URL + audit report + contact info + brand voice
- **Output**: Email draft (subject, body, video embed, live URL, price, 7-day window), video walkthrough
- **Video generation**: hyperframes / website-to-hyperframes (NOT screen recording — generated from HTML)
- **Handoff**: email draft + video URL → Persona Tester

### 6. Persona Tester
- **Input**: Email draft + target persona context from dossier
- **Output**: Persona review — clarity score, trust score, confidence-to-reply score, red flags
- **Loop**: green-light → Conductor | fix-list → Packager
- **Tools**: Gmail (receive), Exa (persona context)

### 7. Conductor
- **Input**: Full package from all agents
- **Output**: Telegram notification to user with approve-to-send CTA
- **Handoff**: user confirms → email sends | user requests changes → loops to relevant agent

## AEO Pitch (lock verbatim)

> Right now, when someone asks ChatGPT for the best [service] in [city], your website is structurally invisible to it — dynamic-loading, no schema, no crawler allowlist, no llms.txt. We built this new site so AI agents can read it cleanly. The goal is to get you recommended first. It's a race, it takes time, reviews matter — but right now, you're not even on the track. This puts you in the race.

## Quality Differentiator

> I didn't stop building this until agent simulations of your typical customer ranked it ahead of every competitor. Here's the link.

## Pricing (May 2026, verified from 11 sources)

| Offer | Price |
|-------|-------|
| Core build (5 pages, AI-optimized, deployed) | $1,997 / $2,497 |
| Premium build (conversion-focused + AEO baked in) | $3,997 / $4,997 |
| Maintenance retainer | $97/mo |
| SEO retainer | $297/mo |
| AEO Growth retainer | $497 / $597/mo |
| AI Quote Tool one-time install | $797 / $997 |

**Framing rules:**
- "Launch audit" bundled into month 1 — never billed as a setup fee
- Month-to-month cancellation on retainers
- DIY counter: Wix/Squarespace costs 40-80 hours of owner time = $2K-$6K hidden opportunity cost

## Knowledge Libraries (Supabase)

**components table**: id, archetype, vertical_fit[], source, user_rating, last_used, win_rate
- Builder reads with preference-weighted retrieval: highest-rated + highest-win-rate wins

**vertical_packs table**: per-vertical research — industry norms, must-have sections, competitor archetypes, proven hooks, pricing benchmarks

## Lead Statuses

`prospected` → `strategized` → `built` → `audited` → `packaged` → `outreached` → `won` | `lost` | `recycled`

## Opportunity Tags

- `no_website`: Business has no web presence at all
- `weak_website`: Site exists but is poor quality
- `outdated`: Site is old/not AI-citable
- `not_ai_citable`: Site is technically functional but invisible to AI search

## AI Search Stats (for pitch)

- ChatGPT: 900M weekly active users (Feb 2026, doubled in 12 months)
- Google searches per US user fell ~20% YoY 2024-2025
- 37% of consumers now start searches with AI tools (not Google)
- Perplexity: 45M MAU early 2026, 800% YoY growth
- 51% of consumers changed research habits due to GenAI

## Retainer Positioning

$497-$597/mo AEO Growth undercuts Optimum Web ($490/mo SEO-only, no AEO) and HelloSEO ($850/mo) while bundling more verifiable deliverables: llms.txt, schema, AI-crawler allowlist, AI-visibility monitoring.

## References

- See `references/agent-configs.md` for per-agent system prompt starters
- See `references/vertical-pack-template.md` for the vertical research scaffold
