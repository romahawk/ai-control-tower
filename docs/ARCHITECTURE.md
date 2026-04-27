# AI Control Tower Architecture

## Current Implemented State
- Frontend-only Next.js app using the `app/` directory
- Static domain data in `data/`
- Shared shell in `components/app-shell.tsx`
- Main implemented surfaces:
  - Scenario-style dashboard
  - Workflow library
  - Active workflow run mode
  - Prompt library
  - Tool registry
  - Context manager placeholder
- Current run mode lives inside the workflow library, not in the legacy `execution-panel` view
- No persistence, backend, auth, or review system yet

## Product Model
The product model is now:

`Scenario -> Workflow -> Step -> Tool/Prompt/Context -> Execution -> Output -> Review`

This replaces the narrower income-engine-first framing.

## Main Modules
### Scenario Dashboard
- Shows the active scenario, next action, active workflow, and current session state

### Workflow Library
- Lists workflows grouped or filtered by scenario
- Entry point into active workflow execution

### Execution Panel
- Focused run surface for one current workflow session
- In the current implementation, this behavior lives inside the workflow library run mode

### Tool Registry
- Stores tool metadata, launch URLs, and workflow relationships

### Prompt Library
- Stores reusable prompts linked to workflows and tools

### Context Manager
- Holds notes, links, files, or docs attached to workflows and steps
- Currently only a lightweight placeholder exists in the app

### Review System
- Summarizes outputs, blockers, and next actions by scenario
- Not implemented yet

## Core Entities In Architecture
- `Scenario`: top-level operating bucket
- `Workflow`: repeatable system inside a scenario
- `Step`: ordered unit of execution
- `Tool`: launch target used during a step
- `Prompt`: reusable instruction asset
- `Context`: supporting material attached to a workflow or step
- `WorkflowSession`: active run state for a workflow
- `Output`: artifact produced during execution
- `Review`: decision layer generated from outputs and session signals

## Data Flow
1. User selects or resumes a `Scenario`
2. Scenario surfaces the recommended `Workflow`
3. User starts a `WorkflowSession`
4. Session focuses on one current `Step`
5. Step exposes relevant `Tool`, `Prompt`, and `Context`
6. User executes externally and produces an `Output`
7. Outputs roll into a `Review`
8. Review informs the next scenario or workflow action

## Component Responsibility Map
| Module | Primary Responsibility | Current State |
| --- | --- | --- |
| Scenario Dashboard | Show active scenario and next action | Implemented, still income-engine flavored in code |
| Workflow Library | Browse workflows and start sessions | Implemented |
| Execution Panel | Run one current step at a time | Partially implemented via workflow run mode |
| Tool Registry | Launch and understand tools | Implemented |
| Prompt Library | Copy and reuse prompts | Implemented |
| Context Manager | Attach and manage context | Placeholder only |
| Review System | Summarize outputs and next moves | Missing |

## State Management Overview
Current frontend state:
- Selected view in app shell
- Selected workflow in app shell
- Active workflow session in app shell
- Local component state for filters, search, and copied prompt state

Missing state layers:
- Persistent workflow session state
- Step completion state
- Output log state
- Review state
- Scenario switching state beyond the current static dashboard framing

## Future Backend / API Considerations
- Keep template definitions separate from user/session data
- Prepare stable IDs for scenarios, workflows, steps, prompts, tools, and outputs
- Keep session state portable for local persistence first, backend later
- Make outputs and context generic across scenarios, not income-specific

## Scalability Notes
- A workflow can belong to one scenario now, but the model should allow reuse later
- A tool or prompt can support many workflows
- Context should attach at both workflow and step level
- Session state should remain independent from template definitions
- Review should aggregate from outputs rather than from raw tool usage
