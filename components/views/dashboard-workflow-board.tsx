"use client"

import { Clock3 } from "lucide-react"
import { StatusBadge } from "@/components/ui/status-badge"
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
}

export function WorkflowBoardPreview({
  columns,
  onOpenWorkflow,
}: WorkflowBoardPreviewProps) {
  return (
    <div className="overflow-x-auto">
      <div
        className="grid min-w-[960px] gap-3 xl:min-w-0"
        style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
      >
        {columns.map((column) => (
          <div key={column.id} className="rounded-2xl bg-secondary/10 p-3">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-foreground">{column.title}</p>
              <StatusBadge status={column.id} />
            </div>
            <div className="space-y-2">
              {column.items.length > 0 ? (
                column.items.slice(0, 3).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onOpenWorkflow(item.workflow.id)}
                    className="w-full rounded-2xl border border-border bg-card/80 p-3 text-left transition hover:border-primary/20 hover:bg-card"
                  >
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-full border border-border bg-secondary/30 px-2.5 py-1 text-[11px] text-muted-foreground">
                        {item.scenario.name}
                      </span>
                      <StatusBadge status={item.status} className="shrink-0" />
                    </div>
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Clock3 className="h-3.5 w-3.5" />
                      {new Date(item.updatedAt).toLocaleDateString()}
                    </div>
                  </button>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
                  Nothing here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
