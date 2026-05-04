# Data Model

## Canonical Product Flow

`Scenario -> Workflow -> Step -> Tool / Prompt / Context -> Execution -> Output -> Review`

## Canonical Interfaces

```ts
type Scenario = {
  id: string
  name: string
  description: string
  category:
    | "income-engine"
    | "product-development"
    | "life-strategy"
    | "admin-tasks"
    | "family-home"
    | "sport-health"
    | "learning"
    | "custom"
  status: "active" | "paused" | "archived"
  priority?: "low" | "medium" | "high"
  defaultWorkflowIds?: string[]
  toolIds?: string[]
  promptIds?: string[]
  nextAction?: string
  targetOutput?: string
}

type Workflow = {
  id: string
  title: string
  goal: string
  scenarioId: string
  trigger: string
  steps: WorkflowStep[]
  output: string
  successMetric: string
  frequency: string
  status: "draft" | "ready" | "active" | "archived"
  completionCriteria?: string
}

type WorkflowStep = {
  id: string
  title: string
  description: string
  toolIds: string[]
  promptIds: string[]
  contextIds?: string[]
  expectedOutput: string
  completionCriteria?: string
  launchUrl?: string
}

type Tool = {
  id: string
  name: string
  category: string
  role: string
  bestFor: string
  avoidWhen: string
  url: string
  linkedWorkflowIds: string[]
  scenarioIds?: string[]
}

type Prompt = {
  id: string
  title: string
  category: string
  content: string
  scenarioId?: string
  workflowId?: string
  stepId?: string
  toolId?: string
  purpose: "research" | "planning" | "drafting" | "analysis" | "review" | "decision" | "execution"
  inputRequired: string
  expectedOutput: string
  version: string
}

type ContextRecord = {
  id: string
  title: string
  content: string
  type:
    | "project"
    | "personal"
    | "business"
    | "customer"
    | "technical"
    | "decision"
    | "reference"
  scenarioId?: string
  workflowId?: string
  stepId?: string
  promptId?: string
  toolId?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

type WorkflowSession = {
  id: string
  scenarioId: string
  workflowId: string
  status: "active" | "paused" | "blocked" | "completed"
  startedAt: string
  updatedAt: string
  completedAt?: string
  currentStepId?: string
  stepExecutions: StepExecution[]
  outputs: OutputRecord[]
  blockerNote?: string
  resumeNote?: string
  summary?: string
}

type StepExecution = {
  id: string
  sessionId: string
  workflowId: string
  stepId: string
  status: "not-started" | "active" | "completed" | "blocked" | "skipped"
  startedAt?: string
  completedAt?: string
  outputIds: string[]
  note?: string
}

type OutputRecord = {
  id: string
  sessionId: string
  stepId?: string
  scenarioId: string
  workflowId: string
  type: "note" | "decision" | "link" | "artifact" | "summary"
  title: string
  content: string
  createdAt: string
  updatedAt: string
  toolId?: string
  promptId?: string
}

type ReviewRecord = {
  id: string
  type: "daily" | "weekly" | "scenario" | "workflow"
  scenarioId?: string
  workflowId?: string
  sessionIds: string[]
  outputIds: string[]
  decisions: string[]
  blockers: string[]
  nextActions: string[]
  createdAt: string
}
```

## Library vs Execution Split

### Library Layer
- scenarios
- workflows
- steps
- prompts
- tools
- seeded context

These are stable templates.

### Execution Layer
- workflow sessions
- step executions
- output records
- review records
- user-added context

These are mutable user records.

## Persistence Model

Current persisted workspace shape:

```ts
type ControlTowerState = {
  version: number
  selectedScenarioId: string
  selectedWorkflowId: string
  activeSessionId?: string
  sessions: WorkflowSession[]
  contexts: ContextRecord[]
  reviews: ReviewRecord[]
}
```

## Migration Notes

- `scenarioId` is canonical
- `incomeEngineId` should not be used in new code
- legacy `INCOME_ENGINES` exists only as a compatibility adapter
- local storage is the MVP persistence boundary until backend repositories exist
