"use client"

import { useMemo, useState } from "react"
import {
  BookOpen,
  Compass,
  GitBranch,
  Layers3,
  MessageSquare,
  PlayCircle,
  SearchCheck,
  Sparkles,
} from "lucide-react"
import { DetailPanel } from "@/components/ui/detail-panel"
import { EmptyState } from "@/components/ui/empty-state"
import { PageHeader } from "@/components/ui/page-header"
import { SegmentedTabs } from "@/components/ui/segmented-tabs"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import type { ViewType } from "@/types"

interface WikiViewProps {
  onNavigate: (view: ViewType) => void
}

type WikiTab = "overview" | "guides" | "playbooks" | "system" | "faq"

const wikiTabs: Array<{ value: WikiTab; label: string }> = [
  { value: "overview", label: "Overview" },
  { value: "guides", label: "Guides" },
  { value: "playbooks", label: "Playbooks" },
  { value: "system", label: "System" },
  { value: "faq", label: "FAQ" },
]

const articles = [
  {
    id: "how-it-works",
    tab: "overview" as const,
    icon: Layers3,
    category: "Overview",
    title: "How AI Control Tower works",
    description: "The universal model: Scenario -> Workflow -> Step -> Tool / Prompt / Context -> Execution -> Output -> Review.",
    summary: "AI Control Tower is a personal execution system. It is not just a prompt library and it is not only an Income Engine.",
    bullets: [
      "Choose a scenario first to reduce context switching.",
      "Run work through workflows and visible steps instead of loose notes.",
      "Treat every useful AI interaction as something that should leave an output.",
      "Use reviews to turn outputs and blockers into the next decision.",
    ],
  },
  {
    id: "scenario-logic",
    tab: "system" as const,
    icon: Compass,
    category: "System",
    title: "Scenario logic",
    description: "Why scenarios exist and how they shape filters, prompts, reviews, and outputs.",
    summary: "Scenarios are reusable operating contexts such as Income Engine, Product Development, Life Strategy, and Learning.",
    bullets: [
      "Use one active scenario when overloaded.",
      "Scenarios shape workflow relevance and prompt relevance.",
      "Scenario management belongs on the Scenarios page, not the dashboard.",
    ],
  },
  {
    id: "workflow-rules",
    tab: "guides" as const,
    icon: GitBranch,
    category: "Guide",
    title: "Workflow status rules",
    description: "How inbox, clarify, active, waiting, done, and blocked should be interpreted.",
    summary: "Workflows exist to move work from capture to completion with less ambiguity.",
    bullets: [
      "Inbox means not yet clarified enough to execute.",
      "Clarify means it needs shaping before a session should start.",
      "Active means it owns attention now. Waiting means it is paused intentionally.",
      "Blocked means there is a named reason progress cannot continue.",
    ],
  },
  {
    id: "prompt-rules",
    tab: "guides" as const,
    icon: MessageSquare,
    category: "Guide",
    title: "Prompt library rules",
    description: "How to keep prompts useful instead of creating prompt overload.",
    summary: "Prompts are most useful when attached to a step and used inside an execution block.",
    bullets: [
      "Prefer step-specific prompts over browsing the whole library.",
      "Use Copy Execution Pack when the tool, context, prompt, and expected output need to travel together.",
      "Do not create new prompts before attaching existing prompts to workflows.",
    ],
  },
  {
    id: "review-playbook",
    tab: "playbooks" as const,
    icon: SearchCheck,
    category: "Playbook",
    title: "Review templates",
    description: "Weekly, scenario, and workflow reviews that reduce open loops.",
    summary: "Reviews should produce decisions and next actions, not just reflection.",
    bullets: [
      "Review recent outputs before deciding what to do next.",
      "Use blockers to surface hidden friction.",
      "Weekly review is the default reset layer for the MVP.",
    ],
  },
  {
    id: "quick-command",
    tab: "faq" as const,
    icon: Sparkles,
    category: "FAQ",
    title: "Quick command guide",
    description: "How to navigate with the command palette and stable shell.",
    summary: "The command palette and stable shell reduce navigation friction.",
    bullets: [
      "Use Ctrl/Cmd + K to open the command palette.",
      "Use the global top bar to search workflows, prompts, and reviews.",
      "Use the + New menu when you need to start rather than browse.",
    ],
  },
  {
    id: "product-development-guide",
    tab: "playbooks" as const,
    icon: PlayCircle,
    category: "Playbook",
    title: "Product Development scenario guide",
    description: "How to validate ideas without building too early.",
    summary: "Product Development is for solo-founder validation, not premature shipping.",
    bullets: [
      "Start with idea intake and problem framing.",
      "Do market research, customer discovery, and MVP scope before build decisions.",
      "Use build / kill / pivot only after evidence is visible.",
    ],
  },
  {
    id: "income-engine-guide",
    tab: "playbooks" as const,
    icon: BookOpen,
    category: "Playbook",
    title: "Income Engine scenario guide",
    description: "How Income Engine now fits as one scenario, not the whole product.",
    summary: "Income Engine remains important, but it is one operating context inside the larger system.",
    bullets: [
      "Use it for agency, job, proof, and trading workflows.",
      "Keep it focused on visible weekly outputs and leverage.",
      "Review it weekly instead of letting it absorb the whole app identity.",
    ],
  },
] as const

export function WikiView({ onNavigate }: WikiViewProps) {
  const [activeTab, setActiveTab] = useState<WikiTab>("overview")
  const [selectedArticleId, setSelectedArticleId] = useState<string>(articles[0].id)

  const visibleArticles = useMemo(
    () => articles.filter((article) => article.tab === activeTab),
    [activeTab]
  )

  const selectedArticle =
    visibleArticles.find((article) => article.id === selectedArticleId) ?? visibleArticles[0] ?? null

  return (
    <div className="h-full overflow-auto px-4 py-4 md:px-6">
      <div className="mx-auto max-w-[1360px] space-y-4">
        <PageHeader
          title="Wiki"
          description="Guides, rules, and operating logic for AI Control Tower."
          icon={BookOpen}
        />

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as WikiTab)} className="space-y-4">
          <SegmentedTabs tabs={wikiTabs} />

          <TabsContent value={activeTab} className="outline-none">
            <div className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
              <div className="space-y-4">
                <div className="rounded-3xl border border-primary/20 bg-primary/10 p-5">
                  <p className="text-sm font-semibold text-primary">Start here</p>
                  <div className="mt-3 grid gap-2">
                    <button
                      onClick={() => onNavigate("scenarios")}
                      className="rounded-2xl bg-card/60 px-4 py-3 text-left text-sm font-medium text-foreground transition hover:bg-card/80"
                    >
                      Create scenario
                    </button>
                    <button
                      onClick={() => onNavigate("workflows")}
                      className="rounded-2xl bg-card/60 px-4 py-3 text-left text-sm font-medium text-foreground transition hover:bg-card/80"
                    >
                      Capture first workflow
                    </button>
                    <button
                      onClick={() => onNavigate("reviews")}
                      className="rounded-2xl bg-card/60 px-4 py-3 text-left text-sm font-medium text-foreground transition hover:bg-card/80"
                    >
                      Run weekly review
                    </button>
                  </div>
                </div>

                <div className="grid gap-3">
                  {visibleArticles.map((article) => {
                    const Icon = article.icon
                    return (
                      <button
                        key={article.id}
                        onClick={() => setSelectedArticleId(article.id)}
                        className={`rounded-3xl border p-4 text-left transition ${
                          selectedArticle?.id === article.id
                            ? "border-primary/25 bg-primary/8"
                            : "border-border/60 bg-card/70 hover:bg-secondary/15"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-semibold text-foreground">{article.title}</p>
                              <span className="rounded-full border border-border/70 bg-secondary/25 px-2 py-0.5 text-[10px] text-muted-foreground">
                                {article.category}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">{article.description}</p>
                          </div>
                        </div>
                      </button>
                    )
                  })}

                  {visibleArticles.length === 0 ? (
                    <EmptyState
                      icon={BookOpen}
                      title="No articles in this section yet"
                      description="The wiki stays concise so operational pages can stay calm."
                    />
                  ) : null}
                </div>
              </div>

              {selectedArticle ? (
                <DetailPanel
                  title={selectedArticle.title}
                  subtitle={selectedArticle.description}
                  icon={selectedArticle.icon}
                  badges={
                    <span className="rounded-full border border-border/70 bg-secondary/25 px-2.5 py-1 text-[11px] text-muted-foreground">
                      {selectedArticle.category}
                    </span>
                  }
                  actions={
                    <button
                      onClick={() => onNavigate("dashboard")}
                      className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                    >
                      Open dashboard
                    </button>
                  }
                >
                  <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary/85">Summary</p>
                    <p className="mt-2 text-sm text-foreground">{selectedArticle.summary}</p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">What to remember</p>
                    {selectedArticle.bullets.map((bullet) => (
                      <div key={bullet} className="rounded-2xl border border-border/60 bg-secondary/15 p-4 text-sm text-foreground">
                        {bullet}
                      </div>
                    ))}
                  </div>
                </DetailPanel>
              ) : (
                <EmptyState
                  icon={BookOpen}
                  title="No article selected"
                  description="Choose an article to preview how the system is meant to work."
                />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
