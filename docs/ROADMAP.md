# AI Control Tower Roadmap

This roadmap reflects the current repo direction and implementation state as of 2026-05-04.

The product model is:

`Scenario -> Workflow -> Step -> Tool / Prompt / Context -> Execution -> Output -> Review`

## Why The Roadmap Changed

The older repo framing treated Income Engine as the product. The current direction treats Income Engine as one important scenario inside a broader Personal Execution OS.

That shift matters because the product is solving:
- AI tool sprawl
- prompt overload
- project overload
- missing execution structure
- missing output and review loops

## Phase Status

| Phase | Name | Status | Notes |
| --- | --- | --- | --- |
| 0 | Re-audit and documentation update | Complete | Docs now reflect the scenario-first execution model. |
| 1 | Static Control Tower foundation | Complete | Dashboard, libraries, navigation, and seeded templates remain intact. |
| 2 | Personal Execution OS | Complete | Workflow sessions, step completion, output logging, blockers, pause/resume, summaries, and local persistence are implemented. |
| 3 | Scenario refactor | Complete | `Scenario` is now the top-level model and Income Engine is one scenario. |
| 4 | Context + Prompt Governance | Complete | Context records persist locally and prompts are step-aware with execution-pack support. |
| 5 | Product Development scenario | Complete | Product Development scenario and its validation workflows are seeded into the same universal system. |
| 6 | Review / Decision Intelligence | Partial | Local review generation and deterministic next actions exist; richer workflow review UX can expand further. |
| 7 | Productization readiness | Partial | Export/import/reset/demo/template-pack structure and backend migration notes exist without introducing SaaS complexity. |

## Phase 1. Static Control Tower Foundation

Goal:
Preserve and clean up the static shell without losing existing functionality.

Included:
- Dashboard shell
- Sidebar and top navigation
- Workflow library
- Prompt library
- Tool registry
- Static seed data

Done:
- Seed data remains visible and typed
- Existing browsing and prompt copy flows were preserved
- Naming moved toward Control Tower / Scenario without risky full rewrites

## Phase 2. Personal Execution OS

Goal:
Turn the app from a viewer into an executable workflow system.

Implemented:
- Workflow session creation
- Active session focus
- Step completion
- Output logging
- Blocker notes
- Pause and resume notes
- Session finishing
- Session summaries
- Local persistence with safe loading

## Phase 3. Scenario Refactor

Goal:
Replace Income Engine as the app identity with Scenario as the top-level model.

Implemented:
- `Scenario` as first-class entity
- Scenario switcher on the dashboard
- Scenario-based workflow, prompt, tool, and context views
- Legacy `INCOME_ENGINES` retained only as a compatibility adapter

## Phase 4. Context + Prompt Governance

Goal:
Reduce prompt overload by attaching prompts and context to active steps.

Implemented:
- Context manager with local persistence
- Scenario/workflow-linked context records
- Prompt metadata for purpose, version, required input, and expected output
- Step-specific prompt surfacing
- Copy execution pack action

## Phase 5. Product Development Scenario

Goal:
Validate product ideas quickly for solo entrepreneurship.

Implemented:
- Product Development scenario
- Seed workflows for intake, framing, research, economics, MVP scope, experiments, and build/kill/pivot
- Shared universal model instead of scenario-specific hardcoding

## Phase 6. Review / Decision Intelligence

Goal:
Add a review layer that reduces cognitive overload and turns outputs into next actions.

Implemented now:
- Review view
- Daily, weekly, and scenario review creation
- Blocked workflow visibility
- Recent outputs
- Decision log
- Deterministic next-action rules

Still useful later:
- Richer workflow-specific review creation UX
- More nuanced decision heuristics
- Review comparison over time

## Phase 7. Productization Readiness

Goal:
Prepare for future backend and multi-user expansion without overbuilding now.

Implemented now:
- Seed templates separated from local user data
- Export/import/reset/demo controls
- Template pack structure
- Backend migration notes in docs

Future productization work:
- Auth
- database repositories
- workspace isolation
- sharing
- multi-user support

## Current Non-Goals

- Backend-first rewrite
- auth flows in the MVP runtime
- AI API orchestration inside the app
- agent automation layer
- SaaS billing or onboarding
