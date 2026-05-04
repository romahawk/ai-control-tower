"use client"

import { QuickCapture } from "@/components/ui/quick-capture"
import type { QuickCaptureRecord, QuickCaptureType, Scenario, Workflow } from "@/types"

interface DashboardQuickCaptureProps {
  selectedScenario: Scenario
  selectedWorkflow?: Workflow
  quickCaptures: QuickCaptureRecord[]
  onSave: (params: {
    type: QuickCaptureType
    content: string
    scenarioId?: string
    workflowId?: string
  }) => void
}

export function DashboardQuickCapture(props: DashboardQuickCaptureProps) {
  return <QuickCapture {...props} />
}
