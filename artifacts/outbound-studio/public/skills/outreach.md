# Outreach

## Overview

The Outreach agent is the final stage of the pipeline. It receives the validated `ClaimPackage` from the Persona Tester and executes the 7-day claim email sequence to the business owner.

## What it does

1. Resolves final contact details (email, name) via enrichment lookup if not already present
2. Renders each email step with personalization tokens filled in
3. Schedules the 7-day drip sequence via the configured email provider
4. Monitors opens, clicks, and replies
5. Marks the lead status based on response behavior
6. Logs all activity to the pipeline run record

## Inputs

- `ClaimPackage` from Persona Tester
- Lead record (contact email, name, domain)
- `sendFromEmail` — sender identity (operator-configured)
- `trackingEnabled` — whether to enable open/click tracking (default: true)

## Email provider integration

The Outreach agent supports:

- **Resend** (recommended) — API-first, high deliverability
- **SendGrid** — SMTP or API mode
- **Postmark** — transactional focused, excellent deliverability
- **SMTP relay** — custom configuration

## Sequence execution

Emails are scheduled relative to the send date:

| Step | Delay | Subject Focus |
|---|---|---|
| 1 | +0h | Discovery — "We built something for you" |
| 2 | +24h | Proof — audit score reveal + site screenshot |
| 3 | +48h | Competitor comparison |
| 4 | +96h | Social proof / case study |
| 5 | +120h | Urgency — 48 hours remaining |
| 6 | +144h | Final reminder |
| 7 | +168h | Expiry notice |

Each step is cancelled if the prospect replies or clicks the claim CTA.

## Lead status transitions

- `outreached` — Day 1 email sent
- `running` — sequence in progress (no response yet)
- `won` — prospect clicked claim CTA or replied positively
- `lost` — sequence completed with no engagement
- `recycled` — opted out or hard bounce; re-enters Prospector after 90-day cooldown

## Deliverability best practices

- Custom sending domain with SPF, DKIM, and DMARC configured
- Minimum 24h warmup between new sending domains and first sequence
- Plain-text fallback for all HTML emails
- Unsubscribe link in footer (CAN-SPAM / GDPR compliant)
- Send time optimization: Tuesday–Thursday, 9–11 AM local time of recipient

## Activity logging

Every send, open, click, and reply is logged to the `activity` table with:

- `leadId`, `runId`
- `type` — `email_sent`, `email_opened`, `email_clicked`, `reply_received`
- `step` — which step in the sequence (1–7)
- `timestamp`
- `metadata` — subject line, IP of open, link clicked
