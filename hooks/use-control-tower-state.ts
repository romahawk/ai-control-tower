"use client"

import { useEffect, useMemo, useState } from "react"
import { PROMPTS } from "@/data/prompts"
import { SCENARIOS } from "@/data/scenarios"
import { WORKFLOWS } from "@/data/workflows"
import {
  addOutputToSession,
  blockSession,
  buildReviewRecord,
  completeSessionStep,
  createInitialControlTowerState,
  createWorkflowSession,
  exportControlTowerData,
  finishSession,
  getActiveSessions,
  getCompletedStepsCount,
  getContextsForStep,
  getCurrentStepIndex,
  getDeterministicNextActions,
  getPromptsForStep,
  getRecentOutputs,
  getScenarioById,
  getScenarioSummary,
  getScenarioToolOptions,
  getScenarioWorkflowOptions,
  getStepExecution,
  getToolsForStep,
  getWorkflowById,
  importControlTowerData,
  loadControlTowerState,
  pauseSession,
  persistControlTowerState,
  resetControlTowerState,
  resumeSession,
  setSessionCurrentStep,
  updateSessionSummary,
  upsertContext,
} from "@/lib/control-tower"
import type { ContextRecord, ControlTowerState, OutputType, ReviewType } from "@/types"

export function useControlTowerState() {
  const [state, setState] = useState<ControlTowerState>(createInitialControlTowerState)

  useEffect(() => {
    setState(loadControlTowerState())
  }, [])

  useEffect(() => {
    persistControlTowerState(state)
  }, [state])

  const selectedScenario =
    getScenarioById(state.selectedScenarioId) ?? SCENARIOS[0]
  const selectedWorkflow =
    getWorkflowById(state.selectedWorkflowId) ??
    getScenarioWorkflowOptions(selectedScenario?.id ?? "")[0] ??
    WORKFLOWS[0]
  const activeSession = state.sessions.find((session) => session.id === state.activeSessionId)
  const activeWorkflow =
    (activeSession && getWorkflowById(activeSession.workflowId)) ?? selectedWorkflow
  const currentStep = activeSession?.currentStepId
    ? activeWorkflow?.steps.find((step) => step.id === activeSession.currentStepId)
    : activeWorkflow?.steps[0]

  const scenarioWorkflows = useMemo(
    () => getScenarioWorkflowOptions(selectedScenario?.id ?? ""),
    [selectedScenario?.id]
  )

  const scenarioPrompts = useMemo(
    () => PROMPTS.filter((prompt) => prompt.scenarioId === selectedScenario?.id),
    [selectedScenario?.id]
  )

  const scenarioTools = useMemo(
    () => getScenarioToolOptions(selectedScenario?.id ?? ""),
    [selectedScenario?.id]
  )

  const activeSessions = useMemo(
    () => getActiveSessions(state),
    [state]
  )

  const recentOutputs = useMemo(
    () => getRecentOutputs(state),
    [state]
  )

  const nextActions = useMemo(
    () => getDeterministicNextActions(state, selectedScenario?.id),
    [selectedScenario?.id, state]
  )

  const reviewSummary = useMemo(
    () => (selectedScenario ? getScenarioSummary(selectedScenario, state) : null),
    [selectedScenario, state]
  )

  const updateState = (updater: (currentState: ControlTowerState) => ControlTowerState) => {
    setState((currentState) => updater(currentState))
  }

  const selectScenario = (scenarioId: string) => {
    updateState((currentState) => {
      const workflows = getScenarioWorkflowOptions(scenarioId)
      return {
        ...currentState,
        selectedScenarioId: scenarioId,
        selectedWorkflowId: workflows[0]?.id ?? currentState.selectedWorkflowId,
      }
    })
  }

  const selectWorkflow = (workflowId: string) => {
    const workflow = getWorkflowById(workflowId)
    if (!workflow) {
      return
    }

    updateState((currentState) => ({
      ...currentState,
      selectedWorkflowId: workflowId,
      selectedScenarioId: workflow.scenarioId,
    }))
  }

  const startWorkflowSession = (workflowId: string) => {
    const workflow = getWorkflowById(workflowId)
    if (!workflow) {
      return
    }

    const session = createWorkflowSession(workflow)
    updateState((currentState) => ({
      ...currentState,
      selectedScenarioId: workflow.scenarioId,
      selectedWorkflowId: workflow.id,
      activeSessionId: session.id,
      sessions: [session, ...currentState.sessions],
    }))
  }

  const setActiveSession = (sessionId?: string) => {
    updateState((currentState) => ({
      ...currentState,
      activeSessionId: sessionId,
    }))
  }

  const resumeWorkflowSession = (sessionId: string, resumeNote: string) => {
    updateState((currentState) => ({
      ...currentState,
      activeSessionId: sessionId,
      sessions: currentState.sessions.map((session) => {
        if (session.id !== sessionId) {
          return session
        }

        const workflow = getWorkflowById(session.workflowId)
        const resumed = resumeSession(session, resumeNote)
        return workflow && resumed.currentStepId ? setSessionCurrentStep(resumed, workflow, resumed.currentStepId) : resumed
      }),
    }))
  }

  const moveActiveStep = (direction: 1 | -1) => {
    if (!activeSession || !activeWorkflow) {
      return
    }

    const currentIndex = getCurrentStepIndex(activeSession, activeWorkflow)
    const nextStep = activeWorkflow.steps[currentIndex + direction]
    if (!nextStep) {
      return
    }

    updateState((currentState) => ({
      ...currentState,
      sessions: currentState.sessions.map((session) =>
        session.id === activeSession.id ? setSessionCurrentStep(session, activeWorkflow, nextStep.id) : session
      ),
    }))
  }

  const jumpToStep = (stepId: string) => {
    if (!activeSession || !activeWorkflow) {
      return
    }

    updateState((currentState) => ({
      ...currentState,
      sessions: currentState.sessions.map((session) =>
        session.id === activeSession.id ? setSessionCurrentStep(session, activeWorkflow, stepId) : session
      ),
    }))
  }

  const completeCurrentStep = () => {
    if (!activeSession || !activeWorkflow || !currentStep) {
      return
    }

    updateState((currentState) => ({
      ...currentState,
      sessions: currentState.sessions.map((session) =>
        session.id === activeSession.id ? completeSessionStep(session, activeWorkflow, currentStep.id) : session
      ),
    }))
  }

  const saveOutput = (params: {
    title: string
    content: string
    type: OutputType
    stepId?: string
    toolId?: string
    promptId?: string
  }) => {
    if (!activeSession || !activeWorkflow) {
      return
    }

    updateState((currentState) => ({
      ...currentState,
      sessions: currentState.sessions.map((session) =>
        session.id === activeSession.id ? addOutputToSession(session, activeWorkflow, params) : session
      ),
    }))
  }

  const saveBlocker = (blockerNote: string) => {
    if (!activeSession) {
      return
    }

    updateState((currentState) => ({
      ...currentState,
      sessions: currentState.sessions.map((session) =>
        session.id === activeSession.id ? blockSession(session, blockerNote) : session
      ),
    }))
  }

  const saveResume = (resumeNote: string) => {
    if (!activeSession) {
      return
    }

    updateState((currentState) => ({
      ...currentState,
      sessions: currentState.sessions.map((session) =>
        session.id === activeSession.id ? resumeSession(session, resumeNote) : session
      ),
    }))
  }

  const pauseActiveSession = (resumeNote: string) => {
    if (!activeSession) {
      return
    }

    updateState((currentState) => ({
      ...currentState,
      sessions: currentState.sessions.map((session) =>
        session.id === activeSession.id ? pauseSession(session, resumeNote) : session
      ),
    }))
  }

  const finishActiveSession = (summary: string) => {
    if (!activeSession) {
      return
    }

    updateState((currentState) => ({
      ...currentState,
      sessions: currentState.sessions.map((session) =>
        session.id === activeSession.id ? finishSession(session, summary) : session
      ),
    }))
  }

  const saveSessionSummary = (summary: string) => {
    if (!activeSession) {
      return
    }

    updateState((currentState) => ({
      ...currentState,
      sessions: currentState.sessions.map((session) =>
        session.id === activeSession.id ? updateSessionSummary(session, summary) : session
      ),
    }))
  }

  const createContextRecord = (
    contextRecord: Omit<ContextRecord, "id" | "createdAt" | "updatedAt"> & {
      id?: string
    }
  ) => {
    updateState((currentState) => ({
      ...currentState,
      contexts: upsertContext(currentState.contexts, contextRecord),
    }))
  }

  const createReview = (type: ReviewType, options?: { scenarioId?: string; workflowId?: string }) => {
    const review = buildReviewRecord(type, state, options)
    updateState((currentState) => ({
      ...currentState,
      reviews: [review, ...currentState.reviews],
    }))
    return review
  }

  const downloadExport = () => {
    if (typeof window === "undefined") {
      return
    }

    const blob = new Blob([exportControlTowerData(state)], { type: "application/json" })
    const objectUrl = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = objectUrl
    link.download = `control-tower-export-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    window.URL.revokeObjectURL(objectUrl)
  }

  const importWorkspace = (rawValue: string) => {
    const importedState = importControlTowerData(rawValue)
    setState(importedState)
  }

  const resetWorkspace = () => {
    setState(resetControlTowerState())
  }

  const loadDemoWorkspace = () => {
    const demoState = createInitialControlTowerState()
    const ideaWorkflow = getWorkflowById("pd-idea-intake")

    if (!ideaWorkflow) {
      setState(demoState)
      return
    }

    const demoSession = createWorkflowSession(ideaWorkflow)
    const demoSessionWithOutput = addOutputToSession(demoSession, ideaWorkflow, {
      stepId: "pd-idea-step-1",
      type: "note",
      title: "Idea captured",
      content: "AI Control Tower for solo founders who need a repeatable validation OS.",
      toolId: "obsidian",
    })

    setState({
      ...demoState,
      selectedScenarioId: "product-development",
      selectedWorkflowId: ideaWorkflow.id,
      activeSessionId: demoSession.id,
      sessions: [demoSessionWithOutput],
    })
  }

  return {
    state,
    selectedScenario,
    selectedWorkflow,
    activeWorkflow,
    activeSession,
    currentStep,
    scenarioWorkflows,
    scenarioPrompts,
    scenarioTools,
    stepPrompts: activeWorkflow && currentStep ? getPromptsForStep(activeWorkflow, currentStep) : [],
    stepTools: currentStep ? getToolsForStep(currentStep) : [],
    stepContexts:
      activeWorkflow && currentStep ? getContextsForStep(state, activeWorkflow, currentStep) : [],
    currentStepExecution: activeSession && currentStep ? getStepExecution(activeSession, currentStep.id) : undefined,
    activeSessions,
    recentOutputs,
    nextActions,
    reviewSummary,
    reviews: state.reviews,
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
    downloadExport,
    importWorkspace,
    resetWorkspace,
    loadDemoWorkspace,
    getCompletedStepsCount,
    getCurrentStepIndex,
  }
}
