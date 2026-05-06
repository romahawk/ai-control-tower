"use client"

import { useMemo, useState } from "react"
import { Compass, PencilLine, PlayCircle, Sparkles } from "lucide-react"
import { SCENARIOS } from "@/data/scenarios"
import { PROMPTS } from "@/data/prompts"
import { WORKFLOWS } from "@/data/workflows"
import { CompactCard } from "@/components/ui/compact-card"
import { DetailPanel } from "@/components/ui/detail-panel"
import { EmptyState } from "@/components/ui/empty-state"
import { PageHeader } from "@/components/ui/page-header"
import { ScenarioBadge } from "@/components/ui/scenario-badge"
import { SegmentedTabs } from "@/components/ui/segmented-tabs"
import { StatusBadge } from "@/components/ui/status-badge"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { getScenarioIcon } from "@/lib/ui-meta"
import type { OutputRecord, Scenario, WorkflowSession } from "@/types"

interface ScenariosViewProps {
  selectedScenario: Scenario
  sessions: WorkflowSession[]
  recentOutputs: OutputRecord[]
  onSelectScenario: (scenarioId: string) => void
  onOpenWorkflows: () => void
  onEditScenario: () => void
}

type ScenarioTab = "all" | "active" | "system" | "custom" | "archived"

const scenarioTabs: Array<{ value: ScenarioTab; label: string }> = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "system", label: "System" },
  { value: "custom", label: "Custom" },
  { value: "archived", label: "Archived" },
]

export function ScenariosView({
  selectedScenario,
  sessions,
  recentOutputs,
  onSelectScenario,
  onOpenWorkflows,
  onEditScenario,
}: ScenariosViewProps) {
  const [activeTab, setActiveTab] = useState<ScenarioTab>("all")
  const [focusedScenarioId, setFocusedScenarioId] = useState(selectedScenario.id)

  const focusedScenario =
    SCENARIOS.find((scenario) => scenario.id === focusedScenarioId) ?? selectedScenario

  const filteredScenarios = useMemo(() => {
    return SCENARIOS.filter((scenario) => {
      switch (activeTab) {
        case "active":
          return scenario.status === "active"
        case "system":
          return scenario.category !== "custom"
        case "custom":
          return scenario.category === "custom"
        case "archived":
          return scenario.status === "archived"
        default:
          return true
      }
    })
  }, [activeTab])

  const getLastActivity = (scenarioId: string) => {
    const sessionDates = sessions
      .filter((session) => session.scenarioId === scenarioId)
      .map((session) => session.updatedAt)
    const outputDates = recentOutputs
      .filter((output) => output.scenarioId === scenarioId)
      .map((output) => output.updatedAt)
    const mostRecent = [...sessionDates, ...outputDates].sort().at(-1)
    return mostRecent ? new Date(mostRecent).toLocaleDateString() : "No activity"
  }

  return (
    <div className="h-full overflow-auto px-4 py-4 md:px-6">
      <div className="mx-auto max-w-[1360px] space-y-4">
        <PageHeader
          title="Scenarios"
          description="Reusable contexts for workflows, prompts, reviews, and outputs."
          icon={Compass}
          actionLabel="New scenario"
          actionIcon={Sparkles}
          onAction={onEditScenario}
        />

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ScenarioTab)} className="space-y-4">
          <SegmentedTabs tabs={scenarioTabs} />
          <TabsContent value={activeTab} className="outline-none">
            <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
              <div className="grid gap-4 sm:grid-cols-2">
                {filteredScenarios.map((scenario) => {
                  const Icon = getScenarioIcon(scenario.category)
                  const workflowCount = WORKFLOWS.filter((workflow) => workflow.scenarioId === scenario.id).length
                  const promptCount = PROMPTS.filter((prompt) => prompt.scenarioId === scenario.id).length
                  const isFocused = scenario.id === focusedScenario.id

                  return (
                    <CompactCard
                      key={scenario.id}
                      title={scenario.name}
                      subtitle={scenario.description}
                      icon={Icon}
                      isActive={isFocused}
                      onClick={() => setFocusedScenarioId(scenario.id)}
                      badges={
                        <>
                          <StatusBadge status={scenario.status} />
                          <span className="rounded-full border border-border/70 bg-secondary/25 px-2.5 py-1 text-[11px] text-muted-foreground">
                            {workflowCount} workflows
                          </span>
                          <span className="rounded-full border border-border/70 bg-secondary/25 px-2.5 py-1 text-[11px] text-muted-foreground">
                            {promptCount} prompts
                          </span>
                        </>
                      }
                      metadata={
                        <>
                          <span>Last activity: {getLastActivity(scenario.id)}</span>
                          {scenario.priority ? <span>{scenario.priority} priority</span> : null}
                        </>
                      }
                      primaryAction={
                        <button
                          onClick={(event) => {
                            event.stopPropagation()
                            onSelectScenario(scenario.id)
                          }}
                          className="rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90"
                        >
                          Set active
                        </button>
                      }
                      secondaryAction={
                        <button
                          onClick={(event) => {
                            event.stopPropagation()
                            onSelectScenario(scenario.id)
                            onOpenWorkflows()
                          }}
                          className="rounded-xl border border-border bg-secondary/25 px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-secondary/45"
                        >
                          Open
                        </button>
                      }
                    />
                  )
                })}

                {filteredScenarios.length === 0 ? (
                  <div className="sm:col-span-2">
                    <EmptyState
                      icon={Compass}
                      title="No scenarios yet"
                      description="Create your first scenario to organize workflows and prompts."
                    />
                  </div>
                ) : null}
              </div>

              <DetailPanel
                title={focusedScenario.name}
                subtitle={focusedScenario.description}
                icon={getScenarioIcon(focusedScenario.category)}
                badges={
                  <>
                    <StatusBadge status={focusedScenario.status} />
                    <ScenarioBadge scenario={focusedScenario} />
                  </>
                }
                actions={
                  <>
                    <button
                      onClick={() => {
                        onSelectScenario(focusedScenario.id)
                        onOpenWorkflows()
                      }}
                      className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                    >
                      Open scenario
                    </button>
                    <button
                      onClick={() => {
                        onSelectScenario(focusedScenario.id)
                        onEditScenario()
                      }}
                      className="rounded-xl border border-border bg-secondary/25 px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary/45"
                    >
                      Edit
                    </button>
                  </>
                }
                metadata={
                  <>
                    <span>{WORKFLOWS.filter((workflow) => workflow.scenarioId === focusedScenario.id).length} linked workflows</span>
                    <span>{PROMPTS.filter((prompt) => prompt.scenarioId === focusedScenario.id).length} linked prompts</span>
                    <span>Last activity: {getLastActivity(focusedScenario.id)}</span>
                  </>
                }
              >
                <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary/85">Purpose</p>
                  <p className="mt-2 text-sm text-foreground">
                    {focusedScenario.targetOutput ?? focusedScenario.nextAction ?? focusedScenario.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Linked workflows</p>
                  {WORKFLOWS.filter((workflow) => workflow.scenarioId === focusedScenario.id)
                    .slice(0, 4)
                    .map((workflow) => (
                      <div key={workflow.id} className="rounded-2xl border border-border/60 bg-secondary/15 p-4">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-foreground">{workflow.title}</p>
                          <StatusBadge status={workflow.status} />
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">{workflow.goal}</p>
                      </div>
                    ))}
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Linked prompts</p>
                  {PROMPTS.filter((prompt) => prompt.scenarioId === focusedScenario.id)
                    .slice(0, 3)
                    .map((prompt) => (
                      <div key={prompt.id} className="rounded-2xl border border-border/60 bg-secondary/15 p-4">
                        <p className="text-sm font-semibold text-foreground">{prompt.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{prompt.expectedOutput}</p>
                      </div>
                    ))}
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recent outputs</p>
                  {recentOutputs
                    .filter((output) => output.scenarioId === focusedScenario.id)
                    .slice(0, 3)
                    .map((output) => (
                      <div key={output.id} className="rounded-2xl border border-border/60 bg-secondary/15 p-4">
                        <p className="text-sm font-semibold text-foreground">{output.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {new Date(output.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}

                  {recentOutputs.filter((output) => output.scenarioId === focusedScenario.id).length === 0 ? (
                    <EmptyState
                      icon={PlayCircle}
                      title="No outputs yet"
                      description="Outputs will appear here once this scenario starts producing visible results."
                    />
                  ) : null}
                </div>
              </DetailPanel>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
