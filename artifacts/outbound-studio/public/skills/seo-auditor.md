# SEO Auditor

## Overview

The SEO Auditor skill runs a comprehensive 230+ rule technical and content audit against any website, producing a prioritized, actionable report with health scores, issue counts, and remediation steps.

## Audit categories

### Technical SEO (60 rules)
- Crawlability: robots.txt, XML sitemap, crawl budget
- Indexation: canonical URLs, noindex tags, duplicate content
- Redirects: 301 chains, redirect loops, broken links
- HTTPS: SSL certificate validity, HSTS, mixed content
- Core Web Vitals: LCP, FID/INP, CLS measured via CrUX API
- Mobile usability: viewport, tap targets, font sizes

### On-Page SEO (50 rules)
- Title tag quality and length (40–60 chars)
- Meta description presence and length
- H1–H6 hierarchy and keyword relevance
- Image alt text coverage
- Internal linking density and anchor diversity
- Word count thresholds per page type

### Structured Data (40 rules)
- Schema.org presence and type coverage
- JSON-LD syntax validation
- Required properties per schema type
- FAQPage question/answer quality
- OpenGraph and Twitter Card completeness

### AEO Readiness (30 rules)
- FAQ content targeting local intent queries
- Direct answer copy (question → answer format)
- Entity disambiguation completeness
- AI search engine citation check (3 engines)
- Knowledge panel presence

### Link Profile (30 rules)
- Referring domain count and authority
- Toxic/spammy backlinks
- Internal link orphaned pages
- Broken outbound links

### Content Quality (20 rules)
- Thin content detection (< 300 words)
- Duplicate content across pages
- Content freshness signals
- Keyword cannibalization detection

## Output format

```json
{
  "url": "https://example.com",
  "healthScore": 67,
  "issueCount": {
    "critical": 3,
    "high": 8,
    "medium": 14,
    "low": 22
  },
  "topIssues": [
    {
      "rule": "missing_faq_schema",
      "severity": "critical",
      "impact": "Not eligible for AI search citation",
      "remediation": "Add FAQPage JSON-LD with 5+ Q&A pairs"
    }
  ],
  "categoryScores": { ... },
  "aeoReadinessScore": 23
}
```

## Integration in pipeline

The SEO Auditor is called by the Strategist agent (to audit the target's existing site) and by the Auditor agent (to evaluate the built replacement site). The Strategist audit drives the blueprint. The Auditor audit determines pass/fail.
