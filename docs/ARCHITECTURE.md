# AI Control Tower Architecture

## Core Architectural Direction

The app is a frontend-only, local-first execution system.

The operating model is:

`Scenario -> Workflow -> Step -> Tool / Prompt / Context -> Execution -> Output -> Review`

The app no longer treats Income Engine as the top-level product concept. Income Engine is implemented as one scenario pack inside the larger Control Tower system.

## Current Runtime Shape

- Next.js app-router frontend
- seed templates in `data/`
- shared types in `types/`
- state and persistence logic in `hooks/` and `lib/`
- UI surfaces in `components/views/`
- no backend in the runtime path

## Major Runtime Modules

### Scenario Dashboard
Responsibilities:
- active scenario selection
- current session visibility
- next-action surfacing
- blocked session visibility
- recent outputs
- review summary visibility

### Workflow Library
Responsibilities:
- browse scenario-specific workflows
- start sessions
- resume sessions
- execute steps
- log outputs
- pause, block, resume, and finish sessions
- copy execution packs

### Prompt Library
Responsibilities:
- expose reusable prompts
- prioritize prompts for the active scenario
- retain the prompt library as a secondary global resource

### Context Manager
Responsibilities:
- manage local context records
- link context to scenario, workflow, step, tool, or prompt

### Tool Registry
Responsibilities:
- expose tools by scenario relevance
- keep tools tied to workflows, not as an unstructured app list

### Review Layer
Responsibilities:
- generate and store daily, weekly, and scenario reviews
- summarize blocked sessions and recent outputs
- produce deterministic next-action recommendations

### Settings / Productization Controls
Responsibilities:
- export workspace JSON
- import workspace JSON
- reset local workspace
- load demo workspace

## Data Boundaries

### Seed Templates
Location:
- `data/scenarios.ts`
- `data/workflows.ts`
- `data/prompts.ts`
- `data/tools.ts`
- `data/contexts.ts`
- `data/template-packs.ts`

Purpose:
- provide stable built-in templates
- preserve reproducible demo content
- remain separate from mutable user state

### User-Generated Local Data
Stored in:
- browser `localStorage`

Includes:
- active and historical workflow sessions
- outputs
- context additions
- reviews
- selected scenario/workflow

### Future Backend Layer
Not implemented yet.

Expected later responsibilities:
- auth
- remote persistence
- workspaces
- sharing
- multi-user support

## State Flow

1. User selects a `Scenario`
2. Scenario determines the visible workflow set
3. User starts a `WorkflowSession`
4. Session tracks the current `Step`
5. Step surfaces relevant `Tool`, `Prompt`, and `Context`
6. User logs `OutputRecord` entries
7. User pauses, blocks, resumes, or finishes the session
8. `ReviewRecord` entries summarize outputs and blockers into next actions

## Persistence Strategy

- `localStorage` only for MVP
- safe JSON parsing and fallback state
- explicit version field on persisted workspace state
- reset path and import/export path for future migration

## Compatibility Strategy

- legacy `INCOME_ENGINES` remains only as an adapter
- workflow/session logic uses `scenarioId` as the canonical parent
- adapters are preferred over risky broad rewrites when preserving old surfaces

## Non-Goals In Current Architecture

- global backend state
- auth-aware routing
- SaaS tenancy
- agent execution infrastructure
- heavy external state-management packages
