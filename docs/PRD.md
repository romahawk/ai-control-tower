# AI Control Tower PRD

## Product Overview
AI Control Tower is a universal workflow execution system that organizes AI and tool usage into structured, repeatable workflows across multiple life domains.

The product helps a user move from scattered tabs, prompts, and partial systems into one clear path:

`Scenario -> Workflow -> Step -> Tool/Prompt/Context -> Execution -> Output -> Review`

## Core Problem
- AI usage is fragmented across too many tools, prompts, notes, and browser tabs.
- Users lose time deciding what to do next instead of executing the next useful step.
- Most AI workflows do not compound because outputs, context, and review loops are not structured.
- Existing systems are often narrow: prompt collections, tool launchers, or agent demos without a reliable execution layer.

## Target User
- Solo operators and small teams using AI daily
- People who need execution systems, not just reference libraries
- Users operating across multiple life domains, not only income work

Primary scenario categories:
- Income Engine
- Life Strategy
- Family & Home
- Admin Tasks
- Sport & Health
- Custom

## Core Solution
- Use `Scenario` as the top-level operating lens instead of a single income-only model.
- Organize work into reusable workflows with ordered steps.
- Keep the current step, prompt, tool, and expected output visible during execution.
- Capture outputs and review signals so AI/tool usage compounds over time.
- Reduce cognitive overload by always surfacing one current scenario, one current workflow, and one next action.

## Positioning
AI Control Tower is a universal AI workflow control system.

It is not only a prompt library, not only a tool launcher, and not only an automation shell.

It is the operating layer for structured AI-assisted execution across work and life domains.

## Core Entities
- `Scenario`: top-level operating context such as Income Engine, Admin Tasks, or Sport & Health
- `Workflow`: repeatable path to an outcome inside a scenario
- `Step`: smallest execution unit inside a workflow
- `Tool`: external app or environment used in a step
- `Prompt`: reusable instruction asset linked to a step or workflow
- `Context`: note, link, file, or document attached to a workflow or step
- `Session`: active run state for a workflow execution
- `Output`: artifact produced by a step or workflow
- `Review`: summary layer that turns outputs and execution signals into the next decision

## Current Implemented Scope
Current app state already covers:
- Static scenario-like seed data
- Dashboard / control tower
- Workflow library
- Prompt library
- Tool registry
- Active workflow run mode
- External launch links
- Copy-to-clipboard prompts
- Lightweight context placeholder screen

## MVP Scope
MVP is now defined as a static but usable scenario-based control system.

Included:
- Scenario dashboard
- Workflow library
- Active workflow session / run mode
- Tool registry
- Prompt library
- Context placeholder layer
- External tool launch links
- Copy-to-clipboard prompts

Still needed for a complete MVP execution layer:
- Step completion state
- Output logging
- Session summary
- Review view

## Non-Goals
- No backend yet
- No auth yet
- No database yet
- No autonomous agent orchestration
- No full automation engine
- No complex collaboration model

## Core User Flows
### 1. Start From Scenario
1. User opens the dashboard.
2. User sees the active scenario and next action.
3. User opens the linked workflow.
4. User starts or resumes a workflow session.

### 2. Execute One Step
1. User enters active workflow run mode.
2. User sees the current step, prompt, tool, and expected output.
3. User copies the prompt or launches the tool.
4. User completes the step and moves forward.

### 3. Reuse Across Domains
1. User switches from one scenario to another.
2. User selects a workflow for that scenario.
3. User executes with the same structured flow regardless of domain.

### 4. Turn Execution Into Outputs
1. User runs a workflow.
2. User produces an output.
3. User reviews what was produced and what to do next.

## Success Metrics
- Time-to-next-action after opening the app
- Workflow session starts per active scenario
- Prompt copy and tool launch rate inside workflow sessions
- Number of outputs captured per scenario per week
- Number of workflows completed across more than one scenario category
- Share of sessions that end in a usable output or review signal

## Future Expansion
- Local persistence for sessions, outputs, prompts, tools, and workflows
- Editable scenarios, workflows, prompts, and tools
- Context attachments at workflow and step level
- Scenario-based review system
- Automation-ready workflow schema and exports
- Multi-user and template-based productization later
