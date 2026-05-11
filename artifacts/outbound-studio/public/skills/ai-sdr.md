# AI SDR

## Overview

The AI SDR (Sales Development Representative) skill provides full end-to-end autonomous outbound prospecting, qualification, and multi-channel sequence management. It powers the Outreach agent's personalization and follow-up intelligence layer.

## What it does

- Prospecting: discover and qualify leads from multiple sources
- Enrichment: resolve contact data (email, phone, LinkedIn, role)
- Sequencing: manage multi-step, multi-channel outreach (email, LinkedIn, SMS)
- Personalization: generate hyper-personalized opening lines and value props
- Qualification: score leads against ICP fit criteria in real time
- Handoff: route qualified leads to CRM with full context

## Personalization engine

The AI SDR generates opening lines using:

- Recent company news (funding, hiring, product launches)
- LinkedIn activity signals (posts, comments, job changes)
- Technology stack signals (what tools they're using)
- Vertical-specific pain points
- Geo-specific competitive landscape

Example output:

> "Hey Sarah — noticed you just hired two new field techs at Clean Pro Power Washing (congrats!). We built something that should help those new hires get booked faster — no SEO agency needed."

## ICP scoring model

Each prospect is scored 0–100 against:

- **Firmographic fit** (25 pts): vertical, size, geo, revenue band
- **Tech fit** (20 pts): no existing AEO-optimized site, no active SEO tool
- **Timing signals** (30 pts): recent hiring, expansion, social activity
- **Reachability** (25 pts): verified email, LinkedIn presence, phone

Leads scoring < 40 are filtered out before sequence enrollment.

## Multi-channel orchestration

- **Email** (Day 1, 3, 5, 7) — primary channel
- **LinkedIn connection request** (Day 2) — with personalized note
- **LinkedIn message** (Day 4) — if connected
- **SMS** (Day 6, optional) — for high-value / high-ICP-fit leads only

## Opt-out and compliance

- CAN-SPAM, GDPR, and CCPA compliant
- Automatic unsubscribe processing
- 90-day global suppression after opt-out
- Bounce handling with domain health monitoring
