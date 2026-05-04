export type ViewType =
  | "dashboard"
  | "prompts"
  | "execution"
  | "contexts"
  | "tools"
  | "workflows"
  | "reviews"
  | "wiki"
  | "settings"

export type ScenarioCategory =
  | "income-engine"
  | "product-development"
  | "life-strategy"
  | "admin-tasks"
  | "family-home"
  | "sport-health"
  | "learning"
  | "custom"

export type ScenarioStatus = "active" | "paused" | "archived"
export type PriorityLevel = "low" | "medium" | "high"
export type WorkflowStatus = "draft" | "ready" | "active" | "archived"
export type SessionStatus = "active" | "paused" | "blocked" | "completed"
export type StepExecutionStatus = "not-started" | "active" | "completed" | "blocked" | "skipped"
export type OutputType = "note" | "decision" | "link" | "artifact" | "summary"
export type ReviewType = "daily" | "weekly" | "scenario" | "workflow"
export type PromptPurpose =
  | "research"
  | "planning"
  | "drafting"
  | "analysis"
  | "review"
  | "decision"
  | "execution"
export type ContextType =
  | "project"
  | "personal"
  | "business"
  | "customer"
  | "technical"
  | "decision"
  | "reference"

export interface Tool {
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

export interface Prompt {
  id: string
  title: string
  category: string
  content: string
  scenarioId?: string
  workflowId?: string
  stepId?: string
  toolId?: string
  purpose: PromptPurpose
  inputRequired: string
  expectedOutput: string
  version: string
  tags?: string[]
}

export interface WorkflowStep {
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

export interface Workflow {
  id: string
  title: string
  goal: string
  scenarioId: string
  trigger: string
  steps: WorkflowStep[]
  output: string
  successMetric: string
  frequency: string
  status: WorkflowStatus
  completionCriteria?: string
}

export interface Scenario {
  id: string
  name: string
  description: string
  category: ScenarioCategory
  status: ScenarioStatus
  priority?: PriorityLevel
  defaultWorkflowIds?: string[]
  toolIds?: string[]
  promptIds?: string[]
  nextAction?: string
  targetOutput?: string
  createdAt?: string
  updatedAt?: string
}

export interface ContextRecord {
  id: string
  title: string
  content: string
  type: ContextType
  scenarioId?: string
  workflowId?: string
  stepId?: string
  promptId?: string
  toolId?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface StepExecution {
  id: string
  sessionId: string
  workflowId: string
  stepId: string
  status: StepExecutionStatus
  startedAt?: string
  completedAt?: string
  outputIds: string[]
  note?: string
}

export interface OutputRecord {
  id: string
  sessionId: string
  stepId?: string
  scenarioId: string
  workflowId: string
  type: OutputType
  title: string
  content: string
  createdAt: string
  updatedAt: string
  toolId?: string
  promptId?: string
}

export interface WorkflowSession {
  id: string
  scenarioId: string
  workflowId: string
  status: SessionStatus
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

export interface ReviewRecord {
  id: string
  type: ReviewType
  scenarioId?: string
  workflowId?: string
  sessionIds: string[]
  outputIds: string[]
  decisions: string[]
  blockers: string[]
  nextActions: string[]
  createdAt: string
}

export interface ControlTowerState {
  version: number
  selectedScenarioId: string
  selectedWorkflowId: string
  activeSessionId?: string
  sessions: WorkflowSession[]
  contexts: ContextRecord[]
  reviews: ReviewRecord[]
}

export interface IncomeEngine {
  id: string
  name: string
  priority: string
  description: string
  status: string
  activeWorkflowId: string
  nextAction: string
  targetOutput: string
  linkedWorkflowIds: string[]
}

export interface ActiveWorkflowSession {
  workflowId: string
  currentStepIndex: number
  startedAt: string
  completedStepIds: string[]
  outputs: WorkflowSessionOutput[]
  blockerNote: string
  sessionSummary: string
  status: "active" | "blocked" | "completed"
  lastUpdatedAt: string
  completedAt?: string
}

export interface WorkflowSessionOutput {
  id: string
  stepId?: string
  type: string
  title: string
  value: string
  note?: string
  createdAt: string
}
