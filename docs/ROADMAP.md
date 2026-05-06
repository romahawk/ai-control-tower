# AI Control Tower Roadmap

This roadmap defines the full strategic delivery sequence for AI Control Tower. It is the durable planning record for all phases, even when detailed implementation issues only exist for the current phase, the next phase, or an early dependency.

The product model remains:

`Scenario -> Workflow -> Step -> Tool / Prompt / Context -> Execution -> Output -> Review`

## Tracking Model

- `ROADMAP.md` stores the full strategic 12-phase plan.
- GitHub Milestones represent each phase.
- GitHub Issues are implementation units.
- GitHub Project is the live execution board and source of truth for active work state.
- Phase Epic issues summarize future phases and preserve intent before detailed work starts.
- Detailed issues should only be created for the current phase and the next phase to avoid backlog overload.

## Full Phase Roadmap

### Phase 0 - Audit

Goal:
Establish the current-state baseline, align documentation, and confirm what the product is before new implementation work continues.

Key deliverables:
- Repo and docs audit
- Current architecture and workflow inventory
- Updated planning docs aligned to the scenario-first product model

Acceptance criteria:
- Scope, terminology, and current system behavior are documented
- Gaps, risks, and immediate sequencing are visible to contributors
- The next implementation phase can start without ambiguity

Risk level:
Low

Suggested milestone name:
`Phase 0 - Audit`

Suggested epic issue title:
`Epic: Phase 0 - Audit`

### Phase 1 - Workspace Foundation

Goal:
Create the stable workspace shell, navigation, and shared structures required for all later execution features.

Key deliverables:
- Workspace shell and information architecture
- Shared navigation and layout patterns
- Base entities, storage boundaries, and seeded app foundation

Acceptance criteria:
- The app has a coherent workspace frame for future modules
- Shared UI/state patterns support adding new domains without rework
- The foundation is stable enough for project-level features

Risk level:
Low

Suggested milestone name:
`Phase 1 - Workspace Foundation`

Suggested epic issue title:
`Epic: Phase 1 - Workspace Foundation`

### Phase 2 - Projects

Goal:
Introduce project-level organization so work can be grouped, tracked, and executed within a durable project structure.

Key deliverables:
- Project entity and lifecycle
- Project list and detail surfaces
- Project-to-scenario/workflow relationships

Acceptance criteria:
- Users can create, view, and organize projects
- Projects can hold the work needed for active execution
- Project structure supports later context, goals, and review features

Risk level:
Medium

Suggested milestone name:
`Phase 2 - Projects`

Suggested epic issue title:
`Epic: Phase 2 - Projects`

### Phase 3 - Project Context Vault

Goal:
Give each project a reusable context layer so important knowledge is stored once and reused across prompts and workflows.

Key deliverables:
- Project context vault model
- Context capture and retrieval flows
- Context linkage to projects, workflows, and steps

Acceptance criteria:
- Project context can be stored and retrieved reliably
- Relevant context can be associated with active execution work
- The vault reduces repeated manual prompt assembly

Risk level:
Medium

Suggested milestone name:
`Phase 3 - Project Context Vault`

Suggested epic issue title:
`Epic: Phase 3 - Project Context Vault`

### Phase 4 - Goals + Workflow Health

Goal:
Add goal tracking and workflow health signals so users can see whether work is progressing or drifting.

Key deliverables:
- Goal model and progress tracking
- Workflow health indicators
- Signals for blocked, stale, or misaligned work

Acceptance criteria:
- Goals can be attached to project execution
- Workflow health is visible without digging through raw activity
- Users can identify where attention is needed next

Risk level:
Medium

Suggested milestone name:
`Phase 4 - Goals + Workflow Health`

Suggested epic issue title:
`Epic: Phase 4 - Goals + Workflow Health`

### Phase 5 - Scenario Home

Goal:
Create a scenario-centered home surface that helps users enter the right execution space quickly.

Key deliverables:
- Scenario home screen
- Scenario summaries and entry points
- Scenario-specific navigation and status framing

Acceptance criteria:
- Users can understand each scenario at a glance
- The home surface provides clear next actions into execution
- Scenario framing is consistent across the workspace

Risk level:
Medium

Suggested milestone name:
`Phase 5 - Scenario Home`

Suggested epic issue title:
`Epic: Phase 5 - Scenario Home`

### Phase 6 - External Systems + AI Thread Registry

Goal:
Track important outside tools and AI conversation threads so execution history is not fragmented across systems.

Key deliverables:
- External system registry
- AI thread registry
- Links between projects, workflows, outputs, and external references

Acceptance criteria:
- External systems and AI threads can be recorded in a structured way
- Users can reconnect app work with off-platform execution artifacts
- The registry supports traceability without requiring full integrations first

Risk level:
High

Suggested milestone name:
`Phase 6 - External Systems + AI Thread Registry`

Suggested epic issue title:
`Epic: Phase 6 - External Systems + AI Thread Registry`

### Phase 7 - Prompt OS + Copy Context + Prompt

Goal:
Systematize prompt usage so users can assemble the right context and prompt package with less friction and fewer mistakes.

Key deliverables:
- Prompt OS structure
- Copy context action
- Copy prompt action
- Standard prompt packaging rules

Acceptance criteria:
- Prompts can be prepared from a repeatable system instead of ad hoc assembly
- Context and prompt content are easy to copy for active execution
- Prompt usage becomes more consistent across scenarios and workflows

Risk level:
Medium

Suggested milestone name:
`Phase 7 - Prompt OS + Copy Context + Prompt`

Suggested epic issue title:
`Epic: Phase 7 - Prompt OS + Copy Context + Prompt`

### Phase 8 - Workflow Runner

Goal:
Provide a dedicated workflow execution experience that supports focused step-by-step run mode.

Key deliverables:
- Workflow runner UI
- Step progression and state handling
- Runtime actions for notes, blockers, and outputs

Acceptance criteria:
- A user can execute a workflow through a dedicated run surface
- Step state is preserved reliably throughout a session
- Execution data is captured in a way later phases can review and analyze

Risk level:
High

Suggested milestone name:
`Phase 8 - Workflow Runner`

Suggested epic issue title:
`Epic: Phase 8 - Workflow Runner`

### Phase 9 - Quick Capture + Clarify Inbox

Goal:
Create a low-friction intake layer for ideas, tasks, and raw inputs before they are fully structured.

Key deliverables:
- Quick capture entry points
- Clarify inbox
- Triage flow into projects, scenarios, goals, or workflows

Acceptance criteria:
- Users can capture incomplete inputs quickly
- Inbox items can be clarified and routed into the main system
- Capture reduces the risk of losing work before formal planning

Risk level:
Medium

Suggested milestone name:
`Phase 9 - Quick Capture + Clarify Inbox`

Suggested epic issue title:
`Epic: Phase 9 - Quick Capture + Clarify Inbox`

### Phase 10 - Outputs + Decisions + Reviews

Goal:
Turn execution artifacts into durable outputs, explicit decisions, and reusable review loops.

Key deliverables:
- Output management
- Decision logging
- Review workflows and summaries

Acceptance criteria:
- Outputs are stored in a structured and retrievable way
- Decisions can be logged with enough context to revisit later
- Reviews help convert raw execution data into next actions

Risk level:
High

Suggested milestone name:
`Phase 10 - Outputs + Decisions + Reviews`

Suggested epic issue title:
`Epic: Phase 10 - Outputs + Decisions + Reviews`

### Phase 11 - Dashboard Logic

Goal:
Make the dashboard truly operational by surfacing the most important status, bottlenecks, and next actions automatically.

Key deliverables:
- Dashboard prioritization logic
- Summary and alert rules
- Cross-project and cross-scenario visibility

Acceptance criteria:
- The dashboard reflects meaningful live execution state
- Users can identify priorities without manual synthesis
- The logic supports decision-making instead of acting as a static overview

Risk level:
High

Suggested milestone name:
`Phase 11 - Dashboard Logic`

Suggested epic issue title:
`Epic: Phase 11 - Dashboard Logic`

### Phase 12 - Settings + Wiki + Export

Goal:
Complete the operational layer for configuration, reference material, and durable data portability.

Key deliverables:
- Settings area
- Internal wiki/reference space
- Export capabilities

Acceptance criteria:
- Core workspace settings can be managed in-app
- Users have a place for durable internal reference material
- Important data can be exported for backup, migration, or sharing

Risk level:
Medium

Suggested milestone name:
`Phase 12 - Settings + Wiki + Export`

Suggested epic issue title:
`Epic: Phase 12 - Settings + Wiki + Export`

## Phase Epic Issue Template

Title:

`Epic: Phase X - [Phase Name]`

Body:

```md
## Goal

## Why it matters

## Deliverables
- [ ] ...

## Out of scope

## Acceptance criteria
- [ ] ...

## Risks

## Child issues
- [ ] To be created when phase becomes active
```

## Issue Creation Rule

Detailed issues should be created only when:
- the phase is current, or
- the phase is next, or
- a dependency must be clarified early.

Avoid creating all detailed future issues upfront. Use phase epic issues and milestone structure to preserve future intent without turning the backlog into an unmaintainable wall of tickets.

## Recommended GitHub Project Views

- Board View: grouped by status
- Roadmap View: grouped by Phase
- Current Phase View: filtered by current phase
- Backlog View: Inbox + Ready
- Done by Phase View: grouped by milestone/phase
