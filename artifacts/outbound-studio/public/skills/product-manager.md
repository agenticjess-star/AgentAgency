# Product Manager

Structure features, prioritize the backlog, and write PRDs for Outbound Studio improvements. Use when planning new agent capabilities, skill additions, or pipeline enhancements.

## When to Use

- Writing a spec for a new agent skill or pipeline stage
- Prioritizing improvements to the Outbound Studio dashboard
- Creating user stories for new features (leads, runs, agents)
- Planning a new vertical pack or agent integration
- Structuring a roadmap for the 7-agent pipeline

## PRD Format — Linear Project Spec (Default)

Short, outcome-focused. Problem → Proposed solution → Success metrics → Non-goals → Open questions.

```
## Problem
[What's broken or missing? Why now?]

## Proposed Solution
[What we'll build. One paragraph, no more.]

## Success Metrics
- [Measurable outcome 1]
- [Measurable outcome 2]

## Non-Goals
- [What we're explicitly NOT building]
- [Scope boundaries]

## Open Questions
- [Unknown that could block execution]
```

**Non-goals are load-bearing** — explicitly listing what you're not building is the single most effective scope-creep prevention.

## RICE Prioritization

Score = (Reach × Impact × Confidence) / Effort

| Factor | How to score |
|--------|-------------|
| Reach | Leads/runs affected per week |
| Impact | 3=massive / 2=high / 1=medium / 0.5=low |
| Confidence | 100%=data / 80%=intuition / 50%=guess |
| Effort | Person-days across all functions |

## Outbound Studio Backlog Tiers

### Now (in flight)
- Live pipeline execution with real AI agents
- Per-run Slack thread linkage
- Mobile companion app

### Next (committed)
- Real-time run progress with WebSocket streaming
- Agent roster with system prompts + input/output contracts
- Skills directory expansion (secretary, business-builder, product-manager)

### Later (directional)
- Multi-operator workspace support
- White-label output for agency resale
- Automated pricing negotiation via Conductor

## Acceptance Criteria Format

```
Given [precondition]
When [action]
Then [observable result]
And [additional result]
```

One scenario per criterion. If you can't write it as Given/When/Then, the requirement is ambiguous.

## Outbound Studio Feature Flags

When shipping new features to the pipeline:
- Flag all new agent integrations behind `FEATURE_[NAME]` env var
- Default off in production until tested on 5+ real leads
- Document handoff contract changes in `references/agent-configs.md`

## Roadmap Principles

1. **Leads first** — every feature must make it easier to find, qualify, or close leads
2. **Agents, not UI** — build AI capability first, UI is the window into it
3. **Operator experience** — the user is a sophisticated operator, not a casual user
4. **Speed beats perfection** — 5 real leads taught us more than 50 mock ones
