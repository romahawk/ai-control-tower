"use client"

import { useEffect, useMemo, useState } from "react"
import { Copy, ExternalLink, FileStack, MessageSquare, Package2, PlayCircle, Sparkles } from "lucide-react"
import { CompactCard } from "@/components/ui/compact-card"
import { DetailPanel } from "@/components/ui/detail-panel"
import { EmptyState } from "@/components/ui/empty-state"
import { PageHeader } from "@/components/ui/page-header"
import { QuickCapture } from "@/components/ui/quick-capture"
import { ScenarioBadge } from "@/components/ui/scenario-badge"
import { SegmentedTabs } from "@/components/ui/segmented-tabs"
import { StatusBadge } from "@/components/ui/status-badge"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { getWorkflowById } from "@/lib/control-tower"
import type { Prompt, QuickCaptureRecord, QuickCaptureType, Scenario, Tool, Workflow } from "@/types"

interface PromptLibraryProps {
  selectedScenario: Scenario
  selectedWorkflow: Workflow
  prompts: Prompt[]
  tools: Tool[]
  quickCaptures: QuickCaptureRecord[]
  promptRules: string[]
  getContextPack: (prompt: Prompt) => string
  getPromptBody: (prompt: Prompt) => string
  getPromptPackage: (prompt: Prompt) => string
  onOpenWorkflow: (workflowId: string) => void
  onSaveQuickCapture: (params: {
    type: QuickCaptureType
    content: string
    scenarioId?: string
    workflowId?: string
  }) => void
}

type PromptTab = "library" | "favorites" | "recent" | "templates" | "archived"

const promptTabs: Array<{ value: PromptTab; label: string }> = [
  { value: "library", label: "Library" },
  { value: "favorites", label: "Favorites" },
  { value: "recent", label: "Recent" },
  { value: "templates", label: "Templates" },
  { value: "archived", label: "Archived" },
]

const filterChips = [
  "all",
  "strategy",
  "execution",
  "analysis",
  "writing",
  "review",
  "product",
  "job search",
  "trading",
  "admin",
  "custom",
] as const

export function PromptLibrary({
  selectedScenario,
  selectedWorkflow,
  prompts,
  tools,
  quickCaptures,
  promptRules,
  getContextPack,
  getPromptBody,
  getPromptPackage,
  onOpenWorkflow,
  onSaveQuickCapture,
}: PromptLibraryProps) {
  const [activeTab, setActiveTab] = useState<PromptTab>("library")
  const [query, setQuery] = useState("")
  const [activeChip, setActiveChip] = useState<(typeof filterChips)[number]>("all")
  const [selectedPromptId, setSelectedPromptId] = useState(prompts[0]?.id ?? "")
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null)
  const [copiedContextId, setCopiedContextId] = useState<string | null>(null)
  const [copiedPackageId, setCopiedPackageId] = useState<string | null>(null)

  const filteredPrompts = useMemo(() => {
    const search = query.trim().toLowerCase()

    return prompts.filter((prompt) => {
      const workflow = prompt.workflowId ? getWorkflowById(prompt.workflowId) : undefined
      const tool = prompt.toolId ? tools.find((item) => item.id === prompt.toolId) : undefined

      const matchesSearch =
        !search ||
        prompt.title.toLowerCase().includes(search) ||
        prompt.category.toLowerCase().includes(search) ||
        prompt.purpose.toLowerCase().includes(search) ||
        prompt.expectedOutput.toLowerCase().includes(search) ||
        prompt.content.toLowerCase().includes(search) ||
        workflow?.title.toLowerCase().includes(search) ||
        tool?.name.toLowerCase().includes(search)

      const promptKeywords = `${prompt.category} ${prompt.purpose} ${prompt.tags?.join(" ") ?? ""}`.toLowerCase()
      const matchesChip =
        activeChip === "all" ||
        (activeChip === "strategy" && /planning|research|decision/.test(promptKeywords)) ||
        (activeChip === "execution" && /execution/.test(promptKeywords)) ||
        (activeChip === "analysis" && /analysis|research/.test(promptKeywords)) ||
        (activeChip === "writing" && /drafting|writing/.test(promptKeywords)) ||
        (activeChip === "review" && /review/.test(promptKeywords)) ||
        (activeChip === "product" && /product/.test(promptKeywords)) ||
        (activeChip === "job search" && /job/.test(promptKeywords)) ||
        (activeChip === "trading" && /trading/.test(promptKeywords)) ||
        (activeChip === "admin" && /admin/.test(promptKeywords)) ||
        (activeChip === "custom" && prompt.scenarioId === "custom")

      const matchesTab =
        activeTab === "library" ||
        (activeTab === "favorites" && prompt.tags?.includes("favorite")) ||
        (activeTab === "recent" && prompts.slice(0, 8).some((item) => item.id === prompt.id)) ||
        (activeTab === "templates" && !prompt.stepId) ||
        activeTab === "archived"
          ? activeTab !== "archived"
          : true

      return matchesSearch && matchesChip && matchesTab
    }).filter((prompt) => activeTab !== "archived")
  }, [activeChip, activeTab, prompts, query, tools])

  useEffect(() => {
    if (filteredPrompts[0] && !filteredPrompts.some((prompt) => prompt.id === selectedPromptId)) {
      setSelectedPromptId(filteredPrompts[0].id)
    }
  }, [filteredPrompts, selectedPromptId])

  const selectedPrompt = filteredPrompts.find((prompt) => prompt.id === selectedPromptId) ?? filteredPrompts[0] ?? null
  const promptDrafts = quickCaptures.filter((capture) => capture.type === "prompt" && capture.scenarioId === selectedScenario.id)

  const copyPrompt = async (promptId: string, content: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedPromptId(promptId)
    window.setTimeout(() => setCopiedPromptId(null), 1500)
  }

  const copyContext = async (prompt: Prompt) => {
    await navigator.clipboard.writeText(getContextPack(prompt))
    setCopiedContextId(prompt.id)
    window.setTimeout(() => setCopiedContextId(null), 1500)
  }

  const copyPackage = async (prompt: Prompt) => {
    await navigator.clipboard.writeText(getPromptPackage(prompt))
    setCopiedPackageId(prompt.id)
    window.setTimeout(() => setCopiedPackageId(null), 1500)
  }

  return (
    <div className="h-full overflow-auto px-4 py-4 md:px-6">
      <div className="mx-auto max-w-[1360px] space-y-4">
        <PageHeader
          title="Prompt OS"
          description="Package the right context, prompt, tool, and expected output before execution."
          icon={MessageSquare}
          actionLabel="New prompt"
          actionIcon={Sparkles}
          onAction={() => setActiveTab("templates")}
        />

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as PromptTab)} className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SegmentedTabs tabs={promptTabs} />
            <div className="min-w-[240px] flex-1 md:max-w-sm">
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search prompts, workflows, tools..."
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {filterChips.map((chip) => (
              <button
                key={chip}
                onClick={() => setActiveChip(chip)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  activeChip === chip
                    ? "border-primary/25 bg-primary/12 text-primary"
                    : "border-border/70 bg-secondary/20 text-muted-foreground hover:text-foreground"
                }`}
              >
                {chip}
              </button>
            ))}
          </div>

          <TabsContent value={activeTab} className="outline-none">
            <div className="grid gap-4 xl:grid-cols-[0.88fr_1.12fr]">
              <div className="space-y-4">
                <div className="rounded-3xl border border-border/60 bg-card/70 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      Active workflow
                    </span>
                    <span className="text-sm text-foreground">{selectedWorkflow.title}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {promptRules.slice(0, 4).map((rule) => (
                      <span key={rule} className="rounded-full border border-border/70 bg-secondary/20 px-3 py-1.5 text-[11px] text-muted-foreground">
                        {rule}
                      </span>
                    ))}
                  </div>
                </div>

                <QuickCapture
                  selectedScenario={selectedScenario}
                  quickCaptures={promptDrafts}
                  onSave={onSaveQuickCapture}
                  placeholder="Capture new prompt idea..."
                  submitLabel="Save as draft"
                />

                <div className="grid gap-3">
                  {filteredPrompts.map((prompt) => {
                    const tool = prompt.toolId ? tools.find((item) => item.id === prompt.toolId) : undefined
                    const workflow = prompt.workflowId ? getWorkflowById(prompt.workflowId) : undefined

                    return (
                      <CompactCard
                        key={prompt.id}
                        title={prompt.title}
                        subtitle={prompt.expectedOutput}
                        isActive={selectedPrompt?.id === prompt.id}
                        onClick={() => setSelectedPromptId(prompt.id)}
                        badges={
                          <>
                            <ScenarioBadge scenario={selectedScenario} />
                            <span className="rounded-full border border-border/70 bg-secondary/25 px-2.5 py-1 text-[11px] text-muted-foreground">
                              {prompt.category}
                            </span>
                            <StatusBadge status={prompt.purpose === "review" ? "review" : "clarify"} />
                          </>
                        }
                        metadata={
                          <>
                            {tool ? <span>{tool.name}</span> : <span>No tool linked</span>}
                            <span>{workflow?.title ?? "No workflow linked"}</span>
                            <span>v{prompt.version}</span>
                          </>
                        }
                        primaryAction={
                          <button
                            onClick={(event) => {
                              event.stopPropagation()
                              copyPackage(prompt)
                            }}
                            className="rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90"
                          >
                            {copiedPackageId === prompt.id ? "Copied" : "Copy package"}
                          </button>
                        }
                        secondaryAction={
                          <button
                            onClick={(event) => {
                              event.stopPropagation()
                              copyPrompt(prompt.id, getPromptBody(prompt))
                            }}
                            className="rounded-xl border border-border bg-secondary/25 px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-secondary/45"
                          >
                            {copiedPromptId === prompt.id ? "Copied" : "Copy prompt"}
                          </button>
                        }
                      >
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={(event) => {
                              event.stopPropagation()
                              copyContext(prompt)
                            }}
                            className="rounded-full border border-border/70 bg-card/50 px-2.5 py-1 text-[11px] text-muted-foreground transition hover:border-primary/20 hover:text-foreground"
                          >
                            {copiedContextId === prompt.id ? "Context copied" : "Copy context"}
                          </button>
                          {prompt.workflowId ? (
                            <button
                              onClick={(event) => {
                                event.stopPropagation()
                                onOpenWorkflow(prompt.workflowId!)
                              }}
                              className="rounded-xl border border-border bg-secondary/25 px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-secondary/45"
                            >
                              Run
                            </button>
                          ) : null}
                        </div>
                      </CompactCard>
                    )
                  })}

                  {filteredPrompts.length === 0 ? (
                    <EmptyState
                      icon={MessageSquare}
                      title="No prompts found"
                      description="Try another filter or capture a new draft prompt idea."
                    />
                  ) : null}
                </div>
              </div>

              {selectedPrompt ? (
                <DetailPanel
                  title={selectedPrompt.title}
                  subtitle={selectedPrompt.category}
                  icon={MessageSquare}
                  badges={
                    <>
                      <ScenarioBadge scenario={selectedScenario} />
                      <StatusBadge status={selectedPrompt.purpose === "review" ? "review" : "clarify"} />
                    </>
                  }
                  actions={
                    <>
                      <button
                        onClick={() => copyPrompt(selectedPrompt.id, getPromptBody(selectedPrompt))}
                        className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                      >
                        {copiedPromptId === selectedPrompt.id ? "Copied" : "Copy prompt"}
                      </button>
                      <button
                        onClick={() => copyContext(selectedPrompt)}
                        className="rounded-xl border border-border bg-secondary/25 px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary/45"
                      >
                        {copiedContextId === selectedPrompt.id ? "Context copied" : "Copy context"}
                      </button>
                      <button
                        onClick={() => copyPackage(selectedPrompt)}
                        className="rounded-xl border border-border bg-secondary/25 px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary/45"
                      >
                        {copiedPackageId === selectedPrompt.id ? "Package copied" : "Copy package"}
                      </button>
                      {selectedPrompt.workflowId ? (
                        <button
                          onClick={() => onOpenWorkflow(selectedPrompt.workflowId!)}
                          className="rounded-xl border border-border bg-secondary/25 px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary/45"
                        >
                          Run
                        </button>
                      ) : null}
                    </>
                  }
                  metadata={
                    <>
                      <span>Purpose: {selectedPrompt.purpose}</span>
                      <span>Expected output: {selectedPrompt.expectedOutput}</span>
                      <span>Version: {selectedPrompt.version}</span>
                    </>
                  }
                >
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary/85">Purpose</p>
                      <p className="mt-2 text-sm text-foreground">{selectedPrompt.purpose}</p>
                    </div>
                    <div className="rounded-2xl border border-border/60 bg-secondary/15 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Input required</p>
                      <p className="mt-2 text-sm text-foreground">{selectedPrompt.inputRequired}</p>
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="rounded-2xl border border-border/60 bg-secondary/15 p-4">
                      <div className="flex items-center gap-2">
                        <FileStack className="h-4 w-4 text-primary" />
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Context pack</p>
                      </div>
                      <p className="mt-2 text-sm text-foreground">Scenario, workflow, step, expected output, and relevant context.</p>
                    </div>
                    <div className="rounded-2xl border border-border/60 bg-secondary/15 p-4">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-primary" />
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Prompt body</p>
                      </div>
                      <p className="mt-2 text-sm text-foreground">The clean instruction set without extra execution framing.</p>
                    </div>
                    <div className="rounded-2xl border border-border/60 bg-secondary/15 p-4">
                      <div className="flex items-center gap-2">
                        <Package2 className="h-4 w-4 text-primary" />
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Full package</p>
                      </div>
                      <p className="mt-2 text-sm text-foreground">Operating rules, context, and prompt body packaged together.</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border/60 bg-secondary/15 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Prompt preview</p>
                    <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-6 text-foreground">
                      {getPromptBody(selectedPrompt)}
                    </pre>
                  </div>

                  <div className="rounded-2xl border border-border/60 bg-secondary/15 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Context preview</p>
                    <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-6 text-foreground">
                      {getContextPack(selectedPrompt)}
                    </pre>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl border border-border/60 bg-secondary/15 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Linked workflow</p>
                      <p className="mt-2 text-sm text-foreground">
                        {selectedPrompt.workflowId ? getWorkflowById(selectedPrompt.workflowId)?.title ?? "No workflow linked" : "No workflow linked"}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border/60 bg-secondary/15 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recommended tool</p>
                      <p className="mt-2 text-sm text-foreground">
                        {selectedPrompt.toolId ? tools.find((tool) => tool.id === selectedPrompt.toolId)?.name ?? "No tool linked" : "No tool linked"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedPrompt.workflowId ? (
                      <button
                        onClick={() => onOpenWorkflow(selectedPrompt.workflowId!)}
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                      >
                        <PlayCircle className="h-4 w-4" />
                        Run prompt
                      </button>
                    ) : null}
                    {selectedPrompt.toolId ? (
                      <a
                        href={tools.find((tool) => tool.id === selectedPrompt.toolId)?.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary/25 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary/45"
                      >
                        Launch tool
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    ) : null}
                  </div>
                </DetailPanel>
              ) : (
                <EmptyState
                  icon={MessageSquare}
                  title="No prompt selected"
                  description="Choose a prompt to preview the body, variables, and linked workflow."
                />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
