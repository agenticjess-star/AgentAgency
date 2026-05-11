# Packager

## Overview

The Packager agent receives the passed `AuditReport` and `BuildArtifact` and assembles them into a complete, structured claim package — everything the Outreach agent needs to deliver a compelling, personalized offer to the prospect.

## What it does

1. Generates a personalized offer letter specific to the business and their identified opportunity
2. Creates a 7-day claim timeline with escalating urgency messaging
3. Bundles the audit findings into a readable "site health report" for the prospect
4. Packages the staging site URL, audit score, and competitor gap analysis
5. Prepares email subject lines, preview text, and body variants for A/B testing
6. Emits a `ClaimPackage` to the Persona Tester

## Inputs

- `BuildArtifact` from Builder
- `AuditReport` from Auditor
- `SiteBlueprint` from Strategist (for gap analysis and competitor context)
- Lead record (for personalization data)

## Output: ClaimPackage

```
{
  leadId: number,
  businessName: string,
  offerLetterHtml: string,
  siteHealthReport: SiteHealthReport,
  stagingUrl: string,
  auditScore: number,
  competitorGaps: string[],
  emailSequence: EmailStep[],
  claimDeadline: ISO8601Date,  // 7 days from package creation
  personalizedSubjects: string[],
  ctaUrl: string
}
```

## Email sequence structure

The Packager generates a 7-step claim sequence:

- **Day 1** — Discovery email: "We built something for [Business Name]"
- **Day 2** — Proof email: Site screenshot + audit score reveal
- **Day 3** — Competitor comparison: "Your competitor is getting cited. You aren't."
- **Day 5** — Social proof: Case study from similar vertical/geo
- **Day 6** — Urgency: "48 hours left to claim [domain]"
- **Day 7 AM** — Final reminder: Countdown with offer recap
- **Day 7 PM** — Expiry notice: "Offer closes at midnight"

## Personalization tokens

Each email is personalized with:

- `{{businessName}}` — target business name
- `{{ownerName}}` — resolved contact name (or "Business Owner")
- `{{vertical}}` — their service category
- `{{geo}}` — their city/region
- `{{auditScore}}` — their existing site score
- `{{newScore}}` — the built site's audit score
- `{{competitorName}}` — top competitor being cited in AI search
- `{{stagingUrl}}` — link to the built site preview
- `{{claimDeadline}}` — formatted expiry date

## Feedback loop

If the Persona Tester simulates ICPs and finds predicted conversion rate < 15%, the Packager receives specific objection data and regenerates the offer letter, subject lines, and Day 1–3 email content. Maximum 2 loops.
