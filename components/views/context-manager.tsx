"use client"

import { useMemo, useState } from "react"
import { Database, Pencil, Plus, Trash2 } from "lucide-react"
import { SCENARIOS } from "@/data/scenarios"
import { WORKFLOWS } from "@/data/workflows"
import { EmptyState } from "@/components/ui/empty-state"
import { SectionHeader } from "@/components/ui/section-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getContextIcon } from "@/lib/ui-meta"
import type { ContextRecord, Project, Scenario, Workflow } from "@/types"

interface ContextManagerProps {
  selectedScenario: Scenario
  selectedProject?: Project
  selectedWorkflow: Workflow
  contexts: ContextRecord[]
  onSaveContext: (
    contextRecord: Omit<ContextRecord, "id" | "createdAt" | "updatedAt"> & {
      id?: string
    }
  ) => void
  onDeleteContext: (contextId: string) => void
}

export function ContextManager({
  selectedScenario,
  selectedProject,
  selectedWorkflow,
  contexts,
  onSaveContext,
  onDeleteContext,
}: ContextManagerProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [type, setType] = useState<ContextRecord["type"]>("project")
  const [scope, setScope] = useState<"project" | "workflow" | "scenario">(
    selectedProject ? "project" : "workflow"
  )
  const [editingContextId, setEditingContextId] = useState<string | undefined>()
  const [query, setQuery] = useState("")

  const scopedContexts = useMemo(() => {
    return contexts.filter((context) =>
      scope === "project"
        ? context.projectId === selectedProject?.id
        : scope === "workflow"
        ? context.workflowId === selectedWorkflow.id || context.scenarioId === selectedScenario.id
        : context.scenarioId === selectedScenario.id
    )
  }, [contexts, scope, selectedProject?.id, selectedScenario.id, selectedWorkflow.id])
  const filteredContexts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) {
      return scopedContexts
    }

    return scopedContexts.filter((context) =>
      context.title.toLowerCase().includes(normalizedQuery) ||
      context.content.toLowerCase().includes(normalizedQuery) ||
      context.tags?.some((tag) => tag.toLowerCase().includes(normalizedQuery))
    )
  }, [query, scopedContexts])

  const saveContext = () => {
    if (title.trim() === "" || content.trim() === "") return

    onSaveContext({
      id: editingContextId,
      title: title.trim(),
      content: content.trim(),
      type,
      projectId: scope === "project" ? selectedProject?.id : undefined,
      scenarioId: selectedScenario.id,
      workflowId: scope === "workflow" ? selectedWorkflow.id : undefined,
      tags: [selectedScenario.category],
    })
    setTitle("")
    setContent("")
    setEditingContextId(undefined)
  }

  return (
    <div className="mx-auto max-w-[1200px] space-y-6 p-6">
      <section className="surface-panel rounded-3xl p-6">
        <SectionHeader
          icon={Database}
          title="Context Manager"
          description="Context stores reusable background information so you do not keep restating the same setup to yourself or your tools."
        />
      </section>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="surface-panel rounded-3xl">
          <CardContent className="p-5">
            <SectionHeader
              icon={Plus}
              title="Add context record"
              description="Attach context to the selected scenario or workflow so it shows up where execution happens."
            />
            <div className="mt-5 space-y-4">
              <div className="surface-subtle rounded-2xl p-4 text-sm text-muted-foreground">
                Scenario: <span className="font-medium text-foreground">{selectedScenario.name}</span>
                <br />
                Project: <span className="font-medium text-foreground">{selectedProject?.name ?? "None selected"}</span>
                <br />
                Workflow: <span className="font-medium text-foreground">{selectedWorkflow.title}</span>
              </div>
              <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Context title" />
              <Textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="What context should follow this scenario or workflow?" className="min-h-32" />

              <div className="flex flex-wrap gap-2">
                {(["project", "personal", "business", "customer", "technical", "decision", "reference"] as const).map((option) => (
                  <Button key={option} variant={type === option ? "default" : "outline"} size="sm" onClick={() => setType(option)}>
                    {option}
                  </Button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedProject ? (
                  <Button variant={scope === "project" ? "default" : "outline"} size="sm" onClick={() => setScope("project")}>
                    Project scope
                  </Button>
                ) : null}
                <Button variant={scope === "workflow" ? "default" : "outline"} size="sm" onClick={() => setScope("workflow")}>
                  Workflow scope
                </Button>
                <Button variant={scope === "scenario" ? "default" : "outline"} size="sm" onClick={() => setScope("scenario")}>
                  Scenario scope
                </Button>
              </div>

              <Button onClick={saveContext}>
                <Plus className="h-4 w-4" />
                {editingContextId ? "Update context" : "Save context"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="surface-panel rounded-3xl">
          <CardContent className="p-5">
            <SectionHeader
              icon={Database}
              title={
                scope === "project"
                  ? "Project context"
                  : scope === "workflow"
                    ? "Workflow context"
                    : "Scenario context"
              }
              description="Keep reusable context near the workflows that actually need it."
            />
            <div className="mt-4">
              <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search context records..." />
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {filteredContexts.map((context) => {
                const Icon = getContextIcon(context.type)
                return (
                  <div key={context.id} className="surface-subtle rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-knowledge/10 text-knowledge">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-foreground">{context.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{context.type}</p>
                        <p className="mt-3 text-sm leading-6 text-muted-foreground">{context.content}</p>
                        {context.tags?.length ? (
                          <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                            {context.tags.map((tag) => (
                              <span key={tag} className="rounded-full border border-border bg-card/50 px-2.5 py-1 text-muted-foreground">
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : null}
                        <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                          {context.scenarioId ? (
                            <span className="rounded-full border border-border bg-secondary/30 px-2.5 py-1">
                              {SCENARIOS.find((scenario) => scenario.id === context.scenarioId)?.name ?? context.scenarioId}
                            </span>
                          ) : null}
                          {context.projectId ? (
                            <span className="rounded-full border border-border bg-secondary/30 px-2.5 py-1">
                              {selectedProject?.id === context.projectId ? selectedProject.name : context.projectId}
                            </span>
                          ) : null}
                          {context.workflowId ? (
                            <span className="rounded-full border border-border bg-secondary/30 px-2.5 py-1">
                              {WORKFLOWS.find((workflow) => workflow.id === context.workflowId)?.title ?? context.workflowId}
                            </span>
                          ) : null}
                          <span className="rounded-full border border-border bg-secondary/30 px-2.5 py-1">
                            Updated {new Date(context.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingContextId(context.id)
                            setTitle(context.title)
                            setContent(context.content)
                            setType(context.type)
                            if (context.projectId) {
                              setScope("project")
                            } else if (context.workflowId) {
                              setScope("workflow")
                            } else {
                              setScope("scenario")
                            }
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => onDeleteContext(context.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
              {filteredContexts.length === 0 ? (
                <EmptyState
                  icon={Database}
                  title={scopedContexts.length > 0 ? "No matching context" : "No context records yet"}
                  description={
                    scopedContexts.length > 0
                      ? "Try a broader search to reveal existing vault records."
                      : "Add a context record to reduce repeated explaining during workflow execution."
                  }
                />
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
