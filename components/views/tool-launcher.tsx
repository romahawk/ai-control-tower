"use client"

import { useState } from "react"
import { ExternalLink, Search } from "lucide-react"
import { TOOLS } from "@/data/tools"
import { WORKFLOWS } from "@/data/workflows"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ToolLauncherProps {
  onOpenWorkflow: (workflowId: string) => void
}

export function ToolLauncher({ onOpenWorkflow }: ToolLauncherProps) {
  const [query, setQuery] = useState("")

  const filteredTools = TOOLS.filter((tool) => {
    const search = query.toLowerCase()
    return (
      search === "" ||
      tool.name.toLowerCase().includes(search) ||
      tool.category.toLowerCase().includes(search) ||
      tool.role.toLowerCase().includes(search) ||
      tool.bestFor.toLowerCase().includes(search)
    )
  })

  return (
    <div className="p-6 space-y-6 max-w-[1320px] mx-auto">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Tool Registry</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tools are framed by the workflows they support, not as a generic app list.
          </p>
        </div>
        <div className="relative w-full md:w-[360px]">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tools..."
            className="w-full rounded-xl border border-border bg-secondary/40 py-2.5 pl-9 pr-3 text-sm text-foreground outline-none focus:border-primary/40"
          />
        </div>
      </div>

      {filteredTools.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-sm text-muted-foreground">
          No tools matched this search.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredTools.map((tool) => {
            const linkedWorkflows = WORKFLOWS.filter((workflow) =>
              tool.linkedWorkflowIds.includes(workflow.id)
            )

            return (
              <Card key={tool.id} className="border-border bg-card/70">
                <CardHeader className="gap-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle>{tool.name}</CardTitle>
                      <CardDescription className="mt-1">{tool.category}</CardDescription>
                    </div>
                    <Badge variant="outline" className="border-primary/20 text-primary">
                      {tool.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-3">
                    <div className="rounded-xl border border-border bg-secondary/25 p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Role</p>
                      <p className="text-sm text-foreground mt-2">{tool.role}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-secondary/25 p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Best for</p>
                      <p className="text-sm text-foreground mt-2">{tool.bestFor}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-secondary/25 p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Avoid when</p>
                      <p className="text-sm text-foreground mt-2">{tool.avoidWhen}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
                      Linked workflows
                    </p>
                    {linkedWorkflows.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {linkedWorkflows.map((workflow) => (
                          <button
                            key={workflow.id}
                            onClick={() => onOpenWorkflow(workflow.id)}
                            className="rounded-full border border-border bg-secondary/30 px-3 py-1.5 text-xs text-foreground hover:border-primary/30 hover:text-primary transition-colors"
                          >
                            {workflow.title}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-lg border border-dashed border-border px-3 py-3 text-sm text-muted-foreground">
                        No workflows linked.
                      </div>
                    )}
                  </div>

                  <Button asChild>
                    <a href={tool.url} target="_blank" rel="noopener noreferrer">
                      Launch tool
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
