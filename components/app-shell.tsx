"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Sidebar from "@/components/sidebar"
import TopBar from "@/components/top-bar"
import CommandPalette from "@/components/command-palette"
import { SCENARIOS } from "@/data/scenarios"
import { Dashboard } from "@/components/views/dashboard"
import { ProjectsView } from "@/components/views/projects-view"
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
import { PROMPT_OS_RULES, buildContextPackForPrompt, buildExecutionPack, buildPromptOnly, buildPromptPackage, getCurrentStepIndex } from "@/lib/control-tower"
import type { ViewType } from "@/types/navigation"

interface AppShellProps {
  currentView: ViewType
  onNavigate: (view: ViewType) => void
}

export default function AppShell({ currentView, onNavigate }: AppShellProps) {
  const [commandOpen, setCommandOpen] = useState(false)
  const {
    state,
    selectedProject,
    selectedScenario,
    selectedWorkflow,
    activeWorkflow,
    activeSession,
    currentStep,
    scenarioProjects,
    scenarioWorkflows,
    projects,
    selectProject,
    scenarioPrompts,
    scenarioTools,
    stepPrompts,
    stepTools,
    stepContexts,
    activeSessions,
    recentOutputs,
    nextActions,
    reviews,
    goals,
    saveProject,
    updateProjectStatus,
    selectedProjectGoals,
    selectedProjectExternalSystems,
    selectedProjectAiThreads,
    saveGoal,
    updateGoalStatus,
    externalSystems,
    aiThreads,
    getScenarioExternalSystems,
    getWorkflowExternalSystems,
    getScenarioAiThreads,
    getWorkflowAiThreads,
    saveExternalSystem,
    removeExternalSystemRecord,
    saveAiThread,
    removeAiThreadRecord,
    getWorkflowHealth,
    selectScenario,
    selectWorkflow,
    startWorkflowSession,
    setActiveSession,
    clearActiveSessionFocus,
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
    removeContextRecord,
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

  const openProject = (projectId: string) => {
    selectProject(projectId)
    onNavigate("projects")
  }

  const handleNewAction = (kind: "workflow" | "project" | "prompt" | "review" | "scenario" | "capture") => {
    switch (kind) {
      case "workflow": {
        const defaultWorkflowId = selectedScenario.defaultWorkflowIds?.[0]
        if (defaultWorkflowId) {
          startWorkflowSession(defaultWorkflowId)
        }
        onNavigate("workflows")
        return
      }
      case "project":
        onNavigate("projects")
        return
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
            scenarioProjects={scenarioProjects}
            scenarioWorkflows={scenarioWorkflows}
            sessions={state.sessions}
            activeSessions={activeSessions}
            activeSession={activeSession}
            quickCaptures={state.quickCaptures}
            recentOutputs={recentOutputs}
            recentReviews={reviews}
            nextActions={nextActions}
            goals={goals}
            getWorkflowHealth={getWorkflowHealth}
            onNavigate={onNavigate}
            onOpenProject={openProject}
            onOpenWorkflow={openWorkflow}
            onStartWorkflowSession={startWorkflowSession}
            onResetFocus={clearActiveSessionFocus}
            onQuickCapture={saveQuickCapture}
          />
        )
      case "projects":
        return (
          <ProjectsView
            selectedScenario={selectedScenario}
            selectedProject={selectedProject}
            projects={projects}
            sessions={state.sessions}
            recentOutputs={recentOutputs}
            contexts={state.contexts}
            goals={selectedProjectGoals}
            externalSystems={selectedProjectExternalSystems}
            aiThreads={selectedProjectAiThreads}
            onSelectProject={selectProject}
            onOpenWorkflows={() => onNavigate("workflows")}
            onOpenScenario={(scenarioId) => {
              selectScenario(scenarioId)
              onNavigate("scenarios")
            }}
            onSaveProject={saveProject}
            onUpdateProjectStatus={updateProjectStatus}
            onSaveGoal={saveGoal}
            onUpdateGoalStatus={updateGoalStatus}
            onSaveExternalSystem={saveExternalSystem}
            onDeleteExternalSystem={removeExternalSystemRecord}
            onSaveAiThread={saveAiThread}
            onDeleteAiThread={removeAiThreadRecord}
            onSaveContext={createContextRecord}
            onDeleteContext={removeContextRecord}
          />
        )
      case "scenarios":
        return (
          <ScenariosView
            selectedScenario={selectedScenario}
            sessions={state.sessions}
            recentOutputs={recentOutputs}
            reviews={reviews}
            quickCaptures={state.quickCaptures}
            projects={projects}
            goals={goals}
            externalSystems={getScenarioExternalSystems(selectedScenario.id)}
            aiThreads={getScenarioAiThreads(selectedScenario.id)}
            getWorkflowHealth={getWorkflowHealth}
            onSelectScenario={selectScenario}
            onOpenWorkflows={() => onNavigate("workflows")}
            onOpenProjects={() => onNavigate("projects")}
            onOpenPrompts={() => onNavigate("prompts")}
            onOpenReviews={() => onNavigate("reviews")}
            onEditScenario={() => onNavigate("settings")}
          />
        )
      case "prompts":
        return (
          <PromptLibrary
            selectedScenario={selectedScenario}
            selectedWorkflow={selectedWorkflow}
            prompts={scenarioPrompts}
            tools={scenarioTools}
            quickCaptures={state.quickCaptures}
            promptRules={PROMPT_OS_RULES}
            getContextPack={(prompt) => buildContextPackForPrompt(prompt, state)}
            getPromptBody={buildPromptOnly}
            getPromptPackage={(prompt) => buildPromptPackage(prompt, state)}
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
            selectedProject={selectedProject}
            selectedWorkflow={selectedWorkflow}
            currentStep={currentStep}
            contexts={state.contexts}
            onSaveContext={createContextRecord}
            onDeleteContext={removeContextRecord}
          />
        )
      case "tools":
        return (
          <ToolLauncher
            selectedScenario={selectedScenario}
            tools={scenarioTools}
            externalSystems={externalSystems}
            aiThreads={aiThreads}
            onOpenWorkflow={openWorkflow}
            onOpenProject={openProject}
            onSaveExternalSystem={saveExternalSystem}
            onDeleteExternalSystem={removeExternalSystemRecord}
            onSaveAiThread={saveAiThread}
            onDeleteAiThread={removeAiThreadRecord}
          />
        )
      case "workflows":
        return (
          <WorkflowLibrary
            selectedScenario={selectedScenario}
            selectedProject={selectedProject}
            scenarioProjects={scenarioProjects}
            workflows={scenarioWorkflows}
            selectedWorkflow={selectedWorkflow}
            allSessions={state.sessions}
            activeSession={activeSession}
            workflowSessions={workflowSessions}
            currentStepIndex={currentStepIndex}
            stepPrompts={stepPrompts}
            stepTools={stepTools}
            stepContexts={stepContexts}
            goals={goals}
            externalSystems={getWorkflowExternalSystems(selectedWorkflow.id)}
            aiThreads={getWorkflowAiThreads(selectedWorkflow.id)}
            getWorkflowHealth={getWorkflowHealth}
            executionPack={executionPack}
            onSelectWorkflow={selectWorkflow}
            onOpenRunner={() => onNavigate("execution")}
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
