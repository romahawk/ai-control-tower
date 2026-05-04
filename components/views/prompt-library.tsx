"use client"

import { useMemo, useState } from "react"
import { Copy, ExternalLink, MessageSquare, Search } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { SectionHeader } from "@/components/ui/section-header"
import { StatusBadge } from "@/components/ui/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { getWorkflowById } from "@/lib/control-tower"
import type { Prompt, Scenario, Tool } from "@/types"

interface PromptLibraryProps {
  selectedScenario: Scenario
  prompts: Prompt[]
  tools: Tool[]
  onOpenWorkflow: (workflowId: string) => void
}

export function PromptLibrary({ selectedScenario, prompts, tools, onOpenWorkflow }: PromptLibraryProps) {
  const [query, setQuery] = useState("")
  const [selectedPromptId, setSelectedPromptId] = useState(prompts[0]?.id ?? "")
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null)

  const filteredPrompts = useMemo(() => {
    const search = query.trim().toLowerCase()
    return prompts.filter((prompt) => {
      if (!search) return true
      const tool = tools.find((item) => item.id === prompt.toolId)
      const workflow = getWorkflowById(prompt.workflowId)
      return (
        prompt.title.toLowerCase().includes(search) ||
        prompt.category.toLowerCase().includes(search) ||
        prompt.purpose.toLowerCase().includes(search) ||
        prompt.expectedOutput.toLowerCase().includes(search) ||
        prompt.content.toLowerCase().includes(search) ||
        tool?.name.toLowerCase().includes(search) ||
        workflow?.title.toLowerCase().includes(search)
      )
    })
  }, [prompts, query, tools])

  const selectedPrompt =
    filteredPrompts.find((prompt) => prompt.id === selectedPromptId) ??
    filteredPrompts[0] ??
    null

  const copyPrompt = async (promptId: string, content: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedPromptId(promptId)
    window.setTimeout(() => setCopiedPromptId(null), 1500)
  }

  return (
    <div className="flex h-full">
      <aside className="surface-panel w-[390px] flex-shrink-0 border-r">
        <div className="border-b border-border p-5">
          <SectionHeader
            icon={MessageSquare}
            title="Prompt Library"
            description={`${selectedScenario.name} prompts first. Use step-specific prompts before browsing the whole library.`}
          />
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search prompts, workflows, tools..." className="pl-9" />
          </div>
        </div>

        <div className="h-[calc(100%-150px)] space-y-3 overflow-y-auto p-3">
          {filteredPrompts.map((prompt) => {
            const workflow = getWorkflowById(prompt.workflowId)
            const tool = tools.find((item) => item.id === prompt.toolId)
            const isActive = selectedPrompt?.id === prompt.id

            return (
              <button
                key={prompt.id}
                onClick={() => setSelectedPromptId(prompt.id)}
                className={cn(
                  "rounded-2xl border p-4 text-left transition-colors",
                  isActive
                    ? "border-primary/25 bg-primary/10"
                    : "border-border bg-secondary/20 hover:border-primary/15 hover:bg-secondary/30"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{prompt.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{workflow?.title ?? "No workflow linked"}</p>
                  </div>
                  <StatusBadge status="review" className="shrink-0" />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full border border-border bg-secondary/30 px-2.5 py-1 text-[11px] text-foreground">{prompt.purpose}</span>
                  {tool ? <span className="rounded-full border border-border bg-secondary/30 px-2.5 py-1 text-[11px] text-muted-foreground">{tool.name}</span> : null}
                  <span className="rounded-full border border-border bg-secondary/30 px-2.5 py-1 text-[11px] text-muted-foreground">v{prompt.version}</span>
                </div>
                <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{prompt.expectedOutput}</p>
              </button>
            )
          })}
          {filteredPrompts.length === 0 ? (
            <EmptyState icon={MessageSquare} title="No prompts found" description="Try another search or switch to a scenario with more attached prompts." />
          ) : null}
        </div>
      </aside>

      <div className="flex-1 overflow-y-auto p-6">
        {selectedPrompt ? (
          <Card className="surface-panel rounded-3xl">
            <CardContent className="p-6">
              <SectionHeader
                icon={MessageSquare}
                title={selectedPrompt.title}
                description={selectedPrompt.category}
                action={
                  <Button variant="outline" onClick={() => copyPrompt(selectedPrompt.id, selectedPrompt.content)}>
                    <Copy className="h-4 w-4" />
                    {copiedPromptId === selectedPrompt.id ? "Copied" : "Copy prompt"}
                  </Button>
                }
              />

              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div className="surface-subtle rounded-2xl p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Purpose</p>
                  <p className="mt-2 text-sm font-medium text-foreground">{selectedPrompt.purpose}</p>
                </div>
                <div className="surface-subtle rounded-2xl p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Workflow</p>
                  <p className="mt-2 text-sm font-medium text-foreground">{getWorkflowById(selectedPrompt.workflowId)?.title ?? "No workflow linked"}</p>
                </div>
                <div className="surface-subtle rounded-2xl p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recommended tool</p>
                  <p className="mt-2 text-sm font-medium text-foreground">{tools.find((tool) => tool.id === selectedPrompt.toolId)?.name ?? "No tool linked"}</p>
                </div>
                <div className="rounded-2xl border border-primary/20 bg-primary/8 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary/85">Expected output</p>
                  <p className="mt-2 text-sm text-foreground">{selectedPrompt.expectedOutput}</p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_0.9fr]">
                <div className="rounded-2xl border border-border bg-secondary/15 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Prompt preview</p>
                  <pre className="mt-4 whitespace-pre-wrap font-sans text-sm leading-7 text-foreground">{selectedPrompt.content}</pre>
                </div>
                <div className="space-y-4">
                  <div className="surface-subtle rounded-2xl p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Input required</p>
                    <p className="mt-2 text-sm text-foreground">{selectedPrompt.inputRequired}</p>
                  </div>
                  <div className="surface-subtle rounded-2xl p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Attached step</p>
                    <p className="mt-2 text-sm text-foreground">{selectedPrompt.stepId ?? "Workflow-level prompt"}</p>
                  </div>
                  <div className="rounded-2xl border border-knowledge/20 bg-knowledge/10 p-4">
                    <p className="text-sm font-semibold text-foreground">Prompt guidance</p>
                    <p className="mt-1 text-sm text-muted-foreground">Use prompts from the current workflow step first. The full library is for discovery, not for replacing execution context.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedPrompt.workflowId ? (
                      <Button onClick={() => onOpenWorkflow(selectedPrompt.workflowId!)}>
                        Open linked workflow
                      </Button>
                    ) : null}
                    {selectedPrompt.toolId ? (
                      <Button variant="outline" asChild>
                        <a href={tools.find((tool) => tool.id === selectedPrompt.toolId)?.url} target="_blank" rel="noopener noreferrer">
                          Launch linked tool
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <EmptyState icon={MessageSquare} title="No prompt selected" description="Choose a prompt from the left to inspect its purpose, expected output, and linked workflow." />
        )}
      </div>
    </div>
  )
}
