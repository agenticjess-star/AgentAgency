# Outbound Studio

An AI-native outbound sales system — a 7-agent crew that finds SMBs with weak web presence, builds a superior version of their site on spec, and sends a targeted 7-day claim offer.

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
- Frontend: React + Vite + Tailwind, `@clerk/react`, Wouter (routing), TanStack Query
- Build: esbuild (CJS bundle)

## Where things live

- `lib/db/src/schema/` — source of truth for DB schema (`leads.ts`, `pipeline_runs.ts`, `activity.ts`)
- `lib/api-spec/openapi.yaml` — OpenAPI contract (run codegen after changes)
- `lib/api-zod/` — generated Zod schemas (from codegen)
- `lib/api-client-react/` — generated React Query hooks (from codegen)
- `artifacts/api-server/src/routes/` — Express route handlers (`leads.ts`, `runs.ts`, `pipeline.ts`)
- `artifacts/outbound-studio/src/pages/` — frontend pages (landing, dashboard, leads, runs, skills)
- `artifacts/outbound-studio/src/index.css` — design tokens (dual-theme: dark landing + light dashboard)
- `artifacts/outbound-studio/public/skills/` — public skills directory (index.json + per-agent .md files)
- `.agents/skills/outbound-studio/SKILL.md` — full 7-agent system knowledge base

## Architecture decisions

- **Public/private split**: Landing page + `/skills` directory are fully public. Dashboard/leads/runs require Clerk auth.
- **Dual theme**: Landing page uses `data-theme="dark"` (black bg, #EA580C accent) — applied per-page, not globally. Dashboard uses warm light theme (`#f0eeeb` bg, `#fafaf8` cards).
- **Contract-first API**: OpenAPI spec drives all server validation (Zod) and client data fetching (React Query hooks). Never hand-write fetch calls.
- **Design system**: JetBrains Mono for all mono labels, Inter for body. Zero shadows, zero border-radius (2px max). Uppercase mono labels everywhere.
- **Clerk proxy pattern**: API server uses `publishableKeyFromHost` so the same backend works across dev preview domains and production.
- **DB first, seed early**: 10 leads + 4 pipeline runs + 8 activity items seeded for immediate dashboard utility.

## Product

- **Public landing page**: Dark full-bleed page. Animated typewriter terminal demo, 7-agent pipeline diagram with feedback loop arrows, AEO thesis with stats, 3-tier pricing. No internal agent mechanics exposed.
- **Skills directory** (`/skills`, `/skills/:slug`): Public reference docs for all 19 skill modules. Searchable, grouped by agent, markdown-rendered detail pages fetched from `public/skills/`.
- **Dashboard**: Status band with 5 live KPIs, vertical breakdown bar chart, real-time activity feed. Collapsible sidebar, mobile bottom tab bar.
- **Leads console**: Searchable operator table with sticky header, status pills, "Inject Lead" right-side sheet, full detail view with pipeline run history and "Execute Sequence" trigger.
- **Runs console**: Audit score column with color-coded thresholds, agent progress tracker, dark terminal for telemetry logs, generated email draft viewer.

## User preferences

- Internal system mechanics (agent names, prompts, tools) must NOT appear on the public landing page.
- Design aesthetic: strict technical brutalism — no shadows, no gradients, JetBrains Mono labels, uppercase.
- Dark landing / light dashboard split — never mix the two themes.

## Gotchas

- Do NOT restart `artifacts/outbound-studio: web` workflow while a design subagent is writing files to that artifact.
- `afterSignInUrl`/`afterSignUpUrl`/`afterSignOutUrl` do not exist in `@clerk/react` v5 — remove them from `ClerkProvider` and `UserButton`.
- `@clerk/themes` does not exist as a package — do not import from it.
- API server port is 8080 (mapped via artifact.toml to `/api` on the shared proxy at port 80).
- `data-theme="dark"` wrapper is applied per-page (landing, skills) — not on the root body or a global theme toggle.
- Skills markdown files are served from `public/skills/*.md` via Vite's static asset serving (no API route needed).
- The `op-table` CSS class (defined in `index.css`) should be applied to all operator data tables — it provides sticky header, row hover, and mono column labels.
- The `status-band` / `status-band-item` CSS classes provide the KPI strip layout — use for all stat displays.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- See `.agents/skills/outbound-studio/SKILL.md` for the full 7-agent system knowledge base, pricing, AEO pitch, and agent handoff contracts
