# AI Control Tower Roadmap

## Phase 1 - Static System
### Goal
Ship a usable static control tower for browsing scenarios, workflows, tools, and prompts.

### Features
- Static data layer
- Dashboard / control tower
- Workflow library
- Tool registry
- Prompt library
- External launch links
- Copy-to-clipboard prompts

### Acceptance Criteria
- User can browse workflows, prompts, and tools
- User can open external tools from workflow and tool views
- User can copy prompts directly from the app

### Status
- Done

### Notes
- Implemented, but still framed in code as income-engine-heavy rather than universal scenario-first

## Phase 2 - Execution Layer
### Goal
Turn the static system into a guided execution system.

### Features
- Active workflow session / run mode
- Current-step focus
- Step navigation
- Step completion state
- Output logging
- Session summary

### Acceptance Criteria
- User can start and resume a workflow session
- User can see one current step at a time
- User can mark progress inside a session
- User can log outputs during execution
- User can review a short session summary before leaving

### Status
- Partial

### Already Done
- Active workflow run mode
- Current-step focus in workflow library
- Next / previous step navigation
- Step jumping
- Prompt copy and tool launch inside run mode

### Missing
- Step completion state
- Output logging
- Blocked / resume notes
- Session summary / wrap-up
- Real review layer

## Phase 3 - Persistence + Editability
### Goal
Make the system personally durable and editable.

### Features
- Local persistence
- Editable prompts
- Editable workflows
- Editable tools
- Custom workflow variants

### Acceptance Criteria
- Scenario and session state persists across refreshes
- User can edit and save prompts, workflows, and tools
- Built-in templates remain separate from user-edited records

### Status
- Not started

### Already Done
- Static templates and shell structure are in place

### Missing
- Persistence layer
- Editable records
- Template vs user-data separation

## Phase 4 - Scenario Expansion + Context Layer
### Goal
Expand beyond income-only framing and support context-aware execution across life domains.

### Features
- Scenario layer and scenario dashboard
- Scenario switching
- Scenario-based filtering
- Context layer for workflows and steps
- Universal output system
- Scenario-based review system

### Acceptance Criteria
- User can switch between scenarios beyond income work
- Workflows, prompts, and tools can be filtered by scenario
- Context can be attached to workflows and steps
- Outputs and reviews work across all scenarios

### Status
- Not started

### Already Done
- Placeholder context manager exists
- Static workflows already hint at cross-domain expansion

### Missing
- Real scenario entity in the app
- Context attachments
- Universal outputs
- Review system

## Phase 5 - Automation Readiness
### Goal
Prepare the system for export, import, and external execution compatibility without automating in-product yet.

### Features
- Canonical schema
- CSV import/export
- OpenClaw-compatible export adapter

### Acceptance Criteria
- Workflow definitions are stable and portable
- Scenario, workflow, context, and output data can be exported/imported safely
- OpenClaw-compatible export path exists for supported workflow definitions

### Status
- Not started

### Already Done
- Static template data gives a starting structure

### Missing
- Canonical normalized schema
- Import/export pipeline
- Automation compatibility layer

## Phase 6 - Productization
### Goal
Turn the single-user local system into a product-ready platform.

### Features
- Multi-user and workspace architecture
- Template packs
- Public demo mode
- Proof / case-study integration

### Acceptance Criteria
- Product boundaries for users and workspaces are defined
- Reusable template packs exist
- Demo mode shows the product clearly without setup
- Outputs can feed proof assets and case studies

### Status
- Not started

### Already Done
- Seeded workflows and prompts provide a strong starting template base

### Missing
- Workspace model
- Productized onboarding path
- Demo layer
- Proof asset layer
