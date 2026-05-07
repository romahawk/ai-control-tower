"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Archive,
  CheckCircle2,
  ChevronRight,
  Copy,
  Database,
  FolderKanban,
  PauseCircle,
  Pencil,
  PlayCircle,
  Plus,
  Sparkles,
  Target,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { EmptyState } from "@/components/ui/empty-state"
import { Input } from "@/components/ui/input"
import { PageHeader } from "@/components/ui/page-header"
import { ScenarioBadge } from "@/components/ui/scenario-badge"
import { SectionHeader } from "@/components/ui/section-header"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SegmentedTabs } from "@/components/ui/segmented-tabs"
import { StatusBadge } from "@/components/ui/status-badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { SCENARIOS } from "@/data/scenarios"
import { WORKFLOWS } from "@/data/workflows"
import { getContextIcon } from "@/lib/ui-meta"
import type {
  ContextRecord,
  GoalRecord,
  GoalStatus,
  OutputRecord,
  PriorityLevel,
  Project,
  ProjectStatus,
  Scenario,
  Workflow,
  WorkflowSession,
} from "@/types"

interface ProjectsViewProps {
  selectedScenario: Scenario
  selectedProject?: Project
  projects: Project[]
  sessions: WorkflowSession[]
  recentOutputs: OutputRecord[]
  contexts: ContextRecord[]
  goals: GoalRecord[]
  onSelectProject: (projectId: string) => void
  onOpenWorkflows: () => void
  onOpenScenario: (scenarioId: string) => void
  onSaveProject: (params: {
    id?: string
    name: string
    description: string
    priority: PriorityLevel
    scenarioId: string
    workflowIds: string[]
    nextAction: string
    ownerNote?: string
    status?: ProjectStatus
  }) => void
  onUpdateProjectStatus: (projectId: string, status: ProjectStatus) => void
  onSaveGoal: (params: {
    id?: string
    title: string
    description: string
    status: GoalStatus
    scenarioId: string
    projectId: string
    workflowIds: string[]
    targetValue: number
    currentValue: number
    unit: string
    dueDate?: string
  }) => void
  onUpdateGoalStatus: (goalId: string, status: GoalStatus) => void
  onSaveContext: (
    contextRecord: Omit<ContextRecord, "id" | "createdAt" | "updatedAt"> & {
      id?: string
    }
  ) => void
  onDeleteContext: (contextId: string) => void
}

type ProjectTab = "all" | "active" | "paused" | "completed" | "archived"
type EditorMode = "view" | "create" | "edit"
type ProjectPanelTab = "overview" | "goals" | "workflows" | "outputs" | "sessions" | "context"

const projectTabs: Array<{ value: ProjectTab; label: string }> = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "completed", label: "Completed" },
  { value: "archived", label: "Archived" },
]

const panelTabs: Array<{ value: ProjectPanelTab; label: string }> = [
  { value: "overview", label: "Overview" },
  { value: "goals", label: "Goals" },
  { value: "workflows", label: "Workflows" },
  { value: "outputs", label: "Outputs" },
  { value: "sessions", label: "Sessions" },
  { value: "context", label: "Context" },
]

const laneOrder: ProjectStatus[] = ["active", "paused", "completed", "archived"]

interface ProjectDraft {
  id?: string
  name: string
  description: string
  priority: PriorityLevel
  scenarioId: string
  workflowIds: string[]
  nextAction: string
  ownerNote: string
  status: ProjectStatus
}

interface GoalDraft {
  id?: string
  title: string
  description: string
  status: GoalStatus
  workflowIds: string[]
  targetValue: string
  currentValue: string
  unit: string
  dueDate: string
}

function makeDraft(project?: Project, fallbackScenarioId?: string): ProjectDraft {
  return {
    id: project?.id,
    name: project?.name ?? "",
    description: project?.description ?? "",
    priority: project?.priority ?? "medium",
    scenarioId: project?.scenarioId ?? fallbackScenarioId ?? SCENARIOS[0]?.id ?? "",
    workflowIds: project?.workflowIds ?? [],
    nextAction: project?.nextAction ?? "",
    ownerNote: project?.ownerNote ?? "",
    status: project?.status ?? "active",
  }
}

function truncate(text: string, max = 88) {
  if (text.length <= max) return text
  return `${text.slice(0, max - 1)}…`
}

function makeGoalDraft(goal?: GoalRecord): GoalDraft {
  return {
    id: goal?.id,
    title: goal?.title ?? "",
    description: goal?.description ?? "",
    status: goal?.status ?? "active",
    workflowIds: goal?.workflowIds ?? [],
    targetValue: goal ? String(goal.targetValue) : "",
    currentValue: goal ? String(goal.currentValue) : "",
    unit: goal?.unit ?? "outputs",
    dueDate: goal?.dueDate ?? "",
  }
}

function getLifecycleLabel(project: ProjectStatus) {
  switch (project) {
    case "active":
      return "Pause, complete, or archive"
    case "paused":
      return "Resume or archive"
    case "completed":
      return "Reopen or archive"
    case "archived":
      return "Restore project"
    default:
      return "Update status"
  }
}

export function ProjectsView({
  selectedScenario,
  selectedProject,
  projects,
  sessions,
  recentOutputs,
  contexts,
  goals,
  onSelectProject,
  onOpenWorkflows,
  onOpenScenario,
  onSaveProject,
  onUpdateProjectStatus,
  onSaveGoal,
  onUpdateGoalStatus,
  onSaveContext,
  onDeleteContext,
}: ProjectsViewProps) {
  const [activeTab, setActiveTab] = useState<ProjectTab>("all")
  const [focusedProjectId, setFocusedProjectId] = useState(selectedProject?.id)
  const [mode, setMode] = useState<EditorMode>("view")
  const [panelTab, setPanelTab] = useState<ProjectPanelTab>("overview")
  const [draft, setDraft] = useState<ProjectDraft>(makeDraft(selectedProject, selectedScenario.id))
  const [copiedContext, setCopiedContext] = useState(false)
  const [contextTitle, setContextTitle] = useState("")
  const [contextContent, setContextContent] = useState("")
  const [contextType, setContextType] = useState<ContextRecord["type"]>("project")
  const [editingContextId, setEditingContextId] = useState<string | undefined>()
  const [contextQuery, setContextQuery] = useState("")
  const [goalDraft, setGoalDraft] = useState<GoalDraft>(makeGoalDraft())

  useEffect(() => {
    if (mode !== "view") return
    setFocusedProjectId(selectedProject?.id)
    setDraft(makeDraft(selectedProject, selectedScenario.id))
  }, [mode, selectedProject, selectedScenario.id])

  const filteredProjects = useMemo(
    () => projects.filter((project) => (activeTab === "all" ? true : project.status === activeTab)),
    [activeTab, projects]
  )

  const focusedProject =
    (mode === "view" ? projects.find((project) => project.id === focusedProjectId) : undefined) ??
    selectedProject ??
    filteredProjects[0]

  const panelProject = mode === "view" ? focusedProject : undefined
  const currentScenario =
    panelProject
      ? SCENARIOS.find((scenario) => scenario.id === panelProject.scenarioId) ?? selectedScenario
      : SCENARIOS.find((scenario) => scenario.id === draft.scenarioId) ?? selectedScenario

  const draftWorkflows = WORKFLOWS.filter((workflow) => workflow.scenarioId === draft.scenarioId)

  const getProjectWorkflows = (project: Project) =>
    WORKFLOWS.filter((workflow) => project.workflowIds.includes(workflow.id))

  const getProjectSessions = (project: Project) =>
    sessions
      .filter(
        (session) =>
          session.scenarioId === project.scenarioId && project.workflowIds.includes(session.workflowId)
      )
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))

  const getProjectOutputs = (project: Project) =>
    recentOutputs
      .filter(
        (output) =>
          output.scenarioId === project.scenarioId && project.workflowIds.includes(output.workflowId)
      )
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt))

  const laneGroups = laneOrder.map((status) => ({
    status,
    projects: filteredProjects.filter((project) => project.status === status),
  }))

  const panelWorkflows = panelProject ? getProjectWorkflows(panelProject) : []
  const panelSessions = panelProject ? getProjectSessions(panelProject) : []
  const panelOutputs = panelProject ? getProjectOutputs(panelProject) : []
  const panelGoals = panelProject
    ? goals
        .filter((goal) => goal.projectId === panelProject.id)
        .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
    : []
  const panelContexts = panelProject
    ? contexts
        .filter((context) => {
          if (context.projectId === panelProject.id) {
            return true
          }
          if (context.workflowId && panelProject.workflowIds.includes(context.workflowId)) {
            return true
          }
          return context.scenarioId === panelProject.scenarioId
        })
        .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
    : []
  const normalizedContextQuery = contextQuery.trim().toLowerCase()
  const filteredPanelContexts = panelContexts.filter((context) => {
    if (!normalizedContextQuery) return true
    return (
      context.title.toLowerCase().includes(normalizedContextQuery) ||
      context.content.toLowerCase().includes(normalizedContextQuery) ||
      context.tags?.some((tag) => tag.toLowerCase().includes(normalizedContextQuery))
    )
  })
  const ownedProjectContexts = filteredPanelContexts.filter((context) => context.projectId === panelProject?.id)
  const inheritedProjectContexts = filteredPanelContexts.filter((context) => context.projectId !== panelProject?.id)
  const latestWorkflow = panelWorkflows[0]
  const latestOutput = panelOutputs[0]
  const latestSession = panelSessions[0]
  const activeGoals = panelGoals.filter((goal) => goal.status === "active")
  const expectedOutput = latestWorkflow?.output ?? "Visible project output"
  const reviewSignal = latestSession
    ? `Last activity ${new Date(latestSession.updatedAt).toLocaleDateString()}`
    : "No review signal yet"

  const activeCount = projects.filter((project) => project.status === "active").length
  const linkedWorkflowCount = projects.reduce((count, project) => count + project.workflowIds.length, 0)
  const outputCount = projects.reduce((count, project) => count + getProjectOutputs(project).length, 0)

  const startNewProject = () => {
    setMode("create")
    setPanelTab("overview")
    setFocusedProjectId(undefined)
    setDraft(makeDraft(undefined, selectedScenario.id))
  }

  const startEditingProject = (project: Project) => {
    setMode("edit")
    setDraft(makeDraft(project, project.scenarioId))
  }

  const cancelEditing = () => {
    setMode("view")
    setDraft(makeDraft(selectedProject, selectedScenario.id))
  }

  const handleSave = () => {
    if (
      !draft.name.trim() ||
      !draft.description.trim() ||
      !draft.nextAction.trim() ||
      draft.workflowIds.length === 0
    ) {
      return
    }

    onSaveProject({
      ...draft,
      name: draft.name.trim(),
      description: draft.description.trim(),
      nextAction: draft.nextAction.trim(),
      ownerNote: draft.ownerNote.trim(),
    })

    setMode("view")
  }

  const toggleWorkflow = (workflowId: string, checked: boolean) => {
    setDraft((current) => ({
      ...current,
      workflowIds: checked
        ? [...current.workflowIds, workflowId]
        : current.workflowIds.filter((id) => id !== workflowId),
    }))
  }

  const handleCopyContext = async () => {
    if (!panelProject) return
    const payload = [
      `Project: ${panelProject.name}`,
      `Scenario: ${currentScenario.name}`,
      `Status: ${panelProject.status}`,
      `Priority: ${panelProject.priority}`,
      `Next action: ${panelProject.nextAction}`,
      `Workflows: ${panelWorkflows.map((workflow) => workflow.title).join(", ") || "None"}`,
      `Owner note: ${panelProject.ownerNote || "None"}`,
      `Vault context: ${panelContexts.map((context) => `${context.title}: ${context.content}`).join(" | ") || "None"}`,
    ].join("\n")

    await navigator.clipboard.writeText(payload)
    setCopiedContext(true)
    window.setTimeout(() => setCopiedContext(false), 1500)
  }

  const continueWorkflow = () => {
    if (!panelProject) return
    onSelectProject(panelProject.id)
    onOpenWorkflows()
  }

  const saveProjectContext = () => {
    if (!panelProject || !contextTitle.trim() || !contextContent.trim()) {
      return
    }

    onSaveContext({
      id: editingContextId,
      title: contextTitle.trim(),
      content: contextContent.trim(),
      type: contextType,
      projectId: panelProject.id,
      scenarioId: panelProject.scenarioId,
      tags: [currentScenario.category, "project-vault"],
    })

    setContextTitle("")
    setContextContent("")
    setContextType("project")
    setEditingContextId(undefined)
  }

  const saveGoal = () => {
    if (
      !panelProject ||
      !goalDraft.title.trim() ||
      !goalDraft.description.trim() ||
      !goalDraft.targetValue.trim() ||
      !goalDraft.currentValue.trim()
    ) {
      return
    }

    onSaveGoal({
      id: goalDraft.id,
      title: goalDraft.title.trim(),
      description: goalDraft.description.trim(),
      status: goalDraft.status,
      scenarioId: panelProject.scenarioId,
      projectId: panelProject.id,
      workflowIds: goalDraft.workflowIds,
      targetValue: Number(goalDraft.targetValue),
      currentValue: Number(goalDraft.currentValue),
      unit: goalDraft.unit.trim() || "outputs",
      dueDate: goalDraft.dueDate || undefined,
    })

    setGoalDraft(makeGoalDraft())
  }

  const lifecycleActions = (project: Project) => {
    switch (project.status) {
      case "active":
        return [
          { label: "Pause", status: "paused" as const, icon: PauseCircle },
          { label: "Complete", status: "completed" as const, icon: CheckCircle2 },
          { label: "Archive", status: "archived" as const, icon: Archive },
        ]
      case "paused":
        return [
          { label: "Resume", status: "active" as const, icon: PlayCircle },
          { label: "Archive", status: "archived" as const, icon: Archive },
        ]
      case "completed":
        return [
          { label: "Reopen", status: "active" as const, icon: PlayCircle },
          { label: "Archive", status: "archived" as const, icon: Archive },
        ]
      case "archived":
        return [{ label: "Restore", status: "active" as const, icon: PlayCircle }]
      default:
        return []
    }
  }

  return (
    <div className="h-full overflow-auto px-4 py-4 md:px-6">
      <div className="mx-auto max-w-[1560px] space-y-4">
        <PageHeader
          title="Projects"
          description="Execution containers that connect scenarios, workflows, outputs, and decisions."
          icon={FolderKanban}
          actionLabel="New project"
          actionIcon={Sparkles}
          onAction={startNewProject}
          className="gap-3"
        />

        <div className="flex flex-wrap items-center gap-2">
          {[
            { label: "Active", value: activeCount },
            { label: "Linked workflows", value: linkedWorkflowCount },
            { label: "Outputs", value: outputCount },
          ].map((chip) => (
            <div
              key={chip.label}
              className="rounded-full border border-border/70 bg-secondary/25 px-3 py-1.5 text-xs text-foreground"
            >
              <span className="font-semibold">{chip.label}:</span> {chip.value}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium">Project flow:</span>
          <span>Choose project</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span>Run workflow</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span>Save output</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span>Review decision</span>
          <button
            onClick={() => onOpenScenario(selectedScenario.id)}
            className="ml-1 text-primary transition hover:opacity-80"
          >
            Learn
          </button>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ProjectTab)} className="space-y-4">
          <SegmentedTabs tabs={projectTabs} />
          <TabsContent value={activeTab}>
            <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
              <div className="space-y-3">
                <div className="rounded-3xl border border-border/60 bg-card/70 p-3 lg:hidden">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">
                    Project selector
                  </p>
                  <Select
                    value={panelProject?.id}
                    onValueChange={(value) => {
                      setMode("view")
                      setFocusedProjectId(value)
                      onSelectProject(value)
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredProjects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Card className="surface-panel hidden rounded-3xl border-border/60 py-0 lg:block">
                  <CardContent className="space-y-3 p-3">
                    <SectionHeader
                      icon={FolderKanban}
                      title="Project Rail"
                      description="Compact status lanes for choosing one project."
                    />

                    {laneGroups.map((lane) => (
                      <div key={lane.status} className="space-y-2 rounded-2xl border border-border/60 bg-secondary/10 p-2.5">
                        <div className="flex items-center justify-between gap-2 px-1">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">
                            {lane.status}
                          </p>
                          <span className="text-[10px] text-muted-foreground">
                            {lane.projects.length}
                          </span>
                        </div>

                        {lane.projects.map((project) => {
                          const isSelected = mode === "view" && project.id === panelProject?.id
                          const scenario = SCENARIOS.find((item) => item.id === project.scenarioId)
                          const outputs = getProjectOutputs(project)

                          return (
                            <button
                              key={project.id}
                              onClick={() => {
                                setMode("view")
                                setFocusedProjectId(project.id)
                                onSelectProject(project.id)
                              }}
                              className={`w-full rounded-2xl border px-3 py-3 text-left transition-all duration-150 ${
                                isSelected
                                  ? "border-primary/35 bg-primary/10 shadow-[0_8px_28px_rgba(37,99,235,0.14)]"
                                  : "border-border/70 bg-background/70 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-secondary/20"
                              }`}
                              title={project.description}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-semibold text-foreground">{project.name}</p>
                                {project.priority !== "low" ? (
                                  <span className="rounded-full border border-border/70 bg-secondary/25 px-2 py-0.5 text-[10px] text-muted-foreground">
                                    {project.priority}
                                  </span>
                                ) : null}
                              </div>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {scenario?.name ?? project.scenarioId} · {project.workflowIds.length} workflows · {outputs.length} outputs
                              </p>
                              <div className="mt-2 flex items-center gap-2">
                                <StatusBadge status={project.status} />
                                <ScenarioBadge scenario={scenario ?? selectedScenario} />
                              </div>
                              <p className="mt-2 text-xs text-muted-foreground">
                                {truncate(project.description, 64)}
                              </p>
                            </button>
                          )
                        })}

                        {lane.projects.length === 0 ? (
                          <div className="rounded-xl border border-dashed border-border/60 px-3 py-4 text-center text-xs text-muted-foreground">
                            No projects here.
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                {mode === "view" && panelProject ? (
                  <Card className="surface-panel rounded-3xl border-border/60">
                    <CardContent className="space-y-4 p-5">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="max-w-3xl">
                          <div className="flex flex-wrap items-center gap-2">
                            <StatusBadge status={panelProject.status} />
                            <ScenarioBadge scenario={currentScenario} />
                            {panelProject.priority !== "low" ? (
                              <span className="rounded-full border border-border/70 bg-secondary/25 px-2.5 py-1 text-[11px] text-muted-foreground">
                                {panelProject.priority} priority
                              </span>
                            ) : null}
                          </div>
                          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                            {panelProject.name}
                          </h2>
                          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground line-clamp-2">
                            {panelProject.description}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <Button onClick={continueWorkflow}>
                            <PlayCircle className="h-4 w-4" />
                            Continue
                          </Button>
                          <Button variant="outline" onClick={onOpenWorkflows}>
                            Open workflows
                          </Button>
                          <Button variant="outline" onClick={() => startEditingProject(panelProject)}>
                            Edit
                          </Button>
                          <Select onValueChange={(value) => onUpdateProjectStatus(panelProject.id, value as ProjectStatus)}>
                            <SelectTrigger className="h-10 min-w-[190px] border-border/70 bg-secondary/20">
                              <SelectValue placeholder={getLifecycleLabel(panelProject.status)} />
                            </SelectTrigger>
                            <SelectContent>
                              {lifecycleActions(panelProject).map((action) => (
                                <SelectItem key={action.label} value={action.status}>
                                  {action.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid gap-3 xl:grid-cols-[1.15fr_0.85fr]">
                        <div className="rounded-3xl border border-primary/20 bg-primary/8 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-primary/85">
                            Next action
                          </p>
                          <p className="mt-2 text-sm font-medium text-foreground">
                            {panelProject.nextAction || "Choose the next concrete move for this project."}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                            <span className="rounded-full border border-border/70 bg-background/60 px-2.5 py-1">
                              Expected output: {expectedOutput}
                            </span>
                            <span className="rounded-full border border-border/70 bg-background/60 px-2.5 py-1">
                              {reviewSignal}
                            </span>
                          </div>
                          <div className="mt-4">
                            <Button size="sm" onClick={continueWorkflow}>
                              Continue workflow
                            </Button>
                          </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                          <div className="rounded-2xl border border-border/60 bg-secondary/15 p-4">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">
                              Scenario
                            </p>
                            <p className="mt-2 text-sm font-medium text-foreground">{currentScenario.name}</p>
                          </div>
                          <div className="rounded-2xl border border-border/60 bg-secondary/15 p-4">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">
                              Workflows
                            </p>
                            <p className="mt-2 text-sm font-medium text-foreground">{panelWorkflows.length}</p>
                          </div>
                          <div className="rounded-2xl border border-border/60 bg-secondary/15 p-4">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">
                              Outputs
                            </p>
                            <p className="mt-2 text-sm font-medium text-foreground">{panelOutputs.length}</p>
                          </div>
                        </div>
                      </div>

                      <Tabs value={panelTab} onValueChange={(value) => setPanelTab(value as ProjectPanelTab)} className="space-y-4">
                        <TabsList className="w-full justify-start overflow-x-auto rounded-2xl bg-secondary/20 p-1">
                          {panelTabs.map((tab) => (
                            <TabsTrigger key={tab.value} value={tab.value} className="px-4">
                              {tab.label}
                            </TabsTrigger>
                          ))}
                        </TabsList>

                        <TabsContent value="overview" className="space-y-4">
                          <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                            <Card className="rounded-3xl border-border/60 bg-card/60">
                              <CardContent className="p-4">
                                <SectionHeader
                                  icon={PlayCircle}
                                  title="Linked workflows"
                                  description="The few workflows this project currently depends on."
                                  action={
                                    panelWorkflows.length > 4 ? (
                                      <button
                                        onClick={() => setPanelTab("workflows")}
                                        className="text-xs font-medium text-primary transition hover:opacity-80"
                                      >
                                        View all workflows
                                      </button>
                                    ) : undefined
                                  }
                                />
                                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                  {panelWorkflows.slice(0, 4).map((workflow, index) => (
                                    <div
                                      key={workflow.id}
                                      className="group rounded-2xl border border-border/60 bg-secondary/15 p-4 transition duration-150 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-secondary/25"
                                    >
                                      <div className="flex items-center justify-between gap-2">
                                        <div className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary/85">
                                          Step {index + 1}
                                        </div>
                                        <StatusBadge status={workflow.status} />
                                      </div>
                                      <p className="mt-3 text-sm font-semibold text-foreground">{workflow.title}</p>
                                      <p className="mt-1 text-xs text-muted-foreground">
                                        {truncate(workflow.goal, 82)}
                                      </p>
                                      <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                                        <span>{workflow.frequency}</span>
                                        <button
                                          onClick={continueWorkflow}
                                          className="text-primary transition hover:opacity-80"
                                        >
                                          Continue
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>

                            <div className="grid gap-4">
                              <Card className="rounded-3xl border-border/60 bg-card/60">
                                <CardContent className="p-4">
                                  <SectionHeader
                                    icon={Target}
                                    title="Active goals"
                                    description="What this project is trying to change, not just what it is doing."
                                    action={
                                      panelGoals.length > 0 ? (
                                        <button
                                          onClick={() => setPanelTab("goals")}
                                          className="text-xs font-medium text-primary transition hover:opacity-80"
                                        >
                                          Open goals
                                        </button>
                                      ) : undefined
                                    }
                                  />
                                  <div className="mt-4 space-y-3">
                                    {activeGoals.length > 0 ? (
                                      activeGoals.slice(0, 2).map((goal) => {
                                        const progressPercent = goal.targetValue > 0
                                          ? Math.min((goal.currentValue / goal.targetValue) * 100, 100)
                                          : 0
                                        return (
                                          <div key={goal.id} className="rounded-2xl border border-border/60 bg-secondary/15 p-4">
                                            <div className="flex items-start justify-between gap-2">
                                              <div>
                                                <p className="text-sm font-semibold text-foreground">{goal.title}</p>
                                                <p className="mt-1 text-xs text-muted-foreground">{goal.description}</p>
                                              </div>
                                              <StatusBadge status={goal.status} />
                                            </div>
                                            <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary/40">
                                              <div className="h-full rounded-full bg-primary" style={{ width: `${progressPercent}%` }} />
                                            </div>
                                            <p className="mt-2 text-[11px] text-muted-foreground">
                                              {goal.currentValue}/{goal.targetValue} {goal.unit}
                                              {goal.dueDate ? ` · due ${new Date(goal.dueDate).toLocaleDateString()}` : ""}
                                            </p>
                                          </div>
                                        )
                                      })
                                    ) : (
                                      <EmptyState
                                        icon={Target}
                                        title="No active goals yet"
                                        description="Add a goal so the project has a measurable direction."
                                      />
                                    )}
                                  </div>
                                </CardContent>
                              </Card>

                              <Card className="rounded-3xl border-border/60 bg-card/60">
                                <CardContent className="p-4">
                                  <SectionHeader
                                    icon={Sparkles}
                                    title="Latest output"
                                    description="Visible progress from this project."
                                  />
                                  <div className="mt-4">
                                    {latestOutput ? (
                                      <div className="rounded-2xl border border-border/60 bg-secondary/15 p-4">
                                        <p className="text-sm font-semibold text-foreground">{latestOutput.title}</p>
                                        <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                                          {latestOutput.content}
                                        </p>
                                        <p className="mt-3 text-[11px] text-muted-foreground">
                                          {new Date(latestOutput.createdAt).toLocaleDateString()}
                                        </p>
                                      </div>
                                    ) : (
                                      <div className="rounded-2xl border border-dashed border-border/60 px-4 py-6">
                                        <EmptyState
                                          icon={Sparkles}
                                          title="No outputs yet"
                                          description="Run a workflow and save an output to create visible progress."
                                        />
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>

                              <Card className="rounded-3xl border-border/60 bg-card/60">
                                <CardContent className="p-4">
                                  <SectionHeader
                                    icon={FolderKanban}
                                    title="Latest session"
                                    description="The most recent execution signal."
                                  />
                                  <div className="mt-4">
                                    {latestSession ? (
                                      <div className="rounded-2xl border border-border/60 bg-secondary/15 p-4">
                                        <div className="flex items-center justify-between gap-2">
                                          <p className="text-sm font-semibold text-foreground">
                                            {WORKFLOWS.find((workflow) => workflow.id === latestSession.workflowId)?.title ??
                                              latestSession.workflowId}
                                          </p>
                                          <StatusBadge status={latestSession.status} />
                                        </div>
                                        <p className="mt-2 text-[11px] text-muted-foreground">
                                          Updated {new Date(latestSession.updatedAt).toLocaleString()}
                                        </p>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                          {latestSession.summary ||
                                            latestSession.resumeNote ||
                                            latestSession.blockerNote ||
                                            "No session summary yet."}
                                        </p>
                                      </div>
                                    ) : (
                                      <div className="rounded-2xl border border-dashed border-border/60 px-4 py-6">
                                        <EmptyState
                                          icon={PlayCircle}
                                          title="No sessions yet"
                                          description="Sessions appear after a workflow step is run."
                                        />
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="goals">
                          <Card className="rounded-3xl border-border/60 bg-card/60">
                            <CardContent className="space-y-4 p-4">
                              <SectionHeader
                                icon={Target}
                                title="Project goals"
                                description="Attach measurable goals to this project and keep workflow effort aligned."
                              />

                              <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                                <div className="space-y-3">
                                  {panelGoals.length > 0 ? (
                                    panelGoals.map((goal) => {
                                      const progressPercent = goal.targetValue > 0
                                        ? Math.min((goal.currentValue / goal.targetValue) * 100, 100)
                                        : 0
                                      return (
                                        <div key={goal.id} className="rounded-2xl border border-border/60 bg-secondary/15 p-4">
                                          <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                              <div className="flex flex-wrap items-center gap-2">
                                                <p className="text-sm font-semibold text-foreground">{goal.title}</p>
                                                <StatusBadge status={goal.status} />
                                              </div>
                                              <p className="mt-2 text-sm text-muted-foreground">{goal.description}</p>
                                              <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                                                <span>{goal.currentValue}/{goal.targetValue} {goal.unit}</span>
                                                {goal.workflowIds.length > 0 ? <span>{goal.workflowIds.length} workflows linked</span> : null}
                                                {goal.dueDate ? <span>Due {new Date(goal.dueDate).toLocaleDateString()}</span> : null}
                                              </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                              <Button size="sm" variant="outline" onClick={() => setGoalDraft(makeGoalDraft(goal))}>
                                                <Pencil className="h-4 w-4" />
                                              </Button>
                                              {goal.status !== "completed" ? (
                                                <Button size="sm" variant="outline" onClick={() => onUpdateGoalStatus(goal.id, "completed")}>
                                                  <CheckCircle2 className="h-4 w-4" />
                                                </Button>
                                              ) : (
                                                <Button size="sm" variant="outline" onClick={() => onUpdateGoalStatus(goal.id, "active")}>
                                                  <PlayCircle className="h-4 w-4" />
                                                </Button>
                                              )}
                                            </div>
                                          </div>
                                          <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary/40">
                                            <div className="h-full rounded-full bg-primary" style={{ width: `${progressPercent}%` }} />
                                          </div>
                                        </div>
                                      )
                                    })
                                  ) : (
                                    <EmptyState
                                      icon={Target}
                                      title="No goals yet"
                                      description="Add a measurable goal so this project can show progress and alignment."
                                    />
                                  )}
                                </div>

                                <div className="rounded-2xl border border-border/60 bg-secondary/15 p-4">
                                  <div className="flex items-center gap-2">
                                    <Target className="h-4 w-4 text-primary" />
                                    <p className="text-sm font-semibold text-foreground">{goalDraft.id ? "Edit goal" : "Add goal"}</p>
                                  </div>
                                  <div className="mt-4 grid gap-3">
                                    <Input
                                      value={goalDraft.title}
                                      onChange={(event) => setGoalDraft((current) => ({ ...current, title: event.target.value }))}
                                      placeholder="Goal title"
                                    />
                                    <Textarea
                                      value={goalDraft.description}
                                      onChange={(event) => setGoalDraft((current) => ({ ...current, description: event.target.value }))}
                                      placeholder="What should this goal change?"
                                      className="min-h-20"
                                    />
                                    <div className="grid gap-3 md:grid-cols-2">
                                      <Input
                                        value={goalDraft.currentValue}
                                        onChange={(event) => setGoalDraft((current) => ({ ...current, currentValue: event.target.value }))}
                                        placeholder="Current"
                                        type="number"
                                      />
                                      <Input
                                        value={goalDraft.targetValue}
                                        onChange={(event) => setGoalDraft((current) => ({ ...current, targetValue: event.target.value }))}
                                        placeholder="Target"
                                        type="number"
                                      />
                                    </div>
                                    <div className="grid gap-3 md:grid-cols-2">
                                      <Input
                                        value={goalDraft.unit}
                                        onChange={(event) => setGoalDraft((current) => ({ ...current, unit: event.target.value }))}
                                        placeholder="Unit"
                                      />
                                      <Input
                                        value={goalDraft.dueDate}
                                        onChange={(event) => setGoalDraft((current) => ({ ...current, dueDate: event.target.value }))}
                                        type="date"
                                      />
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      {(["active", "paused", "completed"] as const).map((status) => (
                                        <Button
                                          key={status}
                                          size="sm"
                                          variant={goalDraft.status === status ? "default" : "outline"}
                                          onClick={() => setGoalDraft((current) => ({ ...current, status }))}
                                        >
                                          {status}
                                        </Button>
                                      ))}
                                    </div>
                                    <div className="space-y-2">
                                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">
                                        Linked workflows
                                      </p>
                                      <div className="grid gap-2">
                                        {panelWorkflows.map((workflow) => (
                                          <label key={workflow.id} className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/60 px-3 py-2 text-sm">
                                            <Checkbox
                                              checked={goalDraft.workflowIds.includes(workflow.id)}
                                              onCheckedChange={(checked) =>
                                                setGoalDraft((current) => ({
                                                  ...current,
                                                  workflowIds: checked
                                                    ? [...current.workflowIds, workflow.id]
                                                    : current.workflowIds.filter((workflowId) => workflowId !== workflow.id),
                                                }))
                                              }
                                            />
                                            <span className="text-foreground">{workflow.title}</span>
                                          </label>
                                        ))}
                                      </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      <Button onClick={saveGoal}>
                                        <Plus className="h-4 w-4" />
                                        {goalDraft.id ? "Update goal" : "Save goal"}
                                      </Button>
                                      {goalDraft.id ? (
                                        <Button variant="outline" onClick={() => setGoalDraft(makeGoalDraft())}>
                                          Cancel edit
                                        </Button>
                                      ) : null}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </TabsContent>

                        <TabsContent value="workflows">
                          <Card className="rounded-3xl border-border/60 bg-card/60">
                            <CardContent className="p-4">
                              <SectionHeader
                                icon={PlayCircle}
                                title="Workflow set"
                                description="Compact workflow cards with direct actions."
                              />
                              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                                {panelWorkflows.map((workflow: Workflow) => (
                                  <div
                                    key={workflow.id}
                                    className="rounded-2xl border border-border/60 bg-secondary/15 p-4 transition duration-150 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-secondary/25"
                                  >
                                    <div className="flex items-center justify-between gap-2">
                                      <p className="text-sm font-semibold text-foreground">{workflow.title}</p>
                                      <StatusBadge status={workflow.status} />
                                    </div>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                      {truncate(workflow.goal, 120)}
                                    </p>
                                    <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground">
                                      <span>{workflow.frequency}</span>
                                      <div className="flex gap-2">
                                        <Button size="sm" variant="outline" onClick={continueWorkflow}>
                                          Open
                                        </Button>
                                        <Button size="sm" onClick={continueWorkflow}>
                                          Continue
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </TabsContent>

                        <TabsContent value="outputs">
                          <Card className="rounded-3xl border-border/60 bg-card/60">
                            <CardContent className="p-4">
                              <SectionHeader
                                icon={Sparkles}
                                title="Project outputs"
                                description="Everything visible this project has produced so far."
                              />
                              <div className="mt-4 space-y-3">
                                {panelOutputs.length > 0 ? (
                                  panelOutputs.map((output) => (
                                    <div
                                      key={output.id}
                                      className="rounded-2xl border border-border/60 bg-secondary/15 p-4"
                                    >
                                      <p className="text-sm font-semibold text-foreground">{output.title}</p>
                                      <p className="mt-2 text-sm text-muted-foreground">{output.content}</p>
                                      <p className="mt-3 text-[11px] text-muted-foreground">
                                        {new Date(output.createdAt).toLocaleDateString()}
                                      </p>
                                    </div>
                                  ))
                                ) : (
                                  <div className="rounded-2xl border border-dashed border-border/60 px-4 py-6">
                                    <EmptyState
                                      icon={Sparkles}
                                      title="No outputs yet"
                                      description="Run a workflow and save an output to create visible progress."
                                    />
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </TabsContent>

                        <TabsContent value="sessions">
                          <Card className="rounded-3xl border-border/60 bg-card/60">
                            <CardContent className="p-4">
                              <SectionHeader
                                icon={FolderKanban}
                                title="Session activity"
                                description="Execution signals attached to this project."
                              />
                              <div className="mt-4 space-y-3">
                                {panelSessions.length > 0 ? (
                                  panelSessions.map((session) => (
                                    <div
                                      key={session.id}
                                      className="rounded-2xl border border-border/60 bg-secondary/15 p-4"
                                    >
                                      <div className="flex items-center justify-between gap-2">
                                        <p className="text-sm font-semibold text-foreground">
                                          {WORKFLOWS.find((workflow) => workflow.id === session.workflowId)?.title ??
                                            session.workflowId}
                                        </p>
                                        <StatusBadge status={session.status} />
                                      </div>
                                      <p className="mt-2 text-[11px] text-muted-foreground">
                                        Updated {new Date(session.updatedAt).toLocaleString()}
                                      </p>
                                      <p className="mt-2 text-sm text-muted-foreground">
                                        {session.summary ||
                                          session.resumeNote ||
                                          session.blockerNote ||
                                          "No extra session detail yet."}
                                      </p>
                                    </div>
                                  ))
                                ) : (
                                  <div className="rounded-2xl border border-dashed border-border/60 px-4 py-6">
                                    <EmptyState
                                      icon={PlayCircle}
                                      title="No sessions yet"
                                      description="Sessions appear after a workflow step is run."
                                    />
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </TabsContent>

                        <TabsContent value="context">
                          <Card className="rounded-3xl border-border/60 bg-card/60">
                            <CardContent className="space-y-4 p-4">
                              <SectionHeader
                                icon={Database}
                                title="Project context"
                                description="Why this project exists, what constrains it, and how to carry context forward."
                                action={
                                  <Button size="sm" variant="outline" onClick={handleCopyContext}>
                                    <Copy className="h-4 w-4" />
                                    {copiedContext ? "Copied" : "Copy project context"}
                                  </Button>
                                }
                              />

                              <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
                                <div className="space-y-3">
                                  <div className="rounded-2xl border border-border/60 bg-secondary/15 p-4">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">
                                      Owner note
                                    </p>
                                    <p className="mt-2 text-sm text-foreground">
                                      {panelProject.ownerNote || "No owner note yet."}
                                    </p>
                                  </div>
                                  <div className="rounded-2xl border border-border/60 bg-secondary/15 p-4">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">
                                      Why this project exists
                                    </p>
                                    <p className="mt-2 text-sm text-foreground">{panelProject.description}</p>
                                  </div>
                                  <div className="rounded-2xl border border-border/60 bg-secondary/15 p-4">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">
                                      Key constraints
                                    </p>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                      Keep the workflow set small, produce visible outputs, and keep one clear next action.
                                    </p>
                                  </div>
                                  <div className="rounded-2xl border border-border/60 bg-secondary/15 p-4">
                                    <div className="flex items-center gap-2">
                                      <Database className="h-4 w-4 text-primary" />
                                      <p className="text-sm font-semibold text-foreground">Vault records</p>
                                    </div>
                                    <div className="mt-3">
                                      <Input
                                        value={contextQuery}
                                        onChange={(event) => setContextQuery(event.target.value)}
                                        placeholder="Search project context..."
                                      />
                                    </div>
                                    <div className="mt-3 space-y-3">
                                      {filteredPanelContexts.length > 0 ? (
                                        <>
                                          {ownedProjectContexts.length > 0 ? (
                                            <div className="space-y-3">
                                              <div className="flex items-center justify-between gap-2">
                                                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">
                                                  Project-owned
                                                </p>
                                                <span className="text-[10px] text-muted-foreground">{ownedProjectContexts.length}</span>
                                              </div>
                                              {ownedProjectContexts.map((context) => {
                                                const Icon = getContextIcon(context.type)
                                                return (
                                                  <div key={context.id} className="rounded-2xl border border-border/60 bg-background/60 p-3">
                                                    <div className="flex items-start gap-3">
                                                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-knowledge/10 text-knowledge">
                                                        <Icon className="h-4 w-4" />
                                                      </div>
                                                      <div className="min-w-0 flex-1">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                          <p className="text-sm font-semibold text-foreground">{context.title}</p>
                                                          <span className="rounded-full border border-border/60 bg-secondary/20 px-2 py-0.5 text-[10px] text-muted-foreground">
                                                            {context.type}
                                                          </span>
                                                          <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
                                                            owned
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
                                                      <div className="flex flex-col gap-2">
                                                        <Button
                                                          size="sm"
                                                          variant="outline"
                                                          onClick={() => {
                                                            setEditingContextId(context.id)
                                                            setContextTitle(context.title)
                                                            setContextContent(context.content)
                                                            setContextType(context.type)
                                                          }}
                                                        >
                                                          <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button size="sm" variant="outline" onClick={() => onDeleteContext(context.id)}>
                                                          <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                      </div>
                                                    </div>
                                                  </div>
                                                )
                                              })}
                                            </div>
                                          ) : null}
                                          {inheritedProjectContexts.length > 0 ? (
                                            <div className="space-y-3">
                                              <div className="flex items-center justify-between gap-2">
                                                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">
                                                  Inherited from scenario/workflows
                                                </p>
                                                <span className="text-[10px] text-muted-foreground">{inheritedProjectContexts.length}</span>
                                              </div>
                                              {inheritedProjectContexts.map((context) => {
                                                const Icon = getContextIcon(context.type)
                                                return (
                                                  <div key={context.id} className="rounded-2xl border border-border/60 bg-background/40 p-3">
                                                    <div className="flex items-start gap-3">
                                                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-knowledge/10 text-knowledge">
                                                        <Icon className="h-4 w-4" />
                                                      </div>
                                                      <div className="min-w-0 flex-1">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                          <p className="text-sm font-semibold text-foreground">{context.title}</p>
                                                          <span className="rounded-full border border-border/60 bg-secondary/20 px-2 py-0.5 text-[10px] text-muted-foreground">
                                                            {context.type}
                                                          </span>
                                                          <span className="rounded-full border border-border/60 bg-card/50 px-2 py-0.5 text-[10px] text-muted-foreground">
                                                            inherited
                                                          </span>
                                                        </div>
                                                        <p className="mt-2 text-sm text-muted-foreground">{context.content}</p>
                                                      </div>
                                                    </div>
                                                  </div>
                                                )
                                              })}
                                            </div>
                                          ) : null}
                                        </>
                                      ) : (
                                        <EmptyState
                                          icon={Database}
                                          title={panelContexts.length > 0 ? "No matching context" : "No project context yet"}
                                          description={
                                            panelContexts.length > 0
                                              ? "Try a broader search to reveal stored vault records."
                                              : "Save reusable project notes here so prompts and workflows stop repeating the same setup."
                                          }
                                        />
                                      )}
                                    </div>
                                  </div>
                                  <div className="rounded-2xl border border-border/60 bg-secondary/15 p-4">
                                    <div className="flex items-center gap-2">
                                      <Plus className="h-4 w-4 text-primary" />
                                      <p className="text-sm font-semibold text-foreground">Add vault record</p>
                                    </div>
                                    <div className="mt-3 grid gap-3">
                                      <Input
                                        value={contextTitle}
                                        onChange={(event) => setContextTitle(event.target.value)}
                                        placeholder="Context title"
                                      />
                                      <Textarea
                                        value={contextContent}
                                        onChange={(event) => setContextContent(event.target.value)}
                                        placeholder="What should this project remember across workflows?"
                                        className="min-h-24"
                                      />
                                      <div className="flex flex-wrap gap-2">
                                        {(["project", "business", "customer", "decision", "reference"] as const).map((option) => (
                                          <Button
                                            key={option}
                                            variant={contextType === option ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setContextType(option)}
                                          >
                                            {option}
                                          </Button>
                                        ))}
                                      </div>
                                      <div>
                                        <Button size="sm" onClick={saveProjectContext}>
                                          <Plus className="h-4 w-4" />
                                          {editingContextId ? "Update context record" : "Save context record"}
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex flex-wrap items-start gap-2 lg:w-[220px] lg:flex-col">
                                  {lifecycleActions(panelProject).map((action) => {
                                    const Icon = action.icon
                                    return (
                                      <Button
                                        key={action.label}
                                        variant="outline"
                                        className="justify-start lg:w-full"
                                        onClick={() => onUpdateProjectStatus(panelProject.id, action.status)}
                                      >
                                        <Icon className="h-4 w-4" />
                                        {action.label}
                                      </Button>
                                    )
                                  })}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="surface-panel rounded-3xl border-border/60">
                    <CardContent className="space-y-4 p-5">
                      <SectionHeader
                        icon={mode === "create" ? Sparkles : FolderKanban}
                        title={mode === "create" ? "Create project" : "Edit project"}
                        description="Define the project, link its workflows, and keep the next action obvious."
                      />

                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-2">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">
                            Project name
                          </p>
                          <Input
                            value={draft.name}
                            onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
                            placeholder="AI Control Tower"
                          />
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">
                            Priority
                          </p>
                          <Select
                            value={draft.priority}
                            onValueChange={(value) =>
                              setDraft((current) => ({ ...current, priority: value as PriorityLevel }))
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">
                          Description
                        </p>
                        <Textarea
                          value={draft.description}
                          onChange={(event) =>
                            setDraft((current) => ({ ...current, description: event.target.value }))
                          }
                          placeholder="What is this project trying to move forward?"
                          className="min-h-24"
                        />
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-2">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">
                            Scenario
                          </p>
                          <Select
                            value={draft.scenarioId}
                            onValueChange={(value) =>
                              setDraft((current) => ({
                                ...current,
                                scenarioId: value,
                                workflowIds: current.workflowIds.filter((workflowId) =>
                                  WORKFLOWS.some(
                                    (workflow) => workflow.id === workflowId && workflow.scenarioId === value
                                  )
                                ),
                              }))
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select scenario" />
                            </SelectTrigger>
                            <SelectContent>
                              {SCENARIOS.map((scenario) => (
                                <SelectItem key={scenario.id} value={scenario.id}>
                                  {scenario.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">
                            Status
                          </p>
                          <Select
                            value={draft.status}
                            onValueChange={(value) =>
                              setDraft((current) => ({ ...current, status: value as ProjectStatus }))
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="paused">Paused</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">
                          Next action
                        </p>
                        <Input
                          value={draft.nextAction}
                          onChange={(event) => setDraft((current) => ({ ...current, nextAction: event.target.value }))}
                          placeholder="What should happen next?"
                        />
                      </div>

                      <div className="space-y-2">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">
                          Owner note
                        </p>
                        <Textarea
                          value={draft.ownerNote}
                          onChange={(event) => setDraft((current) => ({ ...current, ownerNote: event.target.value }))}
                          placeholder="Optional note about why this project matters right now."
                          className="min-h-20"
                        />
                      </div>

                      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
                        <div className="rounded-2xl border border-border/60 bg-secondary/15 p-4">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">
                              Workflow picker
                            </p>
                            <button
                              onClick={() => onOpenScenario(draft.scenarioId)}
                              className="text-xs font-medium text-primary transition hover:opacity-80"
                            >
                              Open scenario
                            </button>
                          </div>
                          <div className="mt-3 space-y-2">
                            {draftWorkflows.map((workflow) => (
                              <label
                                key={workflow.id}
                                className="flex items-start gap-3 rounded-xl px-2 py-2 hover:bg-secondary/40"
                              >
                                <Checkbox
                                  checked={draft.workflowIds.includes(workflow.id)}
                                  onCheckedChange={(checked) => toggleWorkflow(workflow.id, checked === true)}
                                />
                                <div>
                                  <p className="text-sm font-semibold text-foreground">{workflow.title}</p>
                                  <p className="text-xs text-muted-foreground">{truncate(workflow.goal, 84)}</p>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-border/60 bg-secondary/15 p-4">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">
                            Selected workflow chain
                          </p>
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            {draft.workflowIds.length > 0 ? (
                              draft.workflowIds.map((workflowId, index) => {
                                const workflow = WORKFLOWS.find((item) => item.id === workflowId)
                                if (!workflow) return null

                                return (
                                  <div key={workflow.id} className="flex items-center gap-2">
                                    <div className="rounded-2xl border border-border/60 bg-background/60 px-3 py-2">
                                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary/85">
                                        Step {index + 1}
                                      </p>
                                      <p className="text-sm font-semibold text-foreground">{workflow.title}</p>
                                    </div>
                                    {index < draft.workflowIds.length - 1 ? (
                                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                    ) : null}
                                  </div>
                                )
                              })
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                Select at least one workflow so the project has a real execution boundary.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap justify-end gap-2 border-t border-border/60 pt-4">
                        <Button variant="outline" onClick={cancelEditing}>
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSave}
                          disabled={
                            !draft.name.trim() ||
                            !draft.description.trim() ||
                            !draft.nextAction.trim() ||
                            draft.workflowIds.length === 0
                          }
                        >
                          {draft.id ? "Save project" : "Create project"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {mode === "view" && !panelProject ? (
                  <Card className="surface-panel rounded-3xl border-border/60">
                    <CardContent className="p-8">
                      <EmptyState
                        icon={FolderKanban}
                        title="Select a project"
                        description="Choose a project from the rail to inspect workflows, outputs, and next actions."
                      />
                    </CardContent>
                  </Card>
                ) : null}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
