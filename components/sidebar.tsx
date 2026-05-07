"use client"

import { cn } from "@/lib/utils"
import type { ViewType } from "@/types/navigation"
import {
  BookOpen,
  ChevronRight,
  Command,
  Compass,
  FolderKanban,
  GitBranch,
  LayoutDashboard,
  Library,
  Settings,
  Sparkles,
  Wrench,
  Workflow,
} from "lucide-react"

interface SidebarProps {
  currentView: ViewType
  onNavigate: (view: ViewType) => void
  onOpenCommand: () => void
}

const navItems: { id: ViewType; label: string; icon: React.ElementType; badge?: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "projects", label: "Projects", icon: FolderKanban, badge: "Phase 2" },
  { id: "scenarios", label: "Scenarios", icon: Compass },
  { id: "workflows", label: "Workflows", icon: GitBranch, badge: "Core" },
  { id: "tools", label: "Registry", icon: Wrench, badge: "Phase 6" },
  { id: "prompts", label: "Prompts", icon: BookOpen },
  { id: "reviews", label: "Reviews", icon: Workflow },
  { id: "wiki", label: "Wiki", icon: Library, badge: "Guide" },
]

export default function Sidebar({ currentView, onNavigate, onOpenCommand }: SidebarProps) {
  return (
    <aside className="flex h-full w-60 flex-shrink-0 flex-col border-r border-border bg-card">
      <div className="flex h-14 items-center gap-2.5 border-b border-border px-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <span className="text-sm font-semibold text-foreground tracking-tight">AI Control Tower</span>
          <div className="mt-0.5 text-[10px] leading-none text-muted-foreground">Personal Execution OS</div>
        </div>
      </div>

      <div className="px-3 pb-1 pt-3">
        <button
          onClick={onOpenCommand}
          className="group flex w-full items-center gap-2.5 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-xs text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground"
        >
          <Command className="h-3.5 w-3.5 transition-colors group-hover:text-primary" />
          <span className="flex-1 text-left">Quick command</span>
          <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px]">
            Ctrl/Cmd K
          </kbd>
        </button>
      </div>

      <div className="px-4 pb-1 pt-4">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Navigation
        </span>
      </div>

      <nav className="flex-1 space-y-0.5 px-2 pb-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              )}
            >
              <span
                className={cn(
                  "absolute left-2 h-5 w-0.5 rounded-full transition-opacity",
                  isActive ? "bg-primary opacity-100" : "opacity-0"
                )}
              />
              <Icon
                className={cn(
                  "h-4 w-4 flex-shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge ? (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
                    isActive ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
                  )}
                >
                  {item.badge}
                </span>
              ) : null}
              {isActive ? <ChevronRight className="h-3 w-3 text-primary opacity-60" /> : null}
            </button>
          )
        })}
      </nav>

      <div className="space-y-0.5 border-t border-border px-2 py-3">
        <button
          onClick={() => onNavigate("settings")}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
            currentView === "settings"
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
          )}
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </button>
        <div className="mt-1 flex items-center gap-2.5 px-3 py-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 ring-1 ring-primary/30">
            <span className="text-xs font-bold text-primary">OS</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-foreground">Local-first mode</p>
            <p className="truncate text-[10px] text-muted-foreground">Execution before productization</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
