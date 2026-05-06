"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  BookOpen,
  Compass,
  FolderKanban,
  GitBranch,
  Hash,
  LayoutDashboard,
  Library,
  Search,
  Settings,
  Workflow,
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
  { id: "projects", label: "Go to Projects", icon: FolderKanban, shortcut: "G J" },
  { id: "scenarios", label: "Go to Scenarios", icon: Compass, shortcut: "G S" },
  { id: "workflows", label: "Go to Workflow Library", icon: GitBranch, shortcut: "G W" },
  { id: "prompts", label: "Go to Prompt Library", icon: BookOpen, shortcut: "G P" },
  { id: "reviews", label: "Go to Reviews", icon: Workflow, shortcut: "G R" },
  { id: "wiki", label: "Go to Wiki", icon: Library, shortcut: "G I" },
  { id: "settings", label: "Go to Settings", icon: Settings, shortcut: "G S" },
] as const

export default function CommandPalette({ onClose, onNavigate }: CommandPaletteProps) {
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const filteredNav = useMemo(
    () => navCommands.filter((command) => command.label.toLowerCase().includes(query.toLowerCase())),
    [query]
  )
  const filteredPrompts = useMemo(
    () =>
      PROMPTS.filter((prompt) => {
        const search = query.toLowerCase()
        return (
          prompt.title.toLowerCase().includes(search) ||
          prompt.category.toLowerCase().includes(search) ||
          prompt.content.toLowerCase().includes(search)
        )
      }).slice(0, 5),
    [query]
  )

  const results = query ? [...filteredPrompts.map((prompt) => ({ type: "prompt" as const, prompt })), ...filteredNav.map((command) => ({ type: "nav" as const, command }))] : []

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!query || results.length === 0) {
      return
    }

    if (event.key === "ArrowDown") {
      event.preventDefault()
      setSelectedIndex((index) => Math.min(index + 1, results.length - 1))
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setSelectedIndex((index) => Math.max(index - 1, 0))
    } else if (event.key === "Enter") {
      const selectedResult = results[selectedIndex]
      if (!selectedResult) {
        return
      }

      if (selectedResult.type === "nav") {
        onNavigate(selectedResult.command.id as ViewType)
        return
      }

      onNavigate("prompts")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />

      <div
        className="relative mx-4 w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
          <Search className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setSelectedIndex(0)
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search workflows, prompts, tools..."
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
          />
          <kbd className="rounded border border-border bg-secondary px-2 py-1 font-mono text-[10px] text-muted-foreground">
            ESC
          </kbd>
        </div>

        <div className="max-h-[420px] overflow-y-auto">
          {!query ? (
            <>
              <div className="px-3 pb-1 pt-3">
                <p className="px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                  Navigate
                </p>
              </div>
              {navCommands.map((command) => {
                const Icon = command.icon
                return (
                  <button
                    key={command.id}
                    className="flex w-full items-center gap-3 px-5 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
                    onClick={() => onNavigate(command.id as ViewType)}
                  >
                    <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="flex-1">{command.label}</span>
                    <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground/50">
                      {command.shortcut}
                    </kbd>
                  </button>
                )
              })}
            </>
          ) : results.length > 0 ? (
            <>
              {filteredPrompts.length > 0 ? (
                <>
                  <div className="px-3 pb-1 pt-3">
                    <p className="px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                      Prompts
                    </p>
                  </div>
                  {filteredPrompts.map((prompt, index) => (
                    <button
                      key={prompt.id}
                      className={cn(
                        "flex w-full items-center gap-3 px-5 py-2.5 text-left text-sm transition-colors",
                        selectedIndex === index
                          ? "bg-primary/10 text-foreground"
                          : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                      )}
                      onClick={() => onNavigate("prompts")}
                    >
                      <Hash className="h-3.5 w-3.5 flex-shrink-0 text-primary/60" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-foreground">{prompt.title}</p>
                        <p className="truncate text-[11px] text-muted-foreground">{prompt.category}</p>
                      </div>
                    </button>
                  ))}
                </>
              ) : null}

              {filteredNav.length > 0 ? (
                <>
                  <div className="px-3 pb-1 pt-3">
                    <p className="px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                      Navigate
                    </p>
                  </div>
                  {filteredNav.map((command, index) => {
                    const Icon = command.icon
                    const resultIndex = filteredPrompts.length + index
                    return (
                      <button
                        key={command.id}
                        className={cn(
                          "flex w-full items-center gap-3 px-5 py-2.5 text-left text-sm transition-colors",
                          selectedIndex === resultIndex
                            ? "bg-primary/10 text-foreground"
                            : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                        )}
                        onClick={() => onNavigate(command.id as ViewType)}
                      >
                        <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="flex-1">{command.label}</span>
                      </button>
                    )
                  })}
                </>
              ) : null}
            </>
          ) : (
            <div className="px-5 py-10 text-center text-sm text-muted-foreground">
              No results for &quot;{query}&quot;
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
