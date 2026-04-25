"use client"

import { useState, useRef, useEffect } from "react"
import {
  Search,
  LayoutDashboard,
  BookOpen,
  AppWindow,
  GitBranch,
  Settings,
  Hash,
  Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { ViewType } from "@/types/navigation"
import { PROMPTS } from "@/data/prompts"

interface CommandPaletteProps {
  onClose: () => void
  onNavigate: (view: ViewType) => void
}

const navCommands = [
  { id: "dashboard", label: "Go to Control Tower", icon: LayoutDashboard, shortcut: "G D" },
  { id: "workflows", label: "Go to Workflow Library", icon: GitBranch, shortcut: "G W" },
  { id: "prompts", label: "Go to Prompt Library", icon: BookOpen, shortcut: "G P" },
  { id: "tools", label: "Go to Tool Registry", icon: AppWindow, shortcut: "G T" },
  { id: "settings", label: "Go to Settings", icon: Settings, shortcut: "G S" },
] as const

const recentPrompts = PROMPTS.slice(0, 4)

export default function CommandPalette({ onClose, onNavigate }: CommandPaletteProps) {
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const filteredNav = navCommands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  )

  const filteredPrompts = PROMPTS.filter((prompt) => {
    const search = query.toLowerCase()
    return (
      prompt.title.toLowerCase().includes(search) ||
      prompt.category.toLowerCase().includes(search) ||
      prompt.content.toLowerCase().includes(search)
    )
  }).slice(0, 5)

  const hasResults = filteredNav.length > 0 || filteredPrompts.length > 0

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((index) => index + 1)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((index) => Math.max(0, index - 1))
    } else if (e.key === "Enter" && filteredNav[selectedIndex]) {
      onNavigate(filteredNav[selectedIndex].id as ViewType)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />

      <div
        className="relative glass border border-border rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden"
        style={{ boxShadow: "0 25px 60px rgba(0,0,0,0.6), 0 0 40px oklch(0.587 0.21 258 / 0.1)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
          <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search workflows, prompts, tools..."
            className="flex-1 bg-transparent text-foreground text-sm outline-none placeholder:text-muted-foreground/60"
          />
          <kbd className="text-[10px] bg-surface-raised text-muted-foreground px-2 py-1 rounded border border-border font-mono">
            ESC
          </kbd>
        </div>

        <div className="max-h-[420px] overflow-y-auto scrollbar-thin">
          {!query ? (
            <>
              <div className="px-3 pt-3 pb-1">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-2">
                  Recent Prompts
                </p>
              </div>
              {recentPrompts.map((prompt, index) => (
                <button
                  key={prompt.id}
                  className={cn(
                    "w-full flex items-center gap-3 px-5 py-2.5 text-sm transition-colors text-left",
                    selectedIndex === index
                      ? "bg-primary/10 text-foreground"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  )}
                  onClick={() => onNavigate("prompts")}
                >
                  <Clock className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground/60" />
                  <span className="flex-1">{prompt.title}</span>
                  <span className="text-[10px] text-muted-foreground/50">{prompt.category}</span>
                </button>
              ))}

              <div className="px-3 pt-3 pb-1">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-2">
                  Navigate
                </p>
              </div>
              {navCommands.map((cmd, index) => {
                const Icon = cmd.icon
                return (
                  <button
                    key={cmd.id}
                    className={cn(
                      "w-full flex items-center gap-3 px-5 py-2.5 text-sm transition-colors text-left",
                      selectedIndex === index + recentPrompts.length
                        ? "bg-primary/10 text-foreground"
                        : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                    )}
                    onClick={() => onNavigate(cmd.id as ViewType)}
                  >
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="flex-1">{cmd.label}</span>
                    <kbd className="text-[10px] bg-surface-raised px-1.5 py-0.5 rounded border border-border font-mono text-muted-foreground/50">
                      {cmd.shortcut}
                    </kbd>
                  </button>
                )
              })}
            </>
          ) : hasResults ? (
            <>
              {filteredPrompts.length > 0 ? (
                <>
                  <div className="px-3 pt-3 pb-1">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-2">
                      Prompts
                    </p>
                  </div>
                  {filteredPrompts.map((prompt) => (
                    <button
                      key={prompt.id}
                      className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-colors text-left"
                      onClick={() => onNavigate("prompts")}
                    >
                      <Hash className="w-3.5 h-3.5 flex-shrink-0 text-primary/60" />
                      <div className="flex-1 min-w-0">
                        <p className="text-foreground truncate">{prompt.title}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{prompt.category}</p>
                      </div>
                    </button>
                  ))}
                </>
              ) : null}

              {filteredNav.length > 0 ? (
                <>
                  <div className="px-3 pt-3 pb-1">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-2">
                      Navigate
                    </p>
                  </div>
                  {filteredNav.map((cmd) => {
                    const Icon = cmd.icon
                    return (
                      <button
                        key={cmd.id}
                        className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-colors text-left"
                        onClick={() => onNavigate(cmd.id as ViewType)}
                      >
                        <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="flex-1">{cmd.label}</span>
                      </button>
                    )
                  })}
                </>
              ) : null}
            </>
          ) : (
            <div className="px-5 py-10 text-center text-muted-foreground text-sm">
              No results for &quot;{query}&quot;
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 px-5 py-2.5 border-t border-border text-[11px] text-muted-foreground/50">
          <span className="flex items-center gap-1.5">
            <kbd className="bg-surface-raised border border-border rounded px-1 font-mono">↑↓</kbd>
            navigate
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="bg-surface-raised border border-border rounded px-1 font-mono">↵</kbd>
            select
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="bg-surface-raised border border-border rounded px-1 font-mono">ESC</kbd>
            close
          </span>
        </div>
      </div>
    </div>
  )
}
