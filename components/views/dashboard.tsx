"use client"

import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Compass,
  Layers3,
  PlayCircle,
  SearchCheck,
} from "lucide-react"
import { SCENARIOS } from "@/data/scenarios"
import { getScenarioById, getWorkflowById } from "@/lib/control-tower"
import { getScenarioIcon } from "@/lib/ui-meta"
import { ActionCard } from "@/components/ui/action-card"
import { EmptyState } from "@/components/ui/empty-state"
import { MetricCard } from "@/components/ui/metric-card"
import { SectionHeader } from "@/components/ui/section-header"
import { StatusBadge } from "@/components/ui/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { OutputRecord, ReviewRecord, Scenario, ViewType, WorkflowSession } from "@/types"

interface DashboardProps {
  selectedScenario: Scenario
  activeSessions: WorkflowSession[]
  recentOutputs: OutputRecord[]
  recentReviews: ReviewRecord[]
  nextActions: string[]
  onNavigate: (view: ViewType) => void
  onOpenWorkflow: (workflowId: string) => void
  onStartWorkflowSession: (workflowId: string) => void
  onSelectScenario: (scenarioId: string) => void
}

export function Dashboard({
  selectedScenario,
  activeSessions,
  recentOutputs,
  recentReviews,
  nextActions,
  onNavigate,
  onOpenWorkflow,
  onStartWorkflowSession,
  onSelectScenario,
}: DashboardProps) {
  const scenarioSessions = activeSessions.filter((session) => session.scenarioId === selectedScenario.id)
  const blockedSessions = scenarioSessions.filter((session) => session.status === "blocked")
  const completedSessions = activeSessions.filter((session) => session.status === "completed").slice(0, 3)
  const activeSession = scenarioSessions.find((session) => session.status === "active" || session.status === "paused" || session.status === "blocked")
  const activeWorkflow = activeSession ? getWorkflowById(activeSession.workflowId) : getWorkflowById(selectedScenario.defaultWorkflowIds?.[0])
  const currentStep = activeSession && activeWorkflow
    ? activeWorkflow.steps.find((step) => step.id === activeSession.currentStepId) ?? activeWorkflow.steps[0]
    : activeWorkflow?.steps[0]
  const pendingReview = recentOutputs.length > 0 && recentReviews.length === 0

  return (
    <div className="h-full overflow-auto p-4">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-6">
        <section className="surface-panel rounded-3xl p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">AI Control Tower</p>
              <h1 className="mt-2 text-display text-foreground">Scenario-based execution system for tools, prompts, workflows, outputs, and reviews.</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                The dashboard is designed to answer one question first: what matters now? Choose the active scenario, continue the next useful step, and let outputs feed the review layer.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => onNavigate("wiki")}>
                Learn how it works
              </Button>
              <Button onClick={() => onNavigate("workflows")}>
                Open workflows
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        <ActionCard
          icon={activeSession?.status === "blocked" ? AlertTriangle : PlayCircle}
          eyebrow="Next required action"
          title={
            activeSession?.status === "blocked"
              ? "Resolve the blocker before switching attention."
              : activeWorkflow
                ? `Continue ${activeWorkflow.title}`
                : "Start the next workflow"
          }
          description={
            activeSession?.status === "blocked"
              ? activeSession.blockerNote || "This session is blocked and needs an explicit unblock or pause decision."
              : currentStep
                ? `${selectedScenario.name} -> ${activeWorkflow?.title} -> ${currentStep.title}. Expected output: ${currentStep.expectedOutput}`
                : nextActions[0] ?? "Choose a scenario and start a workflow session."
          }
          meta={
            <>
              <StatusBadge status={activeSession?.status ?? "not-started"} />
              {activeWorkflow ? <span className="rounded-full border border-border bg-secondary/30 px-3 py-1 text-xs font-medium text-foreground">{activeWorkflow.title}</span> : null}
              {currentStep ? <span className="rounded-full border border-border bg-secondary/30 px-3 py-1 text-xs font-medium text-foreground">{currentStep.title}</span> : null}
            </>
          }
          action={
            <div className="flex flex-wrap gap-2">
              {activeWorkflow ? (
                <Button onClick={() => onOpenWorkflow(activeWorkflow.id)}>
                  {activeSession ? "Continue execution" : "Open workflow"}
                </Button>
              ) : null}
              {activeWorkflow && !activeSession ? (
                <Button variant="outline" onClick={() => onStartWorkflowSession(activeWorkflow.id)}>
                  Start workflow
                </Button>
              ) : null}
              {blockedSessions.length > 0 ? (
                <Button variant="outline" onClick={() => onNavigate("reviews")}>
                  Review blockers
                </Button>
              ) : null}
            </div>
          }
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard icon={Compass} label="Active scenario" value={selectedScenario.name} hint={selectedScenario.category} />
          <MetricCard icon={PlayCircle} label="Active sessions" value={scenarioSessions.length} hint="Sessions needing attention now" tone="default" />
          <MetricCard icon={AlertTriangle} label="Blocked sessions" value={blockedSessions.length} hint="Needs unblock or pause decision" tone={blockedSessions.length > 0 ? "danger" : "default"} />
          <MetricCard icon={CheckCircle2} label="Recent completions" value={completedSessions.length} hint="Completed sessions across the workspace" tone="success" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="surface-panel rounded-3xl p-6">
            <SectionHeader
              icon={Layers3}
              title="Scenario overview"
              description="Use scenarios as the top-level focus layer. Active and paused states matter more than total volume."
            />
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {SCENARIOS.map((scenario) => {
                const Icon = getScenarioIcon(scenario.category)
                const workflowCount = scenario.defaultWorkflowIds?.length ?? 0
                const scenarioSessionCount = activeSessions.filter((session) => session.scenarioId === scenario.id).length
                const isSelected = scenario.id === selectedScenario.id
                return (
                  <button
                    key={scenario.id}
                    onClick={() => onSelectScenario(scenario.id)}
                    className={`rounded-2xl border p-4 text-left transition-colors ${
                      isSelected
                        ? "border-primary/25 bg-primary/10"
                        : "border-border bg-secondary/20 hover:border-primary/15 hover:bg-secondary/30"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{scenario.name}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{scenario.description}</p>
                        </div>
                      </div>
                      <StatusBadge status={scenario.status} />
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="rounded-full border border-border bg-secondary/30 px-2.5 py-1">{workflowCount} workflows</span>
                      <span className="rounded-full border border-border bg-secondary/30 px-2.5 py-1">{scenarioSessionCount} sessions</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="surface-panel rounded-3xl p-6">
            <SectionHeader
              icon={SearchCheck}
              title="Review overview"
              description="Reviews keep outputs from turning into more open loops."
              action={
                <Button variant="outline" size="sm" onClick={() => onNavigate("reviews")}>
                  Open reviews
                </Button>
              }
            />
            <div className="mt-5 space-y-3">
              <div className="surface-subtle rounded-2xl p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Last review</p>
                <p className="mt-2 text-sm font-medium text-foreground">
                  {recentReviews[0] ? new Date(recentReviews[0].createdAt).toLocaleString() : "No reviews created yet"}
                </p>
              </div>
              {pendingReview ? (
                <div className="rounded-2xl border border-warning/20 bg-warning/10 p-4">
                  <p className="text-sm font-semibold text-foreground">Outputs exist without a saved review.</p>
                  <p className="mt-1 text-sm text-muted-foreground">Create a daily or weekly review so the system ends with a decision, not just activity.</p>
                </div>
              ) : null}
              <div className="space-y-2">
                {nextActions.slice(0, 3).map((action) => (
                  <div key={action} className="surface-subtle rounded-2xl p-4 text-sm text-foreground">
                    {action}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <section className="surface-panel rounded-3xl p-6">
            <SectionHeader
              icon={PlayCircle}
              title="Execution overview"
              description="Current work should stay more visible than completed work."
            />
            <div className="mt-5 grid gap-3">
              {scenarioSessions.length > 0 ? (
                scenarioSessions.slice(0, 5).map((session) => {
                  const workflow = getWorkflowById(session.workflowId)
                  const step = workflow?.steps.find((item) => item.id === session.currentStepId) ?? workflow?.steps[0]
                  return (
                    <button
                      key={session.id}
                      onClick={() => onOpenWorkflow(session.workflowId)}
                      className="rounded-2xl border border-border bg-secondary/20 p-4 text-left transition hover:border-primary/20 hover:bg-secondary/30"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{workflow?.title ?? session.workflowId}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{step ? `Current step: ${step.title}` : "No active step"}</p>
                        </div>
                        <StatusBadge status={session.status} />
                      </div>
                    </button>
                  )
                })
              ) : (
                <EmptyState
                  icon={PlayCircle}
                  title="No active sessions"
                  description="Start a workflow from the selected scenario to make the dashboard action-oriented."
                  primaryAction={<Button onClick={() => onNavigate("workflows")}>Browse workflows</Button>}
                />
              )}
            </div>
          </section>

          <section className="surface-panel rounded-3xl p-6">
            <SectionHeader
              icon={CheckCircle2}
              title="Recent outputs"
              description="Completed artifacts stay visible, but quieter than active or blocked work."
            />
            <div className="mt-5 grid gap-3">
              {recentOutputs.slice(0, 5).map((output) => (
                <div key={output.id} className="rounded-2xl border border-border bg-secondary/15 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">{output.title}</p>
                    <span className="rounded-full border border-success/20 bg-success/10 px-2.5 py-1 text-[11px] font-semibold text-success">
                      {output.type}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{output.content}</p>
                </div>
              ))}
              {recentOutputs.length === 0 ? (
                <EmptyState
                  icon={CheckCircle2}
                  title="No outputs captured yet"
                  description="Save outputs during workflow execution so reviews and next actions have something real to work from."
                  primaryAction={<Button onClick={() => onNavigate("workflows")}>Go to workflows</Button>}
                />
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
