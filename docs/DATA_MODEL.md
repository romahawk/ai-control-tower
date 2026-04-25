# Data Model

## Interfaces
```ts
export type ToolCategory =
  | "llm"
  | "research"
  | "orchestration"
  | "knowledge"
  | "analysis"
  | "delivery"

export type WorkflowStepType =
  | "decision"
  | "research"
  | "prompt"
  | "launch"
  | "review"
  | "output"

export type IncomeEngineType =
  | "web-agency"
  | "job-search"
  | "product-building"
  | "trading-systems"

export interface Tool {
  id: string
  name: string
  category: ToolCategory
  description: string
  launchUrl: string
  tags: string[]
  supportsCopyPaste: boolean
  notes?: string
}

export interface Workflow {
  id: string
  name: string
  description: string
  incomeEngineIds: string[]
  trigger: string
  toolIds: string[]
  promptIds: string[]
  stepIds: string[]
  primaryOutputType: string
  successMetric: string
  status?: "draft" | "active" | "archived"
}

export interface WorkflowStep {
  id: string
  workflowId: string
  order: number
  name: string
  type: WorkflowStepType
  goal: string
  toolIds: string[]
  promptId?: string
  expectedOutput: string
  instructions: string[]
}

export interface Prompt {
  id: string
  name: string
  description: string
  content: string
  tags: string[]
  variables: string[]
  recommendedToolIds: string[]
  workflowIds: string[]
}

export interface IncomeEngine {
  id: string
  name: string
  type: IncomeEngineType
  description: string
  objective: string
  workflowIds: string[]
  projectIds: string[]
  healthStatus: "green" | "yellow" | "red"
}

export interface Project {
  id: string
  name: string
  description: string
  incomeEngineId?: string
  workflowIds: string[]
  activeContext: string[]
  status: "idea" | "active" | "paused" | "done"
}

export interface DecisionLog {
  id: string
  date: string
  title: string
  context: string
  decision: string
  reason: string
  relatedEntityIds: string[]
  nextAction?: string
}

export interface Output {
  id: string
  type: string
  title: string
  summary: string
  workflowId?: string
  projectId?: string
  toolId?: string
  createdAt: string
  location?: string
}
```

## Example Objects
```ts
export const perplexity: Tool = {
  id: "tool-perplexity",
  name: "Perplexity",
  category: "research",
  description: "AI-assisted search for fast research and source gathering.",
  launchUrl: "https://perplexity.ai",
  tags: ["research", "search", "briefs"],
  supportsCopyPaste: true,
  notes: "Best used for fast discovery, sourcing, and first-pass synthesis."
}

export const openClaw: Tool = {
  id: "tool-openclaw",
  name: "OpenClaw",
  category: "orchestration",
  description: "Workflow execution and automation runtime for future-compatible flow definitions.",
  launchUrl: "https://github.com",
  tags: ["automation", "workflow", "execution"],
  supportsCopyPaste: false,
  notes: "Not required for MVP; included for automation-readiness planning."
}

export const obsidian: Tool = {
  id: "tool-obsidian",
  name: "Obsidian",
  category: "knowledge",
  description: "Knowledge base for storing research, notes, decisions, and outputs.",
  launchUrl: "https://obsidian.md",
  tags: ["notes", "knowledge", "review"],
  supportsCopyPaste: true
}

export const agencyLeadGenerationWorkflow: Workflow = {
  id: "wf-agency-lead-generation",
  name: "Agency Lead Generation",
  description: "Find, qualify, and prepare outreach-ready agency leads.",
  incomeEngineIds: ["engine-web-agency"],
  trigger: "Pipeline needs qualified leads or a new niche outreach sprint starts.",
  toolIds: ["tool-perplexity", "tool-obsidian"],
  promptIds: ["prompt-agency-lead-research"],
  stepIds: [
    "step-agency-lead-criteria",
    "step-agency-lead-research",
    "step-agency-lead-qualify",
    "step-agency-lead-hooks",
    "step-agency-lead-export"
  ],
  primaryOutputType: "qualified-lead-list",
  successMetric: "Number of qualified leads generated per session",
  status: "active"
}

export const webAgencyIncomeEngine: IncomeEngine = {
  id: "engine-web-agency",
  name: "Web Agency",
  type: "web-agency",
  description: "Income engine focused on acquiring, delivering, and compounding agency work.",
  objective: "Generate consistent client revenue through repeatable service workflows.",
  workflowIds: [
    "wf-agency-lead-generation",
    "wf-product-case-study-extraction",
    "wf-weekly-income-engine-review"
  ],
  projectIds: ["project-agency-growth"],
  healthStatus: "yellow"
}
```

## Modeling Notes
- `Workflow` is the orchestration unit.
- `WorkflowStep` is the smallest execution unit.
- `Prompt` and `Tool` are reusable dependencies that can be referenced by many workflows.
- `IncomeEngine` groups workflows by economic objective rather than by feature area.
- `Output` and `DecisionLog` are the bridge from tool usage to learning and compounding results.
