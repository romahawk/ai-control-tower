"use client"

import { ChevronRight, Search } from "lucide-react"
import { NewItemMenu } from "@/components/ui/new-item-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Scenario, ViewType } from "@/types"

interface TopBarProps {
  onOpenCommand: () => void
  currentView: ViewType
  selectedScenario: Scenario
  scenarios: Scenario[]
  onSelectScenario: (scenarioId: string) => void
  onNewAction: (kind: "workflow" | "project" | "prompt" | "review" | "scenario" | "capture") => void
}

const VIEW_LABELS: Record<ViewType, string> = {
  dashboard: "Control Tower",
  projects: "Projects",
  scenarios: "Scenarios",
  prompts: "Prompt Library",
  execution: "Legacy Execution Panel",
  contexts: "Context Manager",
  tools: "Tool Registry",
  workflows: "Workflow Library",
  reviews: "Reviews",
  wiki: "Wiki",
  settings: "Settings",
}

export default function TopBar({
  onOpenCommand,
  currentView,
  selectedScenario,
  scenarios,
  onSelectScenario,
  onNewAction,
}: TopBarProps) {
  return (
    <header className="flex h-16 flex-shrink-0 items-center gap-4 border-b border-border bg-card/50 px-4 md:px-6">
      <div className="flex min-w-0 items-center gap-1.5 text-sm">
        <span className="text-muted-foreground">AI Control Tower</span>
        <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/50" />
        <span className="truncate font-semibold text-foreground">{VIEW_LABELS[currentView]}</span>
      </div>

      <div className="mx-auto flex flex-1 items-center gap-3">
        <button
          onClick={onOpenCommand}
          className="group flex w-full max-w-xl items-center gap-3 rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm text-muted-foreground transition-all hover:border-primary/40 hover:bg-secondary"
        >
          <Search className="h-4 w-4 transition-colors group-hover:text-primary" />
          <span className="flex-1 text-left">Search workflows, prompts, reviews...</span>
          <div className="flex items-center gap-1">
            <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px]">
              Ctrl/Cmd
            </kbd>
            <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px]">
              K
            </kbd>
          </div>
        </button>
        <div className="hidden min-w-[190px] md:block">
          <Select value={selectedScenario.id} onValueChange={onSelectScenario}>
            <SelectTrigger className="h-11 rounded-xl">
              <SelectValue placeholder="Select scenario" />
            </SelectTrigger>
            <SelectContent>
              {scenarios.map((scenario) => (
                <SelectItem key={scenario.id} value={scenario.id}>
                  {scenario.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <NewItemMenu currentView={currentView} onSelect={onNewAction} />
      </div>
    </header>
  )
}
