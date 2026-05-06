"use client"

import { useEffect, useMemo, useState } from "react"
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Copy,
  Database,
  ExternalLink,
  Flag,
  GitBranch,
  ListChecks,
  MessageSquare,
  PauseCircle,
  PlayCircle,
  Search,
  Sparkles,
} from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { ScenarioBadge } from "@/components/ui/scenario-badge"
import { SectionHeader } from "@/components/ui/section-header"
import { StatusBadge } from "@/components/ui/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { getLatestSessionForWorkflow } from "@/lib/control-tower"
import { cn } from "@/lib/utils"
import { getContextIcon, getStatusMeta } from "@/lib/ui-meta"
import type { ContextRecord, Project, Prompt, Scenario, Tool, Workflow, WorkflowSession } from "@/types"

interface WorkflowLibraryProps {
  selectedScenario: Scenario
  selectedProject?: Project
  scenarioProjects: Project[]
  workflows: Workflow[]
  selectedWorkflow: Workflow
  allSessions: WorkflowSession[]
  activeSession: WorkflowSession | undefined
  workflowSessions: WorkflowSession[]
  currentStepIndex: number
  stepPrompts: Prompt[]
  stepTools: Tool[]
  stepContexts: ContextRecord[]
  executionPack: string
  onSelectWorkflow: (workflowId: string) => void
  onOpenRunner: () => void
  onStartWorkflowSession: (workflowId: string) => void
  onSetActiveSession: (sessionId?: string) => void
  onResumeWorkflowSession: (sessionId: string, resumeNote: string) => void
  onMoveWorkflowStep: (direction: 1 | -1) => void
  onJumpToWorkflowStep: (stepId: string) => void
  onCompleteCurrentStep: () => void
  onSaveWorkflowOutput: (params: {
    title: string
    content: string
    type: "note" | "decision" | "link" | "artifact" | "summary"
    stepId?: string
    toolId?: string
    promptId?: string
  }) => void
  onBlockSession: (note: string) => void
  onPauseSession: (note: string) => void
  onResumeSession: (note: string) => void
  onFinishSession: (summary: string) => void
  onSaveSessionSummary: (summary: string) => void
  getCompletedStepsCount: (session: WorkflowSession) => number
}

type WorkflowFilter = "all" | "inbox" | "clarify" | "active" | "waiting" | "done" | "blocked"

const workflowFilters: Array<{ value: WorkflowFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "inbox", label: "Inbox" },
  { value: "clarify", label: "Clarify" },
  { value: "active", label: "Active" },
  { value: "waiting", label: "Waiting" },
  { value: "done", label: "Done" },
  { value: "blocked", label: "Blocked" },
]

const groupedStatuses: Array<{ id: Exclude<WorkflowFilter, "all">; title: string }> = [
  { id: "inbox", title: "Inbox" },
  { id: "clarify", title: "Clarify" },
  { id: "active", title: "Active" },
  { id: "waiting", title: "Waiting" },
  { id: "done", title: "Done" },
  { id: "blocked", title: "Blocked" },
]

function getBoardStatus(workflow: Workflow, session?: WorkflowSession) {
  if (session?.status === "blocked") return "blocked" as const
  if (session?.status === "active") return "active" as const
  if (session?.status === "paused") return "waiting" as const
  if (session?.status === "completed") return "done" as const
  if (workflow.status === "draft") return "clarify" as const
  return "inbox" as const
}

function CompactEmpty({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-secondary/10 px-3 py-3">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  )
}

export function WorkflowLibrary({
  selectedScenario,
  selectedProject,
  scenarioProjects,
  workflows,
  selectedWorkflow,
  allSessions,
  activeSession,
  workflowSessions,
  currentStepIndex,
  stepPrompts,
  stepTools,
  stepContexts,
  executionPack,
  onSelectWorkflow,
  onOpenRunner,
  onStartWorkflowSession,
  onSetActiveSession,
  onResumeWorkflowSession,
  onMoveWorkflowStep,
  onJumpToWorkflowStep,
  onCompleteCurrentStep,
  onSaveWorkflowOutput,
  onBlockSession,
  onPauseSession,
  onResumeSession,
  onFinishSession,
  onSaveSessionSummary,
  getCompletedStepsCount,
}: WorkflowLibraryProps) {
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<WorkflowFilter>("all")
  const [activeTab, setActiveTab] = useState("overview")
  const [previewStepId, setPreviewStepId] = useState(selectedWorkflow.steps[0]?.id ?? "")
  const [copiedPack, setCopiedPack] = useState(false)
  const [outputTitle, setOutputTitle] = useState("")
  const [outputContent, setOutputContent] = useState("")
  const [resumeDraft, setResumeDraft] = useState(activeSession?.resumeNote ?? "")
  const [blockerDraft, setBlockerDraft] = useState(activeSession?.blockerNote ?? "")
  const [summaryDraft, setSummaryDraft] = useState(activeSession?.summary ?? "")

  const filteredWorkflows = useMemo(() => {
    const search = query.trim().toLowerCase()
    return workflows.filter((workflow) => {
      const latestSession = getLatestSessionForWorkflow({ sessions: allSessions } as never, workflow.id)
      const boardStatus = getBoardStatus(workflow, latestSession)
      const matchesStatus = statusFilter === "all" || boardStatus === statusFilter
      if (!matchesStatus) return false
      if (!search) return true
      return (
        workflow.title.toLowerCase().includes(search) ||
        workflow.goal.toLowerCase().includes(search) ||
        workflow.output.toLowerCase().includes(search)
      )
    })
  }, [allSessions, query, statusFilter, workflows])

  useEffect(() => {
    if (!filteredWorkflows.some((workflow) => workflow.id === selectedWorkflow.id) && filteredWorkflows[0]) {
      onSelectWorkflow(filteredWorkflows[0].id)
    }
  }, [filteredWorkflows, onSelectWorkflow, selectedWorkflow.id])

  useEffect(() => {
    setResumeDraft(activeSession?.resumeNote ?? "")
    setBlockerDraft(activeSession?.blockerNote ?? "")
    setSummaryDraft(activeSession?.summary ?? "")
    if (activeSession?.workflowId === selectedWorkflow.id) {
      setPreviewStepId(activeSession.currentStepId ?? selectedWorkflow.steps[0]?.id ?? "")
    } else {
      setPreviewStepId(selectedWorkflow.steps[0]?.id ?? "")
    }
  }, [activeSession, selectedWorkflow])

  const workflowGroups = useMemo(
    () =>
      groupedStatuses
        .map((group) => ({
          ...group,
          items: filteredWorkflows.filter((workflow) => {
            const latestSession = getLatestSessionForWorkflow({ sessions: allSessions } as never, workflow.id)
            return getBoardStatus(workflow, latestSession) === group.id
          }),
        }))
        .filter((group) => group.items.length > 0 || statusFilter === "all" || statusFilter === group.id),
    [allSessions, filteredWorkflows, statusFilter]
  )

  const latestWorkflowSession = useMemo(
    () =>
      workflowSessions
        .slice()
        .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))[0],
    [workflowSessions]
  )

  const selectedWorkflowSession = activeSession?.workflowId === selectedWorkflow.id ? activeSession : undefined
  const activeOrLatestSession = selectedWorkflowSession ?? latestWorkflowSession
  const selectedStep = selectedWorkflowSession
    ? selectedWorkflow.steps.find((step) => step.id === selectedWorkflowSession.currentStepId) ?? selectedWorkflow.steps[0]
    : selectedWorkflow.steps.find((step) => step.id === previewStepId) ?? selectedWorkflow.steps[0]
  const currentStepExecution = selectedWorkflowSession?.stepExecutions.find((stepExecution) => stepExecution.stepId === selectedStep?.id)
  const completedStepsCount = activeOrLatestSession ? getCompletedStepsCount(activeOrLatestSession) : 0
  const progressPercent = selectedWorkflow.steps.length > 0 ? (completedStepsCount / selectedWorkflow.steps.length) * 100 : 0
  const expectedOutput = selectedStep?.expectedOutput ?? selectedWorkflow.output
  const currentProjectForWorkflow =
    scenarioProjects.find((project) => project.workflowIds.includes(selectedWorkflow.id)) ?? selectedProject
  const workflowOutputs = workflowSessions
    .flatMap((session) => session.outputs)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
  const latestOutput = workflowOutputs[0]
  const projectVaultContexts = stepContexts
    .filter((context) => currentProjectForWorkflow?.id && context.projectId === currentProjectForWorkflow.id)
    .slice(0, 3)
  const inheritedExecutionContexts = stepContexts
    .filter((context) => !currentProjectForWorkflow?.id || context.projectId !== currentProjectForWorkflow.id)
    .slice(0, 2)
  const nextActionLabel = selectedWorkflowSession
    ? selectedWorkflowSession.status === "paused"
      ? "Resume session"
      : "Continue"
    : "Start session"
  const statusLabel = selectedWorkflowSession?.status ?? getBoardStatus(selectedWorkflow, latestWorkflowSession)

  const copyExecutionPack = async () => {
    await navigator.clipboard.writeText(executionPack)
    setCopiedPack(true)
    window.setTimeout(() => setCopiedPack(false), 1500)
  }

  const saveOutput = () => {
    if (!selectedWorkflowSession || !selectedStep || outputTitle.trim() === "" || outputContent.trim() === "") return
    onSaveWorkflowOutput({
      title: outputTitle.trim(),
      content: outputContent.trim(),
      type: "artifact",
      stepId: selectedStep.id,
      toolId: stepTools[0]?.id,
      promptId: stepPrompts[0]?.id,
    })
    setOutputTitle("")
    setOutputContent("")
  }

  if (workflows.length === 0) {
    return (
      <div className="h-full overflow-auto px-4 py-4 md:px-6">
        <div className="mx-auto max-w-[1360px]">
          <EmptyState
            icon={GitBranch}
            title="No workflows yet"
            description="Create a workflow or convert a captured item into one."
            primaryAction={
              <Button onClick={() => onStartWorkflowSession(selectedWorkflow.id)}>
                <Sparkles className="h-4 w-4" />
                New workflow
              </Button>
            }
          />
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto px-4 py-4 md:px-6">
      <div className="mx-auto max-w-[1440px] space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                <GitBranch className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-semibold tracking-tight text-foreground">Workflows</h1>
                  <ScenarioBadge scenario={selectedScenario} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">Move work from capture to output.</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[240px] md:w-[280px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search workflows..."
                className="pl-9"
              />
            </div>
            <Button onClick={() => onStartWorkflowSession(selectedWorkflow.id)}>
              <Sparkles className="h-4 w-4" />
              New workflow
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {workflowFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm transition",
                statusFilter === filter.value
                  ? "border-primary/25 bg-primary/12 text-primary"
                  : "border-border/60 bg-secondary/20 text-muted-foreground hover:border-primary/20 hover:text-foreground"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-[340px_1fr]">
          <aside className="surface-panel flex min-h-0 flex-col overflow-hidden rounded-3xl border border-border/60">
            <div className="border-b border-border/60 px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">Workflow rail</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Selected: {statusFilter === "all" ? "All" : workflowFilters.find((filter) => filter.value === statusFilter)?.label} · {filteredWorkflows.length} workflows
                  </p>
                </div>
              </div>
            </div>

            <div className="min-h-0 space-y-4 overflow-y-auto px-3 py-3">
              {workflowGroups.map((group) => (
                <div key={group.id} className="space-y-2">
                  <div className="flex items-center justify-between gap-2 px-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{group.title}</p>
                    <span className="rounded-full bg-secondary/25 px-2 py-0.5 text-[10px] text-muted-foreground">
                      {group.items.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {group.items.slice(0, statusFilter === "all" ? undefined : 6).map((workflow) => {
                      const workflowSession = getLatestSessionForWorkflow({ sessions: allSessions } as never, workflow.id)
                      const isSelected = workflow.id === selectedWorkflow.id
                      const workflowProject = scenarioProjects.find((project) => project.workflowIds.includes(workflow.id))
                      const workflowCompletedSteps = workflowSession ? getCompletedStepsCount(workflowSession) : 0
                      return (
                        <button
                          key={workflow.id}
                          onClick={() => onSelectWorkflow(workflow.id)}
                          className={cn(
                            "w-full rounded-2xl border p-3 text-left transition",
                            isSelected
                              ? "border-primary/25 bg-primary/10 shadow-[0_0_0_1px_rgba(59,130,246,0.12)]"
                              : "border-border/60 bg-secondary/15 hover:border-primary/20 hover:bg-secondary/30"
                          )}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="line-clamp-1 text-sm font-semibold text-foreground">{workflow.title}</p>
                            <StatusBadge status={getBoardStatus(workflow, workflowSession)} className="shrink-0" />
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                            <span>{workflowCompletedSteps}/{workflow.steps.length} steps</span>
                            {workflowProject ? <span>{workflowProject.name}</span> : <span>{selectedScenario.name}</span>}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}

              {filteredWorkflows.length === 0 ? (
                <CompactEmpty
                  title="No workflows found"
                  description="Try a broader search or change the selected status filter."
                />
              ) : null}
            </div>
          </aside>

          <div className="min-h-0">
            {!selectedWorkflow ? (
              <EmptyState
                icon={GitBranch}
                title="Select a workflow"
                description="Choose a workflow from the rail to inspect its next step and start a session."
              />
            ) : (
              <Card className="surface-panel rounded-3xl border-border/60">
                <CardContent className="p-5">
                  <div className="space-y-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span>{selectedScenario.name}</span>
                          {currentProjectForWorkflow ? (
                            <>
                              <ArrowRight className="h-3.5 w-3.5" />
                              <span>{currentProjectForWorkflow.name}</span>
                            </>
                          ) : null}
                          <ArrowRight className="h-3.5 w-3.5" />
                          <span>{selectedWorkflow.title}</span>
                          {selectedStep ? (
                            <>
                              <ArrowRight className="h-3.5 w-3.5" />
                              <span className="font-medium text-foreground">{selectedStep.title}</span>
                            </>
                          ) : null}
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <h2 className="text-2xl font-semibold tracking-tight text-foreground">{selectedWorkflow.title}</h2>
                          <StatusBadge status={statusLabel} />
                          <span className="rounded-full border border-border/60 bg-secondary/20 px-2.5 py-1 text-[11px] text-muted-foreground">
                            {selectedWorkflow.status}
                          </span>
                        </div>
                        <p className="mt-2 line-clamp-2 max-w-3xl text-sm text-muted-foreground">{selectedWorkflow.goal}</p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {selectedWorkflowSession ? (
                          <Button onClick={() => onResumeWorkflowSession(selectedWorkflowSession.id, resumeDraft.trim())}>
                            <PlayCircle className="h-4 w-4" />
                            {nextActionLabel}
                          </Button>
                        ) : (
                          <Button onClick={() => onStartWorkflowSession(selectedWorkflow.id)}>
                            <PlayCircle className="h-4 w-4" />
                            {nextActionLabel}
                          </Button>
                        )}
                        <Button variant="outline" onClick={onOpenRunner}>
                          Open full runner
                        </Button>
                        <Button variant="ghost" onClick={() => setActiveTab("context")}>
                          Edit
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-4">
                      <div className="rounded-2xl border border-border/60 bg-secondary/15 px-3 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Current state</p>
                        <p className="mt-2 text-sm text-foreground">{selectedWorkflowSession ? selectedWorkflowSession.status : "Ready to run"}</p>
                      </div>
                      <div className="rounded-2xl border border-border/60 bg-secondary/15 px-3 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Progress</p>
                        <p className="mt-2 text-sm text-foreground">
                          {completedStepsCount}/{selectedWorkflow.steps.length} complete
                        </p>
                      </div>
                      <div className="rounded-2xl border border-border/60 bg-secondary/15 px-3 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Expected output</p>
                        <p className="mt-2 line-clamp-2 text-sm text-foreground">{expectedOutput}</p>
                      </div>
                      <div className="rounded-2xl border border-border/60 bg-secondary/15 px-3 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Success metric</p>
                        <p className="mt-2 line-clamp-2 text-sm text-foreground">{selectedWorkflow.successMetric}</p>
                      </div>
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                      <TabsList className="h-auto rounded-2xl border border-border/60 bg-secondary/15 p-1">
                        <TabsTrigger value="overview" className="rounded-xl px-4 py-2">Overview</TabsTrigger>
                        <TabsTrigger value="steps" className="rounded-xl px-4 py-2">Steps</TabsTrigger>
                        <TabsTrigger value="sessions" className="rounded-xl px-4 py-2">Sessions</TabsTrigger>
                        <TabsTrigger value="outputs" className="rounded-xl px-4 py-2">Outputs</TabsTrigger>
                        <TabsTrigger value="context" className="rounded-xl px-4 py-2">Context</TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview" className="space-y-4">
                        {selectedStep ? (
                          <Card className="rounded-3xl border border-primary/20 bg-primary/8 py-0 shadow-none">
                            <CardContent className="p-4 md:p-5">
                              <div className="flex flex-wrap items-start justify-between gap-4">
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm font-semibold uppercase tracking-wide text-primary/85">Next step</p>
                                    <StatusBadge status={currentStepExecution?.status ?? "not-started"} />
                                  </div>
                                  <h3 className="mt-2 text-xl font-semibold text-foreground">{selectedStep.title}</h3>
                                  <p className="mt-2 text-sm text-muted-foreground">{selectedStep.description}</p>
                                  <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                                    {stepPrompts[0] ? (
                                      <span className="rounded-full border border-border/60 bg-card/50 px-2.5 py-1">
                                        Prompt: {stepPrompts[0].title}
                                      </span>
                                    ) : null}
                                    {stepTools[0] ? (
                                      <span className="rounded-full border border-border/60 bg-card/50 px-2.5 py-1">
                                        Tool: {stepTools[0].name}
                                      </span>
                                    ) : null}
                                  </div>
                                </div>
                                <div className="w-full max-w-xs rounded-2xl border border-border/60 bg-card/50 px-3 py-3">
                                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Expected step output</p>
                                  <p className="mt-2 text-sm text-foreground">{selectedStep.expectedOutput}</p>
                                </div>
                              </div>

                              <div className="mt-4 flex flex-wrap gap-2">
                                <Button variant="outline" onClick={copyExecutionPack}>
                                  <Copy className="h-4 w-4" />
                                  {copiedPack ? "Copied" : "Copy Context + Prompt"}
                                </Button>
                                {selectedWorkflowSession ? (
                                  <Button onClick={() => onResumeWorkflowSession(selectedWorkflowSession.id, resumeDraft.trim())}>
                                    <PlayCircle className="h-4 w-4" />
                                    Resume session
                                  </Button>
                                ) : (
                                  <Button onClick={() => onStartWorkflowSession(selectedWorkflow.id)}>
                                    <PlayCircle className="h-4 w-4" />
                                    Start session
                                  </Button>
                                )}
                                <Button
                                  variant="outline"
                                  onClick={saveOutput}
                                  disabled={!selectedWorkflowSession || outputTitle.trim() === "" || outputContent.trim() === ""}
                                >
                                  Save output
                                </Button>
                                <Button variant="outline" onClick={onCompleteCurrentStep} disabled={!selectedWorkflowSession}>
                                  <CheckCircle2 className="h-4 w-4" />
                                  Mark step complete
                                </Button>
                                {selectedStep.launchUrl ? (
                                  <Button variant="ghost" asChild>
                                    <a href={selectedStep.launchUrl} target="_blank" rel="noopener noreferrer">
                                      Launch tool
                                      <ExternalLink className="h-4 w-4" />
                                    </a>
                                  </Button>
                                ) : null}
                              </div>

                              <div className="mt-4 grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
                                <div className="rounded-2xl border border-border/60 bg-card/55 p-3">
                                  <p className="text-sm font-semibold text-foreground">Save step output</p>
                                  <div className="mt-3 grid gap-2">
                                    <Input
                                      value={outputTitle}
                                      onChange={(event) => setOutputTitle(event.target.value)}
                                      placeholder="Output title"
                                      disabled={!selectedWorkflowSession}
                                    />
                                    <Textarea
                                      value={outputContent}
                                      onChange={(event) => setOutputContent(event.target.value)}
                                      placeholder="What did this step produce?"
                                      className="min-h-24"
                                      disabled={!selectedWorkflowSession}
                                    />
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  <div className="rounded-2xl border border-border/60 bg-card/55 p-3">
                                    <div className="flex items-center justify-between gap-2">
                                      <p className="text-sm font-semibold text-foreground">Session</p>
                                      {selectedWorkflowSession ? <StatusBadge status={selectedWorkflowSession.status} /> : null}
                                    </div>
                                    {selectedWorkflowSession ? (
                                      <div className="mt-3 space-y-3 text-sm text-muted-foreground">
                                        <p>Active since {new Date(selectedWorkflowSession.startedAt).toLocaleString()}</p>
                                        <div className="flex flex-wrap gap-2">
                                          <Button variant="outline" size="sm" onClick={() => onPauseSession(resumeDraft.trim())}>
                                            <PauseCircle className="h-4 w-4" />
                                            Pause
                                          </Button>
                                          <Button variant="outline" size="sm" onClick={() => onBlockSession(blockerDraft.trim())}>
                                            <Flag className="h-4 w-4" />
                                            Block
                                          </Button>
                                          <Button size="sm" onClick={() => onFinishSession(summaryDraft.trim())}>
                                            Finish
                                          </Button>
                                        </div>
                                      </div>
                                    ) : (
                                      <CompactEmpty
                                        title="No active session"
                                        description="Start a session to create execution history."
                                      />
                                    )}
                                  </div>

                                  <div className="rounded-2xl border border-border/60 bg-card/55 p-3">
                                    <div className="flex items-center justify-between gap-2">
                                      <p className="text-sm font-semibold text-foreground">Project vault context</p>
                                      {currentProjectForWorkflow ? (
                                        <span className="rounded-full border border-border/60 bg-secondary/20 px-2 py-0.5 text-[10px] text-muted-foreground">
                                          {currentProjectForWorkflow.name}
                                        </span>
                                      ) : null}
                                    </div>
                                    <div className="mt-3 space-y-2">
                                      {projectVaultContexts.length > 0 ? (
                                        projectVaultContexts.map((context) => (
                                          <div key={context.id} className="rounded-xl border border-border/60 bg-secondary/10 p-3">
                                            <div className="flex flex-wrap items-center gap-2">
                                              <p className="text-sm font-semibold text-foreground">{context.title}</p>
                                              <span className="rounded-full border border-border/60 bg-card/50 px-2 py-0.5 text-[10px] text-muted-foreground">
                                                {context.type}
                                              </span>
                                              <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
                                                project-owned
                                              </span>
                                            </div>
                                            <p className="mt-2 text-sm text-muted-foreground">{context.content}</p>
                                            {context.tags?.length ? (
                                              <div className="mt-2 flex flex-wrap gap-2">
                                                {context.tags.map((tag) => (
                                                  <span key={tag} className="rounded-full border border-border/60 bg-card/50 px-2 py-0.5 text-[10px] text-muted-foreground">
                                                    {tag}
                                                  </span>
                                                ))}
                                              </div>
                                            ) : null}
                                          </div>
                                        ))
                                      ) : (
                                        <CompactEmpty
                                          title="No project vault context"
                                          description="Add project context so this workflow carries the right constraints and memory."
                                        />
                                      )}
                                      {inheritedExecutionContexts.length > 0 ? (
                                        <div className="pt-1">
                                          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">
                                            Also inherited in this step
                                          </p>
                                          <div className="space-y-2">
                                            {inheritedExecutionContexts.map((context) => (
                                              <div key={context.id} className="rounded-xl border border-border/60 bg-background/40 p-3">
                                                <div className="flex flex-wrap items-center gap-2">
                                                  <p className="text-sm font-semibold text-foreground">{context.title}</p>
                                                  <span className="rounded-full border border-border/60 bg-card/50 px-2 py-0.5 text-[10px] text-muted-foreground">
                                                    {context.type}
                                                  </span>
                                                  <span className="rounded-full border border-border/60 bg-secondary/15 px-2 py-0.5 text-[10px] text-muted-foreground">
                                                    inherited
                                                  </span>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      ) : null}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ) : null}

                        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                          <Card className="rounded-3xl border-border/60 py-0 shadow-none">
                            <CardContent className="p-4">
                              <SectionHeader icon={ListChecks} title="Step progress" />
                              <div className="mt-3">
                                <Progress value={progressPercent} />
                              </div>
                              <div className="mt-4 overflow-x-auto">
                                <div className="flex min-w-max items-center gap-2">
                                  {selectedWorkflow.steps.map((step, index) => {
                                    const stepExecution = selectedWorkflowSession?.stepExecutions.find((item) => item.stepId === step.id)
                                    const stepStatus = stepExecution?.status ?? "not-started"
                                    const isCurrent = selectedStep?.id === step.id
                                    return (
                                      <button
                                        key={step.id}
                                        onClick={() => {
                                          if (selectedWorkflowSession) {
                                            onJumpToWorkflowStep(step.id)
                                          } else {
                                            setPreviewStepId(step.id)
                                          }
                                        }}
                                        className={cn(
                                          "min-w-[150px] rounded-2xl border px-3 py-2 text-left transition",
                                          isCurrent
                                            ? "border-primary/25 bg-primary/10"
                                            : stepStatus === "completed"
                                              ? "border-success/20 bg-success/8"
                                              : "border-border/60 bg-secondary/15 hover:border-primary/20"
                                        )}
                                      >
                                        <p className="text-[11px] text-muted-foreground">Step {index + 1}</p>
                                        <p className="mt-1 line-clamp-1 text-sm font-semibold text-foreground">{step.title}</p>
                                      </button>
                                    )
                                  })}
                                </div>
                              </div>
                              {selectedWorkflowSession ? (
                                <div className="mt-4 flex flex-wrap gap-2">
                                  <Button variant="outline" size="sm" onClick={() => onMoveWorkflowStep(-1)} disabled={currentStepIndex <= 0}>
                                    Previous
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => onMoveWorkflowStep(1)} disabled={currentStepIndex >= selectedWorkflow.steps.length - 1}>
                                    Next
                                  </Button>
                                </div>
                              ) : null}
                            </CardContent>
                          </Card>

                          <Card className="rounded-3xl border-border/60 py-0 shadow-none">
                            <CardContent className="p-4">
                              <SectionHeader icon={PlayCircle} title="Latest signal" />
                              <div className="mt-3 space-y-3">
                                {latestOutput ? (
                                  <div className="rounded-2xl border border-border/60 bg-secondary/10 p-3">
                                    <p className="text-sm font-semibold text-foreground">{latestOutput.title}</p>
                                    <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{latestOutput.content}</p>
                                  </div>
                                ) : (
                                  <CompactEmpty title="No outputs yet" description="Save an output from a workflow step." />
                                )}
                                {selectedWorkflowSession ? (
                                  <div className="rounded-2xl border border-border/60 bg-secondary/10 p-3">
                                    <p className="text-sm font-semibold text-foreground">Resume note</p>
                                    <Textarea
                                      value={resumeDraft}
                                      onChange={(event) => setResumeDraft(event.target.value)}
                                      placeholder="What should future-you remember?"
                                      className="mt-3 min-h-20"
                                    />
                                    <div className="mt-2 flex flex-wrap gap-2">
                                      <Button variant="outline" size="sm" onClick={() => onResumeSession(resumeDraft.trim())}>
                                        Save resume note
                                      </Button>
                                      <Button variant="outline" size="sm" onClick={() => onSaveSessionSummary(summaryDraft.trim())}>
                                        Save summary
                                      </Button>
                                    </div>
                                  </div>
                                ) : null}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>

                      <TabsContent value="steps" className="space-y-3">
                        {selectedWorkflow.steps.map((step, index) => {
                          const stepExecution = selectedWorkflowSession?.stepExecutions.find((item) => item.stepId === step.id)
                          const stepStatus = stepExecution?.status ?? "not-started"
                          const isCurrent = selectedStep?.id === step.id
                          const Icon = getStatusMeta(stepStatus).icon
                          return (
                            <button
                              key={step.id}
                              onClick={() => {
                                if (selectedWorkflowSession) {
                                  onJumpToWorkflowStep(step.id)
                                } else {
                                  setPreviewStepId(step.id)
                                }
                              }}
                              className={cn(
                                "flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition",
                                isCurrent
                                  ? "border-primary/25 bg-primary/10"
                                  : stepStatus === "completed"
                                    ? "border-success/20 bg-success/8"
                                    : stepStatus === "blocked"
                                      ? "border-destructive/20 bg-destructive/8"
                                      : "border-border/60 bg-secondary/15 hover:border-primary/20"
                              )}
                            >
                              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-card/60 text-muted-foreground">
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-xs font-semibold text-muted-foreground">Step {index + 1}</span>
                                  <StatusBadge status={stepStatus} />
                                </div>
                                <p className="mt-2 text-sm font-semibold text-foreground">{step.title}</p>
                                <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                                <p className="mt-2 text-xs text-foreground">Expected output: {step.expectedOutput}</p>
                              </div>
                            </button>
                          )
                        })}
                      </TabsContent>

                      <TabsContent value="sessions" className="space-y-3">
                        {workflowSessions.length > 0 ? (
                          workflowSessions
                            .slice()
                            .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
                            .map((session) => (
                              <div key={session.id} className="rounded-2xl border border-border/60 bg-secondary/15 p-4">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                  <div>
                                    <p className="text-sm font-semibold text-foreground">{new Date(session.startedAt).toLocaleString()}</p>
                                    <p className="mt-1 text-xs text-muted-foreground">Updated {new Date(session.updatedAt).toLocaleString()}</p>
                                  </div>
                                  <StatusBadge status={session.status} />
                                </div>
                                <div className="mt-3 flex flex-wrap gap-2">
                                  <Button variant="outline" size="sm" onClick={() => onSetActiveSession(session.id)}>
                                    Focus session
                                  </Button>
                                  {session.status !== "completed" ? (
                                    <Button size="sm" onClick={() => onResumeWorkflowSession(session.id, session.resumeNote ?? "")}>
                                      Resume
                                    </Button>
                                  ) : null}
                                </div>
                              </div>
                            ))
                        ) : (
                          <CompactEmpty
                            title="No sessions yet"
                            description="Start a session to create execution history."
                          />
                        )}
                      </TabsContent>

                      <TabsContent value="outputs" className="space-y-3">
                        {workflowOutputs.length > 0 ? (
                          workflowOutputs.map((output) => (
                            <div key={output.id} className="rounded-2xl border border-border/60 bg-secondary/15 p-4">
                              <div className="flex flex-wrap items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-foreground">{output.title}</p>
                                  <p className="mt-1 text-xs text-muted-foreground">{new Date(output.createdAt).toLocaleString()}</p>
                                </div>
                                <span className="rounded-full border border-border/60 bg-card/50 px-2.5 py-1 text-[11px] text-muted-foreground">
                                  {output.type}
                                </span>
                              </div>
                              <p className="mt-3 text-sm text-muted-foreground">{output.content}</p>
                            </div>
                          ))
                        ) : (
                          <CompactEmpty
                            title="No outputs yet"
                            description="Save an output from a workflow step."
                          />
                        )}
                      </TabsContent>

                      <TabsContent value="context" className="space-y-4">
                        <div className="grid gap-4 lg:grid-cols-2">
                          <Card className="rounded-3xl border-border/60 py-0 shadow-none">
                            <CardContent className="p-4">
                              <SectionHeader icon={MessageSquare} title="Workflow frame" />
                              <div className="mt-3 space-y-3 text-sm text-muted-foreground">
                                <p><span className="text-foreground">Goal:</span> {selectedWorkflow.goal}</p>
                                <p><span className="text-foreground">Expected output:</span> {selectedWorkflow.output}</p>
                                <p><span className="text-foreground">Success metric:</span> {selectedWorkflow.successMetric}</p>
                                <p><span className="text-foreground">Frequency:</span> {selectedWorkflow.frequency}</p>
                                <p><span className="text-foreground">Trigger:</span> {selectedWorkflow.trigger}</p>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="rounded-3xl border-border/60 py-0 shadow-none">
                            <CardContent className="p-4">
                              <SectionHeader icon={Database} title="Linked context" />
                              <div className="mt-3 space-y-3">
                                {stepContexts.length > 0 ? (
                                  stepContexts.map((context) => {
                                    const Icon = getContextIcon(context.type)
                                    return (
                                      <div key={context.id} className="rounded-2xl border border-border/60 bg-secondary/10 p-3">
                                        <div className="flex items-start gap-3">
                                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-knowledge/10 text-knowledge">
                                            <Icon className="h-4 w-4" />
                                          </div>
                                          <div>
                                            <p className="text-sm font-semibold text-foreground">{context.title}</p>
                                            <p className="mt-1 text-sm text-muted-foreground">{context.content}</p>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  })
                                ) : (
                                  <CompactEmpty
                                    title="No context linked"
                                    description="Add reusable context when this workflow needs background information."
                                  />
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        <div className="grid gap-4 lg:grid-cols-3">
                          <Card className="rounded-3xl border-border/60 py-0 shadow-none">
                            <CardContent className="p-4">
                              <SectionHeader icon={MessageSquare} title="Prompts" />
                              <div className="mt-3 space-y-2">
                                {stepPrompts.length > 0 ? (
                                  stepPrompts.map((prompt) => (
                                    <div key={prompt.id} className="rounded-2xl border border-border/60 bg-secondary/10 p-3">
                                      <p className="text-sm font-semibold text-foreground">{prompt.title}</p>
                                      <p className="mt-1 text-xs text-muted-foreground">{prompt.expectedOutput}</p>
                                    </div>
                                  ))
                                ) : (
                                  <CompactEmpty title="No prompts linked" description="This step currently runs without a saved prompt." />
                                )}
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="rounded-3xl border-border/60 py-0 shadow-none">
                            <CardContent className="p-4">
                              <SectionHeader icon={PlayCircle} title="Tools" />
                              <div className="mt-3 flex flex-wrap gap-2">
                                {stepTools.length > 0 ? (
                                  stepTools.map((tool) => (
                                    <a
                                      key={tool.id}
                                      href={tool.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="rounded-full border border-border/60 bg-secondary/20 px-3 py-1.5 text-xs text-foreground transition hover:border-primary/20"
                                    >
                                      {tool.name}
                                    </a>
                                  ))
                                ) : (
                                  <CompactEmpty title="No tools linked" description="No step tools are linked yet." />
                                )}
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="rounded-3xl border-border/60 py-0 shadow-none">
                            <CardContent className="p-4">
                              <SectionHeader icon={AlertTriangle} title="Health warnings" />
                              <div className="mt-3 space-y-2">
                                {selectedWorkflowSession?.status === "blocked" ? (
                                  <div className="rounded-2xl border border-destructive/20 bg-destructive/8 p-3">
                                    <p className="text-sm font-semibold text-foreground">Blocked session</p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                      {selectedWorkflowSession.blockerNote || "This workflow is blocked without a saved blocker note."}
                                    </p>
                                  </div>
                                ) : null}
                                {selectedWorkflowSession ? (
                                  <>
                                    <Textarea
                                      value={blockerDraft}
                                      onChange={(event) => setBlockerDraft(event.target.value)}
                                      placeholder="Blocker note"
                                      className="min-h-20"
                                    />
                                    <Textarea
                                      value={summaryDraft}
                                      onChange={(event) => setSummaryDraft(event.target.value)}
                                      placeholder="Session summary"
                                      className="min-h-24"
                                    />
                                    <div className="flex flex-wrap gap-2">
                                      <Button variant="outline" size="sm" onClick={() => onBlockSession(blockerDraft.trim())}>
                                        <Flag className="h-4 w-4" />
                                        Block session
                                      </Button>
                                      <Button variant="outline" size="sm" onClick={() => onSaveSessionSummary(summaryDraft.trim())}>
                                        Save summary
                                      </Button>
                                    </div>
                                  </>
                                ) : (
                                  <CompactEmpty title="No active risks" description="Start a session to track blockers and summaries." />
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
