"use client"

import { useEffect, useMemo, useState } from "react"
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bot,
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
} from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { InfoCallout } from "@/components/ui/info-callout"
import { SectionHeader } from "@/components/ui/section-header"
import { StatusBadge } from "@/components/ui/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { getContextIcon, getScenarioIcon, getStatusMeta } from "@/lib/ui-meta"
import type { ContextRecord, Prompt, Scenario, Tool, Workflow, WorkflowSession } from "@/types"

interface WorkflowLibraryProps {
  selectedScenario: Scenario
  workflows: Workflow[]
  selectedWorkflow: Workflow
  activeSession: WorkflowSession | undefined
  workflowSessions: WorkflowSession[]
  currentStepIndex: number
  stepPrompts: Prompt[]
  stepTools: Tool[]
  stepContexts: ContextRecord[]
  executionPack: string
  onSelectWorkflow: (workflowId: string) => void
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

export function WorkflowLibrary({
  selectedScenario,
  workflows,
  selectedWorkflow,
  activeSession,
  workflowSessions,
  currentStepIndex,
  stepPrompts,
  stepTools,
  stepContexts,
  executionPack,
  onSelectWorkflow,
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
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null)
  const [copiedPack, setCopiedPack] = useState(false)
  const [outputTitle, setOutputTitle] = useState("")
  const [outputContent, setOutputContent] = useState("")
  const [resumeDraft, setResumeDraft] = useState(activeSession?.resumeNote ?? "")
  const [blockerDraft, setBlockerDraft] = useState(activeSession?.blockerNote ?? "")
  const [summaryDraft, setSummaryDraft] = useState(activeSession?.summary ?? "")
  const [previewStepId, setPreviewStepId] = useState(selectedWorkflow.steps[0]?.id ?? "")

  const filteredWorkflows = useMemo(() => {
    const search = query.trim().toLowerCase()
    return workflows.filter((workflow) => {
      if (!search) return true
      return (
        workflow.title.toLowerCase().includes(search) ||
        workflow.goal.toLowerCase().includes(search) ||
        workflow.output.toLowerCase().includes(search)
      )
    })
  }, [query, workflows])

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

  const selectedWorkflowSession = activeSession?.workflowId === selectedWorkflow.id ? activeSession : undefined
  const selectedStep = selectedWorkflowSession
    ? selectedWorkflow.steps.find((step) => step.id === selectedWorkflowSession.currentStepId) ?? selectedWorkflow.steps[0]
    : selectedWorkflow.steps.find((step) => step.id === previewStepId) ?? selectedWorkflow.steps[0]
  const currentStepExecution = selectedWorkflowSession?.stepExecutions.find(
    (stepExecution) => stepExecution.stepId === selectedStep?.id
  )
  const completedStepsCount = selectedWorkflowSession ? getCompletedStepsCount(selectedWorkflowSession) : 0
  const progress = selectedWorkflowSession && selectedWorkflow.steps.length > 0
    ? (completedStepsCount / selectedWorkflow.steps.length) * 100
    : 0

  const copyText = async (text: string, mode: "pack" | "prompt", promptId?: string) => {
    await navigator.clipboard.writeText(text)
    if (mode === "pack") {
      setCopiedPack(true)
      window.setTimeout(() => setCopiedPack(false), 1500)
      return
    }

    setCopiedPromptId(promptId ?? null)
    window.setTimeout(() => setCopiedPromptId(null), 1500)
  }

  const saveOutput = () => {
    if (!selectedStep || outputTitle.trim() === "" || outputContent.trim() === "") return
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

  const ScenarioIcon = getScenarioIcon(selectedScenario.category)

  return (
    <div className="h-full overflow-hidden p-4">
      <div className="mx-auto grid h-full max-w-[1320px] gap-4 xl:grid-cols-[320px_1fr]">
        <aside className="surface-panel flex min-h-0 flex-col overflow-hidden rounded-3xl">
          <div className="border-b border-border p-4">
            <SectionHeader
              icon={GitBranch}
              title="Workflow Library"
              description="Choose a workflow, then focus on one visible step and one output at a time."
            />
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search workflows..." className="pl-9" />
            </div>
          </div>

          <div className="min-h-0 space-y-2 overflow-y-auto p-3">
            {filteredWorkflows.map((workflow) => {
              const workflowSession = workflowSessions.find((session) => session.workflowId === workflow.id)
              const isSelected = workflow.id === selectedWorkflow.id
              return (
                <button
                  key={workflow.id}
                  onClick={() => onSelectWorkflow(workflow.id)}
                  className={cn(
                    "rounded-2xl border p-4 text-left transition-colors",
                    isSelected
                      ? "border-primary/25 bg-primary/10"
                      : "border-border bg-secondary/20 hover:border-primary/15 hover:bg-secondary/30"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">{workflow.title}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{workflow.goal}</p>
                    </div>
                    <StatusBadge status={workflowSession?.status ?? workflow.status} />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full border border-border bg-secondary/30 px-2.5 py-1 text-[11px] text-muted-foreground">{workflow.steps.length} steps</span>
                    <span className="rounded-full border border-border bg-secondary/30 px-2.5 py-1 text-[11px] text-muted-foreground">{workflow.frequency}</span>
                  </div>
                </button>
              )
            })}
            {filteredWorkflows.length === 0 ? (
              <EmptyState
                icon={GitBranch}
                title="No workflows found"
                description="Try a broader search or switch to another scenario."
              />
            ) : null}
          </div>
        </aside>

        <div className="min-h-0 overflow-auto">
          <div className="space-y-4">
            <Card className="surface-panel rounded-3xl">
              <CardContent className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <ScenarioIcon className="h-3.5 w-3.5" />
                        {selectedScenario.name}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5" />
                      <span>{selectedWorkflow.title}</span>
                      {selectedStep ? (
                        <>
                          <ArrowRight className="h-3.5 w-3.5" />
                          <span className="font-medium text-foreground">{selectedStep.title}</span>
                        </>
                      ) : null}
                    </div>
                    <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{selectedWorkflow.title}</h1>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{selectedWorkflow.goal}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedWorkflowSession ? <StatusBadge status={selectedWorkflowSession.status} /> : <StatusBadge status={selectedWorkflow.status} />}
                    <Button onClick={() => onStartWorkflowSession(selectedWorkflow.id)}>
                      <PlayCircle className="h-4 w-4" />
                      {selectedWorkflowSession ? "Start new session" : "Start session"}
                    </Button>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-4">
                  <div className="surface-subtle rounded-2xl p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Current state</p>
                    <p className="mt-2 text-sm font-medium text-foreground">{selectedWorkflowSession ? selectedWorkflowSession.status : "Preview mode"}</p>
                  </div>
                  <div className="surface-subtle rounded-2xl p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Progress</p>
                    <p className="mt-2 text-sm font-medium text-foreground">{selectedWorkflowSession ? `${completedStepsCount}/${selectedWorkflow.steps.length} steps complete` : `${selectedWorkflow.steps.length} total steps`}</p>
                  </div>
                  <div className="surface-subtle rounded-2xl p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Expected workflow output</p>
                    <p className="mt-2 text-sm text-foreground">{selectedWorkflow.output}</p>
                  </div>
                  <div className="surface-subtle rounded-2xl p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Success metric</p>
                    <p className="mt-2 text-sm text-foreground">{selectedWorkflow.successMetric}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {workflowSessions.length > 0 ? (
              <Card className="surface-panel rounded-3xl">
                <CardContent className="p-5">
                  <SectionHeader
                    icon={PlayCircle}
                    title="Workflow sessions"
                    description="Use one active session for the current deep-work block. Older sessions stay resumable."
                  />
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {workflowSessions.map((session) => (
                      <div key={session.id} className="surface-subtle rounded-2xl p-4">
                        <div className="flex items-start justify-between gap-3">
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
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : null}

            <div className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
              <Card className="surface-panel rounded-3xl">
                <CardContent className="p-5">
                  <SectionHeader
                    icon={ListChecks}
                    title="Step list"
                    description="Completed steps turn green, the current step stays highlighted, blocked steps surface risk, and future steps stay quiet."
                  />
                  {selectedWorkflowSession ? <Progress value={progress} className="mt-4" /> : null}
                  <div className="mt-4 space-y-3">
                    {selectedWorkflow.steps.map((step, index) => {
                      const stepExecution = selectedWorkflowSession?.stepExecutions.find((item) => item.stepId === step.id)
                      const stepStatus = stepExecution?.status ?? (index === 0 ? "not-started" : "not-started")
                      const isCurrent = selectedStep?.id === step.id
                      const Icon = getStatusMeta(stepStatus).icon
                      return (
                        <button
                          key={step.id}
                          onClick={() => {
                            if (selectedWorkflowSession) {
                              onJumpToWorkflowStep(step.id)
                              return
                            }
                            setPreviewStepId(step.id)
                          }}
                          className={cn(
                            "flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-colors",
                            isCurrent
                              ? "border-primary/25 bg-primary/10"
                              : stepStatus === "completed"
                                ? "border-success/20 bg-success/8"
                                : stepStatus === "blocked"
                                  ? "border-destructive/20 bg-destructive/8"
                                  : "border-border bg-secondary/20 hover:border-primary/15 hover:bg-secondary/30"
                          )}
                        >
                          <div className={cn(
                            "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                            stepStatus === "completed"
                              ? "bg-success/12 text-success"
                              : stepStatus === "blocked"
                                ? "bg-destructive/12 text-destructive"
                                : isCurrent
                                  ? "bg-primary/12 text-primary"
                                  : "bg-secondary/40 text-muted-foreground"
                          )}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-semibold text-muted-foreground">Step {index + 1}</span>
                              <StatusBadge status={stepStatus} />
                            </div>
                            <p className="mt-2 text-sm font-semibold text-foreground">{step.title}</p>
                            <p className="mt-1 text-sm text-muted-foreground">{step.expectedOutput}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {selectedStep ? (
                  <Card className="surface-panel rounded-3xl">
                    <CardContent className="p-5">
                      <SectionHeader
                        icon={selectedWorkflowSession?.status === "blocked" ? AlertTriangle : PlayCircle}
                        title={selectedStep.title}
                        description={selectedStep.description}
                        action={selectedWorkflowSession ? <StatusBadge status={selectedWorkflowSession.status} /> : <StatusBadge status="not-started" />}
                      />

                      <div className="mt-5 grid gap-3 md:grid-cols-2">
                        <div className="rounded-2xl border border-primary/20 bg-primary/8 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-primary/85">Expected output</p>
                          <p className="mt-2 text-sm text-foreground">{selectedStep.expectedOutput}</p>
                        </div>
                        <div className="surface-subtle rounded-2xl p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Current step state</p>
                          <p className="mt-2 text-sm font-medium text-foreground">{currentStepExecution?.status ?? "Preview only"}</p>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 md:grid-cols-3">
                        <div className="surface-subtle rounded-2xl p-4">
                          <div className="flex items-center gap-2">
                            <Bot className="h-4 w-4 text-primary" />
                            <p className="text-sm font-semibold text-foreground">Recommended tools</p>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {stepTools.map((tool) => (
                              <a
                                key={tool.id}
                                href={tool.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full border border-border bg-secondary/30 px-3 py-1.5 text-xs text-foreground transition hover:border-primary/20 hover:text-primary"
                              >
                                {tool.name}
                              </a>
                            ))}
                            {stepTools.length === 0 ? <span className="text-sm text-muted-foreground">No tools linked.</span> : null}
                          </div>
                        </div>

                        <div className="surface-subtle rounded-2xl p-4">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-primary" />
                            <p className="text-sm font-semibold text-foreground">Relevant prompts</p>
                          </div>
                          <p className="mt-3 text-sm text-muted-foreground">
                            {stepPrompts.length > 0 ? `${stepPrompts.length} prompt${stepPrompts.length > 1 ? "s" : ""} attached to this step.` : "No step prompts linked."}
                          </p>
                        </div>

                        <div className="surface-subtle rounded-2xl p-4">
                          <div className="flex items-center gap-2">
                            <Database className="h-4 w-4 text-primary" />
                            <p className="text-sm font-semibold text-foreground">Relevant context</p>
                          </div>
                          <p className="mt-3 text-sm text-muted-foreground">
                            {stepContexts.length > 0 ? `${stepContexts.length} context record${stepContexts.length > 1 ? "s" : ""} available.` : "No context records linked yet."}
                          </p>
                        </div>
                      </div>

                      {selectedWorkflowSession ? (
                        <div className="mt-5 space-y-4">
                          <div className="rounded-2xl border border-border bg-secondary/15 p-4">
                            <p className="text-sm font-semibold text-foreground">Primary action</p>
                            <p className="mt-1 text-sm text-muted-foreground">Create the expected output, then mark the step complete.</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              <Button onClick={saveOutput} disabled={outputTitle.trim() === "" || outputContent.trim() === ""}>
                                Save output
                              </Button>
                              <Button variant="outline" onClick={onCompleteCurrentStep}>
                                <CheckCircle2 className="h-4 w-4" />
                                Mark step complete
                              </Button>
                              {selectedStep.launchUrl ? (
                                <Button variant="outline" asChild>
                                  <a href={selectedStep.launchUrl} target="_blank" rel="noopener noreferrer">
                                    Launch tool
                                    <ExternalLink className="h-4 w-4" />
                                  </a>
                                </Button>
                              ) : null}
                            </div>
                          </div>

                          <div className="grid gap-4 xl:grid-cols-[1fr_0.95fr]">
                            <div className="space-y-4">
                              <div className="rounded-2xl border border-border bg-secondary/15 p-4">
                                <p className="text-sm font-semibold text-foreground">Output editor</p>
                                <p className="mt-1 text-sm text-muted-foreground">Answer the expected output directly here so the review layer has something concrete.</p>
                                <div className="mt-3 grid gap-2">
                                  <Input value={outputTitle} onChange={(event) => setOutputTitle(event.target.value)} placeholder="Output title" />
                                  <Textarea value={outputContent} onChange={(event) => setOutputContent(event.target.value)} placeholder="What did this step produce?" className="min-h-28" />
                                </div>
                              </div>

                              <div className="rounded-2xl border border-border bg-secondary/15 p-4">
                                <div className="flex items-center justify-between gap-3">
                                  <div>
                                    <p className="text-sm font-semibold text-foreground">Prompts</p>
                                    <p className="mt-1 text-sm text-muted-foreground">Use the attached prompt first before browsing the broader library.</p>
                                  </div>
                                  <Button variant="outline" size="sm" onClick={() => copyText(executionPack, "pack")}>
                                    <Copy className="h-4 w-4" />
                                    {copiedPack ? "Copied pack" : "Copy execution pack"}
                                  </Button>
                                </div>
                                <div className="mt-3 space-y-3">
                                  {stepPrompts.map((prompt) => (
                                    <div key={prompt.id} className="surface-subtle rounded-2xl p-4">
                                      <div className="flex flex-wrap items-start justify-between gap-2">
                                        <div>
                                          <p className="text-sm font-semibold text-foreground">{prompt.title}</p>
                                          <p className="mt-1 text-xs text-muted-foreground">{prompt.purpose} • v{prompt.version}</p>
                                        </div>
                                        <Button variant="outline" size="sm" onClick={() => copyText(prompt.content, "prompt", prompt.id)}>
                                          {copiedPromptId === prompt.id ? "Copied" : "Copy prompt"}
                                        </Button>
                                      </div>
                                      <p className="mt-2 text-xs text-muted-foreground">Expected output: {prompt.expectedOutput}</p>
                                      <p className="mt-3 line-clamp-4 text-sm text-foreground">{prompt.content}</p>
                                    </div>
                                  ))}
                                  {stepPrompts.length === 0 ? (
                                    <EmptyState icon={MessageSquare} title="No prompts linked" description="This step currently relies on tools and context rather than a saved prompt." />
                                  ) : null}
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div className="rounded-2xl border border-border bg-secondary/15 p-4">
                                <p className="text-sm font-semibold text-foreground">Relevant context</p>
                                <div className="mt-3 space-y-3">
                                  {stepContexts.map((context) => {
                                    const Icon = getContextIcon(context.type)
                                    return (
                                      <div key={context.id} className="surface-subtle rounded-2xl p-4">
                                        <div className="flex items-start gap-3">
                                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-knowledge/10 text-knowledge">
                                            <Icon className="h-4 w-4" />
                                          </div>
                                          <div>
                                            <p className="text-sm font-semibold text-foreground">{context.title}</p>
                                            <p className="mt-2 text-sm text-muted-foreground">{context.content}</p>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  })}
                                  {stepContexts.length === 0 ? (
                                    <EmptyState icon={Database} title="No context linked" description="Add a reusable context record if this step needs background information repeatedly." />
                                  ) : null}
                                </div>
                              </div>

                              <div className="rounded-2xl border border-border bg-secondary/15 p-4">
                                <p className="text-sm font-semibold text-foreground">Session controls</p>
                                <p className="mt-1 text-sm text-muted-foreground">Use pause and block intentionally so the session stays understandable later.</p>
                                <div className="mt-3 space-y-4">
                                  <div>
                                    <Textarea value={resumeDraft} onChange={(event) => setResumeDraft(event.target.value)} placeholder="Resume note: what should I remember next time?" className="min-h-20" />
                                    <div className="mt-2 flex flex-wrap gap-2">
                                      <Button variant="outline" size="sm" onClick={() => onResumeSession(resumeDraft.trim())}>
                                        Save resume note
                                      </Button>
                                      <Button variant="outline" size="sm" onClick={() => onPauseSession(resumeDraft.trim())}>
                                        <PauseCircle className="h-4 w-4" />
                                        Pause session
                                      </Button>
                                    </div>
                                  </div>

                                  <div>
                                    <Textarea value={blockerDraft} onChange={(event) => setBlockerDraft(event.target.value)} placeholder="Blocker note: what is preventing progress?" className="min-h-20" />
                                    <div className="mt-2 flex flex-wrap gap-2">
                                      <Button variant="outline" size="sm" onClick={() => onBlockSession(blockerDraft.trim())}>
                                        <Flag className="h-4 w-4" />
                                        Block session
                                      </Button>
                                    </div>
                                  </div>

                                  <div>
                                    <Textarea value={summaryDraft} onChange={(event) => setSummaryDraft(event.target.value)} placeholder="Session summary: what shipped, what remains, what happens next?" className="min-h-24" />
                                    <div className="mt-2 flex flex-wrap gap-2">
                                      <Button variant="outline" size="sm" onClick={() => onSaveSessionSummary(summaryDraft.trim())}>
                                        Save summary
                                      </Button>
                                      <Button size="sm" onClick={() => onFinishSession(summaryDraft.trim())}>
                                        Finish session
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-5">
                          <InfoCallout
                            variant="info"
                            title="Preview mode"
                            description="Start a session to enable output logging, step completion, blockers, pause/resume, and finish-state behavior."
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <EmptyState icon={ListChecks} title="No step selected" description="Choose a step from the list or start a session to enter guided execution mode." />
                )}
              </div>
            </div>

            {selectedWorkflowSession?.status === "blocked" ? (
              <InfoCallout
                variant="danger"
                title="Blocked session"
                description={selectedWorkflowSession.blockerNote || "This session is blocked. Add a blocker note or move it into pause state intentionally."}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
