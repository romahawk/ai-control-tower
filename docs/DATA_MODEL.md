# Data Model

## Canonical Interfaces
```ts
export interface Scenario {
  id: string
  name: string
  description: string
  category: "income-engine" | "life-strategy" | "family-home" | "admin-tasks" | "sport-health" | "custom"
  activeWorkflowId?: string
  nextAction?: string
  linkedWorkflowIds: string[]
}

export interface Workflow {
  id: string
  title: string
  scenarioId: string
  goal: string
  trigger: string
  steps: WorkflowStep[]
  output: string
  successMetric: string
  frequency: string
  status: "draft" | "ready" | "active" | "archived"
}

export interface WorkflowStep {
  id: string
  title: string
  description: string
  toolIds: string[]
  promptIds: string[]
  expectedOutput: string
  launchUrl?: string
}

export interface Tool {
  id: string
  name: string
  category: string
  role: string
  bestFor: string
  avoidWhen: string
  url: string
  linkedWorkflowIds: string[]
}

export interface Prompt {
  id: string
  title: string
  category: string
  content: string
  linkedToolId: string
  linkedWorkflowId: string
  linkedProjectId?: string
}

export interface Context {
  id: string
  type: "note" | "link" | "file" | "doc"
  content: string
  linkedWorkflowId?: string
  linkedStepId?: string
}

export interface WorkflowSession {
  id: string
  scenarioId: string
  workflowId: string
  currentStepIndex: number
  completedStepIds: string[]
  outputs: Output[]
  status: "idle" | "active" | "blocked" | "completed"
  startedAt: string
  completedAt?: string
}

export interface Output {
  id: string
  scenarioId: string
  workflowId: string
  type: string
  title: string
  value: string
  note?: string
  createdAt: string
}

export interface Review {
  id: string
  scenarioId: string
  title: string
  summary: string
  linkedOutputIds: string[]
  nextAction?: string
  createdAt: string
}
```

## Example Objects
```ts
export const incomeEngineScenario: Scenario = {
  id: "scenario-income-engine",
  name: "Income Engine",
  description: "Revenue, career, and proof-building workflows.",
  category: "income-engine",
  activeWorkflowId: "agency-lead-generation",
  nextAction: "Resume Agency Lead Generation step 2.",
  linkedWorkflowIds: [
    "agency-lead-generation",
    "high-fit-job-discovery",
    "product-case-study-extraction",
    "trading-review"
  ]
}

export const workflowSession: WorkflowSession = {
  id: "session-agency-001",
  scenarioId: "scenario-income-engine",
  workflowId: "agency-lead-generation",
  currentStepIndex: 1,
  completedStepIds: ["agency-step-1"],
  outputs: [],
  status: "active",
  startedAt: "2026-04-27T08:00:00.000Z"
}

export const workflowContext: Context = {
  id: "context-agency-offer",
  type: "note",
  content: "Target Hamburg service businesses with weak mobile UX and outdated conversion flow.",
  linkedWorkflowId: "agency-lead-generation",
  linkedStepId: "agency-step-2"
}

export const workflowOutput: Output = {
  id: "output-agency-leads-001",
  scenarioId: "scenario-income-engine",
  workflowId: "agency-lead-generation",
  type: "lead-list",
  title: "Hamburg SME lead shortlist",
  value: "15 qualified businesses with notes and pain points",
  note: "Ready for hook drafting",
  createdAt: "2026-04-27T08:35:00.000Z"
}
```

## Modeling Notes
- `Scenario` replaces the old income-engine-first framing
- `WorkflowSession` is the live execution state and must stay separate from workflow templates
- `Output` is universal and should not assume only revenue-related value
- `Context` should attach to either a workflow or an individual step
- `Review` is a derived layer built from outputs and execution signals
