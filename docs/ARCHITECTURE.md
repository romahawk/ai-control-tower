# AI Command Center Architecture

## Current Frontend Architecture Assumptions
- Current app is a frontend-only Next.js app using the `app/` directory.
- UI is component-driven, with view modules under `components/views/`.
- App state is local React state with mock data in [`lib/mock-data.ts`](/d:/MazurykOS/01_Projects/IT-Projects-dev/ai-control-tower/lib/mock-data.ts:1).
- Existing views already map loosely to the future product:
  - Dashboard
  - Prompt Library
  - Execution Panel
  - Context Manager
  - Tool Launcher
- Current runtime behavior is static or simulated, which aligns with the planned MVP.

## Proposed Product Architecture
The product should remain frontend-first for MVP, but the information model should shift from isolated screens to a shared workflow system.

Recommended top-level structure:
- `Dashboard`: overview of active engines, workflows, and next actions.
- `Tool Registry`: searchable list of tools with launch metadata.
- `Workflow Library`: reusable execution systems grouped by outcome.
- `Prompt Library`: prompt assets linked to steps and tools.
- `Income Engines`: outcome dashboards for agency, job search, products, and trading.
- `Decision Router`: lightweight intake that recommends the next workflow or step.
- `Context Manager`: active project, goal, and constraint context.
- `Execution Panel`: focused run mode for a chosen workflow step.

## Main Modules
### Dashboard
- Shows current priorities, recent outputs, and next-best actions.
- Aggregates from workflows, engines, and decision history.

### Tool Registry
- Stores tool metadata, categories, launch URLs, and usage notes.
- Supports direct launch and filtering by workflow compatibility.

### Workflow Library
- Stores workflow definitions, step order, inputs, outputs, and related prompts.
- Should become the main organizing layer of the product.

### Prompt Library
- Stores reusable prompt assets with variables, categories, and linked workflow steps.
- Should support copy-first usage before native execution exists.

### Income Engines
- Organizes workflows around business outcomes rather than tool types.
- Tracks which workflows belong to Web Agency, Job Search, Product Building, and Trading Systems.

### Decision Router
- Maps user intent or current bottleneck to a recommended engine, workflow, or step.
- MVP can be rules-based and static.

### Context Manager
- Holds active project, goals, constraints, and other working context.
- Supplies shared context to workflows and prompts.

### Execution Panel
- Presents the current step, recommended prompt, tool, and expected output.
- Later becomes the main run surface for guided execution.

## Data Flow
1. User selects or is routed into an `IncomeEngine`.
2. Engine surfaces relevant `Workflow` records.
3. Workflow exposes ordered `WorkflowStep` items.
4. Each step references one or more `Tool` and `Prompt` entities.
5. User launches an external tool or copies a prompt.
6. User produces an `Output`.
7. User optionally records a `DecisionLog`.
8. Dashboard and review views summarize the latest state.

## Component Responsibility Map
| Module | Primary responsibility | Inputs | Outputs |
| --- | --- | --- | --- |
| Dashboard | Show system status and next actions | Engines, workflows, outputs, decisions | Prioritized actions |
| Tool Registry | Launch and organize tools | Tool records | External launch events |
| Workflow Library | Browse and select workflows | Workflow records | Active workflow selection |
| Prompt Library | Browse and copy prompts | Prompt records | Copied prompt, selected prompt |
| Income Engines | Group work by economic objective | Engine records, linked workflows | Engine status and entry points |
| Decision Router | Reduce uncertainty about next step | Active context, goal, engine | Recommended workflow or prompt |
| Context Manager | Maintain current operating context | Project, goals, constraints | Active context set |
| Execution Panel | Run step-by-step execution | Workflow step, prompt, tool, context | Output, completion state |

## Future Backend/API Considerations
- Store canonical records for tools, workflows, prompts, outputs, and decisions.
- Support user-owned customization without changing base templates.
- Add workflow execution history and status tracking.
- Expose API-ready workflow schemas for future automation or agent runners.
- Separate static system templates from user-generated instances.

## State Management Notes
- MVP can continue using local state plus typed mock data.
- Prefer normalized domain objects over view-specific mock structures.
- Keep selection state local to pages where possible.
- If multiple modules need shared live state, introduce a thin app-level store only after the data model stabilizes.
- Treat local storage as the first persistence layer before any backend work.

## Scalability Considerations
- Design entities so one prompt can belong to multiple workflows and one workflow can belong to multiple engines.
- Separate template definitions from execution history early.
- Keep workflow steps declarative so they can later power automation or export.
- Avoid UI logic that assumes a single external tool per step.
- Preserve stable IDs and schemas to support later import/export, APIs, and multi-user features.
