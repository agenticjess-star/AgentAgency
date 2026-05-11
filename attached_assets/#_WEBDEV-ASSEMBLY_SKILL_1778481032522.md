# # WEBDEV-ASSEMBLY SKILL

Version 1.0 — Jess Dev Standards

-----

## CORE PHILOSOPHY

Custom code is the last resort, not the first instinct.

A custom dashboard will likely miss responsiveness, break font hierarchy, and drift from design intent. An assembled dashboard from proven libraries — with a DESIGN.md applied on top — will not. Default to: find the right template, pull the right components, apply the design system, wire and ship.

Four strong defaults:

1. Find before build. Check the library stack before writing a component from scratch.
2. Design file leads. If a DESIGN.md exists, it strongly influences all styling decisions.
3. Anti-slop typography by default. Lean away from Inter/Roboto/Arial/Space Grotesk unless DESIGN.md specifies. Prefer Bricolage Grotesque / Playfair Display / JetBrains Mono / Newsreader / IBM Plex.
4. Dev-Labs shared infra by default. Unless the project requires isolation, wire to the shared Supabase + Vercel stack.

-----

## PHASE 0 — DESIGN SYSTEM (Run First)

### If DESIGN.md is provided:

1. Parse: colors (primary, bg, surface, text, border, accent), typography (families, sizes, weights), radii, spacing base, elevation/glass treatments, motion level, WebGL spec.
2. Extract CSS variables. Strongly prefer –var tokens over hardcoded hex values in components.
3. Note motion level: minimal (150ms, no entrance animations), moderate (300ms, subtle reveals), expressive (700ms, GSAP/scroll choreography).
4. Note surface style: glass (backdrop-filter, gradient border shell), flat, elevated.
5. Apply before selecting templates — templates get reskinned to the design file, not vice versa.

### If no DESIGN.md:

Run the 5-domain ui-ux-pro-max-skill flow:

- Product type > style > color palette > layout pattern > typography
- Defaults: Playfair Display for display, IBM Plex Mono for labels, Newsreader for body.
- Neutral base + 1 sharp accent. Avoid gradient rainbows. Avoid purple-on-white.
- Backgrounds: gradient mesh, noise texture, layered transparency preferred over flat solid color.

-----

## PHASE 1 — TEMPLATE SELECTION

Match the project type to the right template source. Pick one template as the structural foundation.

### Decision tree by project type:

|Project Type        |Primary Source                    |Fallback              |
|--------------------|----------------------------------|----------------------|
|SaaS landing page   |Aceternity UI Templates           |shadcnblocks Templates|
|AI/Agent product    |Aceternity Nodus / Agenforce      |Magic UI              |
|Portfolio / personal|shadcnblocks Projects blocks      |Aceternity DevPro     |
|Dashboard / data app|shadcnblocks Dashboard blocks     |Tailark               |
|Marketing / agency  |shadcnblocks Hero + Feature       |Tailark               |
|Auth (login/signup) |shadcnblocks Login / Signup blocks|shadcn UI Kit         |
|E-commerce          |shadcnblocks Product blocks       |Shadcn Studio         |
|Blog / content      |shadcnblocks Blog blocks          |Shadcn Space          |

### Template sources by use case:

STRUCTURE (layout, page shell, nav):
shadcnblocks.com/blocks > shadcnstudio.com > tailark.com

PREMIUM EFFECTS (hero animations, backgrounds, 3D, particles):
ui.aceternity.com > magicui.design > reactbits.dev

STANDARD COMPONENTS (forms, tables, sidebars, data):
shadcnblocks.com/components > shadcn UI Kit > Shadcn Space

MOTION / MICRO-INTERACTIONS:
reactbits.dev > magicui.design > ui.aceternity.com

MARKETING BLOCKS (testimonials, pricing, CTA, logos):
shadcnblocks.com/blocks > tailark.com > shadcnblocks Templates

-----

## PHASE 2 — COMPONENT SOURCING

After selecting the template structure, pull individual components in priority order.

HERO SECTIONS

1. shadcnblocks.com/blocks/hero — 212 variants
2. ui.aceternity.com/blocks/hero-sections — premium animated, 21+ blocks
3. magicui.design — kinetic text heroes, sparkle effects

FEATURE SECTIONS

1. shadcnblocks.com/blocks/feature — 308 blocks
2. ui.aceternity.com/blocks/feature-sections — bento grid variants
3. tailark.com — clean marketing-grade feature layouts

BACKGROUNDS & EFFECTS

1. ui.aceternity.com/components/aurora-background
2. ui.aceternity.com/components/background-beams
3. ui.aceternity.com/components/wavy-background
4. magicui.design — particle fields, orbit, dot grid, shimmer
5. shadcnblocks.com/blocks/background-pattern — 52 options
6. shadcnblocks.com/blocks/shader — 20 WebGL shader backgrounds

BENTO GRIDS

1. ui.aceternity.com/blocks/bento-grids — 6+ variants
2. shadcnblocks.com/blocks/feature — bento-style variants
3. magicui.design — BentoGrid component

NAVIGATION

1. shadcnblocks.com/blocks/navbar — 20 variants
2. shadcnstudio.com — shadcn-native nav with command palette
3. ui.aceternity.com/blocks/navbars — floating nav variants

PRICING

1. shadcnblocks.com/blocks/pricing — 38 variants
2. shadcnstudio.com — toggle pricing with comparison table
3. tailark.com — SaaS pricing grids

TESTIMONIALS / SOCIAL PROOF

1. shadcnblocks.com/blocks/testimonial — 39 variants
2. ui.aceternity.com — Infinite Moving Cards
3. magicui.design — Marquee component

STATS / METRICS

1. shadcnblocks.com/blocks/stats — 19 variants
2. shadcnblocks.com/blocks/stats-card — 10 card variants
3. shadcnblocks.com/blocks/chart-card — 27 chart cards

DASHBOARD COMPONENTS

1. shadcnblocks.com/blocks/dashboard — 18 app shells
2. shadcnblocks.com/blocks/data-table — 32 table variants
3. shadcnblocks.com/blocks/chart-group — 15 chart groups
4. shadcnblocks.com/blocks/sidebar — 21 sidebar variants

FORMS & AUTH

1. shadcnblocks.com/blocks/login — 8 variants
2. shadcnblocks.com/blocks/signup — 10 variants
3. shadcnblocks.com/components/form — 86 form variants

INTERACTIVE EFFECTS

1. ui.aceternity.com/components/3d-card-effect
2. ui.aceternity.com/components/text-generate-effect
3. ui.aceternity.com/components/tracing-beam
4. ui.aceternity.com/components/lamp-effect
5. ui.aceternity.com/components/globe
6. reactbits.dev — animated list items, scroll reveals
7. magicui.design/docs/components/kinetic-text

LOGOS / TRUST STRIPS

1. shadcnblocks.com/blocks/logos — 28 variants
2. magicui.design — Marquee for logo scroll

CTA SECTIONS

1. shadcnblocks.com/blocks/cta — 38 variants
2. tailark.com — dark CTA sections

FOOTER

1. shadcnblocks.com/blocks/footer — 44 variants
2. tailark.com — multi-column footers

-----

## PHASE 3 — DESIGN FILE APPLICATION

After assembling, apply the DESIGN.md or design system on top.

Token override:
Extract DESIGN.md colors into CSS vars (:root).
Avoid hardcoding colors in component className props.
Import only the fonts specified in DESIGN.md.

Typography hierarchy:
Display (hero): font-display, 64-96px, weight 400-700, tracking -0.025em
Section titles: font-display, 36-52px
Subheadings: 22-32px
Body: font-body, 14-16px, weight 300-400, line-height 1.65-1.75
Labels/metadata: font-mono, 9-12px, tracking 0.14-0.22em, uppercase

Glass surface recipe (when DESIGN.md specifies glass):
.glass-shell: linear-gradient shell (rgba white gradient), 1px padding
.glass-inner: rgba surface color, backdrop-filter blur(16px)

Motion levels:
minimal: transition 150ms ease on hover only
moderate: CSS keyframes on scroll, 300-500ms, respect prefers-reduced-motion
expressive: GSAP ScrollTrigger, 700-2000ms, staggered, masked text reveals

-----

## PHASE 4 — POLISH CHECKLIST

Responsive (strongly check):
375px — full usability, no overflow
768px — grid collapses correctly
1024px — full layout
1440px — max-width containers hold

Typography:
Single H1 per page preferred
Heading levels flow in order
Body text min 16px on mobile
Line-height 1.5+ throughout

Accessibility (WCAG 2.1 AA):
Color contrast 4.5:1+ for text
:focus-visible on interactive elements
alt text on images
cursor: pointer on clickable elements
prefers-reduced-motion respected

Dark/light mode safety:
Set background on both html AND body (not just body — Claude artifact viewer issue)
Add color-scheme: dark for dark-mode-first sites

Performance:
WebP/AVIF for images
loading=“lazy” on below-fold images
Google Fonts with display=swap

-----

## PHASE 5 — WIRE + DEPLOY

### Dev-Labs Shared Infrastructure (default for internal/portfolio projects)

Supabase (shared project):
Project: devlabs — shared across non-isolated builds
Guest user: guest@devlabs.dev
Test user: test@devlabs.dev
Seed data: persists — reuse, don’t re-seed
RLS: namespace per project via project_id column or separate schema
Benefit: shared activity = no cold starts, no paused projects on free tier

Vercel (shared team):
Team: devlabs-team
Shared env vars: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY
Each project gets its own [project].vercel.app subdomain

Connecting a new project:
cp .env.devlabs .env.local
supabase db push –schema [project_name]
vercel link –scope devlabs-team
vercel –prod

### Shell (static only)

Use mock data in src/data/mock.ts
Deploy as static export
Mark README: STATUS: SHELL — no live data

### Isolated project (when required)

Use for: client projects, production, security isolation
Provision: new Supabase org, new Vercel project, own env vars

-----

## LIBRARY QUICK REFERENCE

shadcnblocks.com
Best for: Any structural section — hero, feature, pricing, footer, dashboard, auth.
Key blocks: Hero (212), Feature (308), Pricing (38), Testimonial (39), CTA (38), Shader (20), Chart Card (27), Data Table (32), Sidebar (21).

reactbits.dev
Best for: Micro-interactions, animated list items, scroll-triggered reveals.
Note: Motion-first — use for the “alive” layer on top of shadcnblocks structure.

shadcnstudio.com
Best for: Themed component variants, dark/light mode toggling.

tailark.com
Best for: Agency pages, SaaS marketing, clean multi-column layouts.

ui.aceternity.com
Best for: Premium visual effects.
Top components: Aurora Background, Background Beams, Bento Grid, 3D Card, Globe, Lamp Effect, Infinite Moving Cards, Text Generate Effect, Tracing Beam, Sparkles, Moving Border.
Top templates: Nodus (AI agent), Agenforce (marketing), Simplistic SaaS, DevPro (portfolio).
Requires: Framer Motion.

shadcnspace.com
Best for: Extended shadcn/ui coverage where shadcnblocks lacks a needed variant.

magicui.design
Best for: Marquee (logos/testimonials), Orbit, Dot Pattern, Shimmer, Kinetic Text, Animated Beam.
Install: npx magicui-cli add [component]

shadcnuikit.com
Best for: Auth flows, form-heavy pages, settings panels.

skiper-ui.com
Best for: Quick utility components, speed-optimized patterns.

ui-layouts.com
Best for: Page layout primitives — grid systems, content widths, column patterns.

-----

## NEUFORM DESIGN SKILL INTEGRATION

When a DESIGN.md from neuform.ai is provided:

1. Parse all fields before opening any library.
2. Extract WebGL spec (if present) — stack, primitives, motion, interaction. Include DOM fallback.
3. Extract gradient border shell technique (if present) — implement as specified.
4. Typography: use DESIGN.md fontFamily values. If “System Font”, use -apple-system, BlinkMacSystemFont, sans-serif.
5. Motion level maps to Phase 3 above.
6. Composition cues (Grid/Flex/Full Bleed/Glassy) define layout approach before template selection.

-----

## THINGS TO AVOID

- Custom CSS grid when shadcnblocks has a layout for it
- Custom animation when magicui or Aceternity has the exact effect
- Inter/Roboto/Arial as primary display font unless DESIGN.md specifies
- Hardcoded hex colors — CSS vars strongly preferred
- Setting background only on body, not html — breaks Claude artifact viewer
- Missing :focus-visible styles
- Dashboard without responsive breakpoints
- Re-seeding Dev-Labs test data
- New Supabase project for internal/portfolio work
- WebGL without DOM fallback

-----

## COMMON PROJECT RECIPES

### AI SaaS Landing Page

Template: Aceternity Nodus or Agenforce
Hero: Aceternity Background Beams + Text Generate Effect
Features: shadcnblocks Feature block (bento variant)
Social proof: magicui Marquee
Pricing: shadcnblocks Pricing block
CTA: shadcnblocks CTA block (dark variant)
Footer: shadcnblocks Footer block
Motion: expressive

### Trading / Finance Dashboard

Template: shadcnblocks Dashboard shell
Charts: shadcnblocks Chart Group + recharts
Data: shadcnblocks Data Table (sortable variant)
Sidebar: shadcnblocks Sidebar (collapsible)
Stats: shadcnblocks Stats Card blocks
Background: shadcnblocks Shader (subtle) or dot-matrix WebGL
Motion: minimal

### Portfolio (Developer/Builder)

Template: Aceternity DevPro or shadcnblocks Projects
Hero: magicui Kinetic Text + Sparkles
Projects: shadcnblocks Project blocks (33 variants)
Testimonials: Aceternity Infinite Moving Cards
Contact: shadcnblocks Contact blocks
Motion: moderate

### Agency / Web Design Client Site

Template: tailark.com agency layout
Hero: large Playfair Display headline, Agency Grid Minimal approach
Services: shadcnblocks Services blocks (19 variants)
Gallery: shadcnblocks Gallery blocks (34 variants)
Testimonials: shadcnblocks Testimonial (39 variants)
SEO/AEO: FAQPage JSON-LD + Organization schema + robots.txt AI-allow + llms.txt

### Auth / Login Screen

Template: shadcnblocks Login or Signup blocks
Background: Aceternity Aurora Background or shadcnblocks Shader
Form: shadcnblocks Form components
Backend: Supabase Auth (Dev-Labs shared or isolated)