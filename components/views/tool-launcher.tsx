"use client"

import { useMemo, useState } from "react"
import { ExternalLink, Search, Wrench } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { SectionHeader } from "@/components/ui/section-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { getWorkflowById } from "@/lib/control-tower"
import type { Scenario, Tool } from "@/types"

interface ToolLauncherProps {
  selectedScenario: Scenario
  tools: Tool[]
  onOpenWorkflow: (workflowId: string) => void
}

export function ToolLauncher({ selectedScenario, tools, onOpenWorkflow }: ToolLauncherProps) {
  const [query, setQuery] = useState("")

  const filteredTools = useMemo(() => {
    const search = query.trim().toLowerCase()
    return tools.filter((tool) => {
      if (!search) return true
      return (
        tool.name.toLowerCase().includes(search) ||
        tool.category.toLowerCase().includes(search) ||
        tool.role.toLowerCase().includes(search) ||
        tool.bestFor.toLowerCase().includes(search)
      )
    })
  }, [query, tools])

  return (
    <div className="mx-auto max-w-[1320px] space-y-6 p-6">
      <section className="surface-panel rounded-3xl p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            icon={Wrench}
            title="Tool Registry"
            description={`Tools for ${selectedScenario.name}. Tool choice should reduce scanning effort, not create more of it.`}
          />
          <div className="relative w-full md:w-[360px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tools..." className="pl-9" />
          </div>
        </div>
      </section>

      {filteredTools.length === 0 ? (
        <EmptyState icon={Wrench} title="No tools found" description="Try a broader search or switch to another scenario." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredTools.map((tool) => {
            const linkedWorkflows = tool.linkedWorkflowIds
              .map((workflowId) => getWorkflowById(workflowId))
              .filter((workflow): workflow is NonNullable<typeof workflow> => !!workflow)

            return (
              <Card key={tool.id} className="surface-panel rounded-3xl">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold tracking-tight text-foreground">{tool.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{tool.category}</p>
                    </div>
                    <span className="rounded-full border border-border bg-secondary/30 px-3 py-1 text-[11px] font-semibold text-foreground">
                      {tool.category}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3">
                    <div className="surface-subtle rounded-2xl p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Role</p>
                      <p className="mt-2 text-sm text-foreground">{tool.role}</p>
                    </div>
                    <div className="surface-subtle rounded-2xl p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Best for</p>
                      <p className="mt-2 text-sm text-foreground">{tool.bestFor}</p>
                    </div>
                    <div className="rounded-2xl border border-destructive/15 bg-destructive/8 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-destructive">Avoid when</p>
                      <p className="mt-2 text-sm text-foreground">{tool.avoidWhen}</p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Linked workflows</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {linkedWorkflows.map((workflow) => (
                        <button
                          key={workflow.id}
                          onClick={() => onOpenWorkflow(workflow.id)}
                          className="rounded-full border border-border bg-secondary/30 px-3 py-1.5 text-xs text-foreground transition hover:border-primary/20 hover:text-primary"
                        >
                          {workflow.title}
                        </button>
                      ))}
                      {linkedWorkflows.length === 0 ? <span className="text-sm text-muted-foreground">No linked workflows.</span> : null}
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Button asChild>
                      <a href={tool.url} target="_blank" rel="noopener noreferrer">
                        Launch tool
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                    {tool.scenarioIds?.length ? (
                      <span className={cn("inline-flex items-center rounded-full border border-border bg-secondary/30 px-3 py-1.5 text-xs text-muted-foreground")}>
                        {tool.scenarioIds.length} linked scenarios
                      </span>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
