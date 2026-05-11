# Outbound Studio

An AI-native outbound sales system — a 7-agent crew that finds SMBs with weak web presence, builds a superior version of their site on spec, and sends a targeted 7-day claim offer. Designed and operated like a real production agency.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5 + `@clerk/express` (auth middleware)
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec → `lib/api-spec/openapi.yaml`)
- Frontend: React + Vite + Tailwind, `@clerk/react`, Wouter (routing), TanStack Query, Framer Motion
- Build: esbuild (CJS bundle)

## Where things live

- `lib/db/src/schema/` — source of truth for DB schema (`leads.ts`, `pipeline_runs.ts`, `activity.ts`)
- `lib/api-spec/openapi.yaml` — OpenAPI contract (run codegen after changes)
- `lib/api-zod/` — generated Zod schemas (from codegen)
- `lib/api-client-react/` — generated React Query hooks (from codegen)
- `artifacts/api-server/src/routes/` — Express route handlers (`leads.ts`, `runs.ts`, `pipeline.ts`, `slack.ts`)
- `artifacts/api-server/src/slack.ts` — Slack service via @replit/connectors-sdk (listChannels, getHistory, sendMessage)
- `artifacts/outbound-studio/src/pages/` — frontend pages (landing, dashboard, leads, runs, skills, agents, settings)
- `artifacts/outbound-studio/src/index.css` — design tokens (dual-theme: dark landing + light dashboard)
- `artifacts/outbound-studio/public/skills/` — public skills directory (index.json + per-agent .md files)
- `.agents/skills/outbound-studio/SKILL.md` — full 7-agent system knowledge base

## Architecture decisions

- **Public/private split**: Landing page + `/skills` directory are fully public. Dashboard/leads/runs/agents/settings require Clerk auth.
- **Dual theme**: Landing page uses `data-theme="dark"` (black bg, #EA580C accent) — applied per-page, not globally. Dashboard uses warm light theme (`#f0eeeb` bg, `#fafaf8` cards).
- **Contract-first API**: OpenAPI spec drives all server validation (Zod) and client data fetching (React Query hooks). Never hand-write fetch calls.
- **Design system**: JetBrains Mono for all mono labels, Inter for body. Zero shadows, zero border-radius (2px max). Uppercase mono labels everywhere.
- **Clerk proxy pattern**: API server uses `publishableKeyFromHost` so the same backend works across dev preview domains and production.
- **DB first, seed early**: 10 leads + 4 pipeline runs + 8 activity items seeded for immediate dashboard utility.
- **Run status values**: The actual DB/API status values are `running`, `completed`, `failed`, `paused`, `awaiting_approval` — NOT `active`/`pending`/`won`. Use `PipelineRunStatus` const from `@workspace/api-client-react` for all comparisons.
- **Slack scopes**: The Replit connector has `channels:read` + `im:read` + `chat:write`. No `groups:read` (no private channels). `not_in_channel` errors return empty arrays gracefully.
- **Integration keys**: User-configured API keys (Firecrawl, Browserbase, Supabase, Telegram) are saved to `localStorage` under `os_integration_settings`. For production, move to server env vars.

## Product

- **Public landing page**: Dark full-bleed page. Animated typewriter terminal demo, 7-agent pipeline diagram with feedback loop arrows, AEO thesis with stats, 3-tier pricing.
- **Skills directory** (`/skills`, `/skills/:slug`): Public reference docs for all 22 skill modules. Searchable, grouped by agent, markdown-rendered detail pages. New modules: AI Secretary, Business Builder, Product Manager.
- **Dashboard** (`/dashboard`): Redesigned command center. Alert strip for failed runs. 5 KPI stats. Left panel: Pipeline runs (rich cards with colored status strips + 7-step progress visualizer) + filter tabs (All/Running/Pending/Done/Failed) + Analytics tab (vertical breakdown chart). Right panel: Needs Attention queue + Quick Actions + live System Log. Click any run card → run detail.
- **Leads console** (`/leads`): Searchable operator table, status pills, "Inject Lead" right-side sheet, full lead detail with pipeline run history and "Execute Sequence" trigger.
- **Runs console** (`/runs`): 7-step pipeline progress strip per run, colored by status. Run detail: telemetry terminal, email draft viewer, audit score ring, site URL.
- **Agents console** (`/agents`): Two-tab interface. **Roster tab**: all 7 agents with numbered badges, roles, input/output contracts, connected tools, and expandable system prompts (collapsible terminal block). Each agent links to its Skill Docs. **Slack tab**: live channel list (public + DMs), dark terminal message stream with 8s auto-poll, send to any channel.
- **Settings** (`/settings`): Integration key management. Configure Firecrawl, Browserbase, Supabase (URL + anon + service keys), Telegram bot + chat ID, n8n webhook. Webhook endpoint docs. Slack status (connected via Replit). Keys saved to localStorage.

## Integration Ecosystem (Hyperagent connected tools)

31 connected integrations in the broader agent stack:
- **Web/Data**: Firecrawl, Browserbase, Serply, Exa, Google Maps, Google Drive, Google Docs, Google Sheets
- **Messaging/Social**: Slack, Telegram, Discord, Reddit, Twitter, LinkedIn, Gmail, Agent Mail
- **Payments/Commerce**: Gumroad, Zoho Invoice, Klaviyo
- **Dev/Deploy**: GitHub, Vercel, Devin MCP, Mobbin MCP
- **AI/Voice**: ElevenLabs, Vapi, OpenRouter (via Exa), Textit
- **Storage**: Supabase, Cloudinary
- **Ads/Content**: Pexels, HubSpot, Google Calendar

**Key agent invocation channels:**
- Slack: `@agent-name` in any connected channel
- Telegram: `@sage_search_jesearch_bot` + other bots
- Webhook: HTTP POST to trigger pipeline runs
- Scheduled: Daily standups + recurring sequences
- Email: Inbound email triggers

## Vision: Per-Run Slack Threads

**Future architecture**: Each pipeline run should spawn a dedicated Slack thread (7 agents, 1 thread per contract/run). The thread becomes the source of truth — agents post status, files, and decisions there. OS dashboard links directly to each run's thread. Users can click into any run and see the full team chat.

To implement:
1. When `POST /api/pipeline/trigger` creates a run, call `slack.sendMessage()` to a designated channel, save the thread `ts` back to the `pipeline_runs` table as `slackThreadTs`
2. All subsequent agent updates use `thread_ts` param on `chat.postMessage` 
3. Dashboard run cards show "View Thread" button linking to `slack://...` or the Slack webapp URL

## User preferences

- Internal system mechanics (agent names, prompts, tools) must NOT appear on the public landing page.
- Design aesthetic: strict technical brutalism — no shadows, no gradients, JetBrains Mono labels, uppercase. Zero border-radius.
- Dark landing / light dashboard split — never mix the two themes.
- Branding: "OS" orange square mark + "Outbound Studio" typemark. Clean, boutique, agency-grade.

## Gotchas

- Do NOT restart `artifacts/outbound-studio: web` workflow while a design subagent is writing files to that artifact.
- `afterSignInUrl`/`afterSignUpUrl`/`afterSignOutUrl` do not exist in `@clerk/react` v5 — remove them from `ClerkProvider` and `UserButton`.
- `@clerk/themes` does not exist as a package — do not import from it.
- API server port is 8080 (mapped via artifact.toml to `/api` on the shared proxy at port 80).
- `data-theme="dark"` wrapper is applied per-page (landing, skills) — not on the root body or a global theme toggle.
- Skills markdown files are served from `public/skills/*.md` via Vite's static asset serving (no API route needed).
- The `op-table` CSS class (defined in `index.css`) should be applied to all operator data tables.
- The `status-band` / `status-band-item` CSS classes provide the KPI strip layout.
- PipelineRunStatus type: use `PipelineRunStatus.running` not `"active"`, `PipelineRunStatus.awaiting_approval` not `"pending"`.
- Slack `not_in_channel` errors return empty `[]` gracefully (bot must be invited to each channel).

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- See `.agents/skills/outbound-studio/SKILL.md` for the full 7-agent system knowledge base, pricing, AEO pitch, and agent handoff contracts
