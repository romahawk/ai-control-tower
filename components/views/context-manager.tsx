"use client"

import { FileText, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Context } from "@/types/navigation"

const CONTEXT_ITEMS: Context[] = [
  {
    id: "ctx-agency",
    name: "Agency Offer Criteria",
    description: "Hamburg SMEs, weak mobile UX, slow conversion flow, service businesses.",
    itemCount: 5,
    lastModified: "Today",
    type: "custom",
  },
  {
    id: "ctx-jobs",
    name: "High-Fit Role Filters",
    description: "Remote-friendly, technical product or AI operations, small fast teams.",
    itemCount: 4,
    lastModified: "Yesterday",
    type: "document",
  },
]

export function ContextManager() {
  return (
    <div className="p-6 space-y-6 max-w-[1100px] mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Context Manager</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Context stays lightweight in Phase 1. Use it to keep your active operating notes close to the workflows.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {CONTEXT_ITEMS.map((context) => (
          <Card key={context.id} className="border-border bg-card/70">
            <CardHeader className="gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Layers className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <CardTitle>{context.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{context.type}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-foreground">{context.description}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{context.itemCount} active notes</span>
                <span>{context.lastModified}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
        Context editing is intentionally light in Phase 1. The MVP focus is manual workflow execution, prompt reuse,
        and external tool launch.
      </div>

      <Button variant="outline" className="w-fit">
        <FileText className="w-4 h-4" />
        Review active context notes
      </Button>
    </div>
  )
}
