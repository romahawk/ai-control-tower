"use client"

import { cn } from "@/lib/utils"
import type { ViewType } from "@/types/navigation"
import {
  LayoutDashboard,
  BookOpen,
  AppWindow,
  GitBranch,
  Settings,
  Command,
  ChevronRight,
  Zap,
} from "lucide-react"

interface SidebarProps {
  currentView: ViewType
  onNavigate: (view: ViewType) => void
  onOpenCommand: () => void
}

const navItems: { id: ViewType; label: string; icon: React.ElementType; badge?: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "workflows", label: "Workflows", icon: GitBranch, badge: "Core" },
  { id: "prompts", label: "Prompts", icon: BookOpen },
  { id: "tools", label: "Tools", icon: AppWindow },
]

export default function Sidebar({ currentView, onNavigate, onOpenCommand }: SidebarProps) {
  return (
    <aside className="w-56 flex-shrink-0 flex flex-col bg-card border-r border-border h-full">
      <div className="flex items-center gap-2.5 px-4 h-14 border-b border-border">
        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 glow-blue-sm">
          <Zap className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <span className="text-sm font-semibold text-foreground tracking-tight">AI Command</span>
          <div className="text-[10px] text-muted-foreground leading-none mt-0.5">Center</div>
        </div>
      </div>

      <div className="px-3 pt-3 pb-1">
        <button
          onClick={onOpenCommand}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg border border-border bg-secondary/50 text-muted-foreground text-xs hover:border-primary/40 hover:text-foreground transition-all group"
        >
          <Command className="w-3.5 h-3.5 group-hover:text-primary transition-colors" />
          <span className="flex-1 text-left">Quick command</span>
          <kbd className="text-[10px] bg-surface-raised px-1.5 py-0.5 rounded border border-border font-mono">
            Ctrl/⌘ K
          </kbd>
        </button>
      </div>

      <div className="px-4 pt-4 pb-1">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Navigation
        </span>
      </div>

      <nav className="flex-1 px-2 space-y-0.5 pb-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              )}
            >
              <span
                className={cn(
                  "absolute left-2 w-0.5 h-5 rounded-full transition-opacity",
                  isActive ? "bg-primary opacity-100" : "opacity-0"
                )}
              />
              <Icon
                className={cn(
                  "w-4 h-4 flex-shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge ? (
                <span
                  className={cn(
                    "text-[10px] font-semibold px-1.5 py-0.5 rounded-full tabular-nums",
                    isActive
                      ? "bg-primary/20 text-primary"
                      : "bg-surface-raised text-muted-foreground"
                  )}
                >
                  {item.badge}
                </span>
              ) : null}
              {isActive ? <ChevronRight className="w-3 h-3 text-primary opacity-60" /> : null}
            </button>
          )
        })}
      </nav>

      <div className="border-t border-border px-2 py-3 space-y-0.5">
        <button
          onClick={() => onNavigate("settings")}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
            currentView === "settings"
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
          )}
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>

        <div className="flex items-center gap-2.5 px-3 py-2 mt-1">
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 ring-1 ring-primary/30">
            <span className="text-xs font-bold text-primary">JD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">John Doe</p>
            <p className="text-[10px] text-muted-foreground truncate">Manual Ops Mode</p>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
        </div>
      </div>
    </aside>
  )
}
