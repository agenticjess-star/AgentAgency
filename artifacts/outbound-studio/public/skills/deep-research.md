# Deep Research

## Overview

The Deep Research skill is a multi-source intelligence gathering agent that synthesizes business information, contact data, and market signals from public web sources. It powers the Prospector's enrichment phase and the Strategist's competitive analysis.

## What it does

- Business entity resolution: confirms business name, address, phone, and ownership
- Contact discovery: finds owner email, phone, and LinkedIn profile
- Technology detection: identifies what CMS, hosting, analytics, and marketing tools the business uses
- Social signal analysis: recent posts, review sentiment, hiring activity
- Competitive mapping: identifies top 3–5 competitors in the same vertical+geo
- Market signal aggregation: recent news, funding, BBB status, review scores

## Data sources

### Structured data
- Google Business Profile API
- Yelp Business API
- LinkedIn company + people search
- Hunter.io / Apollo.io for contact email resolution
- Clearbit for company enrichment
- BuiltWith / Wappalyzer for tech stack detection

### Unstructured web
- Google Search API (news, reviews, mentions)
- Common Crawl for historical site data
- Archive.org for site age and change history
- Local business directories (Angi, HomeAdvisor, Thumbtack)

### Social
- Facebook Page activity and review count
- Google Maps review score and recency
- Yelp rating and review velocity

## Output: BusinessIntelRecord

```
{
  businessName: string,
  legalName: string | null,
  address: PostalAddress,
  phone: string,
  email: string | null,
  ownerName: string | null,
  ownerLinkedIn: URL | null,
  foundedYear: number | null,
  employeeCount: "1-5" | "5-20" | "20-50" | "50+",
  techStack: string[],
  reviewScore: number,
  reviewCount: number,
  socialPresence: SocialSummary,
  competitors: CompetitorRecord[],
  lastWebsiteUpdate: Date | null,
  siteAgeYears: number | null
}
```

## Contact resolution confidence

Contacts are scored by resolution confidence:

- **Verified (90–100%)** — email confirmed via MX validation + pattern match from same domain
- **Likely (70–89%)** — email pattern inferred from domain, not directly confirmed
- **Possible (50–69%)** — email found via third-party enrichment, unverified
- **Unresolved (< 50%)** — only phone/LinkedIn available; email send not recommended

The Outreach agent only proceeds with contacts scoring ≥ 70% confidence.
