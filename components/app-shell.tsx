"use client"

import { useState, useEffect, useCallback } from "react"
import Sidebar from "@/components/sidebar"
import TopBar from "@/components/top-bar"
import CommandPalette from "@/components/command-palette"
import { Dashboard } from "@/components/views/dashboard"
import { PromptLibrary } from "@/components/views/prompt-library"
import { ExecutionPanel } from "@/components/views/execution-panel"
import { ContextManager } from "@/components/views/context-manager"
import { ToolLauncher } from "@/components/views/tool-launcher"
import { Settings } from "@/components/views/settings"
import type { ViewType } from "@/types/navigation"

interface AppShellProps {
  currentView: ViewType
  onNavigate: (view: ViewType) => void
}

export default function AppShell({ currentView, onNavigate }: AppShellProps) {
  const [commandOpen, setCommandOpen] = useState(false)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault()
      setCommandOpen((prev) => !prev)
    }
    if (e.key === "Escape") {
      setCommandOpen(false)
    }
  }, [])

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard onNavigate={onNavigate} onOpenCommand={() => setCommandOpen(true)} />
      case "prompts":
        return <PromptLibrary />
      case "execution":
        return <ExecutionPanel />
      case "contexts":
        return <ContextManager />
      case "tools":
        return <ToolLauncher />
      case "settings":
        return <Settings />
      default:
        return <Dashboard onNavigate={onNavigate} onOpenCommand={() => setCommandOpen(true)} />
    }
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar
        currentView={currentView}
        onNavigate={onNavigate}
        onOpenCommand={() => setCommandOpen(true)}
      />
      <div className="flex flex-col flex-1 min-w-0">
        <TopBar
          onOpenCommand={() => setCommandOpen(true)}
          currentView={currentView}
        />
        <main className="flex-1 overflow-auto scrollbar-thin">
          {renderView()}
        </main>
      </div>
      {commandOpen && (
        <CommandPalette
          onClose={() => setCommandOpen(false)}
          onNavigate={(view) => {
            onNavigate(view)
            setCommandOpen(false)
          }}
        />
      )}
    </div>
  )
}
