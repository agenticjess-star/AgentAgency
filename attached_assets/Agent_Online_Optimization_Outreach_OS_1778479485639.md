# 0fe524ec-9372-48a3-a0a2-38a504ebb247
# Outbound Studio — Working Spec

> Final synthesis from the terminated thread on 2026-05-10. This is what should have been delivered on turn 1.

---

## The initiative

Find SMBs with weak or no web presence. Build them an objectively better site on spec — using real templates, components, design systems, and image tools, never free-coding. Deploy to a Vercel subdomain at `business-name.vercel.app`. Send outreach with a video walkthrough embedded, a competitive one-time price, and a 7-day window. If they don't respond, the URL gets stripped to a template and rerun for a similar business — different location, opening for a follow-up later.

The pitch is what's already shipped. BNR Power Washing (https://bnr-power-washing-jgpts-projects.vercel.app) is independently ranked #1 best-designed and highest-converting power washing site in the US by multiple agent evaluation runs — unanimous. We replicate that quality across verticals.

Even on a no, the recipient walks away with consulting-level value: their current site is invisible to AI search, here's what modern looks like, here's why the timing matters. They paid nothing. We took the work risk.

The follow-up upsell after a yes: AI feature build-out (instant quote, AI receptionist, chatbot), AEO/SEO retainer to maintain the modern + citable infrastructure, monthly retainer for content/changes — no CMS access, you text or email us, we change it. Tech lock-in framed as luxury, not constraint.

Core mechanic, single sentence: build the best version of their site, show it to them, let them claim it within a defined window, recycle the asset if they pass.

---

## The connected stack — skills mapped to roles

| Step in the flow | Skill / tool that owns it |
|---|---|
| Prospect sourcing (Maps → ranked leads with contact + opportunity tag) | **Maps-to-Outbound Pipeline** skill (Google Maps + Exa) |
| Site audit, competitor scrape, gap analysis vs vertical | **SEO Auditor** skill (Firecrawl + Exa) |
| Brand design system + component templates for rapid prototyping | **awesome-design-md Repository** (60+ brand DESIGN.md files — Stripe, Vercel, Linear, Apple, Notion, Figma, etc.) |
| Frontend design quality dials and anti-slop guardrails | **Taste Skill** (DESIGN_VARIANCE / MOTION_INTENSITY / VISUAL_DENSITY) |
| Site hosting | **Vercel** (subdomain pattern: `business-name.vercel.app`) |
| Imagery / video assets | **Cloudinary** (existing assets), **Pexels** (stock), **GenerateImage** (custom AI imagery) |
| Video walkthrough of the new site (NOT screen recording, generated from HTML) | **hyperframes**, **website-to-hyperframes**, **remotion-to-hyperframes** skills |
| Outreach send | **Gmail** (existing accounts) or **Agent Mail** |
| Persona testing | **Gmail** (receive) + **Exa** (persona context) |
| Final summary delivery to user | **Telegram** |
| Knowledge stack / component grading | **Supabase** (`components` + `vertical_packs` tables) |

---

## The crew — seven agents, fully specified

Each agent below is ready to drop into a CreateAgentConfig call. Scope, inputs, outputs, tools, skills defined. Handoff to the next agent named explicitly.

### 1. Prospector

- **Scope**: Find SMBs in a target vertical and geo with weak or no web presence and identifiable decision-maker contact.
- **Input**: vertical category + geo (e.g., `power_washing` in `Houston, TX`)
- **Output**: Lead pack — business name, URL, sector, decision-maker contact (email + phone), opportunity tag (`no_website` / `weak_website` / `outdated` / `not_ai_citable`)
- **Tools**: Google Maps, Exa
- **Skill**: Maps-to-Outbound Pipeline
- **Handoff**: scored lead JSONL → Strategist

### 2. Strategist

- **Scope**: Build a complete dossier on the target — their existing site, brand voice, services, customer-pain themes from reviews, and a side-by-side gap analysis vs top 3-5 local competitors.
- **Input**: Lead JSON from Prospector
- **Output**: Target dossier — business info, services list, brand voice samples, top review themes, competitor list with comparison table, gap inventory (what they're missing vs competitors), industry-norm content map (what every site in this vertical needs to have)
- **Tools**: Firecrawl (full-site crawl), Exa (semantic competitor search + industry research), Browserbase (any JS-rendered site that Firecrawl can't handle)
- **Skill**: SEO Auditor
- **Handoff**: `dossier.md` + `competitor_comparison.json` → Builder

### 3. Builder

- **Scope**: Rapid-prototype an objectively better site using templates + design system + components. Never free-code. Deploy to Vercel at `business-name.vercel.app`.
- **Input**: Target dossier from Strategist
- **Output**: Live Vercel URL, GitHub repo, asset manifest (Cloudinary assets, AI-generated imagery, schema + llms.txt baked in), site source code
- **Tools**: GitHub, Vercel, Cloudinary, Pexels, GenerateImage
- **Skills**: awesome-design-md (pull matching brand-archetype DESIGN.md — Linear for B2B service-style, Apple for premium consumer, Stripe for trust-heavy, etc.), Taste Skill (apply design dials matched to brand archetype)
- **Handoff**: site URL + GitHub repo + asset manifest → Auditor

### 4. Auditor

- **Scope**: Verify the new site closes every item in the gap inventory, beats competitors on simulated customer journey, has clean AI-citable infrastructure (schema, llms.txt, crawler allowlist), and renders correctly across breakpoints.
- **Input**: Site URL + target dossier + competitor list
- **Output**: Audit report — `gaps_closed: bool` per item, competitor comparison scores, agent customer-journey grade (clarity / trust / ease / confidence), responsive verification at 375 / 768 / 1440, AI-citability checklist
- **Tools**: Browserbase (responsive screenshots, interactive checks), Exa (re-run competitor comparison against the new site)
- **Skills**: SEO Auditor (re-run against the new site to confirm scores), Taste Skill (design-dial verification)
- **V2 upgrade**: Monte Carlo customer-journey simulation as the actual quality gate — agent swarms of the target's typical customer, going on their typical shopping journey, logging clarity / trust / ease / confidence. Iterate Builder until the simulation grades the new site above the competitor set. This is the differentiator that turns subjective quality into empirical quality.
- **Handoff**: pass-flag + audit report → Packager. Fail-flag + fix-list → back to Builder.

### 5. Packager

- **Scope**: Generate a video walkthrough of the new site. Draft the outreach email with the live URL, video embed, price, and 7-day window framing.
- **Input**: Site URL + audit report + decision-maker contact + brand voice notes
- **Output**: Email draft (subject + body + video embed link + live URL + price + 7-day window dates), video file
- **Tools**: Gmail / Agent Mail
- **Skills**: hyperframes, website-to-hyperframes (turns the live site into a walkthrough video — no screen recording needed), remotion-to-hyperframes (motion graphics if the brand archetype calls for them)
- **Handoff**: email draft + video URL + send target → Persona Tester

### 6. Persona Tester

- **Scope**: Receive the email as the target's business owner would. RAG'd on the target's business context from Strategist's dossier. Identify clarity issues, friction, confusion, anything that drops trust.
- **Input**: Email draft + target persona context from dossier
- **Output**: Persona review — clarity score, trust score, confidence-to-reply score, red flags + suggested fixes
- **Tools**: Gmail (receive), Exa (re-up persona context)
- **Skills**: none — pure reasoning agent
- **Handoff**: green-light → Conductor. Fix-list → back to Packager (loop until green).

### 7. Conductor

- **Scope**: Final QA on the entire package (site URL, video, email, audit report). Honest look-over. Notify user via Telegram with everything in one summary message: pipeline-ready, awaiting user confirm-to-send.
- **Input**: Full package from previous agents
- **Output**: Telegram message to user with target name, site URL, video URL, email draft preview, price tier, 7-day window dates, approve-to-send CTA
- **Tools**: Telegram
- **Skills**: none — reasoning + delivery agent
- **Handoff**: user confirms → email sends. User requests changes → loops back to the relevant agent.

---

## Knowledge stacking — library + grading

Two living libraries the system writes to and reads from on every run, so each successive build is faster and better than the last.

**Component library** (`Supabase: components`)

Every component used in any build gets logged with:
- `id` (unique)
- `archetype` (hero, pricing, services, gallery, testimonials, faq, cta_block, etc.)
- `vertical_fit[]` (which verticals it suits: `service`, `food`, `retail`, `barber`, etc.)
- `source` (which DESIGN.md it came from, or which build it was extracted from)
- `user_rating` (1-5, user grades after the build ships)
- `last_used` (timestamp)
- `win_rate` (% of deals closed where this component was in the build)

Builder reads the library with preference-weighted retrieval: when multiple components match the archetype + vertical, the highest-rated and highest-win-rate version gets used.

**Vertical pack library** (`Supabase: vertical_packs`)

Per-vertical research done once and reused on every lead in that vertical:
- industry norms (what every site in this vertical has)
- must-have sections
- competitor archetypes (the 3-5 patterns competitors fall into)
- proven hooks (which gap framings have closed deals)
- pricing benchmarks for that vertical

First vertical (power washing) is built from BNR + the Houston competitor scrape. Second vertical onwards is much faster because the template + grading rubric + research scaffolding is already in place.

**The user is the grader.** After every build ships (or every batch), the user grades the components and the build itself 1-5. Those grades feed preference-weighting for Builder. The user's taste becomes the system's taste, compounding.

---

## Pricing reference

Verified from 11 independent live agency price cards in May 2026 (Clutch, GoodFirms, WebFX, WebCostEstimator, Codivox, ConversionCrush, Optimum Web, HelloSEO, Brandify, Citelayer, Fiverr).

| Offer | A/B test arms |
|---|---|
| Core build (5 pages, AI-optimized, deployed) | $1,997 / $2,497 |
| Premium build (conversion-focused + AEO infrastructure baked in) | $3,997 / $4,997 |
| Maintenance retainer (security, uptime, content edits, monthly report) | $97/mo |
| SEO retainer (above + local SEO on-page + GBP optimization + schema) | $297/mo |
| AEO Growth retainer (above + AI-visibility tracking + 1 blog post/mo) | $497 / $597/mo |
| AI Quote Tool one-time install (custom, conversion-focused, not SaaS template) | $797 / $997 |

**Market gap**: freelancer tier ($800-$5K) delivers no strategy. Boutique agency floor ($5K-$15K) is out of reach for trades SMB. The $1,997-$2,497 productized AI-augmented build sits cleanly in the gap — undercuts boutique by 50-60% without dropping into "no strategy" freelancer territory.

**Framing rules locked from research**:
- "Launch audit" bundled into month 1 — never billed as a separate setup fee. SMB buyers have been burned by setup fees that deliver nothing.
- Month-to-month cancellation on retainers. Trades SMB retainer churn is real; lower the barrier to entry, retain via results.
- DIY platforms (Wix/Squarespace at $23-29/mo) look cheap, but require 40-80 hours of owner time. That's $2K-$6K in hidden opportunity cost at any reasonable hourly rate. Strongest counter to "I'll just do it myself."

**Retainer tier positioning**: $497-$597/mo AEO Growth specifically undercuts Optimum Web ($490/mo SEO-only — they don't bundle AEO infrastructure) and HelloSEO ($850/mo foundational SEO), while bundling more verifiable deliverables (llms.txt, schema, AI-crawler allowlist, AI-visibility monitoring). Brandify is at $497/$997/$1,997 with similar bounded-promise framing — they're the closest comp in market.

---

## AEO pitch language + differentiator framing

**AEO pitch — lock verbatim, don't paraphrase:**

> Right now, when someone asks ChatGPT for the best [service] in [city], your website is structurally invisible to it — dynamic-loading, no schema, no crawler allowlist, no llms.txt. We built this new site so AI agents can read it cleanly. The goal is to get you recommended first. It's a race, it takes time, reviews matter — but right now, you're not even on the track. This puts you in the race.

The analogy: lawyers don't promise verdicts. They promise the fight. We promise the verifiable infrastructure — llms.txt, schema, AI-crawler allowlist, comparison-friendly content, FAQ schema — that puts a business in the race for AI citations. Whether they win the race depends on the work compounding, on reviews, on consistency. We never promise rankings.

**Citable AI-search adoption stats (use in the pitch):**

- ChatGPT 900 million weekly active users as of Feb 2026, doubled in 12 months (TechCrunch)
- Google searches per US user fell ~20% YoY 2024-2025 (Datos/SparkToro via Search Engine Land)
- 37% of consumers start their searches with AI tools rather than Google (Eight Oh Two survey via Search Engine Land)
- Perplexity hit 45M MAU early 2026, 800% YoY growth (DemandSage)
- 51% of consumers changed research habits due to GenAI; 71% of those shifted to conversational query phrasing (Gartner)

**Differentiator framing:**

For the email opener:

> I didn't stop building this until agent simulations of your typical customer ranked it ahead of every competitor. Here's the link.

That converts subjective quality into empirical quality. It's not "we think this looks better." It's "we ran agent swarms simulating your customers shopping for this category, scored clarity / trust / ease / confidence across builds, iterated until your site won." No Wix template or freelancer can make that claim.

For the retainer pitch:

> No WordPress login. No plugin breaks. You text or email us a change — the AI does it instantly. You never touch a dashboard again. You're paying us so you don't have to think about your online presence.

That's tech lock-in reframed as luxury, not constraint. SMB owners hate logging into WordPress. They don't want a CMS. They want the site to work and someone else to handle it.

---

## Continuity notes — what to do in the next thread

This thread cost ~$20 and shipped no agents, no doctrine docs, no first crew run. The mechanical failure was clear: research-on-the-wrong-topics + risk-listicles + named-but-unspecified entities (Anchor, Echo, Mercer, etc. — they were research sub-agent names, not the crew agents, and the agent kept mixing them up in framing).

What the next thread should do, in order, on turn 1:

1. Read every connected skill referenced in the stack table (Maps-to-Outbound, SEO Auditor, Taste Skill, hyperframes, website-to-hyperframes, remotion-to-hyperframes, awesome-design-md). Use GetKnowledgeDetails on each. Do not skip this step. It is what was supposed to happen on turn 1 of THIS thread and didn't.

2. Web-search to verify each tool is the current best-in-class for its role. If something better has shipped, name it and substitute.

3. Propose the seven-agent crew from this doc, verify the tool/skill mappings work given what you found in step 1, and surface any concrete substitution.

4. Ask ONE question: "topology + tool assignments look right, ready to write the system prompts and create the first agent?" Then stop.

5. After approval, write the Builder agent's system prompt first — it's the highest-leverage agent. Drop into CreateAgentConfig. Test on a BNR rebuild as the regression case. If the rebuild lands within striking distance of the BNR baseline, proceed to other agents. If not, iterate Builder until it does.

What the next thread should NOT do:

- No risk listicles. No "considerations worth naming." No "partner-mode pushback" before the work has been touched. If risk has a fix, ship the fix as part of the design and never mention the risk again.
- No time language. No "this week" / "by [date]". Sequence work by entry-and-exit conditions on each agent, not by calendar.
- No go/no-go gates on decisions the user already made. The decision was "go" from turn 1. The economics clear, the proof exists (BNR is verifiable, the live URL is shareable). Stop relitigating it.
- No research on cold-email reply rates, sender warmup, deliverability, spam complaint thresholds, trademark precedent, ACPA exposure, CAN-SPAM disclosure language. Every single one of these failed the four-filter rule and burned tokens. If they ever become relevant, they belong in a v3 ops doc, not v1 critical path.
- No invented entities ("Anchor handles the pitch") without concrete scope/inputs/outputs/tools/skills. Names are placeholders for specifications. If the specification isn't written, the name shouldn't exist.

What survives from this thread:

- This doc (the spec the user actually asked for in their first message)
- Maps-to-Outbound Pipeline skill draft (Prospector's primary tool — already in the knowledge base, awaiting user save)
- The pricing reference (11 independent sources, current 2026)
- The locked AEO pitch language and the citable AI-search adoption stats
- The differentiator framing (agent-swarm-simulation customer-journey grade) and the tech-lock-in-as-luxury retainer pitch
