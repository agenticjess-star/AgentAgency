# Auditor

## Overview

The Auditor agent evaluates the site produced by the Builder against a 40+ criteria quality scorecard. It is the quality gate of the pipeline — if the built site doesn't meet threshold, it sends structured feedback back to the Builder for a revision cycle.

## What it does

1. Fetches the staging URL from the BuildArtifact
2. Runs automated technical audits (Lighthouse, schema validation, AEO checks)
3. Submits the site URL to AI search engines and checks for citation
4. Computes a composite audit score (0–100)
5. If score ≥ 70: passes BuildArtifact to Packager
6. If score < 70: emits structured feedback to Builder for revision (up to 3 loops)

## Scoring model

### Technical Quality (35 points)

| Criterion | Max Points |
|---|---|
| Lighthouse Performance ≥ 80 | 10 |
| Lighthouse Accessibility ≥ 90 | 5 |
| Lighthouse Best Practices ≥ 90 | 5 |
| Core Web Vitals: LCP < 2.5s | 5 |
| Core Web Vitals: CLS < 0.1 | 5 |
| HTTPS valid + HSTS | 3 |
| Mobile-responsive | 2 |

### Schema / Structured Data (35 points)

| Criterion | Max Points |
|---|---|
| LocalBusiness schema valid | 10 |
| FAQPage schema present + valid | 8 |
| Minimum 5 FAQ items | 5 |
| ServiceOffering schema per service | 5 |
| OpenGraph tags complete | 4 |
| BreadcrumbList on interior pages | 3 |

### AEO / AI Citation (30 points)

| Criterion | Max Points |
|---|---|
| Cited in ChatGPT for 1+ local query | 10 |
| Cited in Perplexity for 1+ local query | 8 |
| Cited in Gemini for 1+ local query | 7 |
| FAQ content answers target queries | 5 |

## Threshold behavior

- **Score ≥ 70** → Pass. Emit `AuditReport` to Packager.
- **Score 50–69** → Fail. Send feedback to Builder for targeted revision. Max 3 loops.
- **Score < 50** → Hard fail. Flag for human review. Pause pipeline.

## Feedback payload structure

When failing, the Auditor emits a structured feedback record:

- `failingCriteria` — list of criteria that scored 0
- `lowScoreCriteria` — list of criteria with partial scores
- `suggestedFixes` — actionable remediation for each failing criterion
- `loopCount` — current iteration number (1, 2, or 3)

## Output: AuditReport

- `auditScore` — composite score (0–100)
- `breakdown` — scores per category
- `citations` — list of AI queries where the site was cited
- `failingCriteria` — remaining failures after final iteration
- `passed` — boolean
