"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { OutputRecord, Scenario } from "@/types"

interface DashboardRecentOutputsProps {
  outputs: OutputRecord[]
  scenarios: Scenario[]
  onOpenOutput: (output: OutputRecord) => void
}

export function DashboardRecentOutputs({
  outputs,
  scenarios,
  onOpenOutput,
}: DashboardRecentOutputsProps) {
  return (
    <div className="space-y-3">
      {outputs.slice(0, 3).map((output) => (
        <div key={output.id} className="rounded-2xl border border-border bg-card/70 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">{output.title}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                <span className="rounded-full border border-border bg-secondary/30 px-2.5 py-1">
                  {scenarios.find((scenario) => scenario.id === output.scenarioId)?.name ?? output.scenarioId}
                </span>
                <span className="rounded-full border border-border bg-secondary/30 px-2.5 py-1">
                  {new Date(output.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => onOpenOutput(output)}>
              Open
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
