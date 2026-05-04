import { CONTEXT_RECORDS } from "@/data/contexts"
import { PROMPTS } from "@/data/prompts"
import { SCENARIOS } from "@/data/scenarios"
import { TOOLS } from "@/data/tools"
import { WORKFLOWS } from "@/data/workflows"
import { readLocalStorage, removeLocalStorage, writeLocalStorage } from "@/lib/storage"
import type {
  ContextRecord,
  ControlTowerState,
  OutputRecord,
  ReviewRecord,
  ReviewType,
  Scenario,
  StepExecution,
  StepExecutionStatus,
  Tool,
  Workflow,
  WorkflowSession,
  WorkflowStep,
} from "@/types"

export const CONTROL_TOWER_STORAGE_KEY = "ai-control-tower.local.v1"
export const CONTROL_TOWER_DATA_VERSION = 1

const defaultScenario = SCENARIOS[0]
const defaultWorkflow = WORKFLOWS.find((workflow) => workflow.scenarioId === defaultScenario?.id) ?? WORKFLOWS[0]

export function createInitialControlTowerState(): ControlTowerState {
  return {
    version: CONTROL_TOWER_DATA_VERSION,
    selectedScenarioId: defaultScenario?.id ?? "",
    selectedWorkflowId: defaultWorkflow?.id ?? "",
    activeSessionId: undefined,
    sessions: [],
    contexts: CONTEXT_RECORDS,
    reviews: [],
  }
}

export function sanitizeState(input: ControlTowerState): ControlTowerState {
  const fallback = createInitialControlTowerState()
  const selectedScenario = getScenarioById(input.selectedScenarioId) ?? getScenarioById(fallback.selectedScenarioId)
  const selectedWorkflow =
    getWorkflowById(input.selectedWorkflowId) ??
    WORKFLOWS.find((workflow) => workflow.scenarioId === selectedScenario?.id) ??
    getWorkflowById(fallback.selectedWorkflowId)

  return {
    version: CONTROL_TOWER_DATA_VERSION,
    selectedScenarioId: selectedScenario?.id ?? fallback.selectedScenarioId,
    selectedWorkflowId: selectedWorkflow?.id ?? fallback.selectedWorkflowId,
    activeSessionId: input.sessions.some((session) => session.id === input.activeSessionId)
      ? input.activeSessionId
      : fallback.activeSessionId,
    sessions: input.sessions ?? [],
    contexts: input.contexts?.length ? input.contexts : fallback.contexts,
    reviews: input.reviews ?? [],
  }
}

export function loadControlTowerState(): ControlTowerState {
  const fallback = createInitialControlTowerState()
  const parsed = readLocalStorage<ControlTowerState>(CONTROL_TOWER_STORAGE_KEY, fallback)
  return sanitizeState(parsed)
}

export function persistControlTowerState(state: ControlTowerState) {
  writeLocalStorage(CONTROL_TOWER_STORAGE_KEY, state)
}

export function resetControlTowerState() {
  removeLocalStorage(CONTROL_TOWER_STORAGE_KEY)
  return createInitialControlTowerState()
}

export function getScenarioById(scenarioId?: string) {
  return SCENARIOS.find((scenario) => scenario.id === scenarioId)
}

export function getWorkflowById(workflowId?: string) {
  return WORKFLOWS.find((workflow) => workflow.id === workflowId)
}

export function getToolById(toolId?: string) {
  return TOOLS.find((tool) => tool.id === toolId)
}

export function getContextsForStep(
  state: ControlTowerState,
  workflow: Workflow,
  step?: WorkflowStep
): ContextRecord[] {
  return state.contexts.filter((context) => {
    if (step?.id && context.stepId === step.id) {
      return true
    }
    if (context.workflowId === workflow.id) {
      return true
    }
    return context.scenarioId === workflow.scenarioId
  })
}

export function getPromptsForStep(workflow: Workflow, step?: WorkflowStep) {
  return PROMPTS.filter((prompt) => {
    if (!step) {
      return prompt.workflowId === workflow.id
    }
    return prompt.workflowId === workflow.id && (!prompt.stepId || prompt.stepId === step.id)
  })
}

export function getToolsForStep(step?: WorkflowStep): Tool[] {
  if (!step) {
    return []
  }

  return TOOLS.filter((tool) => step.toolIds.includes(tool.id))
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function makeStepExecutions(sessionId: string, workflow: Workflow, timestamp: string): StepExecution[] {
  return workflow.steps.map((step, index) => ({
    id: makeId(`step-exec-${step.id}`),
    sessionId,
    workflowId: workflow.id,
    stepId: step.id,
    status: index === 0 ? "active" : "not-started",
    startedAt: index === 0 ? timestamp : undefined,
    completedAt: undefined,
    outputIds: [],
  }))
}

export function createWorkflowSession(workflow: Workflow): WorkflowSession {
  const timestamp = new Date().toISOString()
  const sessionId = makeId(`session-${workflow.id}`)

  return {
    id: sessionId,
    scenarioId: workflow.scenarioId,
    workflowId: workflow.id,
    status: "active",
    startedAt: timestamp,
    updatedAt: timestamp,
    currentStepId: workflow.steps[0]?.id,
    stepExecutions: makeStepExecutions(sessionId, workflow, timestamp),
    outputs: [],
    blockerNote: "",
    resumeNote: "",
    summary: "",
  }
}

export function getCurrentStepIndex(session: WorkflowSession, workflow: Workflow) {
  if (!session.currentStepId) {
    return 0
  }

  const index = workflow.steps.findIndex((step) => step.id === session.currentStepId)
  return index >= 0 ? index : 0
}

function updateStepExecutionStatuses(
  stepExecutions: StepExecution[],
  targetStepId: string,
  status: StepExecutionStatus
) {
  const timestamp = new Date().toISOString()

  return stepExecutions.map((stepExecution) => {
    if (stepExecution.stepId !== targetStepId) {
      return stepExecution
    }

    return {
      ...stepExecution,
      status,
      startedAt: stepExecution.startedAt ?? timestamp,
      completedAt: status === "completed" ? timestamp : stepExecution.completedAt,
    }
  })
}

export function setSessionCurrentStep(
  session: WorkflowSession,
  workflow: Workflow,
  stepId: string
): WorkflowSession {
  const timestamp = new Date().toISOString()

  return {
    ...session,
    currentStepId: stepId,
    updatedAt: timestamp,
    status: session.status === "completed" ? "completed" : "active",
    stepExecutions: session.stepExecutions.map((stepExecution) => {
      if (stepExecution.stepId === stepId && stepExecution.status === "not-started") {
        return {
          ...stepExecution,
          status: "active",
          startedAt: stepExecution.startedAt ?? timestamp,
        }
      }

      if (
        stepExecution.stepId !== stepId &&
        stepExecution.status === "active" &&
        workflow.steps.some((step) => step.id === stepExecution.stepId)
      ) {
        return {
          ...stepExecution,
          status: stepExecution.completedAt ? "completed" : "not-started",
        }
      }

      return stepExecution
    }),
  }
}

export function addOutputToSession(
  session: WorkflowSession,
  workflow: Workflow,
  output: Omit<OutputRecord, "id" | "scenarioId" | "workflowId" | "createdAt" | "updatedAt" | "sessionId">
): WorkflowSession {
  const timestamp = new Date().toISOString()
  const newOutput: OutputRecord = {
    id: makeId("output"),
    sessionId: session.id,
    scenarioId: workflow.scenarioId,
    workflowId: workflow.id,
    createdAt: timestamp,
    updatedAt: timestamp,
    ...output,
  }

  return {
    ...session,
    updatedAt: timestamp,
    outputs: [newOutput, ...session.outputs],
    stepExecutions: session.stepExecutions.map((stepExecution) =>
      stepExecution.stepId === output.stepId
        ? {
            ...stepExecution,
            outputIds: [newOutput.id, ...stepExecution.outputIds],
          }
        : stepExecution
    ),
  }
}

export function completeSessionStep(session: WorkflowSession, workflow: Workflow, stepId: string): WorkflowSession {
  const timestamp = new Date().toISOString()
  const currentIndex = workflow.steps.findIndex((step) => step.id === stepId)
  const nextStep = currentIndex >= 0 ? workflow.steps[currentIndex + 1] : undefined
  const updatedStepExecutions = updateStepExecutionStatuses(session.stepExecutions, stepId, "completed").map(
    (stepExecution) => {
      if (nextStep && stepExecution.stepId === nextStep.id && stepExecution.status === "not-started") {
        return {
          ...stepExecution,
          status: "active" as const,
          startedAt: stepExecution.startedAt ?? timestamp,
        }
      }

      return stepExecution
    }
  )

  return {
    ...session,
    updatedAt: timestamp,
    currentStepId: nextStep?.id,
    stepExecutions: updatedStepExecutions,
  }
}

export function pauseSession(session: WorkflowSession, resumeNote: string): WorkflowSession {
  return {
    ...session,
    status: "paused",
    resumeNote,
    updatedAt: new Date().toISOString(),
  }
}

export function blockSession(session: WorkflowSession, blockerNote: string): WorkflowSession {
  return {
    ...session,
    status: "blocked",
    blockerNote,
    updatedAt: new Date().toISOString(),
    stepExecutions: session.currentStepId
      ? updateStepExecutionStatuses(session.stepExecutions, session.currentStepId, "blocked")
      : session.stepExecutions,
  }
}

export function resumeSession(session: WorkflowSession, resumeNote: string): WorkflowSession {
  const timestamp = new Date().toISOString()

  return {
    ...session,
    status: "active",
    resumeNote,
    blockerNote: "",
    updatedAt: timestamp,
    stepExecutions: session.stepExecutions.map((stepExecution) =>
      stepExecution.stepId === session.currentStepId && stepExecution.status === "blocked"
        ? {
            ...stepExecution,
            status: "active",
            startedAt: stepExecution.startedAt ?? timestamp,
          }
        : stepExecution
    ),
  }
}

export function finishSession(session: WorkflowSession, summary: string): WorkflowSession {
  const timestamp = new Date().toISOString()

  return {
    ...session,
    status: "completed",
    blockerNote: "",
    summary,
    completedAt: timestamp,
    updatedAt: timestamp,
    stepExecutions: session.stepExecutions.map((stepExecution) =>
      stepExecution.status === "completed" || stepExecution.status === "skipped"
        ? stepExecution
        : {
            ...stepExecution,
            status: stepExecution.stepId === session.currentStepId ? "completed" : stepExecution.status,
            completedAt: stepExecution.stepId === session.currentStepId ? timestamp : stepExecution.completedAt,
          }
    ),
  }
}

export function updateSessionSummary(session: WorkflowSession, summary: string): WorkflowSession {
  return {
    ...session,
    summary,
    updatedAt: new Date().toISOString(),
  }
}

export function upsertContext(
  contexts: ContextRecord[],
  contextRecord: Omit<ContextRecord, "id" | "createdAt" | "updatedAt"> & {
    id?: string
  }
) {
  const timestamp = new Date().toISOString()

  if (contextRecord.id) {
    return contexts.map((existingContext) =>
      existingContext.id === contextRecord.id
        ? {
            ...existingContext,
            ...contextRecord,
            updatedAt: timestamp,
          }
        : existingContext
    )
  }

  return [
    {
      ...contextRecord,
      id: makeId("context"),
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    ...contexts,
  ]
}

export function buildExecutionPack(
  workflow: Workflow,
  step: WorkflowStep,
  state: ControlTowerState
) {
  const tools = getToolsForStep(step)
  const prompts = getPromptsForStep(workflow, step)
  const contexts = getContextsForStep(state, workflow, step)

  return [
    `Scenario: ${getScenarioById(workflow.scenarioId)?.name ?? workflow.scenarioId}`,
    `Workflow: ${workflow.title}`,
    `Step: ${step.title}`,
    `Expected output: ${step.expectedOutput}`,
    `Recommended tools: ${tools.map((tool) => tool.name).join(", ") || "None"}`,
    `Relevant prompts:\n${prompts.map((prompt) => `- ${prompt.title}\n${prompt.content}`).join("\n\n") || "- None"}`,
    `Relevant context:\n${contexts.map((context) => `- ${context.title}: ${context.content}`).join("\n") || "- None"}`,
  ].join("\n\n")
}

export function buildReviewRecord(
  type: ReviewType,
  state: ControlTowerState,
  options?: {
    scenarioId?: string
    workflowId?: string
  }
): ReviewRecord {
  const sessions = state.sessions.filter((session) => {
    if (options?.workflowId && session.workflowId !== options.workflowId) {
      return false
    }
    if (options?.scenarioId && session.scenarioId !== options.scenarioId) {
      return false
    }
    return true
  })

  const outputs = sessions.flatMap((session) => session.outputs)
  const blockers = sessions
    .filter((session) => session.status === "blocked" && session.blockerNote)
    .map((session) => `${getWorkflowById(session.workflowId)?.title ?? session.workflowId}: ${session.blockerNote}`)
  const decisions = outputs
    .filter((output) => output.type === "decision" || /build|kill|pivot|decid/i.test(output.title))
    .map((output) => output.title)
  const nextActions = getDeterministicNextActions(state, options?.scenarioId)

  return {
    id: makeId("review"),
    type,
    scenarioId: options?.scenarioId,
    workflowId: options?.workflowId,
    sessionIds: sessions.map((session) => session.id),
    outputIds: outputs.map((output) => output.id),
    decisions,
    blockers,
    nextActions,
    createdAt: new Date().toISOString(),
  }
}

export function getDeterministicNextActions(state: ControlTowerState, scenarioId?: string) {
  const relevantSessions = state.sessions.filter((session) => !scenarioId || session.scenarioId === scenarioId)
  const outputs = relevantSessions.flatMap((session) => session.outputs)
  const nextActions: string[] = []

  const blockedSessions = relevantSessions.filter((session) => session.status === "blocked")
  if (blockedSessions.length > 0) {
    nextActions.push("Resolve the top blocker or pause the blocked session intentionally.")
  }

  const activeSessions = relevantSessions.filter((session) => session.status === "active")
  if (activeSessions.length > 1) {
    nextActions.push("Reduce parallel execution by selecting one active scenario or session as the primary focus.")
  }

  const noOutputActiveSessions = activeSessions.filter((session) => session.outputs.length === 0)
  if (noOutputActiveSessions.length > 0) {
    nextActions.push("Create one concrete output in the current active workflow before switching context.")
  }

  const productDecisionSessions = relevantSessions.filter((session) => {
    if (session.scenarioId !== "product-development") {
      return false
    }
    return session.stepExecutions.some((stepExecution) => stepExecution.stepId === "pd-decision-step-3")
  })
  if (productDecisionSessions.length > 0) {
    nextActions.push("Run a build/kill/pivot review and commit the follow-through action immediately.")
  }

  if (outputs.length >= 5 && state.reviews.length === 0) {
    nextActions.push("Create a weekly review so recent outputs turn into one decision set.")
  }

  if (nextActions.length === 0) {
    nextActions.push("Continue the next incomplete workflow step and capture a visible output.")
  }

  return nextActions
}

export function exportControlTowerData(state: ControlTowerState) {
  return JSON.stringify(state, null, 2)
}

export function importControlTowerData(rawValue: string) {
  const parsed = JSON.parse(rawValue) as ControlTowerState
  return sanitizeState(parsed)
}

export function getRecentOutputs(state: ControlTowerState, scenarioId?: string) {
  return state.sessions
    .filter((session) => !scenarioId || session.scenarioId === scenarioId)
    .flatMap((session) => session.outputs)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
}

export function getActiveSessions(state: ControlTowerState, scenarioId?: string) {
  return state.sessions.filter(
    (session) =>
      (!scenarioId || session.scenarioId === scenarioId) &&
      (session.status === "active" || session.status === "paused" || session.status === "blocked")
  )
}

export function getCompletedStepsCount(session: WorkflowSession) {
  return session.stepExecutions.filter((stepExecution) => stepExecution.status === "completed").length
}

export function getStepExecution(session: WorkflowSession, stepId?: string) {
  return session.stepExecutions.find((stepExecution) => stepExecution.stepId === stepId)
}

export function getScenarioWorkflowOptions(scenarioId: string) {
  return WORKFLOWS.filter((workflow) => workflow.scenarioId === scenarioId)
}

export function getScenarioPromptOptions(scenarioId: string) {
  return PROMPTS.filter((prompt) => prompt.scenarioId === scenarioId)
}

export function getScenarioToolOptions(scenarioId: string) {
  return TOOLS.filter((tool) => tool.scenarioIds?.includes(scenarioId))
}

export function getScenarioSummary(scenario: Scenario, state: ControlTowerState) {
  const sessions = getActiveSessions(state, scenario.id)
  const recentOutputs = getRecentOutputs(state, scenario.id)
  const blockedSessions = sessions.filter((session) => session.status === "blocked")

  return {
    sessions,
    recentOutputs,
    blockedSessions,
    nextActions: getDeterministicNextActions(state, scenario.id),
  }
}
