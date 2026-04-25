"use client"

import { useState, useEffect, useCallback } from "react"
import { INCOME_ENGINES } from "@/data/income-engines"
import Sidebar from "@/components/sidebar"
import TopBar from "@/components/top-bar"
import CommandPalette from "@/components/command-palette"
import { Dashboard } from "@/components/views/dashboard"
import { PromptLibrary } from "@/components/views/prompt-library"
import { ExecutionPanel } from "@/components/views/execution-panel"
import { ContextManager } from "@/components/views/context-manager"
import { ToolLauncher } from "@/components/views/tool-launcher"
import { WorkflowLibrary } from "@/components/views/workflow-library"
import { Settings } from "@/components/views/settings"
import type { ViewType } from "@/types/navigation"

interface AppShellProps {
  currentView: ViewType
  onNavigate: (view: ViewType) => void
}

export default function AppShell({ currentView, onNavigate }: AppShellProps) {
  const [commandOpen, setCommandOpen] = useState(false)
  const [selectedWorkflowId, setSelectedWorkflowId] = useState(
    INCOME_ENGINES.find((engine) => engine.priority === "Primary")?.activeWorkflowId ??
      INCOME_ENGINES[0]?.activeWorkflowId ??
      ""
  )

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

  const openWorkflow = (workflowId: string) => {
    setSelectedWorkflowId(workflowId)
    onNavigate("workflows")
  }

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <Dashboard
            onNavigate={onNavigate}
            onOpenCommand={() => setCommandOpen(true)}
            onOpenWorkflow={openWorkflow}
          />
        )
      case "prompts":
        return <PromptLibrary onOpenWorkflow={openWorkflow} />
      case "execution":
        return <ExecutionPanel />
      case "contexts":
        return <ContextManager />
      case "tools":
        return <ToolLauncher onOpenWorkflow={openWorkflow} />
      case "workflows":
        return (
          <WorkflowLibrary
            selectedWorkflowId={selectedWorkflowId}
            onSelectWorkflow={setSelectedWorkflowId}
          />
        )
      case "settings":
        return <Settings />
      default:
        return (
          <Dashboard
            onNavigate={onNavigate}
            onOpenCommand={() => setCommandOpen(true)}
            onOpenWorkflow={openWorkflow}
          />
        )
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
        <main className="flex-1 overflow-auto scrollbar-thin">{renderView()}</main>
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
