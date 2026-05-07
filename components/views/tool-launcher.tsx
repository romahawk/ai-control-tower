"use client"

import { useMemo, useState } from "react"
import { Bot, ExternalLink, FolderKanban, Link2, Search, Trash2, Wrench } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { SectionHeader } from "@/components/ui/section-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { getWorkflowById } from "@/lib/control-tower"
import { cn } from "@/lib/utils"
import type { AiThreadRecord, ExternalSystemRecord, Scenario, Tool } from "@/types"

interface ToolLauncherProps {
  selectedScenario: Scenario
  tools: Tool[]
  externalSystems: ExternalSystemRecord[]
  aiThreads: AiThreadRecord[]
  onOpenWorkflow: (workflowId: string) => void
  onOpenProject: (projectId: string) => void
  onSaveExternalSystem: (
    system: Omit<ExternalSystemRecord, "id" | "createdAt" | "updatedAt"> & { id?: string }
  ) => void
  onDeleteExternalSystem: (systemId: string) => void
  onSaveAiThread: (
    thread: Omit<AiThreadRecord, "id" | "createdAt" | "updatedAt"> & { id?: string }
  ) => void
  onDeleteAiThread: (threadId: string) => void
}

const defaultSystemDraft = {
  name: "",
  category: "Reference",
  status: "reference" as ExternalSystemRecord["status"],
  url: "",
  purpose: "",
  notes: "",
}

const defaultThreadDraft = {
  title: "",
  provider: "ChatGPT",
  status: "active" as AiThreadRecord["status"],
  url: "",
  summary: "",
  nextAction: "",
}

export function ToolLauncher({
  selectedScenario,
  tools,
  externalSystems,
  aiThreads,
  onOpenWorkflow,
  onOpenProject,
  onSaveExternalSystem,
  onDeleteExternalSystem,
  onSaveAiThread,
  onDeleteAiThread,
}: ToolLauncherProps) {
  const [query, setQuery] = useState("")
  const [systemDraft, setSystemDraft] = useState(defaultSystemDraft)
  const [threadDraft, setThreadDraft] = useState(defaultThreadDraft)

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

  const scenarioSystems = useMemo(
    () => externalSystems.filter((system) => system.scenarioId === selectedScenario.id),
    [externalSystems, selectedScenario.id]
  )
  const scenarioThreads = useMemo(
    () => aiThreads.filter((thread) => thread.scenarioId === selectedScenario.id),
    [aiThreads, selectedScenario.id]
  )

  const saveSystem = () => {
    if (!systemDraft.name.trim() || !systemDraft.purpose.trim()) {
      return
    }

    onSaveExternalSystem({
      name: systemDraft.name.trim(),
      category: systemDraft.category.trim(),
      status: systemDraft.status,
      scenarioId: selectedScenario.id,
      url: systemDraft.url.trim() || undefined,
      purpose: systemDraft.purpose.trim(),
      notes: systemDraft.notes.trim() || undefined,
      lastUsedAt: new Date().toISOString(),
    })
    setSystemDraft(defaultSystemDraft)
  }

  const saveThread = () => {
    if (!threadDraft.title.trim() || !threadDraft.summary.trim()) {
      return
    }

    onSaveAiThread({
      title: threadDraft.title.trim(),
      provider: threadDraft.provider.trim(),
      status: threadDraft.status,
      scenarioId: selectedScenario.id,
      url: threadDraft.url.trim() || undefined,
      summary: threadDraft.summary.trim(),
      nextAction: threadDraft.nextAction.trim() || undefined,
      lastMessageAt: new Date().toISOString(),
    })
    setThreadDraft(defaultThreadDraft)
  }

  return (
    <div className="mx-auto max-w-[1360px] space-y-4 p-6">
      <section className="surface-panel rounded-3xl p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            icon={Wrench}
            title="External Systems + AI Threads"
            description={`Track the outside systems and AI conversations attached to ${selectedScenario.name}.`}
          />
          <div className="relative w-full md:w-[360px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tools..." className="pl-9" />
          </div>
        </div>
      </section>

      <Tabs defaultValue="tools" className="space-y-4">
        <TabsList className="h-auto rounded-2xl border border-border/60 bg-secondary/15 p-1">
          <TabsTrigger value="tools" className="rounded-xl px-4 py-2">Tools</TabsTrigger>
          <TabsTrigger value="systems" className="rounded-xl px-4 py-2">External systems</TabsTrigger>
          <TabsTrigger value="threads" className="rounded-xl px-4 py-2">AI threads</TabsTrigger>
        </TabsList>

        <TabsContent value="tools">
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
                        <InfoPanel title="Role" body={tool.role} />
                        <InfoPanel title="Best for" body={tool.bestFor} />
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
        </TabsContent>

        <TabsContent value="systems">
          <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
            <div className="space-y-3">
              {scenarioSystems.length > 0 ? (
                scenarioSystems.map((system) => (
                  <Card key={system.id} className="surface-panel rounded-3xl">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <Link2 className="h-4 w-4 text-primary" />
                            <p className="text-sm font-semibold text-foreground">{system.name}</p>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {system.category} · {system.status}
                          </p>
                          <p className="mt-2 text-sm text-muted-foreground">{system.purpose}</p>
                          {system.notes ? <p className="mt-2 text-xs text-muted-foreground">{system.notes}</p> : null}
                        </div>
                        <div className="flex gap-2">
                          {system.projectId ? (
                            <Button size="sm" variant="outline" onClick={() => onOpenProject(system.projectId!)}>
                              <FolderKanban className="h-4 w-4" />
                            </Button>
                          ) : null}
                          <Button size="sm" variant="outline" onClick={() => onDeleteExternalSystem(system.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <EmptyState icon={Link2} title="No external systems yet" description="Register the outside systems this scenario depends on." />
              )}
            </div>

            <Card className="surface-panel rounded-3xl">
              <CardContent className="space-y-3 p-4">
                <SectionHeader icon={Link2} title="Add external system" />
                <Input value={systemDraft.name} onChange={(event) => setSystemDraft((current) => ({ ...current, name: event.target.value }))} placeholder="System name" />
                <Input value={systemDraft.category} onChange={(event) => setSystemDraft((current) => ({ ...current, category: event.target.value }))} placeholder="Category" />
                <Select value={systemDraft.status} onValueChange={(value) => setSystemDraft((current) => ({ ...current, status: value as ExternalSystemRecord["status"] }))}>
                  <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reference">Reference</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="connected">Connected</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <Input value={systemDraft.url} onChange={(event) => setSystemDraft((current) => ({ ...current, url: event.target.value }))} placeholder="URL (optional)" />
                <Textarea value={systemDraft.purpose} onChange={(event) => setSystemDraft((current) => ({ ...current, purpose: event.target.value }))} placeholder="Why does this system matter?" className="min-h-24" />
                <Textarea value={systemDraft.notes} onChange={(event) => setSystemDraft((current) => ({ ...current, notes: event.target.value }))} placeholder="Notes (optional)" className="min-h-20" />
                <Button onClick={saveSystem}>Save system</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="threads">
          <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
            <div className="space-y-3">
              {scenarioThreads.length > 0 ? (
                scenarioThreads.map((thread) => (
                  <Card key={thread.id} className="surface-panel rounded-3xl">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <Bot className="h-4 w-4 text-primary" />
                            <p className="text-sm font-semibold text-foreground">{thread.title}</p>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {thread.provider} · {thread.status}
                          </p>
                          <p className="mt-2 text-sm text-muted-foreground">{thread.summary}</p>
                          {thread.nextAction ? <p className="mt-2 text-xs text-foreground">Next: {thread.nextAction}</p> : null}
                        </div>
                        <div className="flex gap-2">
                          {thread.workflowId ? (
                            <Button size="sm" variant="outline" onClick={() => onOpenWorkflow(thread.workflowId!)}>
                              Open
                            </Button>
                          ) : null}
                          <Button size="sm" variant="outline" onClick={() => onDeleteAiThread(thread.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <EmptyState icon={Bot} title="No AI threads yet" description="Register the AI conversations that carry execution context outside the app." />
              )}
            </div>

            <Card className="surface-panel rounded-3xl">
              <CardContent className="space-y-3 p-4">
                <SectionHeader icon={Bot} title="Add AI thread" />
                <Input value={threadDraft.title} onChange={(event) => setThreadDraft((current) => ({ ...current, title: event.target.value }))} placeholder="Thread title" />
                <Input value={threadDraft.provider} onChange={(event) => setThreadDraft((current) => ({ ...current, provider: event.target.value }))} placeholder="Provider" />
                <Select value={threadDraft.status} onValueChange={(value) => setThreadDraft((current) => ({ ...current, status: value as AiThreadRecord["status"] }))}>
                  <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <Input value={threadDraft.url} onChange={(event) => setThreadDraft((current) => ({ ...current, url: event.target.value }))} placeholder="Thread URL (optional)" />
                <Textarea value={threadDraft.summary} onChange={(event) => setThreadDraft((current) => ({ ...current, summary: event.target.value }))} placeholder="What did this thread cover?" className="min-h-24" />
                <Textarea value={threadDraft.nextAction} onChange={(event) => setThreadDraft((current) => ({ ...current, nextAction: event.target.value }))} placeholder="Next action (optional)" className="min-h-20" />
                <Button onClick={saveThread}>Save thread</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function InfoPanel({ title, body }: { title: string; body: string }) {
  return (
    <div className="surface-subtle rounded-2xl p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
      <p className="mt-2 text-sm text-foreground">{body}</p>
    </div>
  )
}
