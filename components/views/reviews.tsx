"use client"

import { AlertTriangle, CheckCircle2, ClipboardCheck, SearchCheck } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { SectionHeader } from "@/components/ui/section-header"
import { StatusBadge } from "@/components/ui/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getWorkflowById } from "@/lib/control-tower"
import { getReviewIcon } from "@/lib/ui-meta"
import type { OutputRecord, ReviewRecord, Scenario, WorkflowSession } from "@/types"

interface ReviewsViewProps {
  selectedScenario: Scenario
  activeSessions: WorkflowSession[]
  recentOutputs: OutputRecord[]
  reviews: ReviewRecord[]
  nextActions: string[]
  onCreateReview: (type: "daily" | "weekly" | "scenario" | "workflow") => void
  onOpenWorkflow: (workflowId: string) => void
}

export function ReviewsView({
  selectedScenario,
  activeSessions,
  recentOutputs,
  reviews,
  nextActions,
  onCreateReview,
  onOpenWorkflow,
}: ReviewsViewProps) {
  const scenarioSessions = activeSessions.filter((session) => session.scenarioId === selectedScenario.id)
  const blockedSessions = scenarioSessions.filter((session) => session.status === "blocked")
  const decisionLog = recentOutputs.filter((output) => output.type === "decision" || /decision|build|kill|pivot/i.test(output.title))

  return (
    <div className="mx-auto max-w-[1320px] space-y-6 p-6">
      <section className="surface-panel rounded-3xl p-6">
        <SectionHeader
          icon={SearchCheck}
          title="Reviews and decision intelligence"
          description="Reviews turn session history, blockers, and outputs into a clearer next move."
          action={
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => onCreateReview("daily")}>
                Create daily review
              </Button>
              <Button variant="outline" size="sm" onClick={() => onCreateReview("weekly")}>
                Create weekly review
              </Button>
              <Button size="sm" onClick={() => onCreateReview("scenario")}>
                Create scenario review
              </Button>
            </div>
          }
        />
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="surface-panel rounded-3xl">
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Next actions</p>
            <div className="mt-4 space-y-2">
              {nextActions.slice(0, 3).map((action) => (
                <div key={action} className="surface-subtle rounded-2xl p-4 text-sm text-foreground">
                  {action}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="surface-panel rounded-3xl">
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Blocked workflows</p>
            <div className="mt-4 space-y-2">
              {blockedSessions.length > 0 ? (
                blockedSessions.map((session) => {
                  const workflow = getWorkflowById(session.workflowId)
                  return (
                    <button
                      key={session.id}
                      onClick={() => onOpenWorkflow(session.workflowId)}
                      className="w-full rounded-2xl border border-destructive/20 bg-destructive/8 p-4 text-left"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-foreground">{workflow?.title ?? session.workflowId}</p>
                        <StatusBadge status="blocked" />
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{session.blockerNote || "Blocked without note."}</p>
                    </button>
                  )
                })
              ) : (
                <EmptyState icon={AlertTriangle} title="No blocked sessions" description="Blocked workflows will appear here when they need attention." />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="surface-panel rounded-3xl">
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Decision log</p>
            <div className="mt-4 space-y-2">
              {decisionLog.length > 0 ? (
                decisionLog.slice(0, 4).map((output) => (
                  <div key={output.id} className="surface-subtle rounded-2xl p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground">{output.title}</p>
                      <StatusBadge status="review" />
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{output.content}</p>
                  </div>
                ))
              ) : (
                <EmptyState icon={ClipboardCheck} title="No decisions logged" description="Decision outputs will show up here once workflow sessions start producing them." />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="surface-panel rounded-3xl">
          <CardContent className="p-5">
            <SectionHeader
              icon={CheckCircle2}
              title="Recent outputs"
              description="What was completed and what evidence exists now."
            />
            <div className="mt-5 space-y-3">
              {recentOutputs.slice(0, 8).map((output) => (
                <div key={output.id} className="rounded-2xl border border-border bg-secondary/15 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">{output.title}</p>
                    <span className="rounded-full border border-border bg-secondary/30 px-2.5 py-1 text-[11px] text-muted-foreground">{output.type}</span>
                  </div>
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{output.content}</p>
                </div>
              ))}
              {recentOutputs.length === 0 ? (
                <EmptyState icon={CheckCircle2} title="No outputs yet" description="Run a workflow and save outputs so the review layer has something real to synthesize." />
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card className="surface-panel rounded-3xl">
          <CardContent className="p-5">
            <SectionHeader
              icon={ClipboardCheck}
              title="Saved reviews"
              description="Daily, weekly, scenario, and workflow reviews saved locally."
            />
            <div className="mt-5 space-y-3">
              {reviews.length > 0 ? (
                reviews.slice(0, 8).map((review) => {
                  const Icon = getReviewIcon(review.type)
                  return (
                    <div key={review.id} className="surface-subtle rounded-2xl p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-knowledge/10 text-knowledge">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold capitalize text-foreground">{review.type} review</p>
                            <p className="mt-1 text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                        <StatusBadge status="review" />
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                        <span className="rounded-full border border-border bg-secondary/30 px-2.5 py-1">{review.sessionIds.length} sessions</span>
                        <span className="rounded-full border border-border bg-secondary/30 px-2.5 py-1">{review.outputIds.length} outputs</span>
                        <span className="rounded-full border border-border bg-secondary/30 px-2.5 py-1">{review.blockers.length} blockers</span>
                      </div>
                      <p className="mt-3 text-sm text-foreground">{review.nextActions[0] ?? "No next action generated."}</p>
                    </div>
                  )
                })
              ) : (
                <EmptyState icon={ClipboardCheck} title="No reviews saved yet" description="Create a daily or weekly review once outputs start accumulating." />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
