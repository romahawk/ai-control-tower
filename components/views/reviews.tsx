"use client"

import { useMemo, useState } from "react"
import { AlertTriangle, ClipboardCheck, Compass, SearchCheck, Sparkles } from "lucide-react"
import { DetailPanel } from "@/components/ui/detail-panel"
import { EmptyState } from "@/components/ui/empty-state"
import { PageHeader } from "@/components/ui/page-header"
import { ScenarioBadge } from "@/components/ui/scenario-badge"
import { SegmentedTabs } from "@/components/ui/segmented-tabs"
import { StatusBadge } from "@/components/ui/status-badge"
import { Tabs, TabsContent } from "@/components/ui/tabs"
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

type ReviewTab = "weekly" | "monthly" | "quarterly" | "templates" | "archive"

const reviewTabs: Array<{ value: ReviewTab; label: string }> = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "templates", label: "Templates" },
  { value: "archive", label: "Archive" },
]

export function ReviewsView({
  selectedScenario,
  activeSessions,
  recentOutputs,
  reviews,
  nextActions,
  onCreateReview,
  onOpenWorkflow,
}: ReviewsViewProps) {
  const [activeTab, setActiveTab] = useState<ReviewTab>("weekly")
  const [selectedReviewId, setSelectedReviewId] = useState(reviews[0]?.id ?? "")

  const activeReview =
    reviews.find((review) => review.id === selectedReviewId) ?? reviews[0] ?? null

  const filteredReviews = useMemo(() => {
    switch (activeTab) {
      case "weekly":
        return reviews.filter((review) => review.type === "weekly" || review.type === "daily")
      case "templates":
        return []
      case "archive":
        return reviews
      default:
        return []
    }
  }, [activeTab, reviews])

  const blockedSessions = activeSessions.filter(
    (session) => session.scenarioId === selectedScenario.id && session.status === "blocked"
  )

  return (
    <div className="h-full overflow-auto px-4 py-4 md:px-6">
      <div className="mx-auto max-w-[1360px] space-y-4">
        <PageHeader
          title="Reviews"
          description="Turn activity into decisions, lessons, and next actions."
          icon={SearchCheck}
          actionLabel="New review"
          actionIcon={Sparkles}
          onAction={() => onCreateReview("weekly")}
        />

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ReviewTab)} className="space-y-4">
          <SegmentedTabs tabs={reviewTabs} />

          <TabsContent value={activeTab} className="outline-none">
            <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
              <div className="space-y-4">
                <div className="rounded-3xl border border-primary/20 bg-primary/10 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="max-w-2xl">
                      <p className="text-sm font-semibold text-primary">Current Review</p>
                      <p className="mt-2 text-lg font-semibold text-foreground">
                        {activeReview ? `${activeReview.type} review` : "No active review"}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {activeReview?.nextActions[0] ?? "Start a new review to turn outputs and blockers into decisions."}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <ScenarioBadge scenario={selectedScenario} />
                        {activeReview ? <StatusBadge status="review" /> : <StatusBadge status="inbox" />}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {activeReview ? (
                        <button
                          onClick={() => setSelectedReviewId(activeReview.id)}
                          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                        >
                          Continue
                        </button>
                      ) : null}
                      <button
                        onClick={() => onCreateReview("weekly")}
                        className="rounded-xl border border-border bg-secondary/25 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary/45"
                      >
                        Open
                      </button>
                    </div>
                  </div>
                </div>

                {activeTab === "templates" ? (
                  <div className="grid gap-3">
                    {[
                      { title: "Weekly Focus Reset", type: "weekly" as const, description: "Review active sessions and pick the next real priority." },
                      { title: "Monthly Strategy Review", type: "scenario" as const, description: "Use a scenario review as the current monthly strategy layer." },
                      { title: "Product Validation Review", type: "workflow" as const, description: "Turn product evidence into a build, kill, or pivot call." },
                      { title: "Job Search Review", type: "workflow" as const, description: "Check fit, output quality, and pipeline consistency." },
                      { title: "Trading Review", type: "workflow" as const, description: "Capture rule-level lessons from decisions." },
                    ].map((template) => (
                      <button
                        key={template.title}
                        onClick={() => onCreateReview(template.type)}
                        className="rounded-3xl border border-border/60 bg-card/70 p-4 text-left transition hover:bg-secondary/15"
                      >
                        <p className="text-sm font-semibold text-foreground">{template.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{template.description}</p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredReviews.map((review) => {
                      const Icon = getReviewIcon(review.type)

                      return (
                        <button
                          key={review.id}
                          onClick={() => setSelectedReviewId(review.id)}
                          className={`w-full rounded-3xl border p-4 text-left transition ${
                            activeReview?.id === review.id
                              ? "border-primary/25 bg-primary/8"
                              : "border-border/60 bg-card/70 hover:bg-secondary/15"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-knowledge/10 text-knowledge">
                                <Icon className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold capitalize text-foreground">{review.type} review</p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <StatusBadge status="review" />
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                            <span className="rounded-full border border-border/70 bg-secondary/25 px-2.5 py-1">
                              {review.outputIds.length} outputs
                            </span>
                            <span className="rounded-full border border-border/70 bg-secondary/25 px-2.5 py-1">
                              {review.decisions.length} decisions
                            </span>
                            <span className="rounded-full border border-border/70 bg-secondary/25 px-2.5 py-1">
                              {review.blockers.length} blockers
                            </span>
                          </div>
                          <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                            {review.nextActions[0] ?? "No next action generated."}
                          </p>
                        </button>
                      )
                    })}

                    {filteredReviews.length === 0 ? (
                      <EmptyState
                        icon={ClipboardCheck}
                        title={activeTab === "monthly" || activeTab === "quarterly" ? "No reviews in this cadence yet" : "No reviews found"}
                        description="Use a template or create a fresh review from the current scenario."
                      />
                    ) : null}
                  </div>
                )}
              </div>

              <DetailPanel
                title={activeReview ? `${activeReview.type} review` : "Review details"}
                subtitle={activeReview ? new Date(activeReview.createdAt).toLocaleString() : "Choose a review or start from a template."}
                icon={activeReview ? getReviewIcon(activeReview.type) : SearchCheck}
                badges={
                  <>
                    <ScenarioBadge scenario={selectedScenario} />
                    {activeReview ? <StatusBadge status="review" /> : <StatusBadge status="inbox" />}
                  </>
                }
                actions={
                  <>
                    <button
                      onClick={() => onCreateReview("weekly")}
                      className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                    >
                      Continue
                    </button>
                    <button
                      onClick={() => onCreateReview("workflow")}
                      className="rounded-xl border border-border bg-secondary/25 px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary/45"
                    >
                      Create workflow from decision
                    </button>
                  </>
                }
                metadata={
                  <>
                    <span>{blockedSessions.length} blocked sessions</span>
                    <span>{recentOutputs.length} recent outputs</span>
                    <span>{nextActions.length} next actions</span>
                  </>
                }
              >
                {activeReview ? (
                  <>
                    <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary/85">Summary</p>
                      <p className="mt-2 text-sm text-foreground">
                        {activeReview.nextActions[0] ?? "No summary yet."}
                      </p>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="rounded-2xl border border-border/60 bg-secondary/15 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Decisions captured</p>
                        <div className="mt-3 space-y-2">
                          {activeReview.decisions.length > 0 ? activeReview.decisions.map((decision) => (
                            <div key={decision} className="rounded-2xl bg-card/60 p-3 text-sm text-foreground">
                              {decision}
                            </div>
                          )) : <p className="text-sm text-muted-foreground">No decisions captured.</p>}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-border/60 bg-secondary/15 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Next actions</p>
                        <div className="mt-3 space-y-2">
                          {activeReview.nextActions.length > 0 ? activeReview.nextActions.map((action) => (
                            <div key={action} className="rounded-2xl bg-card/60 p-3 text-sm text-foreground">
                              {action}
                            </div>
                          )) : <p className="text-sm text-muted-foreground">No next actions captured.</p>}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border/60 bg-secondary/15 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Blockers and linked workflows</p>
                      <div className="mt-3 space-y-3">
                        {activeReview.blockers.length > 0 ? activeReview.blockers.map((blocker) => (
                          <div key={blocker} className="rounded-2xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-foreground">
                            {blocker}
                          </div>
                        )) : (
                          <div className="rounded-2xl bg-card/60 p-3 text-sm text-muted-foreground">
                            No blockers recorded in this review.
                          </div>
                        )}

                        {activeReview.workflowId ? (
                          <button
                            onClick={() => onOpenWorkflow(activeReview.workflowId!)}
                            className="rounded-xl border border-border bg-card/60 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary/45"
                          >
                            Open linked workflow
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </>
                ) : (
                  <EmptyState
                    icon={SearchCheck}
                    title="No review selected"
                    description="Choose an existing review or start from a template."
                  />
                )}

                {blockedSessions.length > 0 ? (
                  <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <p className="text-sm font-semibold text-foreground">Blocked workflows</p>
                    </div>
                    <div className="mt-3 space-y-2">
                      {blockedSessions.map((session) => (
                        <button
                          key={session.id}
                          onClick={() => onOpenWorkflow(session.workflowId)}
                          className="w-full rounded-2xl bg-card/60 p-3 text-left text-sm text-foreground transition hover:bg-card/80"
                        >
                          {session.blockerNote || "Blocked session without note"}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </DetailPanel>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
