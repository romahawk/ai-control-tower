"use client"

import { useMemo } from "react"
import {
  ArrowRight,
  OctagonAlert,
  Compass,
  PlayCircle,
  SearchCheck,
  Sparkles,
} from "lucide-react"
import { SCENARIOS } from "@/data/scenarios"
import { DashboardQuickCapture } from "@/components/views/dashboard-quick-capture"
import { DashboardRecentOutputs } from "@/components/views/dashboard-recent-outputs"
import { WorkflowBoardPreview } from "@/components/views/dashboard-workflow-board"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { InfoCallout } from "@/components/ui/info-callout"
import { SectionHeader } from "@/components/ui/section-header"
import { StatusBadge } from "@/components/ui/status-badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getWorkflowById, getLatestSessionForWorkflow } from "@/lib/control-tower"
import type {
  OutputRecord,
  QuickCaptureRecord,
  ReviewRecord,
  Scenario,
  ViewType,
  Workflow,
  WorkflowSession,
} from "@/types"

interface DashboardProps {
  selectedScenario: Scenario
  scenarioWorkflows: Workflow[]
  sessions: WorkflowSession[]
  activeSessions: WorkflowSession[]
  quickCaptures: QuickCaptureRecord[]
  recentOutputs: OutputRecord[]
  recentReviews: ReviewRecord[]
  nextActions: string[]
  onNavigate: (view: ViewType) => void
  onOpenWorkflow: (workflowId: string) => void
  onStartWorkflowSession: (workflowId: string) => void
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

export function Dashboard({
  selectedScenario,
  scenarioWorkflows,
  sessions,
  quickCaptures,
  recentOutputs,
  recentReviews,
  nextActions,
  onNavigate,
  onOpenWorkflow,
  onStartWorkflowSession,
  onQuickCapture,
}: DashboardProps) {
  const scenarioSessions = sessions.filter((session) => session.scenarioId === selectedScenario.id)
  const activeSession = scenarioSessions
    .filter((session) => session.status === "active" || session.status === "paused" || session.status === "blocked")
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))[0]

  const currentWorkflow = activeSession
    ? getWorkflowById(activeSession.workflowId)
    : scenarioWorkflows[0]

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
      return latestSession?.status === "blocked"
        ? { workflow, session: latestSession }
        : null
    })
    .filter((item): item is { workflow: Workflow; session: WorkflowSession } => !!item)

  const quickCaptureItems = quickCaptures.filter((capture) => capture.scenarioId === selectedScenario.id)
  const currentStep = activeSession && currentWorkflow
    ? currentWorkflow.steps.find((step) => step.id === activeSession.currentStepId) ?? currentWorkflow.steps[0]
    : currentWorkflow?.steps[0]
  const focusCtaLabel = activeSession ? "Continue" : currentWorkflow ? "Start workflow" : "Choose workflow"
  const focusDescription = currentStep
    ? `${currentStep.title} -> ${currentStep.expectedOutput}`
    : nextActions[0] ?? "Choose a workflow and start a session."
  const recentOutputSlice = recentOutputs.slice(0, 3)

  return (
    <div className="h-full overflow-auto bg-background px-4 py-4 md:px-6">
      <div className="mx-auto max-w-[1360px] space-y-4">
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
              <span className="rounded-full border border-border/70 bg-secondary/25 px-3 py-1 text-[11px] text-muted-foreground">
                {selectedScenario.name}
              </span>
              {blockedItems.length > 0 ? <StatusBadge status="blocked" /> : null}
            </div>
          </div>

          <TabsContent value="today" className="space-y-4">
            {blockedItems.length > 0 ? (
              <div className="space-y-3">
                <InfoCallout
                  variant="danger"
                  icon={OctagonAlert}
                  title={`${blockedItems.length} workflow${blockedItems.length > 1 ? "s are" : " is"} blocked`}
                  description={blockedItems.map((item) => item.workflow.title).join(", ")}
                />
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => onNavigate("workflows")}>
                    Review blockers
                  </Button>
                </div>
              </div>
            ) : null}

            <div className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
              <Card className="surface-panel rounded-3xl border-border/60">
                <CardContent className="p-5 md:p-6">
                  <SectionHeader
                    icon={PlayCircle}
                    title="Current Focus"
                    description="The one workflow that should own attention right now."
                  />
                  <div className="mt-4 rounded-3xl border border-primary/20 bg-primary/10 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="max-w-2xl">
                        <p className="text-lg font-semibold tracking-tight text-foreground">
                          {currentWorkflow?.title ?? "No workflow selected"}
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {focusDescription}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {activeSession ? <StatusBadge status={activeSession.status} /> : <StatusBadge status="inbox" />}
                          {currentStep ? (
                            <span className="rounded-full border border-border/70 bg-card/60 px-3 py-1 text-[11px] text-foreground">
                              {currentStep.title}
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {currentWorkflow ? (
                          <Button
                            onClick={() =>
                              activeSession ? onOpenWorkflow(currentWorkflow.id) : onStartWorkflowSession(currentWorkflow.id)
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
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="surface-panel rounded-3xl border-border/60">
                <CardContent className="p-5 md:p-6">
                  <SectionHeader
                    icon={Sparkles}
                    title="Quick Capture"
                    description="Capture task, prompt, idea, or decision without leaving the dashboard."
                  />
                  <div className="mt-4">
                    <DashboardQuickCapture
                      selectedScenario={selectedScenario}
                      selectedWorkflow={currentWorkflow ?? scenarioWorkflows[0]}
                      quickCaptures={quickCaptureItems}
                      onSave={onQuickCapture}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.4fr_0.6fr]">
              <Card className="surface-panel rounded-3xl border-border/60">
                <CardContent className="p-5 md:p-6">
                  <SectionHeader
                    icon={Compass}
                    title="Active Workflows"
                    description="Compact board preview for inbox, clarify, active, waiting, and done."
                    action={
                      <Button variant="outline" size="sm" onClick={() => onNavigate("workflows")}>
                        Open all workflows
                      </Button>
                    }
                  />
                  <div className="mt-5">
                    <WorkflowBoardPreview columns={boardItems} onOpenWorkflow={onOpenWorkflow} />
                  </div>
                </CardContent>
              </Card>

              <Card className="surface-panel rounded-3xl border-border/60">
                <CardContent className="p-5 md:p-6">
                  <SectionHeader
                    icon={SearchCheck}
                    title="Recent Outputs"
                    description="Only the latest three results, so the dashboard stays compact."
                  />
                  <div className="mt-4">
                    {recentOutputSlice.length > 0 ? (
                      <DashboardRecentOutputs
                        outputs={recentOutputSlice}
                        scenarios={SCENARIOS}
                        onOpenOutput={(output) => onOpenWorkflow(output.workflowId)}
                      />
                    ) : (
                      <EmptyState
                        icon={SearchCheck}
                        title="No recent outputs"
                        description="Outputs will appear here after a workflow step is completed and saved."
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="workflows" className="space-y-4">
            <Card className="surface-panel rounded-3xl border-border/60">
              <CardContent className="p-5 md:p-6">
                <SectionHeader
                  icon={Compass}
                  title="Workflow board"
                  description="Use this tab for the fuller board view without making Today feel heavy."
                />
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
                  <SectionHeader
                    icon={SearchCheck}
                    title="Review Signals"
                    description="What needs review or attention next."
                  />
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
                    description="Latest review records without leaving the dashboard."
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
                      <EmptyState icon={SearchCheck} title="No reviews yet" description="Create a daily or weekly review from the Reviews page once outputs start accumulating." />
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="outputs" className="space-y-4">
            <Card className="surface-panel rounded-3xl border-border/60">
              <CardContent className="p-5 md:p-6">
                <SectionHeader
                  icon={SearchCheck}
                  title="All Recent Outputs"
                  description="A cleaner outputs list without crowding the default dashboard."
                />
                <div className="mt-4">
                  {recentOutputs.length > 0 ? (
                    <DashboardRecentOutputs
                      outputs={recentOutputs.slice(0, 8)}
                      scenarios={SCENARIOS}
                      onOpenOutput={(output) => onOpenWorkflow(output.workflowId)}
                    />
                  ) : (
                    <EmptyState icon={SearchCheck} title="No outputs yet" description="Outputs appear here when workflow steps are saved." />
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
                  description="Keep the dashboard operational. Open the full Wiki when you want guidance, concepts, or onboarding detail."
                  action={
                    <Button onClick={() => onNavigate("wiki")}>
                      Open Wiki
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  }
                />
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {[
                    "Scenario -> Workflow -> Step -> Tool / Prompt / Context -> Execution -> Output -> Review",
                    "Use one active scenario when overloaded.",
                    "Every AI interaction should produce an output or decision.",
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
