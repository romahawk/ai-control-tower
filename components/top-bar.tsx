"use client"

import { Search, Bell, ChevronRight, Moon } from "lucide-react"
import type { ViewType } from "@/types/navigation"

interface TopBarProps {
  onOpenCommand: () => void
  currentView: ViewType
}

const VIEW_LABELS: Record<ViewType, string> = {
  dashboard: "Control Tower",
  prompts: "Prompt Library",
  execution: "Execution Panel",
  contexts: "Context Manager",
  tools: "Tool Registry",
  workflows: "Workflow Library",
  settings: "Settings",
}

export default function TopBar({ onOpenCommand, currentView }: TopBarProps) {
  return (
    <header className="h-14 flex items-center gap-4 px-6 border-b border-border bg-card/50 flex-shrink-0">
      <div className="flex items-center gap-1.5 text-sm min-w-0">
        <span className="text-muted-foreground">AI Command Center</span>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0" />
        <span className="font-semibold text-foreground truncate">{VIEW_LABELS[currentView]}</span>
      </div>

      <div className="flex-1 max-w-xl mx-auto">
        <button
          onClick={onOpenCommand}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg border border-border bg-secondary/50 text-muted-foreground text-sm hover:border-primary/40 hover:bg-secondary transition-all group"
        >
          <Search className="w-4 h-4 group-hover:text-primary transition-colors" />
          <span className="flex-1 text-left text-sm">Search workflows, prompts, and tools...</span>
          <div className="flex items-center gap-1">
            <kbd className="text-[10px] bg-surface-raised px-1.5 py-0.5 rounded border border-border font-mono">
              Ctrl/⌘
            </kbd>
            <kbd className="text-[10px] bg-surface-raised px-1.5 py-0.5 rounded border border-border font-mono">
              K
            </kbd>
          </div>
        </button>
      </div>

      <div className="flex items-center gap-1.5">
        <button className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
        </button>
        <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
          <Moon className="w-4 h-4" />
        </button>
        <div className="w-px h-5 bg-border mx-1" />
        <button className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-secondary transition-all">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center ring-1 ring-primary/30">
            <span className="text-[10px] font-bold text-primary">JD</span>
          </div>
        </button>
      </div>
    </header>
  )
}
