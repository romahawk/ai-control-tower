"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Archive,
  ArrowRight,
  CheckCircle2,
  FolderKanban,
  Info,
  PauseCircle,
  PlayCircle,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { CompactCard } from "@/components/ui/compact-card"
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
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { SCENARIOS } from "@/data/scenarios"
import { WORKFLOWS } from "@/data/workflows"
import type {
  OutputRecord,
  PriorityLevel,
  Project,
  ProjectStatus,
  Scenario,
  WorkflowSession,
} from "@/types"

interface ProjectsViewProps {
  selectedScenario: Scenario
  selectedProject?: Project
  projects: Project[]
  sessions: WorkflowSession[]
  recentOutputs: OutputRecord[]
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
}

type ProjectTab = "all" | "active" | "paused" | "completed" | "archived"
type EditorMode = "view" | "create" | "edit"

const projectTabs: Array<{ value: ProjectTab; label: string }> = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "completed", label: "Completed" },
  { value: "archived", label: "Archived" },
]

const railLanes: Array<{
  key: ProjectStatus
  title: string
  tone: string
}> = [
  { key: "active", title: "Active lane", tone: "border-sky-500/20 bg-sky-500/6" },
  { key: "paused", title: "Paused lane", tone: "border-amber-500/20 bg-amber-500/6" },
  { key: "completed", title: "Completed lane", tone: "border-emerald-500/20 bg-emerald-500/6" },
  { key: "archived", title: "Archived lane", tone: "border-slate-500/20 bg-slate-500/6" },
]

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

export function ProjectsView({
  selectedScenario,
  selectedProject,
  projects,
  sessions,
  recentOutputs,
  onSelectProject,
  onOpenWorkflows,
  onOpenScenario,
  onSaveProject,
  onUpdateProjectStatus,
}: ProjectsViewProps) {
  const [activeTab, setActiveTab] = useState<ProjectTab>("all")
  const [focusedProjectId, setFocusedProjectId] = useState(selectedProject?.id)
  const [mode, setMode] = useState<EditorMode>("view")
  const [draft, setDraft] = useState<ProjectDraft>(makeDraft(selectedProject, selectedScenario.id))

  useEffect(() => {
    if (mode !== "view") {
      return
    }
    setFocusedProjectId(selectedProject?.id)
    setDraft(makeDraft(selectedProject, selectedScenario.id))
  }, [mode, selectedProject, selectedScenario.id])

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => (activeTab === "all" ? true : project.status === activeTab))
  }, [activeTab, projects])

  const focusedProject =
    (mode === "view" ? projects.find((project) => project.id === focusedProjectId) : undefined) ??
    selectedProject ??
    filteredProjects[0]

  const draftWorkflows = WORKFLOWS.filter((workflow) => workflow.scenarioId === draft.scenarioId)

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

  const railProjects = filteredProjects.length > 0 ? filteredProjects : projects
  const groupedRailProjects = railLanes.map((lane) => ({
    ...lane,
    projects: railProjects.filter((project) => project.status === lane.key),
  }))
  const panelProject = mode === "view" ? focusedProject : undefined
  const panelSessions = panelProject ? getProjectSessions(panelProject) : []
  const panelOutputs = panelProject ? getProjectOutputs(panelProject) : []
  const activeProjectCount = projects.filter((project) => project.status === "active").length
  const totalLinkedWorkflowCount = projects.reduce(
    (count, project) => count + project.workflowIds.length,
    0
  )
  const totalOutputCount = projects.reduce(
    (count, project) => count + getProjectOutputs(project).length,
    0
  )

  const startNewProject = () => {
    setMode("create")
    setFocusedProjectId(undefined)
    setDraft(makeDraft(undefined, selectedScenario.id))
  }

  const startEditingProject = (project: Project) => {
    setMode("edit")
    setFocusedProjectId(project.id)
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

  const currentScenario = panelProject
    ? SCENARIOS.find((scenario) => scenario.id === panelProject.scenarioId) ?? selectedScenario
    : SCENARIOS.find((scenario) => scenario.id === draft.scenarioId) ?? selectedScenario

  const linkedWorkflows = panelProject
    ? WORKFLOWS.filter((workflow) => panelProject.workflowIds.includes(workflow.id))
    : draftWorkflows.filter((workflow) => draft.workflowIds.includes(workflow.id))

  return (
    <div className="h-full overflow-auto px-4 py-4 md:px-6">
      <div className="mx-auto max-w-[1680px] space-y-4">
        <PageHeader
          title="Projects"
          description="Projects are the execution containers that connect one scenario, a small workflow set, and the next action that actually matters."
          icon={FolderKanban}
          actionLabel="New project"
          actionIcon={Sparkles}
          onAction={startNewProject}
        />

        <div className="grid gap-3 lg:grid-cols-3">
          <Card className="surface-panel rounded-3xl border-sky-500/20 bg-sky-500/5">
            <CardContent className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Active projects
              </p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{activeProjectCount}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Keep this small so the workspace stays decisive.
              </p>
            </CardContent>
          </Card>
          <Card className="surface-panel rounded-3xl border-violet-500/20 bg-violet-500/5">
            <CardContent className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Linked workflows
              </p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{totalLinkedWorkflowCount}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Projects should group workflows intentionally, not hoard them.
              </p>
            </CardContent>
          </Card>
          <Card className="surface-panel rounded-3xl border-emerald-500/20 bg-emerald-500/5">
            <CardContent className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Captured outputs
              </p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{totalOutputCount}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                A healthy project turns workflow activity into visible results.
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ProjectTab)} className="space-y-4">
          <SegmentedTabs tabs={projectTabs} />
          <TabsContent value={activeTab} className="outline-none">
            <Card className="surface-panel rounded-3xl border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary/80">
                      Project Flow
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Read the page left to right: choose the container, inspect the linked workflow chain, then judge outputs and session movement.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { label: "Step 1", value: "Choose project", tone: "bg-sky-500/12 text-sky-200 border-sky-400/20" },
                      { label: "Step 2", value: "Trace workflow path", tone: "bg-violet-500/12 text-violet-200 border-violet-400/20" },
                      { label: "Step 3", value: "Check outputs + sessions", tone: "bg-emerald-500/12 text-emerald-200 border-emerald-400/20" },
                    ].map((step, index) => (
                      <div key={step.label} className="flex items-center gap-2">
                        <div className={`rounded-2xl border px-3 py-2 ${step.tone}`}>
                          <p className="text-[10px] font-semibold uppercase tracking-wide opacity-80">{step.label}</p>
                          <p className="text-sm font-semibold">{step.value}</p>
                        </div>
                        {index < 2 ? <ArrowRight className="h-4 w-4 text-primary/60" /> : null}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 xl:grid-cols-[380px_minmax(0,1fr)]">
              <Card className="surface-panel rounded-3xl border-border/60 py-0">
                <CardContent className="p-4">
                  <SectionHeader
                    icon={FolderKanban}
                    title="Project Rail"
                    description="Use the lanes like a compact kanban: choose the container, then inspect or advance it on the right."
                  />
                  <div className="mt-4 space-y-4">
                    {groupedRailProjects
                      .filter((lane) => activeTab === "all" || lane.key === activeTab)
                      .map((lane) => (
                        <div key={lane.key} className={`rounded-3xl border p-3 ${lane.tone}`}>
                          <div className="mb-3 flex items-center justify-between gap-2">
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">
                                {lane.title}
                              </p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {lane.projects.length} project{lane.projects.length === 1 ? "" : "s"}
                              </p>
                            </div>
                            <StatusBadge status={lane.key} />
                          </div>

                          <div className="space-y-3">
                            {lane.projects.map((project) => {
                              const isFocused = mode === "view" && project.id === focusedProject?.id
                              const scenario = SCENARIOS.find((item) => item.id === project.scenarioId)
                              const projectSessions = getProjectSessions(project)
                              const outputs = getProjectOutputs(project)

                              return (
                                <div
                                  key={project.id}
                                  className={`rounded-[1.4rem] transition-all duration-200 ${
                                    isFocused ? "translate-x-1" : "hover:-translate-y-0.5 hover:translate-x-1"
                                  }`}
                                >
                                  <CompactCard
                                    title={project.name}
                                    subtitle={project.nextAction}
                                    icon={FolderKanban}
                                    isActive={isFocused}
                                    onClick={() => {
                                      setMode("view")
                                      setFocusedProjectId(project.id)
                                      onSelectProject(project.id)
                                    }}
                                    className={`border-l-4 ${
                                      isFocused
                                        ? "shadow-[0_0_0_1px_rgba(59,130,246,0.35),0_10px_30px_rgba(15,23,42,0.35)]"
                                        : "hover:shadow-[0_10px_28px_rgba(15,23,42,0.28)]"
                                    } ${
                                      lane.key === "active"
                                        ? "border-l-sky-400"
                                        : lane.key === "paused"
                                          ? "border-l-amber-400"
                                          : lane.key === "completed"
                                            ? "border-l-emerald-400"
                                            : "border-l-slate-400"
                                    }`}
                                    badges={
                                      <>
                                        <StatusBadge status={project.status} />
                                        <span className="rounded-full border border-border/70 bg-secondary/25 px-2.5 py-1 text-[11px] text-muted-foreground">
                                          {project.priority} priority
                                        </span>
                                      </>
                                    }
                                    metadata={
                                      <>
                                        <span>{scenario?.name ?? project.scenarioId}</span>
                                        <span>{project.workflowIds.length} workflows</span>
                                        <span>{projectSessions.length} sessions</span>
                                        <span>{outputs.length} outputs</span>
                                      </>
                                    }
                                    secondaryAction={
                                      <button
                                        title="Edit this project's scope, linked workflows, and next action"
                                        onClick={(event) => {
                                          event.stopPropagation()
                                          startEditingProject(project)
                                        }}
                                        className="rounded-xl border border-border bg-secondary/25 px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-secondary/45"
                                      >
                                        Edit
                                      </button>
                                    }
                                  >
                                    <div className="mb-3 flex items-center gap-2 text-[11px] text-muted-foreground">
                                      <Info className="h-3.5 w-3.5 text-primary/70" />
                                      <span>
                                        This card is the project container. Open it to trace execution flow on the right.
                                      </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{project.description}</p>
                                  </CompactCard>
                                </div>
                              )
                            })}

                            {lane.projects.length === 0 ? (
                              <div className="rounded-2xl border border-dashed border-border/60 px-4 py-5 text-center text-xs text-muted-foreground">
                                No projects in this lane.
                              </div>
                            ) : null}
                          </div>
                        </div>
                      ))}

                    {railProjects.length === 0 ? (
                      <EmptyState
                        icon={FolderKanban}
                        title="No projects yet"
                        description="Create a project to group related workflows into one coherent execution track."
                      />
                    ) : null}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {mode === "view" && panelProject ? (
                  <>
                    <Card className="surface-panel rounded-3xl border-border/60">
                      <CardContent className="p-5">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="max-w-3xl">
                            <div className="flex flex-wrap items-center gap-2">
                              <StatusBadge status={panelProject.status} />
                              <ScenarioBadge scenario={currentScenario} />
                              <span className="rounded-full border border-border/70 bg-secondary/25 px-2.5 py-1 text-[11px] text-muted-foreground">
                                {panelProject.priority} priority
                              </span>
                            </div>
                            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                              {panelProject.name}
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                              {panelProject.description}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button title="Open the parent scenario that frames this project" variant="outline" onClick={() => onOpenScenario(panelProject.scenarioId)}>
                              Open scenario
                            </Button>
                            <Button
                              title="Open the workflow library with this project context selected"
                              variant="outline"
                              onClick={() => {
                                onSelectProject(panelProject.id)
                                onOpenWorkflows()
                              }}
                            >
                              Open workflows
                            </Button>
                            <Button title="Adjust project structure, status, and workflow links" onClick={() => startEditingProject(panelProject)}>Edit project</Button>
                          </div>
                        </div>

                        <div className="mt-5 rounded-3xl border border-primary/20 bg-primary/10 p-5">
                          <p className="text-xs font-semibold uppercase tracking-wide text-primary/85">
                            Current next action
                          </p>
                          <p className="mt-2 text-sm text-foreground">{panelProject.nextAction}</p>
                        </div>

                        <div className="mt-5 rounded-3xl border border-violet-500/20 bg-violet-500/7 p-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-violet-200/90">
                              Workflow journey
                            </p>
                            <span className="text-[11px] text-violet-100/70">
                              Follow the path left to right. Each card is one stage in the project journey.
                            </span>
                          </div>
                          <div className="mt-4 overflow-x-auto pb-2">
                            <div className="flex min-w-max items-stretch gap-3">
                              {linkedWorkflows.map((workflow, index) => (
                                <div
                                  key={workflow.id}
                                  className="flex items-center gap-3"
                                >
                                  <div
                                    title={workflow.goal}
                                    className="group w-[240px] rounded-3xl border border-violet-400/20 bg-background/70 p-4 transition duration-200 hover:-translate-y-1 hover:border-violet-300/40 hover:bg-violet-500/10 hover:shadow-[0_14px_32px_rgba(76,29,149,0.18)]"
                                  >
                                    <div className="flex items-center justify-between gap-2">
                                      <div className="rounded-full border border-violet-400/20 bg-violet-500/12 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-200/90">
                                        Step {index + 1}
                                      </div>
                                      <StatusBadge status={workflow.status} />
                                    </div>
                                    <p className="mt-3 text-sm font-semibold text-foreground">{workflow.title}</p>
                                    <p className="mt-2 line-clamp-3 text-xs leading-5 text-muted-foreground">
                                      {workflow.goal}
                                    </p>
                                    <div className="mt-3 text-[11px] text-violet-100/70">
                                      {workflow.frequency}
                                    </div>
                                  </div>
                                  {index < linkedWorkflows.length - 1 ? (
                                    <div className="flex items-center gap-1 px-1">
                                      <div className="h-px w-6 bg-violet-300/40" />
                                      <ArrowRight className="h-4 w-4 text-violet-300/60" />
                                      <div className="h-px w-6 bg-violet-300/40" />
                                    </div>
                                  ) : null}
                                </div>
                              ))}
                              {linkedWorkflows.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                  Link workflows to make the project path visible.
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </div>

                        <div className="mt-5 grid gap-3 md:grid-cols-4">
                          <div className="rounded-2xl border border-sky-500/20 bg-sky-500/7 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              Scenario
                            </p>
                            <p className="mt-2 text-sm font-medium text-foreground">{currentScenario.name}</p>
                          </div>
                          <div className="rounded-2xl border border-violet-500/20 bg-violet-500/7 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              Workflows
                            </p>
                            <p className="mt-2 text-sm font-medium text-foreground">
                              {panelProject.workflowIds.length} linked
                            </p>
                          </div>
                          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/7 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              Sessions
                            </p>
                            <p className="mt-2 text-sm font-medium text-foreground">{panelSessions.length} total</p>
                          </div>
                          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/7 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              Outputs
                            </p>
                            <p className="mt-2 text-sm font-medium text-foreground">{panelOutputs.length} captured</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
                      <Card className="surface-panel rounded-3xl border-border/60">
                        <CardContent className="p-5">
                          <SectionHeader
                            icon={FolderKanban}
                            title="Project frame"
                            description="Why this project exists and how it should behave."
                          />
                          <div className="mt-4 space-y-4">
                            <div className="rounded-2xl border border-sky-500/20 bg-sky-500/7 p-4">
                              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Owner note
                              </p>
                              <p className="mt-2 text-sm text-foreground">
                                {panelProject.ownerNote || "No owner note added yet."}
                              </p>
                            </div>
                            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/7 p-4">
                              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Lifecycle controls
                              </p>
                              <div className="mt-3 flex flex-wrap gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() =>
                                    onUpdateProjectStatus(
                                      panelProject.id,
                                      panelProject.status === "paused" ? "active" : "paused"
                                    )
                                  }
                                >
                                  {panelProject.status === "paused" ? (
                                    <>
                                      <PlayCircle className="h-4 w-4" />
                                      Resume project
                                    </>
                                  ) : (
                                    <>
                                      <PauseCircle className="h-4 w-4" />
                                      Pause project
                                    </>
                                  )}
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => onUpdateProjectStatus(panelProject.id, "completed")}
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                  Complete
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => onUpdateProjectStatus(panelProject.id, "archived")}
                                >
                                  <Archive className="h-4 w-4" />
                                  Archive
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="surface-panel rounded-3xl border-violet-500/20 bg-violet-500/4">
                        <CardContent className="p-5">
                          <SectionHeader
                            icon={PlayCircle}
                            title="Linked workflows"
                            description="This project should only carry the workflows that genuinely belong together."
                          />
                          <div className="mt-4 grid gap-3 md:grid-cols-2">
                            {linkedWorkflows.map((workflow) => (
                              <div
                                key={workflow.id}
                                title={workflow.goal}
                                className="rounded-2xl border border-violet-400/20 bg-violet-500/8 p-4 transition hover:border-violet-300/40 hover:bg-violet-500/12"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <p className="text-sm font-semibold text-foreground">{workflow.title}</p>
                                  <StatusBadge status={workflow.status} />
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground">{workflow.goal}</p>
                                <p className="mt-3 text-xs text-muted-foreground">{workflow.frequency}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                      <Card className="surface-panel rounded-3xl border-emerald-500/20 bg-emerald-500/4">
                        <CardContent className="p-5">
                          <SectionHeader
                            icon={Sparkles}
                            title="Recent outputs"
                            description="Visible results are the best signal that the project is alive."
                          />
                          <div className="mt-4 space-y-3">
                            {panelOutputs.slice(0, 4).map((output) => (
                              <div
                                key={output.id}
                                title="Captured result produced by one of this project's linked workflows"
                                className="rounded-2xl border border-emerald-400/20 bg-emerald-500/8 p-4 transition hover:border-emerald-300/40 hover:bg-emerald-500/12"
                              >
                                <p className="text-sm font-semibold text-foreground">{output.title}</p>
                                <p className="mt-1 text-sm text-muted-foreground">{output.content}</p>
                                <p className="mt-3 text-xs text-muted-foreground">
                                  {new Date(output.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            ))}
                            {panelOutputs.length === 0 ? (
                              <EmptyState
                                icon={Sparkles}
                                title="No outputs yet"
                                description="Outputs linked to this project will accumulate here once workflows start producing results."
                              />
                            ) : null}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="surface-panel rounded-3xl border-amber-500/20 bg-amber-500/4">
                        <CardContent className="p-5">
                          <SectionHeader
                            icon={FolderKanban}
                            title="Session activity"
                            description="Sessions tell you whether the project is moving, waiting, or blocked."
                          />
                          <div className="mt-4 space-y-3">
                            {panelSessions.slice(0, 4).map((session) => (
                              <div
                                key={session.id}
                                title="Execution session state for one workflow inside this project"
                                className="rounded-2xl border border-amber-400/20 bg-amber-500/8 p-4 transition hover:border-amber-300/40 hover:bg-amber-500/12"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <p className="text-sm font-semibold text-foreground">
                                    {WORKFLOWS.find((workflow) => workflow.id === session.workflowId)?.title ??
                                      session.workflowId}
                                  </p>
                                  <StatusBadge status={session.status} />
                                </div>
                                <p className="mt-2 text-xs text-muted-foreground">
                                  Updated {new Date(session.updatedAt).toLocaleString()}
                                </p>
                                {session.blockerNote ? (
                                  <p className="mt-2 text-sm text-muted-foreground">{session.blockerNote}</p>
                                ) : null}
                              </div>
                            ))}
                            {panelSessions.length === 0 ? (
                              <EmptyState
                                icon={PlayCircle}
                                title="No sessions yet"
                                description="Once a linked workflow is run, its sessions will give this project an execution history."
                              />
                            ) : null}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </>
                ) : (
                    <Card className="surface-panel rounded-3xl border-primary/20 bg-primary/4">
                      <CardContent className="p-5">
                      <SectionHeader
                        icon={mode === "create" ? Sparkles : FolderKanban}
                        title={mode === "create" ? "Create project" : "Edit project"}
                        description="Keep the project definition tight: one scenario, a small workflow cluster, and a next action clear enough to act on."
                      />

                        <div className="mt-5 grid gap-4">
                          <div className="rounded-3xl border border-primary/20 bg-primary/8 p-4">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-xs font-semibold uppercase tracking-wide text-primary/85">
                                Builder sequence
                              </p>
                              <span className="text-[11px] text-muted-foreground">
                                Define the project {"->"} pick the scenario {"->"} assemble the workflow chain.
                              </span>
                            </div>
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              {["Name + intent", "Scenario + status", "Workflow chain", "Save project"].map((step, index) => (
                                <div key={step} className="flex items-center gap-2">
                                  <div className="rounded-2xl border border-primary/20 bg-background/60 px-3 py-2">
                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-primary/80">
                                      Step {index + 1}
                                    </p>
                                    <p className="text-sm font-semibold text-foreground">{step}</p>
                                  </div>
                                  {index < 3 ? <ArrowRight className="h-4 w-4 text-primary/60" /> : null}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="grid gap-3 md:grid-cols-2">
                          <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              Project name
                            </p>
                            <Input
                              value={draft.name}
                              onChange={(event) =>
                                setDraft((current) => ({ ...current, name: event.target.value }))
                              }
                              placeholder="AI Control Tower"
                            />
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              Priority
                            </p>
                            <Select
                              value={draft.priority}
                              onValueChange={(value) =>
                                setDraft((current) => ({
                                  ...current,
                                  priority: value as PriorityLevel,
                                }))
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
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
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
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
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
                                      (workflow) =>
                                        workflow.id === workflowId && workflow.scenarioId === value
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
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              Status
                            </p>
                            <Select
                              value={draft.status}
                              onValueChange={(value) =>
                                setDraft((current) => ({
                                  ...current,
                                  status: value as ProjectStatus,
                                }))
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
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Next action
                          </p>
                          <Input
                            value={draft.nextAction}
                            onChange={(event) =>
                              setDraft((current) => ({ ...current, nextAction: event.target.value }))
                            }
                            placeholder="What should happen next?"
                          />
                        </div>

                        <div className="space-y-2">
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Owner note
                          </p>
                          <Textarea
                            value={draft.ownerNote}
                            onChange={(event) =>
                              setDraft((current) => ({ ...current, ownerNote: event.target.value }))
                            }
                            placeholder="Optional note about why this project matters right now."
                            className="min-h-20"
                          />
                        </div>

                        <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
                          <div className="rounded-2xl border border-violet-500/20 bg-violet-500/7 p-4">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
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
                                    onCheckedChange={(checked) =>
                                      toggleWorkflow(workflow.id, checked === true)
                                    }
                                  />
                                  <div>
                                    <p className="text-sm font-semibold text-foreground">{workflow.title}</p>
                                    <p className="text-xs text-muted-foreground">{workflow.goal}</p>
                                  </div>
                                </label>
                              ))}
                              {draftWorkflows.length === 0 ? (
                                <EmptyState
                                  icon={PlayCircle}
                                  title="No workflows in this scenario"
                                  description="Choose another scenario or add workflows before linking this project."
                                />
                              ) : null}
                            </div>
                          </div>

                          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/7 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              Selected workflow set
                            </p>
                            <div className="mt-3 space-y-3">
                              {linkedWorkflows.map((workflow) => (
                                <div
                                  key={workflow.id}
                                  className="rounded-xl border border-border/60 bg-background/60 p-3"
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <p className="text-sm font-semibold text-foreground">{workflow.title}</p>
                                    <StatusBadge status={workflow.status} />
                                  </div>
                                  <p className="mt-2 text-xs text-muted-foreground">{workflow.frequency}</p>
                                </div>
                              ))}
                              {linkedWorkflows.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                  Select at least one workflow so the project has a real execution boundary.
                                </p>
                              ) : null}
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
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
