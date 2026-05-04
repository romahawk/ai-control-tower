"use client"

import { ChevronRight, Search } from "lucide-react"
import type { ViewType } from "@/types/navigation"

interface TopBarProps {
  onOpenCommand: () => void
  currentView: ViewType
}

const VIEW_LABELS: Record<ViewType, string> = {
  dashboard: "Control Tower",
  prompts: "Prompt Library",
  execution: "Legacy Execution Panel",
  contexts: "Context Manager",
  tools: "Tool Registry",
  workflows: "Workflow Library",
  reviews: "Reviews",
  wiki: "Wiki",
  settings: "Settings",
}

export default function TopBar({ onOpenCommand, currentView }: TopBarProps) {
  return (
    <header className="flex h-14 flex-shrink-0 items-center gap-4 border-b border-border bg-card/50 px-6">
      <div className="flex min-w-0 items-center gap-1.5 text-sm">
        <span className="text-muted-foreground">AI Control Tower</span>
        <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/50" />
        <span className="truncate font-semibold text-foreground">{VIEW_LABELS[currentView]}</span>
      </div>

      <div className="mx-auto flex-1 max-w-xl">
        <button
          onClick={onOpenCommand}
          className="group flex w-full items-center gap-3 rounded-lg border border-border bg-secondary/50 px-4 py-2 text-sm text-muted-foreground transition-all hover:border-primary/40 hover:bg-secondary"
        >
          <Search className="h-4 w-4 transition-colors group-hover:text-primary" />
          <span className="flex-1 text-left">Search workflows, prompts, tools, and views...</span>
          <div className="flex items-center gap-1">
            <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px]">
              Ctrl/Cmd
            </kbd>
            <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px]">
              K
            </kbd>
          </div>
        </button>
      </div>
    </header>
  )
}
