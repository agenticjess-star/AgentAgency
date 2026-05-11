# Skill Creator

**Agent:** Platform  
**Category:** Platform · Meta  
**Status:** Production

---

## What It Does

Skill Creator is the meta-skill that lets operators build, test, and publish new agent skills into the Outbound Studio skill registry. New skills can extend any agent in the pipeline — adding new data sources, outreach formats, audit checks, or content templates.

---

## What a Skill Is

A skill is a named, versioned capability module that an agent can invoke. Skills are:
- **Composable**: stack multiple skills on a single agent
- **Testable**: each skill has a defined input/output contract
- **Publishable**: approved skills appear in this directory and are available to all runs

---

## Skill File Structure

```
skills/
├── my-skill/
│   ├── SKILL.md          # Human-readable description (this format)
│   ├── schema.json       # Input/output JSON schema
│   ├── prompt.md         # System prompt fragment for the agent
│   └── examples/
│       ├── input.json
│       └── output.json
```

---

## Creating a New Skill

**Step 1 — Define the contract**  
Write `schema.json` with `input` and `output` fields. Be explicit about required vs. optional fields.

**Step 2 — Write the prompt fragment**  
`prompt.md` is injected into the agent's system prompt when the skill is active. Keep it under 500 tokens.

**Step 3 — Add examples**  
At least one `input.json` + `output.json` pair is required for testing.

**Step 4 — Write the SKILL.md**  
Document what it does, inputs, outputs, and failure modes (this file format).

**Step 5 — Run evals**  
The skill creator runs the examples through the agent and checks output schema compliance. Pass rate must be ≥ 80% before publishing.

---

## Skill Versioning

Skills follow semantic versioning (`1.0.0`). Breaking changes to the schema require a major version bump. The registry keeps the last 3 versions of each skill active for backward compatibility.

---

## Registry API

Published skills are accessible at:
```
GET /skills/index.json          → full registry
GET /skills/:slug.md            → human-readable docs
```
