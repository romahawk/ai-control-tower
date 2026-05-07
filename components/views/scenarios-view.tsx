"use client"

import type { ReactNode } from "react"
import { useEffect, useMemo, useState } from "react"
import {
  AlertTriangle,
  Compass,
  FolderKanban,
  GitBranch,
  NotebookText,
  PencilLine,
  PlayCircle,
  ScrollText,
  Sparkles,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { SCENARIOS } from "@/data/scenarios"
import { PROMPTS } from "@/data/prompts"
import { WORKFLOWS } from "@/data/workflows"
import { EmptyState } from "@/components/ui/empty-state"
import { PageHeader } from "@/components/ui/page-header"
import { ScenarioBadge } from "@/components/ui/scenario-badge"
import { SegmentedTabs } from "@/components/ui/segmented-tabs"
import { StatusBadge } from "@/components/ui/status-badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getScenarioIcon } from "@/lib/ui-meta"
import { cn } from "@/lib/utils"
import type {
  GoalRecord,
  OutputRecord,
  Project,
  QuickCaptureRecord,
  ReviewRecord,
  Scenario,
  WorkflowHealth,
  WorkflowSession,
} from "@/types"

interface ScenariosViewProps {
  selectedScenario: Scenario
  sessions: WorkflowSession[]
  recentOutputs: OutputRecord[]
  reviews: ReviewRecord[]
  quickCaptures: QuickCaptureRecord[]
  projects: Project[]
  goals: GoalRecord[]
  getWorkflowHealth: (workflowId: string) => WorkflowHealth | undefined
  onSelectScenario: (scenarioId: string) => void
  onOpenWorkflows: () => void
  onOpenProjects: () => void
  onOpenPrompts: () => void
  onOpenReviews: () => void
  onEditScenario: () => void
}

type ScenarioTab = "all" | "active" | "system" | "custom" | "archived"
type ScenarioPanelTab = "overview" | "workflows" | "projects" | "outputs" | "reviews"

const scenarioTabs: Array<{ value: ScenarioTab; label: string }> = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "system", label: "System" },
  { value: "custom", label: "Custom" },
  { value: "archived", label: "Archived" },
]

const panelTabs: Array<{ value: ScenarioPanelTab; label: string }> = [
  { value: "overview", label: "Overview" },
  { value: "workflows", label: "Workflows" },
  { value: "projects", label: "Projects" },
  { value: "outputs", label: "Outputs" },
  { value: "reviews", label: "Reviews" },
]

export function ScenariosView({
  selectedScenario,
  sessions,
  recentOutputs,
  reviews,
  quickCaptures,
  projects,
  goals,
  getWorkflowHealth,
  onSelectScenario,
  onOpenWorkflows,
  onOpenProjects,
  onOpenPrompts,
  onOpenReviews,
  onEditScenario,
}: ScenariosViewProps) {
  const [activeTab, setActiveTab] = useState<ScenarioTab>("all")
  const [panelTab, setPanelTab] = useState<ScenarioPanelTab>("overview")
  const [focusedScenarioId, setFocusedScenarioId] = useState(selectedScenario.id)

  const filteredScenarios = useMemo(() => {
    return SCENARIOS.filter((scenario) => {
      switch (activeTab) {
        case "active":
          return scenario.status === "active"
        case "system":
          return scenario.category !== "custom"
        case "custom":
          return scenario.category === "custom"
        case "archived":
          return scenario.status === "archived"
        default:
          return true
      }
    })
  }, [activeTab])

  useEffect(() => {
    setFocusedScenarioId(selectedScenario.id)
  }, [selectedScenario.id])

  useEffect(() => {
    if (filteredScenarios.some((scenario) => scenario.id === focusedScenarioId)) {
      return
    }

    setFocusedScenarioId(filteredScenarios[0]?.id ?? selectedScenario.id)
  }, [filteredScenarios, focusedScenarioId, selectedScenario.id])

  const focusedScenario =
    SCENARIOS.find((scenario) => scenario.id === focusedScenarioId) ?? selectedScenario

  const scenarioWorkflows = useMemo(
    () => WORKFLOWS.filter((workflow) => workflow.scenarioId === focusedScenario.id),
    [focusedScenario.id]
  )

  const scenarioProjects = useMemo(
    () =>
      projects
        .filter((project) => project.scenarioId === focusedScenario.id)
        .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt)),
    [focusedScenario.id, projects]
  )

  const scenarioOutputs = useMemo(
    () => recentOutputs.filter((output) => output.scenarioId === focusedScenario.id),
    [focusedScenario.id, recentOutputs]
  )

  const scenarioSessions = useMemo(
    () =>
      sessions
        .filter((session) => session.scenarioId === focusedScenario.id)
        .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt)),
    [focusedScenario.id, sessions]
  )

  const scenarioReviews = useMemo(
    () => reviews.filter((review) => review.scenarioId === focusedScenario.id),
    [focusedScenario.id, reviews]
  )

  const scenarioCaptures = useMemo(
    () => quickCaptures.filter((capture) => capture.scenarioId === focusedScenario.id),
    [focusedScenario.id, quickCaptures]
  )

  const scenarioGoals = useMemo(
    () => goals.filter((goal) => goal.scenarioId === focusedScenario.id),
    [focusedScenario.id, goals]
  )

  const scenarioPrompts = useMemo(
    () => PROMPTS.filter((prompt) => prompt.scenarioId === focusedScenario.id),
    [focusedScenario.id]
  )

  const blockedSessions = scenarioSessions.filter((session) => session.status === "blocked")
  const liveSessions = scenarioSessions.filter(
    (session) => session.status === "active" || session.status === "paused"
  )
  const unresolvedCaptures = scenarioCaptures.filter(
    (capture) => capture.status === "inbox" || capture.status === "clarify"
  )

  const workflowHealthEntries = scenarioWorkflows.map((workflow) => ({
    workflow,
    health: getWorkflowHealth(workflow.id),
  }))
  const unhealthyWorkflowCount = workflowHealthEntries.filter(
    ({ health }) => health && health.status !== "healthy"
  ).length

  const openLoopCount = blockedSessions.length + unresolvedCaptures.length + unhealthyWorkflowCount
  const latestOutput = scenarioOutputs[0]
  const latestReview = scenarioReviews[0]
  const latestSession = scenarioSessions[0]
  const activeProject = scenarioProjects.find((project) => project.status === "active") ?? scenarioProjects[0]
  const activeWorkflow =
    scenarioWorkflows.find((workflow) => liveSessions.some((session) => session.workflowId === workflow.id)) ??
    scenarioWorkflows.find((workflow) => focusedScenario.defaultWorkflowIds?.includes(workflow.id)) ??
    scenarioWorkflows[0]
  const nextAction =
    activeProject?.nextAction ??
    focusedScenario.nextAction ??
    activeWorkflow?.steps[0]?.title ??
    "Choose the next workflow worth moving."
  const targetOutput =
    focusedScenario.targetOutput ?? activeWorkflow?.output ?? "Visible output from the next executed workflow."
  const currentStep = activeWorkflow?.steps[0]
  const lastActivity = latestOutput?.updatedAt ?? latestSession?.updatedAt

  const handleOpenScenarioWorkflows = () => {
    onSelectScenario(focusedScenario.id)
    onOpenWorkflows()
  }

  const handleOpenScenarioProjects = () => {
    onSelectScenario(focusedScenario.id)
    onOpenProjects()
  }

  const handleOpenScenarioPrompts = () => {
    onSelectScenario(focusedScenario.id)
    onOpenPrompts()
  }

  const handleOpenScenarioReviews = () => {
    onSelectScenario(focusedScenario.id)
    onOpenReviews()
  }

  const railHeightClass = "xl:max-h-[calc(100vh-230px)] xl:overflow-auto xl:pr-1"

  return (
    <div className="h-full overflow-auto px-4 py-4 md:px-6">
      <div className="mx-auto max-w-[1460px] space-y-4">
        <PageHeader
          title="Scenarios"
          description="Scenario homes frame each execution domain so you can see motion, outputs, and next actions without hunting."
          icon={Compass}
          action={
            <>
              <button
                onClick={onEditScenario}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                <Sparkles className="h-4 w-4" />
                New scenario
              </button>
            </>
          }
        />

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ScenarioTab)} className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SegmentedTabs tabs={scenarioTabs} />
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <StatChip label="Scenarios" value={filteredScenarios.length} />
              <StatChip label="Active workflows" value={liveSessions.length} />
              <StatChip label="Open loops" value={openLoopCount} tone={openLoopCount > 0 ? "warning" : "neutral"} />
            </div>
          </div>

          <TabsContent value={activeTab} className="outline-none">
            <div className="grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)]">
              <div className={cn("space-y-3", railHeightClass)}>
                <div className="rounded-3xl border border-border/60 bg-card/75 p-3">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">Scenario rail</p>
                      <p className="text-xs text-muted-foreground">Pick the operating domain you want to run from.</p>
                    </div>
                    <span className="rounded-full border border-border/70 bg-secondary/20 px-2.5 py-1 text-[11px] text-muted-foreground">
                      {filteredScenarios.length} shown
                    </span>
                  </div>

                  <div className="space-y-2">
                    {filteredScenarios.map((scenario) => {
                      const Icon = getScenarioIcon(scenario.category)
                      const workflowCount = WORKFLOWS.filter((workflow) => workflow.scenarioId === scenario.id).length
                      const projectCount = projects.filter((project) => project.scenarioId === scenario.id).length
                      const scenarioOutputCount = recentOutputs.filter((output) => output.scenarioId === scenario.id).length
                      const isFocused = scenario.id === focusedScenario.id

                      return (
                        <button
                          key={scenario.id}
                          type="button"
                          onClick={() => setFocusedScenarioId(scenario.id)}
                          className={cn(
                            "w-full rounded-2xl border p-2.5 text-left transition",
                            isFocused
                              ? "border-primary/30 bg-primary/10 shadow-[0_0_0_1px_rgba(59,130,246,0.15)]"
                              : "border-border/60 bg-secondary/10 hover:border-primary/20 hover:bg-secondary/20"
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
                                  <Icon className="h-4 w-4" />
                                </div>
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-semibold text-foreground">{scenario.name}</p>
                                  <p className="line-clamp-1 text-xs text-muted-foreground">{scenario.description}</p>
                                </div>
                              </div>
                            </div>
                            {isFocused ? <span className="text-[11px] font-medium text-primary">Open</span> : null}
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <StatusBadge status={scenario.status} />
                            <span className="text-[11px] text-muted-foreground">
                              {workflowCount} workflows · {projectCount} projects · {scenarioOutputCount} outputs
                            </span>
                          </div>
                        </button>
                      )
                    })}

                    {filteredScenarios.length === 0 ? (
                      <EmptyState
                        icon={Compass}
                        title="No scenarios yet"
                        description="Create a scenario to anchor workflows, prompts, and reviews."
                      />
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-3xl border border-border/60 bg-card/75 p-4 shadow-sm">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={focusedScenario.status} />
                        <ScenarioBadge scenario={focusedScenario} />
                        {focusedScenario.priority ? (
                          <span className="rounded-full border border-border/70 bg-secondary/25 px-2.5 py-1 text-[11px] text-muted-foreground">
                            {focusedScenario.priority} priority
                          </span>
                        ) : null}
                        {focusedScenario.id === selectedScenario.id ? (
                          <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
                            Active scenario
                          </span>
                        ) : null}
                      </div>
                      <div>
                        <h2 className="text-2xl font-semibold tracking-tight text-foreground">{focusedScenario.name}</h2>
                        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{focusedScenario.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <StatChip label="Workflows" value={scenarioWorkflows.length} />
                        <StatChip label="Projects" value={scenarioProjects.length} />
                        <StatChip label="Outputs" value={scenarioOutputs.length} />
                        <StatChip label="Open loops" value={openLoopCount} tone={openLoopCount > 0 ? "warning" : "neutral"} />
                        <StatChip label="Goals" value={scenarioGoals.length} />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {focusedScenario.id !== selectedScenario.id ? (
                        <ActionButton onClick={() => onSelectScenario(focusedScenario.id)} variant="primary">
                          Set active
                        </ActionButton>
                      ) : null}
                      <ActionButton onClick={handleOpenScenarioWorkflows}>Open workflows</ActionButton>
                      <ActionButton onClick={handleOpenScenarioProjects}>Open projects</ActionButton>
                      <ActionButton onClick={handleOpenScenarioReviews}>Review</ActionButton>
                      <ActionButton onClick={onEditScenario}>
                        <PencilLine className="h-4 w-4" />
                        Edit
                      </ActionButton>
                    </div>
                  </div>
                </div>

                <Tabs
                  value={panelTab}
                  onValueChange={(value) => setPanelTab(value as ScenarioPanelTab)}
                  className="rounded-3xl border border-border/60 bg-card/75 p-4 shadow-sm"
                >
                  <div className="flex flex-col gap-4 border-b border-border/60 pb-4 lg:flex-row lg:items-center lg:justify-between">
                    <TabsList className="h-10 rounded-xl bg-secondary/20">
                      {panelTabs.map((tab) => (
                        <TabsTrigger key={tab.value} value={tab.value} className="rounded-lg px-3 text-xs sm:text-sm">
                          {tab.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    <div className="flex flex-wrap gap-2">
                      <MiniHelper label="Next action" value={nextAction} />
                      <MiniHelper
                        label="Last activity"
                        value={lastActivity ? new Date(lastActivity).toLocaleDateString() : "No activity"}
                      />
                    </div>
                  </div>

                  <TabsContent value="overview" className="pt-4">
                    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                      <div className="space-y-4">
                        <div className="grid gap-4 lg:grid-cols-2">
                          <CompactPanel
                            icon={PlayCircle}
                            title="Next action"
                            description={nextAction}
                            footer={
                              <div className="flex flex-wrap gap-2">
                                <ActionButton onClick={handleOpenScenarioWorkflows} variant="primary">
                                  Continue execution
                                </ActionButton>
                                <ActionButton onClick={handleOpenScenarioPrompts}>Open prompts</ActionButton>
                              </div>
                            }
                          >
                            <MetaRow label="Focus workflow" value={activeWorkflow?.title ?? "Choose a workflow"} />
                            <MetaRow label="Current step" value={currentStep?.title ?? "No step yet"} />
                          </CompactPanel>

                          <CompactPanel
                            icon={NotebookText}
                            title="Target output"
                            description={targetOutput}
                          >
                            <MetaRow
                              label="Visible signal"
                              value={latestOutput?.title ?? "No recent output yet"}
                            />
                            <MetaRow
                              label="Review pulse"
                              value={latestReview?.nextActions[0] ?? "No review signal yet"}
                            />
                          </CompactPanel>
                        </div>

                        <CompactPanel
                          icon={GitBranch}
                          title="Workflow motion"
                          description="The highest-leverage workflows in this scenario home."
                          footer={
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-xs text-muted-foreground">
                                {scenarioWorkflows.length > 3 ? `+${scenarioWorkflows.length - 3} more workflows` : "Full workflow set available"}
                              </span>
                              <ActionButton onClick={handleOpenScenarioWorkflows}>Open workflows</ActionButton>
                            </div>
                          }
                        >
                          <div className="space-y-2">
                            {workflowHealthEntries.slice(0, 3).map(({ workflow, health }) => (
                              <ListRow
                                key={workflow.id}
                                title={workflow.title}
                                description={workflow.goal}
                                badges={
                                  <>
                                    <StatusBadge status={workflow.status} />
                                    {health ? <StatusBadge status={health.status} /> : null}
                                  </>
                                }
                                meta={`${workflow.steps.length} steps`}
                              />
                            ))}
                          </div>
                        </CompactPanel>
                      </div>

                      <div className="space-y-4">
                        <CompactPanel
                          icon={FolderKanban}
                          title="Projects in motion"
                          description="Scenario containers carrying the current work."
                          footer={
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-xs text-muted-foreground">
                                {scenarioProjects.length > 2 ? `+${scenarioProjects.length - 2} more projects` : "Project list is current"}
                              </span>
                              <ActionButton onClick={handleOpenScenarioProjects}>Open projects</ActionButton>
                            </div>
                          }
                        >
                          {scenarioProjects.length > 0 ? (
                            <div className="space-y-2">
                              {scenarioProjects.slice(0, 2).map((project) => (
                                <ListRow
                                  key={project.id}
                                  title={project.name}
                                  description={project.nextAction}
                                  badges={<StatusBadge status={project.status} />}
                                  meta={`${project.workflowIds.length} workflows`}
                                />
                              ))}
                            </div>
                          ) : (
                            <CompactEmptyState
                              title="No projects yet"
                              description="Create a project when this scenario needs a stronger execution container."
                            />
                          )}
                        </CompactPanel>

                        <CompactPanel
                          icon={ScrollText}
                          title="Recent signal"
                          description="The latest visible output, review, or clarification pressure."
                        >
                          <div className="space-y-3">
                            <MetaRow label="Latest output" value={latestOutput?.title ?? "No outputs yet"} />
                            <MetaRow
                              label="Latest review"
                              value={latestReview?.nextActions[0] ?? "No review yet"}
                            />
                            <MetaRow
                              label="Needs clarification"
                              value={
                                unresolvedCaptures[0]?.content ?? "No inbox or clarify items are waiting here."
                              }
                            />
                          </div>
                        </CompactPanel>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="workflows" className="pt-4">
                    <div className="space-y-3">
                      {scenarioWorkflows.length > 0 ? (
                        workflowHealthEntries.map(({ workflow, health }) => (
                          <ListRow
                            key={workflow.id}
                            title={workflow.title}
                            description={workflow.goal}
                            badges={
                              <>
                                <StatusBadge status={workflow.status} />
                                {health ? <StatusBadge status={health.status} /> : null}
                              </>
                            }
                            meta={`${workflow.steps.length} steps · ${workflow.output}`}
                            action={
                              <ActionButton onClick={handleOpenScenarioWorkflows} variant="primary">
                                Open
                              </ActionButton>
                            }
                          />
                        ))
                      ) : (
                        <CompactEmptyState
                          title="No workflows yet"
                          description="Add a workflow to turn this scenario into an execution surface."
                        />
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="projects" className="pt-4">
                    <div className="space-y-3">
                      {scenarioProjects.length > 0 ? (
                        scenarioProjects.map((project) => (
                          <ListRow
                            key={project.id}
                            title={project.name}
                            description={project.nextAction}
                            badges={<StatusBadge status={project.status} />}
                            meta={`${project.workflowIds.length} workflows · ${project.priority} priority`}
                            action={<ActionButton onClick={handleOpenScenarioProjects}>Open</ActionButton>}
                          />
                        ))
                      ) : (
                        <CompactEmptyState
                          title="No projects yet"
                          description="This scenario can still run from workflows alone, but projects help hold multi-step work."
                        />
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="outputs" className="pt-4">
                    <div className="space-y-3">
                      {scenarioOutputs.length > 0 ? (
                        scenarioOutputs.slice(0, 6).map((output) => (
                          <ListRow
                            key={output.id}
                            title={output.title}
                            description={output.content}
                            meta={new Date(output.createdAt).toLocaleDateString()}
                            badges={<span className="rounded-full border border-border/70 bg-secondary/20 px-2 py-1 text-[11px] text-muted-foreground">{output.type}</span>}
                          />
                        ))
                      ) : (
                        <CompactEmptyState
                          title="No outputs yet"
                          description="Run a workflow in this scenario to start generating visible outputs."
                        />
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="reviews" className="pt-4">
                    <div className="grid gap-4 lg:grid-cols-[1fr_0.85fr]">
                      <div className="space-y-3">
                        {scenarioReviews.length > 0 ? (
                          scenarioReviews.slice(0, 5).map((review) => (
                            <ListRow
                              key={review.id}
                              title={`${review.type[0]?.toUpperCase()}${review.type.slice(1)} review`}
                              description={review.nextActions[0] ?? "No next action generated."}
                              meta={new Date(review.createdAt).toLocaleDateString()}
                              action={<ActionButton onClick={handleOpenScenarioReviews}>Open</ActionButton>}
                            />
                          ))
                        ) : (
                          <CompactEmptyState
                            title="No reviews yet"
                            description="Run a review to turn activity into decisions and next actions."
                          />
                        )}
                      </div>

                      <div className="space-y-4">
                        <CompactPanel
                          icon={AlertTriangle}
                          title="Open loops"
                          description="Pressure points that still need clarification or intervention."
                        >
                          <div className="space-y-3">
                            <MetaRow label="Blocked sessions" value={String(blockedSessions.length)} />
                            <MetaRow label="Unresolved captures" value={String(unresolvedCaptures.length)} />
                            <MetaRow label="Unhealthy workflows" value={String(unhealthyWorkflowCount)} />
                          </div>
                        </CompactPanel>

                        <CompactPanel
                          icon={Compass}
                          title="Prompt set"
                          description="Prompt assets linked to this scenario."
                          footer={<ActionButton onClick={handleOpenScenarioPrompts}>Open prompts</ActionButton>}
                        >
                          <MetaRow label="Scenario prompts" value={String(scenarioPrompts.length)} />
                          <MetaRow label="Goals linked" value={String(scenarioGoals.length)} />
                        </CompactPanel>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function ActionButton({
  children,
  onClick,
  variant = "secondary",
}: {
  children: ReactNode
  onClick: () => void
  variant?: "primary" | "secondary"
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-xl px-3 text-sm font-medium transition",
        variant === "primary"
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "border border-border/70 bg-secondary/20 text-foreground hover:bg-secondary/35"
      )}
    >
      {children}
    </button>
  )
}

function CompactPanel({
  icon: Icon,
  title,
  description,
  children,
  footer,
}: {
  icon: LucideIcon
  title: string
  description: string
  children?: ReactNode
  footer?: ReactNode
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-secondary/10 p-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      {children ? <div className="mt-4">{children}</div> : null}
      {footer ? <div className="mt-4">{footer}</div> : null}
    </div>
  )
}

function ListRow({
  title,
  description,
  badges,
  meta,
  action,
}: {
  title: string
  description: string
  badges?: ReactNode
  meta?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-secondary/10 p-3 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          {badges ? <div className="flex flex-wrap gap-2">{badges}</div> : null}
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{description}</p>
        {meta ? <p className="mt-2 text-[11px] text-muted-foreground">{meta}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border/50 py-2 last:border-b-0 last:pb-0 first:pt-0">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="max-w-[70%] text-right text-sm text-foreground">{value}</span>
    </div>
  )
}

function MiniHelper({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-secondary/10 px-3 py-2">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 max-w-[280px] truncate text-xs text-foreground">{value}</p>
    </div>
  )
}

function StatChip({
  label,
  value,
  tone = "neutral",
}: {
  label: string
  value: string | number
  tone?: "neutral" | "warning"
}) {
  return (
    <span
      className={cn(
        "rounded-full border px-2.5 py-1 text-[11px]",
        tone === "warning"
          ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
          : "border-border/70 bg-secondary/20 text-muted-foreground"
      )}
    >
      {label}: <span className="text-foreground">{value}</span>
    </span>
  )
}

function CompactEmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-secondary/10 p-4">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
