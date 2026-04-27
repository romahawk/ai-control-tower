export type ViewType =
  | "dashboard"
  | "prompts"
  | "execution"
  | "contexts"
  | "tools"
  | "workflows"
  | "settings"

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

export interface WorkflowStep {
  id: string
  title: string
  description: string
  toolIds: string[]
  promptIds: string[]
  expectedOutput: string
  launchUrl?: string
}

export interface Workflow {
  id: string
  title: string
  goal: string
  incomeEngineId: string
  trigger: string
  steps: WorkflowStep[]
  output: string
  successMetric: string
  frequency: string
  status: string
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
}
