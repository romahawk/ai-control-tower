"use client"

import { useState } from "react"
import { Check, Copy, ExternalLink, Search } from "lucide-react"
import { PROMPTS } from "@/data/prompts"
import { TOOLS } from "@/data/tools"
import { WORKFLOWS } from "@/data/workflows"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PromptLibraryProps {
  onOpenWorkflow: (workflowId: string) => void
}

export function PromptLibrary({ onOpenWorkflow }: PromptLibraryProps) {
  const [query, setQuery] = useState("")
  const [selectedPromptId, setSelectedPromptId] = useState(PROMPTS[0]?.id ?? "")
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null)

  const filteredPrompts = PROMPTS.filter((prompt) => {
    const search = query.toLowerCase()
    const tool = TOOLS.find((item) => item.id === prompt.linkedToolId)
    const workflow = WORKFLOWS.find((item) => item.id === prompt.linkedWorkflowId)

    return (
      search === "" ||
      prompt.title.toLowerCase().includes(search) ||
      prompt.category.toLowerCase().includes(search) ||
      prompt.content.toLowerCase().includes(search) ||
      tool?.name.toLowerCase().includes(search) ||
      workflow?.title.toLowerCase().includes(search)
    )
  })

  const selectedPrompt =
    filteredPrompts.find((prompt) => prompt.id === selectedPromptId) ??
    filteredPrompts[0] ??
    null

  const copyPrompt = async (promptId: string, content: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedPromptId(promptId)
    setTimeout(() => setCopiedPromptId(null), 1500)
  }

  return (
    <div className="flex h-full">
      <aside className="w-96 flex-shrink-0 border-r border-border bg-card/30">
        <div className="border-b border-border p-5 space-y-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Prompt Library</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Copy-ready prompts connected to real workflows and tools.
            </p>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search prompts, workflows, tools..."
              className="w-full rounded-xl border border-border bg-secondary/40 py-2.5 pl-9 pr-3 text-sm text-foreground outline-none focus:border-primary/40"
            />
          </div>
        </div>

        <div className="h-[calc(100%-145px)] overflow-y-auto scrollbar-thin p-3 space-y-3">
          {filteredPrompts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
              No prompts found for this search.
            </div>
          ) : (
            filteredPrompts.map((prompt) => {
              const tool = TOOLS.find((item) => item.id === prompt.linkedToolId)
              const workflow = WORKFLOWS.find((item) => item.id === prompt.linkedWorkflowId)
              const isActive = selectedPrompt?.id === prompt.id

              return (
                <button
                  key={prompt.id}
                  onClick={() => setSelectedPromptId(prompt.id)}
                  className={`w-full rounded-xl border p-4 text-left transition-colors ${
                    isActive
                      ? "border-primary/30 bg-primary/8"
                      : "border-border bg-secondary/20 hover:border-primary/20 hover:bg-secondary/35"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{prompt.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{prompt.category}</p>
                    </div>
                    <Badge variant="outline" className="border-border text-muted-foreground">
                      {tool?.name ?? "No tool"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3 line-clamp-3">{prompt.content}</p>
                  <p className="text-xs text-muted-foreground mt-3">
                    Workflow: {workflow?.title ?? "No linked workflow"}
                  </p>
                </button>
              )
            })
          )}
        </div>
      </aside>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
        {selectedPrompt ? (
          <Card className="border-border bg-card/70">
            <CardHeader className="gap-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle>{selectedPrompt.title}</CardTitle>
                  <CardDescription className="mt-1">{selectedPrompt.category}</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    onClick={() => copyPrompt(selectedPrompt.id, selectedPrompt.content)}
                  >
                    {copiedPromptId === selectedPrompt.id ? (
                      <>
                        <Check className="w-4 h-4 text-green-400" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy prompt
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-border bg-secondary/25 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Linked tool</p>
                  <p className="text-base font-semibold text-foreground mt-1">
                    {TOOLS.find((tool) => tool.id === selectedPrompt.linkedToolId)?.name ?? "No linked tool"}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-secondary/25 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Linked workflow</p>
                  <p className="text-base font-semibold text-foreground mt-1">
                    {WORKFLOWS.find((workflow) => workflow.id === selectedPrompt.linkedWorkflowId)?.title ??
                      "No linked workflow"}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-secondary/20 p-5">
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">Prompt preview</p>
                <pre className="whitespace-pre-wrap text-sm leading-7 text-foreground font-sans">
                  {selectedPrompt.content}
                </pre>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button onClick={() => onOpenWorkflow(selectedPrompt.linkedWorkflowId)}>
                  Open linked workflow
                </Button>
                {TOOLS.find((tool) => tool.id === selectedPrompt.linkedToolId) ? (
                  <Button variant="outline" asChild>
                    <a
                      href={TOOLS.find((tool) => tool.id === selectedPrompt.linkedToolId)?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Launch linked tool
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="rounded-xl border border-dashed border-border p-8 text-sm text-muted-foreground">
            No prompts available.
          </div>
        )}
      </div>
    </div>
  )
}
