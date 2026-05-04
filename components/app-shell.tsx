"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Sidebar from "@/components/sidebar"
import TopBar from "@/components/top-bar"
import CommandPalette from "@/components/command-palette"
import { SCENARIOS } from "@/data/scenarios"
import { Dashboard } from "@/components/views/dashboard"
import { PromptLibrary } from "@/components/views/prompt-library"
import { ExecutionPanel } from "@/components/views/execution-panel"
import { ContextManager } from "@/components/views/context-manager"
import { ToolLauncher } from "@/components/views/tool-launcher"
import { WorkflowLibrary } from "@/components/views/workflow-library"
import { ReviewsView } from "@/components/views/reviews"
import { Settings } from "@/components/views/settings"
import { ScenariosView } from "@/components/views/scenarios-view"
import { WikiView } from "@/components/views/wiki"
import { useControlTowerState } from "@/hooks/use-control-tower-state"
import { buildExecutionPack, getCurrentStepIndex } from "@/lib/control-tower"
import type { ViewType } from "@/types/navigation"

interface AppShellProps {
  currentView: ViewType
  onNavigate: (view: ViewType) => void
}

export default function AppShell({ currentView, onNavigate }: AppShellProps) {
  const [commandOpen, setCommandOpen] = useState(false)
  const {
    state,
    selectedScenario,
    selectedWorkflow,
    activeWorkflow,
    activeSession,
    currentStep,
    scenarioWorkflows,
    scenarioPrompts,
    scenarioTools,
    stepPrompts,
    stepTools,
    stepContexts,
    activeSessions,
    recentOutputs,
    nextActions,
    reviews,
    selectScenario,
    selectWorkflow,
    startWorkflowSession,
    setActiveSession,
    resumeWorkflowSession,
    moveActiveStep,
    jumpToStep,
    completeCurrentStep,
    saveOutput,
    saveBlocker,
    saveResume,
    pauseActiveSession,
    finishActiveSession,
    saveSessionSummary,
    createContextRecord,
    createReview,
    saveQuickCapture,
    downloadExport,
    importWorkspace,
    resetWorkspace,
    loadDemoWorkspace,
    getCompletedStepsCount,
  } = useControlTowerState()

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault()
      setCommandOpen((current) => !current)
    }
    if (event.key === "Escape") {
      setCommandOpen(false)
    }
  }, [])

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  const openWorkflow = (workflowId: string) => {
    selectWorkflow(workflowId)
    onNavigate("workflows")
  }

  const handleNewAction = (kind: "workflow" | "prompt" | "review" | "scenario" | "capture") => {
    switch (kind) {
      case "workflow": {
        const defaultWorkflowId = selectedScenario.defaultWorkflowIds?.[0]
        if (defaultWorkflowId) {
          startWorkflowSession(defaultWorkflowId)
        }
        onNavigate("workflows")
        return
      }
      case "prompt":
        onNavigate("prompts")
        return
      case "review":
        createReview("weekly", { scenarioId: selectedScenario.id })
        onNavigate("reviews")
        return
      case "scenario":
        onNavigate("scenarios")
        return
      case "capture":
        onNavigate("dashboard")
        return
      default:
        onNavigate("dashboard")
    }
  }

  const workflowSessions = useMemo(
    () => state.sessions.filter((session) => session.workflowId === selectedWorkflow.id),
    [selectedWorkflow.id, state.sessions]
  )

  const executionPack =
    activeWorkflow && currentStep ? buildExecutionPack(activeWorkflow, currentStep, state) : ""
  const currentStepIndex =
    activeSession && activeWorkflow ? getCurrentStepIndex(activeSession, activeWorkflow) : 0

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <Dashboard
            selectedScenario={selectedScenario}
            scenarioWorkflows={scenarioWorkflows}
            sessions={state.sessions}
            activeSessions={activeSessions}
            quickCaptures={state.quickCaptures}
            recentOutputs={recentOutputs}
            recentReviews={reviews}
            nextActions={nextActions}
            onNavigate={onNavigate}
            onOpenWorkflow={openWorkflow}
            onStartWorkflowSession={startWorkflowSession}
            onQuickCapture={saveQuickCapture}
          />
        )
      case "scenarios":
        return (
          <ScenariosView
            selectedScenario={selectedScenario}
            sessions={state.sessions}
            recentOutputs={recentOutputs}
            onSelectScenario={selectScenario}
            onOpenWorkflows={() => onNavigate("workflows")}
            onEditScenario={() => onNavigate("settings")}
          />
        )
      case "prompts":
        return (
          <PromptLibrary
            selectedScenario={selectedScenario}
            prompts={scenarioPrompts}
            tools={scenarioTools}
            quickCaptures={state.quickCaptures}
            onOpenWorkflow={openWorkflow}
            onSaveQuickCapture={saveQuickCapture}
          />
        )
      case "execution":
        return <ExecutionPanel />
      case "contexts":
        return (
          <ContextManager
            selectedScenario={selectedScenario}
            selectedWorkflow={selectedWorkflow}
            contexts={state.contexts}
            onSaveContext={createContextRecord}
          />
        )
      case "tools":
        return (
          <ToolLauncher
            selectedScenario={selectedScenario}
            tools={scenarioTools}
            onOpenWorkflow={openWorkflow}
          />
        )
      case "workflows":
        return (
          <WorkflowLibrary
            selectedScenario={selectedScenario}
            workflows={scenarioWorkflows}
            selectedWorkflow={selectedWorkflow}
            allSessions={state.sessions}
            activeSession={activeSession}
            workflowSessions={workflowSessions}
            currentStepIndex={currentStepIndex}
            stepPrompts={stepPrompts}
            stepTools={stepTools}
            stepContexts={stepContexts}
            executionPack={executionPack}
            onSelectWorkflow={selectWorkflow}
            onStartWorkflowSession={startWorkflowSession}
            onSetActiveSession={setActiveSession}
            onResumeWorkflowSession={resumeWorkflowSession}
            onMoveWorkflowStep={moveActiveStep}
            onJumpToWorkflowStep={jumpToStep}
            onCompleteCurrentStep={completeCurrentStep}
            onSaveWorkflowOutput={saveOutput}
            onBlockSession={saveBlocker}
            onPauseSession={pauseActiveSession}
            onResumeSession={saveResume}
            onFinishSession={finishActiveSession}
            onSaveSessionSummary={saveSessionSummary}
            getCompletedStepsCount={getCompletedStepsCount}
          />
        )
      case "reviews":
        return (
          <ReviewsView
            selectedScenario={selectedScenario}
            activeSessions={activeSessions}
            recentOutputs={recentOutputs}
            reviews={reviews}
            nextActions={nextActions}
            onCreateReview={(type) => createReview(type, { scenarioId: selectedScenario.id })}
            onOpenWorkflow={openWorkflow}
          />
        )
      case "settings":
        return (
          <Settings
            onExport={downloadExport}
            onImport={importWorkspace}
            onReset={resetWorkspace}
            onLoadDemo={loadDemoWorkspace}
          />
        )
      case "wiki":
        return <WikiView onNavigate={onNavigate} />
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar
        currentView={currentView}
        onNavigate={onNavigate}
        onOpenCommand={() => setCommandOpen(true)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          onOpenCommand={() => setCommandOpen(true)}
          currentView={currentView}
          selectedScenario={selectedScenario}
          scenarios={SCENARIOS}
          onSelectScenario={selectScenario}
          onNewAction={handleNewAction}
        />
        <main className="flex-1 overflow-auto">{renderView()}</main>
      </div>
      {commandOpen ? (
        <CommandPalette
          onClose={() => setCommandOpen(false)}
          onNavigate={(view) => {
            onNavigate(view)
            setCommandOpen(false)
          }}
        />
      ) : null}
    </div>
  )
}
