"use client"

import { useEffect, useState } from "react"
import { Check, Copy, ExternalLink, Search } from "lucide-react"
import { INCOME_ENGINES } from "@/data/income-engines"
import { PROMPTS } from "@/data/prompts"
import { TOOLS } from "@/data/tools"
import { WORKFLOWS } from "@/data/workflows"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface WorkflowLibraryProps {
  selectedWorkflowId: string
  onSelectWorkflow: (workflowId: string) => void
}

export function WorkflowLibrary({
  selectedWorkflowId,
  onSelectWorkflow,
}: WorkflowLibraryProps) {
  const [query, setQuery] = useState("")
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null)

  const filteredWorkflows = WORKFLOWS.filter((workflow) => {
    const engine = INCOME_ENGINES.find((item) => item.id === workflow.incomeEngineId)
    const search = query.toLowerCase()
    return (
      search === "" ||
      workflow.title.toLowerCase().includes(search) ||
      workflow.goal.toLowerCase().includes(search) ||
      workflow.output.toLowerCase().includes(search) ||
      engine?.name.toLowerCase().includes(search)
    )
  })

  useEffect(() => {
    if (!filteredWorkflows.some((workflow) => workflow.id === selectedWorkflowId) && filteredWorkflows[0]) {
      onSelectWorkflow(filteredWorkflows[0].id)
    }
  }, [filteredWorkflows, onSelectWorkflow, selectedWorkflowId])

  const selectedWorkflow =
    filteredWorkflows.find((workflow) => workflow.id === selectedWorkflowId) ??
    filteredWorkflows[0] ??
    null

  const copyPrompt = async (promptId: string, content: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedPromptId(promptId)
    setTimeout(() => setCopiedPromptId(null), 1500)
  }

  return (
    <div className="flex h-full">
      <aside className="w-[420px] flex-shrink-0 border-r border-border bg-card/30">
        <div className="border-b border-border p-5 space-y-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Workflow Library</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manual execution systems organized by income engine and expected output.
            </p>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search workflows..."
              className="w-full rounded-xl border border-border bg-secondary/40 py-2.5 pl-9 pr-3 text-sm text-foreground outline-none focus:border-primary/40"
            />
          </div>
        </div>

        <div className="h-[calc(100%-145px)] overflow-y-auto scrollbar-thin p-3 space-y-3">
          {filteredWorkflows.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
              No workflows found.
            </div>
          ) : (
            filteredWorkflows.map((workflow) => {
              const engine = INCOME_ENGINES.find((item) => item.id === workflow.incomeEngineId)
              const toolNames = workflow.steps
                .flatMap((step) => step.toolIds)
                .map((toolId) => TOOLS.find((tool) => tool.id === toolId)?.name)
                .filter(Boolean)

              const dedupedTools = [...new Set(toolNames)].slice(0, 3)
              const isActive = selectedWorkflow?.id === workflow.id

              return (
                <button
                  key={workflow.id}
                  onClick={() => onSelectWorkflow(workflow.id)}
                  className={`w-full rounded-xl border p-4 text-left transition-colors ${
                    isActive
                      ? "border-primary/30 bg-primary/8"
                      : "border-border bg-secondary/20 hover:border-primary/20 hover:bg-secondary/35"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{workflow.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{workflow.goal}</p>
                    </div>
                    <Badge variant="outline" className="border-border text-muted-foreground">
                      {workflow.status}
                    </Badge>
                  </div>
                  <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                    <p>Income engine: {engine?.name ?? "Unlinked"}</p>
                    <p>Expected output: {workflow.output}</p>
                    <p>Success metric: {workflow.successMetric}</p>
                    <p>Tools: {dedupedTools.join(", ") || "No tools linked"}</p>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </aside>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
        {selectedWorkflow ? (
          <div className="space-y-6">
            <Card className="border-border bg-card/70">
              <CardHeader className="gap-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <CardTitle>{selectedWorkflow.title}</CardTitle>
                    <CardDescription className="mt-1">{selectedWorkflow.goal}</CardDescription>
                  </div>
                  <Badge variant="outline" className="border-primary/20 text-primary">
                    {INCOME_ENGINES.find((engine) => engine.id === selectedWorkflow.incomeEngineId)?.name ??
                      "No engine"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl border border-border bg-secondary/25 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Trigger</p>
                  <p className="text-sm text-foreground mt-2">{selectedWorkflow.trigger}</p>
                </div>
                <div className="rounded-xl border border-border bg-secondary/25 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Output</p>
                  <p className="text-sm text-foreground mt-2">{selectedWorkflow.output}</p>
                </div>
                <div className="rounded-xl border border-border bg-secondary/25 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Success metric</p>
                  <p className="text-sm text-foreground mt-2">{selectedWorkflow.successMetric}</p>
                </div>
                <div className="rounded-xl border border-border bg-secondary/25 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Frequency</p>
                  <p className="text-sm text-foreground mt-2">{selectedWorkflow.frequency}</p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {selectedWorkflow.steps.map((step, index) => {
                const stepTools = TOOLS.filter((tool) => step.toolIds.includes(tool.id))
                const stepPrompts = PROMPTS.filter((prompt) => step.promptIds.includes(prompt.id))

                return (
                  <Card key={step.id} className="border-border bg-card/70">
                    <CardHeader className="gap-3">
                      <div className="flex items-start gap-4">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                          {index + 1}
                        </div>
                        <div className="space-y-1">
                          <CardTitle>{step.title}</CardTitle>
                          <CardDescription>{step.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        <div className="rounded-xl border border-border bg-secondary/25 p-4">
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">Tools used</p>
                          {stepTools.length > 0 ? (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {stepTools.map((tool) => (
                                <Badge key={tool.id} variant="outline" className="border-border text-foreground">
                                  {tool.name}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground mt-2">No tools linked.</p>
                          )}
                        </div>
                        <div className="rounded-xl border border-border bg-secondary/25 p-4">
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">Expected output</p>
                          <p className="text-sm text-foreground mt-2">{step.expectedOutput}</p>
                        </div>
                        <div className="rounded-xl border border-border bg-secondary/25 p-4">
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">Launch</p>
                          {step.launchUrl ? (
                            <Button variant="outline" asChild className="mt-3">
                              <a href={step.launchUrl} target="_blank" rel="noopener noreferrer">
                                Launch tool
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </Button>
                          ) : (
                            <p className="text-sm text-muted-foreground mt-2">No direct launch link.</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
                          Linked prompts
                        </p>
                        {stepPrompts.length > 0 ? (
                          <div className="space-y-3">
                            {stepPrompts.map((prompt) => (
                              <div
                                key={prompt.id}
                                className="rounded-xl border border-border bg-secondary/20 p-4"
                              >
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                  <div>
                                    <p className="font-medium text-foreground">{prompt.title}</p>
                                    <p className="text-sm text-muted-foreground mt-1">{prompt.category}</p>
                                  </div>
                                  <Button
                                    variant="outline"
                                    onClick={() => copyPrompt(prompt.id, prompt.content)}
                                  >
                                    {copiedPromptId === prompt.id ? (
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
                                <p className="text-sm text-muted-foreground mt-3 line-clamp-5">
                                  {prompt.content}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="rounded-xl border border-dashed border-border px-4 py-4 text-sm text-muted-foreground">
                            No prompts linked for this step.
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border p-8 text-sm text-muted-foreground">
            No workflow selected.
          </div>
        )}
      </div>
    </div>
  )
}
