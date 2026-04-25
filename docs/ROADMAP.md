# AI Command Center Roadmap

## Phase 0 - Documentation & Product Alignment
### Goal
Align the repository around a clear product direction before UI or system expansion.

### Key Features
- Create core product docs
- Define entities
- Define MVP scope

### Acceptance Criteria
- `/docs` folder exists with aligned product, architecture, roadmap, workflows, data model, and decisions docs.
- Core entities are defined consistently across documents.
- MVP boundaries and non-goals are explicit enough to generate issues from.

### Risks
- Documentation drifts from the current codebase if not updated during implementation.
- Team may interpret "workflow control center" differently without continued decision logging.

## Phase 1 - Static MVP
### Goal
Ship a usable frontend-only control center that helps users choose tools, workflows, and prompts without backend complexity.

### Key Features
- Tool cards
- Workflow cards
- Prompt cards
- Income engine dashboard
- Decision router
- External launch links

### Acceptance Criteria
- User can browse tools, workflows, prompts, and income engines from the UI.
- User can open external tools from registry and workflow screens.
- User can copy prompts from both library and workflow contexts.
- Decision router can route to a recommended workflow using static logic.

### Risks
- Static UX may look more capable than it is if labels imply automation.
- Without persistence, users may expect saved progress that does not exist yet.

## Phase 2 - Execution Layer
### Goal
Turn the app from a browse-only dashboard into a guided execution surface.

### Key Features
- Active workflow mode
- Step-by-step execution panel
- Output tracking
- Weekly review view

### Acceptance Criteria
- User can enter a workflow run mode and move step by step.
- Each step clearly shows goal, tool, prompt, and expected output.
- User can log outputs manually.
- Weekly review screen summarizes outputs, blocked workflows, and next actions.

### Risks
- Execution flows may become too heavy if manual logging feels like admin work.
- Output tracking can create schema churn before persistence decisions settle.

## Phase 3 - Persistence
### Goal
Persist user systems and allow the control center to become personally useful over time.

### Key Features
- Local storage or lightweight DB
- User-customizable tools/workflows/prompts
- Basic status tracking

### Acceptance Criteria
- User-created or edited records persist across sessions.
- Workflow status can be marked as not started, active, blocked, or complete.
- User can save custom tools, prompts, and workflows without changing system templates.

### Risks
- Early persistence choices can constrain later API design.
- Local-only storage may create migration pain when multi-user support arrives.

## Phase 4 - Automation Readiness
### Goal
Prepare workflow definitions for external execution systems without building full automation in-product yet.

### Key Features
- OpenClaw-compatible workflow definitions
- CSV export/import
- API-ready workflow schema

### Acceptance Criteria
- Workflow definitions can be exported in a structured format.
- Import/export preserves stable IDs and step order.
- Schema supports tool references, prompt references, inputs, outputs, and step types.

### Risks
- Premature schema complexity can slow product iteration.
- Compatibility requirements may pull the product toward engineering needs before user value is proven.

## Phase 5 - Productization
### Goal
Turn the internal operating system into a product-ready platform.

### Key Features
- Multi-user support
- Templates
- Public demo mode
- Portfolio case study integration

### Acceptance Criteria
- Multiple users or workspaces can exist without data leakage.
- Template packs can be shared or duplicated.
- Public demo mode communicates product value without requiring setup.
- Case studies can show before/after workflow outcomes.

### Risks
- Productization can distract from proving core user behavior first.
- Multi-user support introduces auth, permissions, and support complexity quickly.
