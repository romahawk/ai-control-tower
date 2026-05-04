# AI Control Tower PRD

## Product Summary

AI Control Tower is a local-first Personal Execution OS that helps a user organize AI tools, prompts, workflows, and context into one repeatable operating system across multiple scenarios.

The universal model is:

`Scenario -> Workflow -> Step -> Tool / Prompt / Context -> Execution -> Output -> Review`

## Core Problem

- AI usage is fragmented across too many tools, prompts, tabs, and notes.
- Users spend too much energy deciding what to do next.
- Prompt libraries alone do not create compounding value.
- Workflow systems without outputs and reviews stay shallow.
- Income-focused execution is important, but it is only one scenario among several.

## Product Positioning

AI Control Tower is not:
- just a prompt library
- just a tool launcher
- just a workflow browser
- just an automation shell

AI Control Tower is:
- a structured execution layer
- a scenario-first operating model
- a way to reduce cognitive overload
- a system that turns AI usage into outputs and review signals

## Users

Primary:
- solo founders
- solo operators using AI daily
- technical product builders
- people managing multiple active projects and domains

Secondary:
- small AI-native teams later

## Top-Level Product Model

### Scenario
The major operating context.

Examples:
- Income Engine
- Product Development
- Life Strategy
- Admin Tasks
- Family & Home
- Sport & Health
- Learning
- Custom

### Workflow
A repeatable path to an outcome inside a scenario.

### Step
The smallest guided execution unit.

### Tool / Prompt / Context
The inputs required for execution.

### Execution
The active running of a workflow session.

### Output
The artifact or decision created during execution.

### Review
The deterministic reflection layer that turns outputs into the next actions.

## Product Thesis

The system creates value when it moves the user from:

`tool overload -> workflow clarity -> visible output -> better next decision`

Without execution and review, the product becomes a reference library.

With execution and review, it becomes a compounding operating system.

## Current Scope In Repo

Implemented:
- Scenario-first dashboard
- workflow library
- prompt library
- tool registry
- context manager
- workflow sessions
- step completion
- output logging
- pause, blocker, resume, and finish state
- review layer with deterministic recommendations
- local persistence
- import/export/reset/demo workspace controls

## MVP Strategy

The MVP is intentionally local-first.

Included:
- seeded scenario and workflow templates
- local user state
- no backend dependency
- no auth dependency
- no AI API requirement

Why:
- validate the execution loop before building product infrastructure
- keep changes testable and reversible
- separate seed templates from user data early

## Non-Goals

- multi-user collaboration
- SaaS backend
- auth and billing
- agent orchestration inside the product
- prompt version history systems beyond a simple version field
- complex state-management infrastructure unless justified later

## Product Flows

### 1. Scenario To Session
1. User selects a scenario.
2. User opens a workflow.
3. User starts a workflow session.
4. User executes step by step.

### 2. Execution To Output
1. User sees the current step.
2. User sees relevant prompts, tools, context, and expected output.
3. User logs the output.
4. User marks the step complete.

### 3. Interruption Handling
1. User pauses or blocks a session.
2. User stores blocker or resume notes.
3. User resumes without reloading mental context from scratch.

### 4. Output To Review
1. Outputs accumulate across sessions.
2. User creates a daily, weekly, or scenario review.
3. The system suggests deterministic next actions.

## Success Metrics

- time to first useful action after opening the app
- session starts per week
- workflow completion rate
- outputs captured per scenario
- number of scenarios actively used
- number of reviews generated from real work

## Future Expansion

- repository/service layer for backend migration
- auth and user workspaces
- shared template packs
- multi-user support
- optional AI-assisted review generation later
