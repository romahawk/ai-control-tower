"use client"

import { useEffect, useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  Play,
  Search,
  Square,
} from "lucide-react"
import { INCOME_ENGINES } from "@/data/income-engines"
import { PROMPTS } from "@/data/prompts"
import { TOOLS } from "@/data/tools"
import { WORKFLOWS } from "@/data/workflows"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { ActiveWorkflowSession } from "@/types"

interface WorkflowLibraryProps {
  selectedWorkflowId: string
  onSelectWorkflow: (workflowId: string) => void
  activeWorkflowSession: ActiveWorkflowSession | null
  onStartWorkflowSession: (workflowId: string) => void
  onEndWorkflowSession: () => void
  onMoveWorkflowStep: (direction: 1 | -1) => void
  onJumpToWorkflowStep: (stepIndex: number) => void
}

export function WorkflowLibrary({
  selectedWorkflowId,
  onSelectWorkflow,
  activeWorkflowSession,
  onStartWorkflowSession,
  onEndWorkflowSession,
  onMoveWorkflowStep,
  onJumpToWorkflowStep,
}: WorkflowLibraryProps) {
  const [query, setQuery] = useState("")
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null)

  const filteredWorkflows = WORKFLOWS.filter((workflow) => {
    const engine = INCOME_ENGINES.find((item) => item.id === workflow.incomeEngineId)
    const search = query.toLowerCase()
    return (
      search === "" ||
      workflow.title.toLowerCase().includes(search) ||
      workflow.goal.toLowerCase().includes(search) ||
      workflow.output.toLowerCase().includes(search) ||
      engine?.name.toLowerCase().includes(search)
    )
  })

  useEffect(() => {
    if (!filteredWorkflows.some((workflow) => workflow.id === selectedWorkflowId) && filteredWorkflows[0]) {
      onSelectWorkflow(filteredWorkflows[0].id)
    }
  }, [filteredWorkflows, onSelectWorkflow, selectedWorkflowId])

  const selectedWorkflow =
    filteredWorkflows.find((workflow) => workflow.id === selectedWorkflowId) ??
    filteredWorkflows[0] ??
    null
  const isActiveRunMode = !!selectedWorkflow && activeWorkflowSession?.workflowId === selectedWorkflow.id
  const currentStepIndex = isActiveRunMode && selectedWorkflow
    ? Math.min(activeWorkflowSession.currentStepIndex, selectedWorkflow.steps.length - 1)
    : 0
  const currentStep = isActiveRunMode && selectedWorkflow ? selectedWorkflow.steps[currentStepIndex] : null
  const currentStepTools = currentStep
    ? TOOLS.filter((tool) => currentStep.toolIds.includes(tool.id))
    : []
  const currentStepPrompts = currentStep
    ? PROMPTS.filter((prompt) => currentStep.promptIds.includes(prompt.id))
    : []
  const progressValue =
    isActiveRunMode && selectedWorkflow
      ? ((currentStepIndex + 1) / selectedWorkflow.steps.length) * 100
      : 0

  const copyPrompt = async (promptId: string, content: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedPromptId(promptId)
    setTimeout(() => setCopiedPromptId(null), 1500)
  }

  return (
    <div className="flex h-full">
      <aside className="w-[420px] flex-shrink-0 border-r border-border bg-card/30">
        <div className="border-b border-border p-5 space-y-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Workflow Library</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manual execution systems with a focused run mode for one step at a time.
            </p>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search workflows..."
              className="w-full rounded-xl border border-border bg-secondary/40 py-2.5 pl-9 pr-3 text-sm text-foreground outline-none focus:border-primary/40"
            />
          </div>
        </div>

        <div className="h-[calc(100%-145px)] overflow-y-auto scrollbar-thin p-3 space-y-3">
          {filteredWorkflows.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
              No workflows found.
            </div>
          ) : (
            filteredWorkflows.map((workflow) => {
              const engine = INCOME_ENGINES.find((item) => item.id === workflow.incomeEngineId)
              const toolNames = workflow.steps
                .flatMap((step) => step.toolIds)
                .map((toolId) => TOOLS.find((tool) => tool.id === toolId)?.name)
                .filter(Boolean)

              const dedupedTools = [...new Set(toolNames)].slice(0, 3)
              const isActive = selectedWorkflow?.id === workflow.id

              return (
                <button
                  key={workflow.id}
                  onClick={() => onSelectWorkflow(workflow.id)}
                  className={`w-full rounded-xl border p-4 text-left transition-colors ${
                    isActive
                      ? "border-primary/30 bg-primary/8"
                      : "border-border bg-secondary/20 hover:border-primary/20 hover:bg-secondary/35"
                  }`}
                >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">{workflow.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{workflow.goal}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      activeWorkflowSession?.workflowId === workflow.id
                        ? "border-primary/30 text-primary"
                        : "border-border text-muted-foreground"
                    }
                  >
                    {activeWorkflowSession?.workflowId === workflow.id ? "In Run Mode" : workflow.status}
                  </Badge>
                </div>
                  <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                    <p>Income engine: {engine?.name ?? "Unlinked"}</p>
                    <p>Expected output: {workflow.output}</p>
                    <p>Success metric: {workflow.successMetric}</p>
                    <p>Tools: {dedupedTools.join(", ") || "No tools linked"}</p>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </aside>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
        {selectedWorkflow ? (
          <div className="space-y-6">
            <Card className="border-border bg-card/70">
              <CardHeader className="gap-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <CardTitle>{selectedWorkflow.title}</CardTitle>
                    <CardDescription className="mt-1">{selectedWorkflow.goal}</CardDescription>
                  </div>
                  <Badge variant="outline" className="border-primary/20 text-primary">
                    {INCOME_ENGINES.find((engine) => engine.id === selectedWorkflow.incomeEngineId)?.name ??
                      "No engine"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-xl border border-border bg-secondary/25 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Trigger</p>
                    <p className="text-sm text-foreground mt-2">{selectedWorkflow.trigger}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-secondary/25 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Output</p>
                    <p className="text-sm text-foreground mt-2">{selectedWorkflow.output}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-secondary/25 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Success metric</p>
                    <p className="text-sm text-foreground mt-2">{selectedWorkflow.successMetric}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-secondary/25 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Frequency</p>
                    <p className="text-sm text-foreground mt-2">{selectedWorkflow.frequency}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => onStartWorkflowSession(selectedWorkflow.id)}>
                    <Play className="w-4 h-4" />
                    {isActiveRunMode ? "Restart run mode" : "Start workflow"}
                  </Button>
                  {isActiveRunMode ? (
                    <Button variant="outline" onClick={onEndWorkflowSession}>
                      <Square className="w-4 h-4" />
                      End run mode
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>

            {isActiveRunMode && currentStep ? (
              <Card className="border-primary/20 bg-card/80">
                <CardHeader className="gap-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="bg-primary/10 text-primary border border-primary/20">
                          Active Run Mode
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Step {currentStepIndex + 1} of {selectedWorkflow.steps.length}
                        </span>
                      </div>
                      <CardTitle>{currentStep.title}</CardTitle>
                      <CardDescription className="mt-1">{currentStep.description}</CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        onClick={() => onMoveWorkflowStep(-1)}
                        disabled={currentStepIndex === 0}
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Previous
                      </Button>
                      <Button
                        onClick={() => onMoveWorkflowStep(1)}
                        disabled={currentStepIndex === selectedWorkflow.steps.length - 1}
                      >
                        Next step
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Workflow progress</span>
                      <span>{Math.round(progressValue)}%</span>
                    </div>
                    <Progress value={progressValue} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="rounded-xl border border-border bg-secondary/25 p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Current step goal</p>
                      <p className="text-sm text-foreground mt-2">{currentStep.description}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-secondary/25 p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Expected output</p>
                      <p className="text-sm text-foreground mt-2">{currentStep.expectedOutput}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-secondary/25 p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Run focus</p>
                      <p className="text-sm text-foreground mt-2">
                        Complete this step before jumping back into the broader workflow list.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-secondary/15 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">Step navigator</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedWorkflow.steps.map((step, index) => (
                        <button
                          key={step.id}
                          onClick={() => onJumpToWorkflowStep(index)}
                          className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                            index === currentStepIndex
                              ? "border-primary/30 bg-primary/10 text-primary"
                              : "border-border bg-secondary/20 text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {index + 1}. {step.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    <div className="rounded-xl border border-border bg-secondary/25 p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Tools for this step</p>
                      {currentStepTools.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {currentStepTools.map((tool) => (
                            <Badge key={tool.id} variant="outline" className="border-border text-foreground">
                              {tool.name}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground mt-2">No tools linked.</p>
                      )}
                    </div>
                    <div className="rounded-xl border border-border bg-secondary/25 p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Expected output</p>
                      <p className="text-sm text-foreground mt-2">{currentStep.expectedOutput}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-secondary/25 p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Launch</p>
                      {currentStep.launchUrl ? (
                        <Button variant="outline" asChild className="mt-3">
                          <a href={currentStep.launchUrl} target="_blank" rel="noopener noreferrer">
                            Launch current tool
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      ) : (
                        <p className="text-sm text-muted-foreground mt-2">No direct launch link.</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
                      Prompts for this step
                    </p>
                    {currentStepPrompts.length > 0 ? (
                      <div className="space-y-3">
                        {currentStepPrompts.map((prompt) => (
                          <div
                            key={prompt.id}
                            className="rounded-xl border border-border bg-secondary/20 p-4"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <p className="font-medium text-foreground">{prompt.title}</p>
                                <p className="text-sm text-muted-foreground mt-1">{prompt.category}</p>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => copyPrompt(prompt.id, prompt.content)}
                                >
                                  {copiedPromptId === prompt.id ? (
                                    <>
                                      <Check className="w-4 h-4 text-green-400" />
                                      Copied
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-4 h-4" />
                                      Copy prompt
                                    </>
                                  )}
                                </Button>
                                {TOOLS.find((tool) => tool.id === prompt.linkedToolId) ? (
                                  <Button variant="outline" asChild>
                                    <a
                                      href={TOOLS.find((tool) => tool.id === prompt.linkedToolId)?.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      Launch linked tool
                                      <ExternalLink className="w-4 h-4" />
                                    </a>
                                  </Button>
                                ) : null}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-3 whitespace-pre-wrap">
                              {prompt.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-border px-4 py-4 text-sm text-muted-foreground">
                        No prompts linked for this step.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : null}

            <div className="space-y-4">
              {selectedWorkflow.steps.map((step, index) => {
                const stepTools = TOOLS.filter((tool) => step.toolIds.includes(tool.id))
                const stepPrompts = PROMPTS.filter((prompt) => step.promptIds.includes(prompt.id))
                const isFocusedStep = isActiveRunMode && currentStep?.id === step.id

                return (
                  <Card
                    key={step.id}
                    className={
                      isFocusedStep
                        ? "border-primary/30 bg-primary/5"
                        : "border-border bg-card/70"
                    }
                  >
                    <CardHeader className="gap-3">
                      <div className="flex items-start gap-4">
                        <div
                          className={
                            isFocusedStep
                              ? "flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
                              : "flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary"
                          }
                        >
                          {index + 1}
                        </div>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <CardTitle>{step.title}</CardTitle>
                            {isFocusedStep ? (
                              <Badge variant="secondary" className="bg-primary/10 text-primary border border-primary/20">
                                Current Step
                              </Badge>
                            ) : null}
                          </div>
                          <CardDescription>{step.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        <div className="rounded-xl border border-border bg-secondary/25 p-4">
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">Tools used</p>
                          {stepTools.length > 0 ? (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {stepTools.map((tool) => (
                                <Badge key={tool.id} variant="outline" className="border-border text-foreground">
                                  {tool.name}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground mt-2">No tools linked.</p>
                          )}
                        </div>
                        <div className="rounded-xl border border-border bg-secondary/25 p-4">
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">Expected output</p>
                          <p className="text-sm text-foreground mt-2">{step.expectedOutput}</p>
                        </div>
                        <div className="rounded-xl border border-border bg-secondary/25 p-4">
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">Launch</p>
                          {step.launchUrl ? (
                            <Button variant="outline" asChild className="mt-3">
                              <a href={step.launchUrl} target="_blank" rel="noopener noreferrer">
                                Launch tool
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </Button>
                          ) : (
                            <p className="text-sm text-muted-foreground mt-2">No direct launch link.</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
                          Linked prompts
                        </p>
                        {stepPrompts.length > 0 ? (
                          <div className="space-y-3">
                            {stepPrompts.map((prompt) => (
                              <div
                                key={prompt.id}
                                className="rounded-xl border border-border bg-secondary/20 p-4"
                              >
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                  <div>
                                    <p className="font-medium text-foreground">{prompt.title}</p>
                                    <p className="text-sm text-muted-foreground mt-1">{prompt.category}</p>
                                  </div>
                                  <Button
                                    variant="outline"
                                    onClick={() => copyPrompt(prompt.id, prompt.content)}
                                  >
                                    {copiedPromptId === prompt.id ? (
                                      <>
                                        <Check className="w-4 h-4 text-green-400" />
                                        Copied
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-4 h-4" />
                                        Copy prompt
                                      </>
                                    )}
                                  </Button>
                                </div>
                                <p className="text-sm text-muted-foreground mt-3 line-clamp-5">
                                  {prompt.content}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="rounded-xl border border-dashed border-border px-4 py-4 text-sm text-muted-foreground">
                            No prompts linked for this step.
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border p-8 text-sm text-muted-foreground">
            No workflow selected.
          </div>
        )}
      </div>
    </div>
  )
}
