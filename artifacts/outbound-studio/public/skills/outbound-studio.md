# Outbound Studio

**Category:** Platform · System Overview  
**Status:** Production

---

## What It Is

Outbound Studio is an AI-native outbound sales system — a 7-agent crew that finds small and medium-sized businesses with weak web presence, builds a superior version of their site entirely on spec, and delivers a 7-day claim offer to the owner.

No cold calling. No manually researched lists. The pipeline runs automatically from lead discovery through to a live site and personalized email in the owner's inbox.

---

## The 7-Agent Pipeline

```
01 Prospector → 02 Strategist → 03 Builder → 04 Auditor
                                                  ↓ (score < 70: loop)
                               05 Packager → 06 Persona Tester
                                                  ↓ (rate < 40%: loop)
                               07 Outreach
```

| Agent | Role | Output |
|---|---|---|
| **Prospector** | Finds SMBs with weak/no web presence | Scored lead list |
| **Strategist** | Audits existing site, maps opportunity | Site blueprint + pitch angle |
| **Builder** | Generates AEO-optimized replacement site | Live staging URL |
| **Auditor** | Scores site on 40+ quality criteria | Audit score (0–100) |
| **Packager** | Bundles site + audit + offer materials | Claim package |
| **Persona Tester** | Simulates 3 ICP personas against the offer | Conversion likelihood |
| **Outreach** | Writes and sends personalized claim email | 7-day sequence |

---

## The Claim Offer Model

The prospect receives:
1. A link to a live version of their new site (hosted on spec)
2. An audit report comparing it to their current site
3. A 7-day time-limited claim offer with transparent pricing
4. A personalized email from the AI SDR

If they claim: the site transfers to their domain. If they don't: the asset is repurposed for a competitor outreach run.

---

## Feedback Loops

The pipeline has two quality gates with automatic loops:

- **Auditor → Builder**: if audit score < 70, the site is rebuilt with correction notes
- **Persona Tester → Packager**: if simulated conversion rate < 40%, the offer is repackaged

---

## Answer Engine Optimization (AEO)

Every built site is optimized for AI citation, not just Google ranking. This means:

- `FAQPage`, `LocalBusiness`, `Service`, and `HowTo` JSON-LD schema
- Conversational content blocks targeted at AI Overview and Perplexity queries
- Entity-first heading structure
- NAP consistency across all structured data

---

## Pricing

| Tier | Price | Volume |
|---|---|---|
| Starter | $297/mo | 50 leads/mo |
| Operator | $897/mo | 250 leads/mo |
| Agency | Custom | Unlimited + white-label |
