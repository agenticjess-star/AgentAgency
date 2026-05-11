# Persona Tester

## Overview

The Persona Tester agent simulates three ideal customer profile (ICP) personas reading the claim package and predicts conversion likelihood. If the predicted rate falls below threshold, it feeds objection data back to the Packager for revision.

## What it does

1. Loads 3 ICP personas for the target vertical (pre-built library of 50+ personas)
2. Simulates each persona's decision process when receiving the Day 1 email
3. Identifies objections, friction points, and conversion blockers per persona
4. Computes a predicted aggregate conversion rate
5. If rate ≥ 15%: passes ClaimPackage to Outreach
6. If rate < 15%: emits objection report to Packager for revision (max 2 loops)

## ICP Persona library (examples)

### Vertical: Power Washing

**Persona A — The Skeptic Owner**
- Demographics: Male, 45–55, owner-operator, 1–3 employees
- Behavior: Skeptical of marketing pitches, reads only subject lines initially
- Primary objection: "This is a scam / I didn't ask for this"
- Conversion trigger: Seeing the actual site URL with their branding already built
- Required: Clear proof of value in subject line

**Persona B — The Growth-Minded Owner**
- Demographics: Female, 30–40, has a part-time marketer, 5–10 employees
- Behavior: Opens emails, clicks links, compares to competitors
- Primary objection: "How much does this really cost?"
- Conversion trigger: ROI calculation showing competitor advantage
- Required: Specific dollar value of lost business due to no AI citation

**Persona C — The Referred Decision Maker**
- Demographics: Male, 50–65, follows advice from business groups/peers
- Behavior: Doesn't open cold emails; needs social proof first
- Primary objection: "I need to ask my accountant / partner"
- Conversion trigger: Testimonial from same vertical
- Required: Case study in email body

## Simulation process

For each persona, the model evaluates:

1. **Subject line open likelihood** (0–100%) based on persona trigger alignment
2. **Email body engagement** — does the copy address the primary objection?
3. **CTA click likelihood** — is the value clear before the CTA?
4. **Overall conversion score** — probability of responding within 7 days

## Scoring output

```
{
  personaA: { openRate: 72%, clickRate: 38%, conversionScore: 24% },
  personaB: { openRate: 85%, clickRate: 62%, conversionScore: 41% },
  personaC: { openRate: 31%, clickRate: 12%, conversionScore: 8% },
  aggregateConversionRate: 24.3%,
  passed: true,
  topObjections: ["price ambiguity", "cold outreach skepticism"],
  recommendedFixes: []
}
```

## Threshold behavior

- **Rate ≥ 15%** → Pass. Forward ClaimPackage to Outreach.
- **Rate 10–14%** → Marginal. Send top objections to Packager with specific copy fixes. Max 2 loops.
- **Rate < 10%** → Hard fail. Flag lead for manual review or re-stratification.
