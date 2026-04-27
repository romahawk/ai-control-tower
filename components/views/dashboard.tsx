"use client"

import { ArrowRight, Briefcase, ExternalLink, GitBranch, Play, Target } from "lucide-react"
import { INCOME_ENGINES } from "@/data/income-engines"
import { WORKFLOWS } from "@/data/workflows"
import { TOOLS } from "@/data/tools"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ActiveWorkflowSession, ViewType } from "@/types"

interface DashboardProps {
  onNavigate: (view: ViewType) => void
  onOpenCommand: () => void
  onOpenWorkflow: (workflowId: string) => void
  onStartWorkflowSession: (workflowId: string) => void
  activeWorkflowSession: ActiveWorkflowSession | null
}

const primaryEngine =
  INCOME_ENGINES.find((engine) => engine.priority === "Primary") ?? INCOME_ENGINES[0]
const nextWorkflow =
  WORKFLOWS.find((workflow) => workflow.id === primaryEngine.activeWorkflowId) ?? WORKFLOWS[0]
const nextStep = nextWorkflow.steps[1] ?? nextWorkflow.steps[0]
const recommendedTool =
  TOOLS.find((tool) => tool.id === nextStep?.toolIds[0]) ?? TOOLS[0]

export function Dashboard({
  onNavigate,
  onOpenCommand,
  onOpenWorkflow,
  onStartWorkflowSession,
  activeWorkflowSession,
}: DashboardProps) {
  const activeSessionMatchesPrimary = activeWorkflowSession?.workflowId === nextWorkflow.id
  const activeSessionStepNumber = activeSessionMatchesPrimary && activeWorkflowSession
    ? activeWorkflowSession.currentStepIndex + 1
    : null
  const activeSessionStep =
    activeSessionMatchesPrimary && activeWorkflowSession
      ? nextWorkflow.steps[activeWorkflowSession.currentStepIndex] ?? nextWorkflow.steps[0]
      : null

  return (
    <div className="p-6 space-y-6 max-w-[1320px] mx-auto">
      <div
        className="rounded-2xl border border-border bg-card/70 p-6 cursor-pointer hover:border-primary/30 transition-colors"
        onClick={onOpenCommand}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary border border-primary/20">
              Control Tower
            </Badge>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Run one clear workflow at a time.</h1>
              <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                Use the dashboard to see the active income engine, the next manual action,
                and the workflow that should get your attention now.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="self-start lg:self-auto">
              Open quick command
            </Button>
            <Button variant="secondary" onClick={() => onNavigate("workflows")}>
              Browse workflows
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.95fr]">
        <Card className="border-border bg-card/70">
          <CardHeader className="gap-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary" />
                <CardTitle>Active Income Engine</CardTitle>
              </div>
              <Badge variant="outline" className="border-primary/30 text-primary">
                {primaryEngine.priority}
              </Badge>
            </div>
            <CardDescription>{primaryEngine.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-secondary/30 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Engine</p>
                <p className="text-lg font-semibold text-foreground mt-1">{primaryEngine.name}</p>
              </div>
              <div className="rounded-xl border border-border bg-secondary/30 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Status</p>
                <p className="text-lg font-semibold text-foreground mt-1">{primaryEngine.status}</p>
              </div>
              <div className="rounded-xl border border-border bg-secondary/30 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Target Output</p>
                <p className="text-sm font-semibold text-foreground mt-1">{primaryEngine.targetOutput}</p>
              </div>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/8 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-primary/80">Current workflow</p>
                  <h2 className="text-xl font-semibold text-foreground mt-1">{nextWorkflow.title}</h2>
                  <p className="text-sm text-muted-foreground mt-2">{nextWorkflow.goal}</p>
                  {activeSessionStep ? (
                    <p className="text-xs text-primary mt-3">
                      Active run mode: step {activeSessionStepNumber} of{" "}
                      {nextWorkflow.steps.length} - {activeSessionStep.title}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-col gap-2">
                  <Button onClick={() => onOpenWorkflow(nextWorkflow.id)}>
                    {activeSessionMatchesPrimary ? "Resume workflow" : "Open workflow"}
                  </Button>
                  {!activeSessionMatchesPrimary ? (
                    <Button variant="outline" onClick={() => onStartWorkflowSession(nextWorkflow.id)}>
                      <Play className="w-4 h-4" />
                      Start run mode
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/70">
          <CardHeader className="gap-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-accent" />
              <CardTitle>Single Next Action</CardTitle>
            </div>
            <CardDescription>
              One action with a recommended workflow and tool to reduce decision drag.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-border bg-secondary/30 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Next action</p>
              <p className="text-lg font-semibold text-foreground mt-1">{primaryEngine.nextAction}</p>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4 rounded-lg border border-border px-4 py-3">
                <span className="text-muted-foreground">Linked workflow</span>
                <span className="font-medium text-foreground">{nextWorkflow.title}</span>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-lg border border-border px-4 py-3">
                <span className="text-muted-foreground">Recommended tool</span>
                <span className="font-medium text-foreground">{recommendedTool.name}</span>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-lg border border-border px-4 py-3">
                <span className="text-muted-foreground">Expected output</span>
                <span className="font-medium text-foreground text-right">{nextStep.expectedOutput}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => onOpenWorkflow(nextWorkflow.id)}>
                Open workflow
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" asChild>
                <a href={recommendedTool.url} target="_blank" rel="noopener noreferrer">
                  Launch {recommendedTool.name}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="border-border bg-card/70">
          <CardHeader className="gap-3">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" />
              <CardTitle>Income Engine Overview</CardTitle>
            </div>
            <CardDescription>
              See how each engine is being run and where the current target output sits.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {INCOME_ENGINES.map((engine) => {
              const workflow = WORKFLOWS.find((item) => item.id === engine.activeWorkflowId)
              return (
                <button
                  key={engine.id}
                  onClick={() => workflow && onOpenWorkflow(workflow.id)}
                  className="rounded-xl border border-border bg-secondary/25 p-4 text-left hover:border-primary/30 hover:bg-secondary/40 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-foreground">{engine.name}</p>
                    <Badge variant="outline" className="border-border text-muted-foreground">
                      {engine.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{engine.status}</p>
                  <p className="text-sm text-foreground mt-4">{workflow?.title ?? "No active workflow"}</p>
                  <p className="text-xs text-muted-foreground mt-2">{engine.targetOutput}</p>
                </button>
              )
            })}
          </CardContent>
        </Card>

        <Card className="border-border bg-card/70">
          <CardHeader className="gap-3">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-accent" />
              <CardTitle>Current Workflow Preview</CardTitle>
            </div>
            <CardDescription>
              Preview the workflow before opening the full step-by-step view.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <h3 className="text-lg font-semibold text-foreground">{nextWorkflow.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{nextWorkflow.goal}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-secondary/25 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Steps</p>
                <p className="text-lg font-semibold text-foreground mt-1">{nextWorkflow.steps.length}</p>
              </div>
              <div className="rounded-xl border border-border bg-secondary/25 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Frequency</p>
                <p className="text-lg font-semibold text-foreground mt-1">{nextWorkflow.frequency}</p>
              </div>
              <div className="rounded-xl border border-border bg-secondary/25 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Output</p>
                <p className="text-sm font-semibold text-foreground mt-1">{nextWorkflow.output}</p>
              </div>
            </div>
            <div className="space-y-2">
              {nextWorkflow.steps.slice(0, 3).map((step, index) => (
                <div
                  key={step.id}
                  className="flex items-start gap-3 rounded-lg border border-border bg-secondary/20 px-4 py-3"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{step.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button onClick={() => onOpenWorkflow(nextWorkflow.id)} variant="outline">
              View full workflow
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
