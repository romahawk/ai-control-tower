"use client"

import { useMemo } from "react"
import {
  ArrowRight,
  ClipboardCheck,
  Compass,
  FolderKanban,
  OctagonAlert,
  PlayCircle,
  SearchCheck,
  Sparkles,
} from "lucide-react"
import { SCENARIOS } from "@/data/scenarios"
import { DashboardQuickCapture } from "@/components/views/dashboard-quick-capture"
import { WorkflowBoardPreview } from "@/components/views/dashboard-workflow-board"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScenarioBadge } from "@/components/ui/scenario-badge"
import { SectionHeader } from "@/components/ui/section-header"
import { StatusBadge } from "@/components/ui/status-badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getLatestSessionForWorkflow, getWorkflowById } from "@/lib/control-tower"
import type {
  OutputRecord,
  Project,
  QuickCaptureRecord,
  ReviewRecord,
  Scenario,
  ViewType,
  Workflow,
  WorkflowSession,
} from "@/types"

interface DashboardProps {
  selectedScenario: Scenario
  scenarioProjects: Project[]
  scenarioWorkflows: Workflow[]
  sessions: WorkflowSession[]
  activeSessions: WorkflowSession[]
  activeSession?: WorkflowSession
  quickCaptures: QuickCaptureRecord[]
  recentOutputs: OutputRecord[]
  recentReviews: ReviewRecord[]
  nextActions: string[]
  onNavigate: (view: ViewType) => void
  onOpenProject: (projectId: string) => void
  onOpenWorkflow: (workflowId: string) => void
  onStartWorkflowSession: (workflowId: string) => void
  onResetFocus: () => void
  onQuickCapture: (params: {
    type: "task" | "prompt" | "idea" | "decision"
    content: string
    scenarioId?: string
    workflowId?: string
  }) => void
}

const boardColumns: Array<{
  id: "inbox" | "clarify" | "active" | "waiting" | "done" | "blocked"
  title: string
}> = [
  { id: "inbox", title: "Inbox" },
  { id: "clarify", title: "Clarify" },
  { id: "active", title: "Active" },
  { id: "waiting", title: "Waiting" },
  { id: "done", title: "Done" },
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

export function Dashboard({
  selectedScenario,
  scenarioProjects,
  scenarioWorkflows,
  sessions,
  activeSessions,
  activeSession,
  quickCaptures,
  recentOutputs,
  recentReviews,
  nextActions,
  onNavigate,
  onOpenProject,
  onOpenWorkflow,
  onStartWorkflowSession,
  onResetFocus,
  onQuickCapture,
}: DashboardProps) {
  const scenarioSessions = sessions.filter((session) => session.scenarioId === selectedScenario.id)
  const focusedSession = activeSession?.scenarioId === selectedScenario.id ? activeSession : undefined
  const currentWorkflow = focusedSession ? getWorkflowById(focusedSession.workflowId) : scenarioWorkflows[0]
  const currentProject =
    scenarioProjects.find((project) => currentWorkflow && project.workflowIds.includes(currentWorkflow.id)) ??
    scenarioProjects.find((project) => project.status === "active") ??
    scenarioProjects[0]
  const currentStep = focusedSession && currentWorkflow
    ? currentWorkflow.steps.find((step) => step.id === focusedSession.currentStepId) ?? currentWorkflow.steps[0]
    : currentWorkflow?.steps[0]
  const focusCtaLabel = focusedSession ? "Continue" : currentWorkflow ? "Start workflow" : "Choose workflow"
  const focusNextAction = currentStep?.title ?? currentProject?.nextAction ?? nextActions[0] ?? "Choose a workflow and start a session."
  const focusExpectedOutput = currentStep?.expectedOutput
  const quickCaptureItems = quickCaptures.filter((capture) => capture.scenarioId === selectedScenario.id)
  const recentOutputSlice = recentOutputs.slice(0, 3)
  const scenarioActiveProjects = scenarioProjects.filter((project) => project.status === "active")
  const scenarioActiveSessions = activeSessions.filter((session) => session.scenarioId === selectedScenario.id)

  const boardItems = useMemo(() => {
    const items = scenarioWorkflows.map((workflow) => {
      const latestSession = getLatestSessionForWorkflow({ sessions } as never, workflow.id)
      return {
        id: workflow.id,
        title: workflow.title,
        scenario: selectedScenario,
        status: getBoardStatus(workflow, latestSession),
        updatedAt: latestSession?.updatedAt ?? new Date().toISOString(),
        workflow,
      }
    })

    return boardColumns.map((column) => ({
      ...column,
      items: items.filter((item) => item.status === column.id || (column.id === "waiting" && item.status === "blocked")),
    }))
  }, [scenarioWorkflows, selectedScenario, sessions])

  const blockedItems = scenarioWorkflows
    .map((workflow) => {
      const latestSession = getLatestSessionForWorkflow({ sessions } as never, workflow.id)
      return latestSession?.status === "blocked" ? { workflow, session: latestSession } : null
    })
    .filter((item): item is { workflow: Workflow; session: WorkflowSession } => !!item)

  const recentDecisionItems = useMemo(() => {
    const outputDecisions = recentOutputs
      .filter((output) => output.type === "decision")
      .map((output) => ({
        id: output.id,
        label: output.title,
        meta: SCENARIOS.find((scenario) => scenario.id === output.scenarioId)?.name ?? selectedScenario.name,
        workflowId: output.workflowId,
      }))

    const reviewDecisions = recentReviews.flatMap((review) =>
      review.decisions.map((decision, index) => ({
        id: `${review.id}-${index}`,
        label: decision,
        meta: `${review.type} review`,
        workflowId: review.workflowId,
      }))
    )

    return [...outputDecisions, ...reviewDecisions].slice(0, 3)
  }, [recentOutputs, recentReviews, selectedScenario.name])

  const recentSessionItems = scenarioSessions
    .slice()
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
    .slice(0, 3)

  const openLoopItems = [
    ...blockedItems.map((item) => ({
      id: item.session.id,
      label: `${item.workflow.title} is blocked`,
      tone: "blocked" as const,
    })),
    ...quickCaptureItems
      .filter((capture) => capture.status === "inbox")
      .slice(0, 2)
      .map((capture) => ({
        id: capture.id,
        label: `Clarify ${capture.type}: ${capture.content}`,
        tone: "inbox" as const,
      })),
    ...scenarioActiveSessions
      .filter((session) => session.outputs.length === 0)
      .slice(0, 1)
      .map((session) => ({
        id: session.id,
        label: `${getWorkflowById(session.workflowId)?.title ?? "Workflow"} needs a visible output`,
        tone: "waiting" as const,
      })),
  ].slice(0, 3)

  return (
    <div className="h-full overflow-auto bg-background px-4 py-4 md:px-6">
      <div className="mx-auto max-w-[1440px] space-y-4">
        <Tabs defaultValue="today" className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <TabsList className="h-auto rounded-2xl border border-border/70 bg-secondary/20 p-1">
              <TabsTrigger value="today" className="rounded-xl px-4 py-2">Today</TabsTrigger>
              <TabsTrigger value="workflows" className="rounded-xl px-4 py-2">Workflows</TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-xl px-4 py-2">Reviews</TabsTrigger>
              <TabsTrigger value="outputs" className="rounded-xl px-4 py-2">Outputs</TabsTrigger>
              <TabsTrigger value="wiki" className="rounded-xl px-4 py-2">Wiki</TabsTrigger>
            </TabsList>
            <div className="hidden items-center gap-2 lg:flex">
              <ScenarioBadge scenario={selectedScenario} />
              {blockedItems.length > 0 ? <StatusBadge status="blocked" /> : null}
            </div>
          </div>

          <TabsContent value="today" className="space-y-4">
            <div className="grid gap-4 xl:grid-cols-[1.7fr_0.9fr]">
              <div className="space-y-4">
                <Card className="surface-panel rounded-3xl border-border/60">
                  <CardContent className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-lg font-semibold tracking-tight text-foreground">Today&apos;s Focus</p>
                          <ScenarioBadge scenario={selectedScenario} />
                          {currentProject ? <StatusBadge status={currentProject.status} /> : null}
                        </div>
                        <div className="mt-3 space-y-2">
                          <p className="text-xl font-semibold text-foreground">
                            {currentWorkflow?.title ?? "No workflow selected"}
                          </p>
                          {currentProject ? (
                            <p className="text-sm text-muted-foreground">{currentProject.name}</p>
                          ) : null}
                          <p className="text-sm text-foreground">
                            <span className="text-muted-foreground">Next:</span> {focusNextAction}
                          </p>
                          {focusExpectedOutput ? (
                            <p className="text-sm text-foreground">
                              <span className="text-muted-foreground">Output:</span> {focusExpectedOutput}
                            </p>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {currentWorkflow ? (
                          <Button
                            onClick={() =>
                              focusedSession ? onOpenWorkflow(currentWorkflow.id) : onStartWorkflowSession(currentWorkflow.id)
                            }
                          >
                            {focusCtaLabel}
                          </Button>
                        ) : null}
                        {currentWorkflow ? (
                          <Button variant="outline" onClick={() => onOpenWorkflow(currentWorkflow.id)}>
                            Open workflow
                          </Button>
                        ) : null}
                        {focusedSession ? (
                          <Button
                            variant="ghost"
                            onClick={onResetFocus}
                            title="Clear the current focus and return to neutral browsing mode."
                          >
                            Reset focus
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Open loops", value: openLoopItems.length, action: () => onNavigate("reviews") },
                    { label: "Active workflows", value: scenarioActiveSessions.length, action: () => onNavigate("workflows") },
                    { label: "Active projects", value: scenarioActiveProjects.length, action: () => onNavigate("projects") },
                    { label: "Recent outputs", value: recentOutputSlice.length },
                  ].map((chip) =>
                    chip.action ? (
                      <button
                        key={chip.label}
                        onClick={chip.action}
                        className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/20 px-3 py-1.5 text-sm text-foreground transition hover:border-primary/25 hover:bg-secondary/35"
                      >
                        <span className="font-semibold">{chip.label}</span>
                        <span className="rounded-full bg-card/80 px-2 py-0.5 text-xs text-muted-foreground">{chip.value}</span>
                      </button>
                    ) : (
                      <span
                        key={chip.label}
                        className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/20 px-3 py-1.5 text-sm text-foreground"
                      >
                        <span className="font-semibold">{chip.label}</span>
                        <span className="rounded-full bg-card/80 px-2 py-0.5 text-xs text-muted-foreground">{chip.value}</span>
                      </span>
                    )
                  )}
                </div>

                <Card className="surface-panel rounded-3xl border-border/60">
                  <CardContent className="p-5">
                    <SectionHeader
                      icon={Compass}
                      title="Active Workflows"
                      action={
                        <Button variant="outline" size="sm" onClick={() => onNavigate("workflows")}>
                          Open workflows
                        </Button>
                      }
                    />
                    <div className="mt-4">
                      <WorkflowBoardPreview
                        columns={boardItems}
                        onOpenWorkflow={onOpenWorkflow}
                        compact
                        maxItemsPerColumn={2}
                      />
                    </div>
                  </CardContent>
                </Card>

                {openLoopItems.length > 0 ? (
                  <Card className="surface-panel rounded-3xl border-border/60">
                    <CardContent className="p-5">
                      <SectionHeader icon={OctagonAlert} title="Open Loops" />
                      <div className="mt-4 space-y-2">
                        {openLoopItems.map((item) => (
                          <div key={item.id} className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-secondary/10 px-3 py-2.5">
                            <p className="min-w-0 flex-1 truncate text-sm text-foreground">{item.label}</p>
                            <StatusBadge status={item.tone} />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ) : null}
              </div>

              <div className="space-y-4">
                <Card className="surface-panel rounded-3xl border-border/60">
                  <CardContent className="p-4">
                    <SectionHeader icon={Sparkles} title="Quick Capture" />
                    <div className="mt-3">
                      <DashboardQuickCapture
                        selectedScenario={selectedScenario}
                        selectedWorkflow={currentWorkflow ?? scenarioWorkflows[0]}
                        quickCaptures={quickCaptureItems}
                        onSave={onQuickCapture}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="surface-panel rounded-3xl border-border/60">
                  <CardContent className="p-4">
                    <SectionHeader
                      icon={FolderKanban}
                      title="Projects in Motion"
                      action={
                        <Button variant="outline" size="sm" onClick={() => onNavigate("projects")}>
                          Open projects
                        </Button>
                      }
                    />
                    <div className="mt-3 space-y-2.5">
                      {scenarioProjects.slice(0, 2).map((project) => (
                        <button
                          key={project.id}
                          onClick={() => onOpenProject(project.id)}
                          className="w-full rounded-2xl border border-border/60 bg-secondary/15 p-3 text-left transition hover:border-primary/20 hover:bg-secondary/30"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-foreground">{project.name}</p>
                              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{project.nextAction}</p>
                            </div>
                            <StatusBadge status={project.status} />
                          </div>
                          <div className="mt-2 text-[11px] text-muted-foreground">
                            {project.workflowIds.length} workflows
                          </div>
                        </button>
                      ))}
                      {scenarioProjects.length > 2 ? (
                        <div className="rounded-xl border border-dashed border-border/70 px-3 py-2 text-center text-[11px] text-muted-foreground">
                          +{scenarioProjects.length - 2} more
                        </div>
                      ) : null}
                      {scenarioProjects.length === 0 ? (
                        <CompactEmpty
                          title="No projects yet"
                          description="Create a project to group related workflows and outputs."
                        />
                      ) : null}
                    </div>
                  </CardContent>
                </Card>

                <Card className="surface-panel rounded-3xl border-border/60">
                  <CardContent className="p-4">
                    <Tabs defaultValue={recentDecisionItems.length > 0 ? "decisions" : "outputs"} className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <SectionHeader icon={ClipboardCheck} title="Recent Activity" className="gap-2" />
                        <TabsList className="h-auto rounded-2xl border border-border/60 bg-secondary/15 p-1">
                          <TabsTrigger value="outputs" className="rounded-xl px-3 py-1.5 text-xs">Outputs</TabsTrigger>
                          <TabsTrigger value="decisions" className="rounded-xl px-3 py-1.5 text-xs">Decisions</TabsTrigger>
                          <TabsTrigger value="sessions" className="rounded-xl px-3 py-1.5 text-xs">Sessions</TabsTrigger>
                        </TabsList>
                      </div>

                      <TabsContent value="outputs" className="space-y-2">
                        {recentOutputSlice.length > 0 ? (
                          recentOutputSlice.map((output) => (
                            <button
                              key={output.id}
                              onClick={() => onOpenWorkflow(output.workflowId)}
                              className="w-full rounded-2xl border border-border/60 bg-secondary/15 p-3 text-left transition hover:border-primary/20 hover:bg-secondary/30"
                            >
                              <p className="text-sm font-semibold text-foreground">{output.title}</p>
                              <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                                <span>{SCENARIOS.find((scenario) => scenario.id === output.scenarioId)?.name ?? output.scenarioId}</span>
                                <span>{new Date(output.createdAt).toLocaleDateString()}</span>
                              </div>
                            </button>
                          ))
                        ) : (
                          <CompactEmpty
                            title="No outputs yet"
                            description="Run a workflow and save an output."
                          />
                        )}
                      </TabsContent>

                      <TabsContent value="decisions" className="space-y-2">
                        {recentDecisionItems.length > 0 ? (
                          recentDecisionItems.map((decision) => (
                            <button
                              key={decision.id}
                              onClick={() => decision.workflowId ? onOpenWorkflow(decision.workflowId) : onNavigate("reviews")}
                              className="w-full rounded-2xl border border-border/60 bg-secondary/15 p-3 text-left transition hover:border-primary/20 hover:bg-secondary/30"
                            >
                              <p className="text-sm font-semibold text-foreground">{decision.label}</p>
                              <p className="mt-1 text-[11px] text-muted-foreground">{decision.meta}</p>
                            </button>
                          ))
                        ) : (
                          <CompactEmpty
                            title="No decisions yet"
                            description="Decisions appear after outputs or reviews are saved."
                          />
                        )}
                      </TabsContent>

                      <TabsContent value="sessions" className="space-y-2">
                        {recentSessionItems.length > 0 ? (
                          recentSessionItems.map((session) => (
                            <button
                              key={session.id}
                              onClick={() => onOpenWorkflow(session.workflowId)}
                              className="w-full rounded-2xl border border-border/60 bg-secondary/15 p-3 text-left transition hover:border-primary/20 hover:bg-secondary/30"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-semibold text-foreground">
                                  {getWorkflowById(session.workflowId)?.title ?? "Workflow session"}
                                </p>
                                <StatusBadge status={session.status} />
                              </div>
                              <p className="mt-1 text-[11px] text-muted-foreground">
                                Updated {new Date(session.updatedAt).toLocaleDateString()}
                              </p>
                            </button>
                          ))
                        ) : (
                          <CompactEmpty
                            title="No sessions yet"
                            description="Sessions appear after a workflow step is run."
                          />
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="workflows" className="space-y-4">
            <Card className="surface-panel rounded-3xl border-border/60">
              <CardContent className="p-5 md:p-6">
                <SectionHeader icon={Compass} title="Workflow board" />
                <div className="mt-4">
                  <WorkflowBoardPreview columns={boardItems} onOpenWorkflow={onOpenWorkflow} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
              <Card className="surface-panel rounded-3xl border-border/60">
                <CardContent className="p-5 md:p-6">
                  <SectionHeader icon={SearchCheck} title="Review Signals" />
                  <div className="mt-4 space-y-3">
                    {nextActions.slice(0, 4).map((action) => (
                      <div key={action} className="rounded-2xl border border-border/60 bg-secondary/15 p-4 text-sm text-foreground">
                        {action}
                      </div>
                    ))}
                    {blockedItems.length > 0 ? (
                      <div className="rounded-2xl border border-destructive/20 bg-destructive/8 p-4">
                        <p className="text-sm font-semibold text-foreground">Blocked workflows</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {blockedItems.map((item) => item.workflow.title).join(", ")}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </CardContent>
              </Card>

              <Card className="surface-panel rounded-3xl border-border/60">
                <CardContent className="p-5 md:p-6">
                  <SectionHeader
                    icon={SearchCheck}
                    title="Saved Reviews"
                    action={<Button variant="outline" size="sm" onClick={() => onNavigate("reviews")}>Open reviews</Button>}
                  />
                  <div className="mt-4 space-y-3">
                    {recentReviews.slice(0, 4).map((review) => (
                      <div key={review.id} className="rounded-2xl border border-border/60 bg-secondary/15 p-4">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold capitalize text-foreground">{review.type} review</p>
                          <StatusBadge status="review" />
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {review.nextActions[0] ?? "No next action generated."}
                        </p>
                      </div>
                    ))}
                    {recentReviews.length === 0 ? (
                      <CompactEmpty
                        title="No reviews yet"
                        description="Create a daily or weekly review once outputs start accumulating."
                      />
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="outputs" className="space-y-4">
            <Card className="surface-panel rounded-3xl border-border/60">
              <CardContent className="p-5 md:p-6">
                <SectionHeader icon={SearchCheck} title="All Recent Outputs" />
                <div className="mt-4 space-y-3">
                  {recentOutputs.length > 0 ? (
                    recentOutputs.slice(0, 8).map((output) => (
                      <button
                        key={output.id}
                        onClick={() => onOpenWorkflow(output.workflowId)}
                        className="w-full rounded-2xl border border-border/60 bg-secondary/15 p-4 text-left transition hover:border-primary/20 hover:bg-secondary/30"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-foreground">{output.title}</p>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                          <span>{SCENARIOS.find((scenario) => scenario.id === output.scenarioId)?.name ?? output.scenarioId}</span>
                          <span>{new Date(output.createdAt).toLocaleDateString()}</span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <CompactEmpty title="No outputs yet" description="Outputs appear here when workflow steps are saved." />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wiki" className="space-y-4">
            <Card className="surface-panel rounded-3xl border-border/60">
              <CardContent className="p-5 md:p-6">
                <SectionHeader
                  icon={Sparkles}
                  title="Wiki"
                  action={
                    <Button onClick={() => onNavigate("wiki")}>
                      Open Wiki
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  }
                />
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {[
                    "One scenario should own attention when the workload gets noisy.",
                    "Every workflow step should produce one visible output or decision.",
                    "Use reviews to convert output volume into follow-through.",
                  ].map((item) => (
                    <div key={item} className="rounded-2xl border border-border bg-secondary/15 p-4 text-sm text-foreground">
                      {item}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
