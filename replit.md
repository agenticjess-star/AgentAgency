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
- `artifacts/outbound-studio/src/pages/` — frontend pages (landing, dashboard, leads, runs)
- `artifacts/outbound-studio/src/index.css` — design tokens (Factory.ai aesthetic)
- `.agents/skills/outbound-studio/SKILL.md` — full system knowledge base for this product

## Architecture decisions

- **Public/private split**: Landing page is fully public. Dashboard/leads/runs require Clerk auth. Internal agent mechanics are never exposed on the public page.
- **Contract-first API**: OpenAPI spec drives all server validation (Zod) and client data fetching (React Query hooks). Never hand-write fetch calls.
- **Factory.ai aesthetic**: `#eeeeee` bg, `#fafafa` cards, `#020202` text, `#ef6f2e` Code Orange accent, Inter font, zero shadows/gradients, mono uppercase labels.
- **Clerk proxy pattern**: API server uses `publishableKeyFromHost` so the same backend works across dev preview domains and production.
- **DB first, seed early**: 10 leads + 4 pipeline runs + 8 activity items seeded for immediate dashboard utility.

## Product

- **Public landing page**: Showcases the 7-agent pipeline concept and AEO pitch without exposing mechanics. "ACCESS CONSOLE" CTA leads to auth.
- **Dashboard**: Aggregate pipeline stats (total leads, active runs, won deals, revenue, conversion rate), activity feed, vertical breakdown chart.
- **Leads console**: Searchable lead table with status pills; "Inject Lead" modal for adding new prospects; full detail view per lead with pipeline run history and "Execute Sequence" trigger.
- **Runs console**: All pipeline runs with agent telemetry, logs, generated email drafts, and audit scores.

## User preferences

- Internal system mechanics (agent names, prompts, tools) must NOT appear on the public landing page.
- Design aesthetic: strict Factory.ai technical brutalism — no shadows, no gradients, mono labels uppercase.

## Gotchas

- Do NOT restart `artifacts/outbound-studio: web` workflow while a design subagent is writing files to that artifact.
- `afterSignInUrl`/`afterSignUpUrl`/`afterSignOutUrl` do not exist in `@clerk/react` v5 — remove them from `ClerkProvider` and `UserButton`.
- `@clerk/themes` does not exist as a package — do not import from it.
- API server port is 8080 (mapped via artifact.toml to `/api` on the shared proxy at port 80).

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- See `.agents/skills/outbound-studio/SKILL.md` for the full 7-agent system knowledge base, pricing, AEO pitch, and agent handoff contracts
