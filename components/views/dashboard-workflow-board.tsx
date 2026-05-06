"use client"

import { Clock3 } from "lucide-react"
import { StatusBadge } from "@/components/ui/status-badge"
import { cn } from "@/lib/utils"
import type { Scenario, Workflow } from "@/types"

interface WorkflowBoardCard {
  id: string
  title: string
  scenario: Scenario
  status: "inbox" | "clarify" | "active" | "waiting" | "done" | "blocked"
  updatedAt: string
  workflow: Workflow
}

interface WorkflowBoardPreviewProps {
  columns: {
    id: WorkflowBoardCard["status"]
    title: string
    items: WorkflowBoardCard[]
  }[]
  onOpenWorkflow: (workflowId: string) => void
  compact?: boolean
  maxItemsPerColumn?: number
}

export function WorkflowBoardPreview({
  columns,
  onOpenWorkflow,
  compact = false,
  maxItemsPerColumn = compact ? 2 : 3,
}: WorkflowBoardPreviewProps) {
  return (
    <div className="overflow-x-auto">
      <div
        className={cn(
          "grid gap-3",
          compact ? "min-w-[880px] xl:min-w-0" : "min-w-[960px] xl:min-w-0"
        )}
        style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
      >
        {columns.map((column) => {
          const visibleItems = column.items.slice(0, maxItemsPerColumn)
          const hiddenCount = Math.max(column.items.length - visibleItems.length, 0)

          return (
            <div
              key={column.id}
              className={cn(
                "rounded-2xl bg-secondary/10 p-3",
                compact && "rounded-[20px] border border-border/50 bg-card/55 p-2.5"
              )}
            >
              <div className={cn("mb-3 flex items-center justify-between gap-2", compact && "mb-2")}>
                <p className={cn("text-sm font-semibold text-foreground", compact && "text-[13px]")}>{column.title}</p>
                <StatusBadge status={column.id} className={compact ? "px-2 py-0.5 text-[10px]" : undefined} />
              </div>
              <div className="space-y-2">
                {visibleItems.length > 0 ? (
                  <>
                    {visibleItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => onOpenWorkflow(item.workflow.id)}
                        className={cn(
                          "w-full rounded-2xl border border-border bg-card/80 p-3 text-left transition hover:border-primary/20 hover:bg-card",
                          compact && "rounded-xl border-border/60 px-2.5 py-2 hover:-translate-y-0.5"
                        )}
                        title={`Open ${item.title}`}
                      >
                        <p className={cn("text-sm font-semibold text-foreground", compact && "line-clamp-1 text-[13px]")}>
                          {item.title}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          <span
                            className={cn(
                              "rounded-full border border-border bg-secondary/30 px-2.5 py-1 text-[11px] text-muted-foreground",
                              compact && "px-2 py-0.5 text-[10px]"
                            )}
                          >
                            {item.scenario.name}
                          </span>
                          {!compact ? <StatusBadge status={item.status} className="shrink-0" /> : null}
                        </div>
                        <div className={cn("mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground", compact && "mt-2 text-[10px]")}>
                          <Clock3 className="h-3.5 w-3.5" />
                          {new Date(item.updatedAt).toLocaleDateString()}
                        </div>
                      </button>
                    ))}
                    {hiddenCount > 0 ? (
                      <div className="rounded-xl border border-dashed border-border/70 px-3 py-2 text-center text-[11px] text-muted-foreground">
                        +{hiddenCount} more
                      </div>
                    ) : null}
                  </>
                ) : (
                  <div
                    className={cn(
                      "rounded-2xl border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground",
                      compact && "rounded-xl px-3 py-4 text-[11px]"
                    )}
                  >
                    Nothing here
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
