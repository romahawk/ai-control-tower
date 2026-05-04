"use client"

import {
  ArrowRight,
  BookOpen,
  Bot,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  Database,
  ExternalLink,
  FileText,
  GitBranch,
  Layers3,
  ListChecks,
  MessageSquare,
  NotebookText,
  OctagonAlert,
  PlayCircle,
  SearchCheck,
  Wrench,
} from "lucide-react"
import { ActionCard } from "@/components/ui/action-card"
import { EmptyState } from "@/components/ui/empty-state"
import { InfoCallout } from "@/components/ui/info-callout"
import { MetricCard } from "@/components/ui/metric-card"
import { SectionHeader } from "@/components/ui/section-header"
import { StatusBadge } from "@/components/ui/status-badge"
import type { ViewType } from "@/types"

interface WikiViewProps {
  onNavigate: (view: ViewType) => void
}

const operatingModel = [
  { label: "Scenario", description: "Life, business, or project area the work belongs to.", icon: Compass },
  { label: "Workflow", description: "Repeatable path to a specific outcome.", icon: GitBranch },
  { label: "Step", description: "Concrete action inside the workflow.", icon: ListChecks },
  { label: "Tool / Prompt / Context", description: "Execution inputs that reduce friction and repeated thinking.", icon: Bot },
  { label: "Execution", description: "The active working session where progress actually happens.", icon: PlayCircle },
  { label: "Output", description: "The note, artifact, decision, or result produced by the step.", icon: NotebookText },
  { label: "Review", description: "The layer that turns outputs and blockers into next actions.", icon: SearchCheck },
]

const glossary = [
  ["Scenario", "A major operating area such as Income Engine or Product Development."],
  ["Workflow", "A repeatable process with ordered steps."],
  ["Step", "A single execution unit inside a workflow."],
  ["Prompt", "A reusable instruction attached to scenario, workflow, or step."],
  ["Tool", "An AI or external tool used to execute the step."],
  ["Context", "Reusable background information that reduces re-explaining."],
  ["Output", "A result captured during execution."],
  ["Session", "A live run of one workflow."],
  ["Review", "A deterministic summary of outputs, blockers, and next actions."],
  ["Decision", "A logged choice created from evidence or review."],
  ["Blocker", "A named reason execution cannot continue cleanly."],
  ["Execution Pack", "A copy-ready bundle of step prompt, context, tools, and expected output."],
]

export function WikiView({ onNavigate }: WikiViewProps) {
  return (
    <div className="mx-auto max-w-[1320px] space-y-6 p-6">
      <ActionCard
        icon={BookOpen}
        eyebrow="Wiki"
        title="Learn the system before expanding the system."
        description="AI Control Tower is a personal execution system for scenarios, workflows, prompts, tools, context, outputs, and reviews. Use this page as the operational guide for how the product is meant to be used today."
        meta={
          <>
            <StatusBadge status="active" />
            <StatusBadge status="review" />
          </>
        }
        action={
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onNavigate("dashboard")}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Open dashboard
            </button>
            <button
              onClick={() => onNavigate("workflows")}
              className="rounded-xl border border-border bg-secondary/30 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary/50"
            >
              Open workflows
            </button>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard icon={Compass} label="Mindset" value="Scenario-first" hint="Choose the operating area first." />
        <MetricCard icon={PlayCircle} label="Execution rule" value="One clear next action" hint="Reduce switching and reopen fewer loops." tone="success" />
        <MetricCard icon={SearchCheck} label="Compounding loop" value="Output -> Review" hint="Every useful session should leave evidence." tone="knowledge" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <section className="surface-panel rounded-3xl p-6">
            <SectionHeader
              icon={BookOpen}
              title="What is AI Control Tower?"
              description="It is a personal execution system for using AI tools, prompts, workflows, context, outputs, and reviews. It is not just a prompt library, and it is not only an Income Engine."
            />
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <InfoCallout
                variant="info"
                title="What it does"
                description="It reduces cognitive overload by turning scattered AI usage into repeatable, visible workflows."
              />
              <InfoCallout
                variant="neutral"
                title="What it is not"
                description="It does not automate your work for you yet. The current product is a guided manual execution loop."
              />
            </div>
          </section>

          <section className="surface-panel rounded-3xl p-6">
            <SectionHeader
              icon={Layers3}
              title="Core operating model"
              description="This is the actual model the current app implements."
            />
            <div className="mt-5 rounded-3xl border border-primary/20 bg-primary/8 p-5">
              <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-foreground">
                <span>Scenario</span>
                <ArrowRight className="h-4 w-4 text-primary" />
                <span>Workflow</span>
                <ArrowRight className="h-4 w-4 text-primary" />
                <span>Step</span>
                <ArrowRight className="h-4 w-4 text-primary" />
                <span>Tool / Prompt / Context</span>
                <ArrowRight className="h-4 w-4 text-primary" />
                <span>Execution</span>
                <ArrowRight className="h-4 w-4 text-primary" />
                <span>Output</span>
                <ArrowRight className="h-4 w-4 text-primary" />
                <span>Review</span>
              </div>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {operatingModel.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.label} className="surface-subtle rounded-2xl p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">{item.label}</p>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="surface-panel rounded-3xl p-6">
            <SectionHeader
              icon={Compass}
              title="Main scenarios"
              description="These are the default scenario packs currently seeded into the app."
            />
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {[
                "Income Engine",
                "Product Development",
                "Life Strategy",
                "Admin Tasks",
                "Family & Home",
                "Sport & Health",
                "Learning",
                "Custom",
              ].map((scenario) => (
                <div key={scenario} className="surface-subtle rounded-2xl px-4 py-3 text-sm font-medium text-foreground">
                  {scenario}
                </div>
              ))}
            </div>
          </section>

          <section className="surface-panel rounded-3xl p-6">
            <SectionHeader
              icon={PlayCircle}
              title="Recommended daily usage"
              description="Use the system to reduce decisions before work begins."
            />
            <div className="mt-5 grid gap-3">
              {[
                "Open Dashboard and check the Next Action card.",
                "Continue one active workflow instead of scanning everything.",
                "Use the recommended tool, prompt, and context for the current step.",
                "Save an output before you leave the session.",
                "Mark the step complete or write the blocker explicitly.",
                "End the session with one clear next action.",
              ].map((item, index) => (
                <div key={item} className="surface-subtle flex items-start gap-3 rounded-2xl p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-6 text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="surface-panel rounded-3xl p-6">
            <SectionHeader
              icon={ClipboardCheck}
              title="Recommended weekly usage"
              description="Reviews stop the system from turning into a pile of open loops."
            />
            <div className="mt-5 grid gap-3">
              {[
                "Review recent outputs and completed sessions.",
                "Check blocked sessions and decide what to resolve, pause, or kill.",
                "Choose what to stop, continue, and start next.",
                "Create a weekly review.",
                "Pick the next active scenario before the next work block begins.",
              ].map((item) => (
                <div key={item} className="surface-subtle rounded-2xl p-4 text-sm leading-6 text-foreground">
                  {item}
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="surface-panel rounded-3xl p-6">
            <SectionHeader
              icon={CheckCircle2}
              title="Quick-start checklist"
              description="If you are new, start here."
            />
            <div className="mt-5 space-y-3">
              {[
                "Choose the scenario that matters most right now.",
                "Open one workflow and start a session.",
                "Follow the current step instead of browsing the whole library.",
                "Capture a visible output.",
                "Use reviews to decide what happens next.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-success/20 bg-success/8 p-4">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <p className="text-sm leading-6 text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="surface-panel rounded-3xl p-6">
            <SectionHeader
              icon={GitBranch}
              title="How to use workflows"
              description="A workflow is where the app turns from library into execution system."
            />
            <div className="mt-5 space-y-3">
              <InfoCallout variant="info" title="Start workflow" description="Start a session from the workflow screen. The app will track current step, outputs, blockers, and summaries." />
              <InfoCallout variant="success" title="Follow current step" description="Use the expected output and attached prompts instead of improvising every time." />
              <InfoCallout variant="warning" title="If blocked" description="Write the blocker note. Do not keep it in your head or abandon the session silently." />
            </div>
          </section>

          <section className="surface-panel rounded-3xl p-6">
            <SectionHeader
              icon={MessageSquare}
              title="How to use prompts"
              description="Prompts are more useful when attached to execution context."
            />
            <div className="mt-5 space-y-3 text-sm leading-6 text-foreground">
              <div className="surface-subtle rounded-2xl p-4">Prefer step-specific prompts over browsing the entire prompt library.</div>
              <div className="surface-subtle rounded-2xl p-4">Use Copy Execution Pack when you want the prompt, context, tools, and expected output bundled together.</div>
              <div className="surface-subtle rounded-2xl p-4">Do not create more prompts before attaching existing prompts to workflows and steps.</div>
            </div>
          </section>

          <section className="surface-panel rounded-3xl p-6">
            <SectionHeader
              icon={Database}
              title="How to use context"
              description="Context is there to reduce repeated explaining and repeated thinking."
            />
            <div className="mt-5 space-y-3 text-sm leading-6 text-foreground">
              <div className="surface-subtle rounded-2xl p-4">Store reusable project, personal, business, customer, or technical background.</div>
              <div className="surface-subtle rounded-2xl p-4">Attach context to the relevant scenario or workflow instead of scattering it across raw notes.</div>
              <div className="surface-subtle rounded-2xl p-4">Use context to shorten setup time when moving into an execution block.</div>
            </div>
          </section>

          <section className="surface-panel rounded-3xl p-6">
            <SectionHeader
              icon={SearchCheck}
              title="How reviews reduce overload"
              description="Reviews convert activity into decisions."
            />
            <div className="mt-5 space-y-3">
              <InfoCallout variant="neutral" title="Reviews expose blockers" description="Blocked sessions stop feeling vague once they are visible in one place." />
              <InfoCallout variant="knowledge" title="Reviews define next actions" description="The point of review is not reflection alone. It is to decide what deserves attention now." />
            </div>
          </section>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <section className="surface-panel rounded-3xl p-6">
          <SectionHeader
            icon={BookOpen}
            title="Best practices"
            description="Practical operating rules for the current MVP."
          />
          <div className="mt-5 grid gap-3">
            {[
              "One active scenario at a time when overloaded.",
              "One workflow session per deep-work block.",
              "Every AI interaction should produce an output.",
              "Every output should eventually feed a review or decision.",
              "If a workflow is blocked, write the blocker instead of keeping it in your head.",
              "Build repeatable systems before automating.",
            ].map((rule) => (
              <div key={rule} className="surface-subtle rounded-2xl p-4 text-sm leading-6 text-foreground">
                {rule}
              </div>
            ))}
          </div>
        </section>

        <section className="surface-panel rounded-3xl p-6">
          <SectionHeader
            icon={OctagonAlert}
            title="Common mistake -> Better approach"
            description="Use these to keep the system disciplined."
          />
          <div className="mt-5 space-y-3">
            {[
              ["Browsing everything first", "Open the dashboard and follow the Next Action card."],
              ["Collecting prompts without execution", "Attach prompts to a step and use them inside a live session."],
              ["Switching workflows without outputs", "Finish one meaningful output before switching."],
              ["Holding blockers mentally", "Write the blocker and let the review layer surface it later."],
              ["Expanding scope before validation", "Use Product Development workflows to stress-test the idea first."],
            ].map(([mistake, better]) => (
              <div key={mistake} className="rounded-2xl border border-border bg-secondary/20 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-destructive">Common mistake</p>
                <p className="mt-1 text-sm font-medium text-foreground">{mistake}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-success">Better approach</p>
                <p className="mt-1 text-sm text-foreground">{better}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <section className="surface-panel rounded-3xl p-6">
          <SectionHeader
            icon={FileText}
            title="App glossary"
            description="Short definitions for the main terms used in the UI."
          />
          <div className="mt-5 grid gap-3">
            {glossary.map(([term, description]) => (
              <div key={term} className="surface-subtle rounded-2xl p-4">
                <p className="text-sm font-semibold text-foreground">{term}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="surface-panel rounded-3xl p-6">
            <SectionHeader
              icon={ExternalLink}
              title="Current limitations"
              description="This page matches what the app can actually do today."
            />
            <div className="mt-5 space-y-3">
              <InfoCallout variant="warning" title="Local-first MVP" description="Data lives locally unless a future backend is added." />
              <InfoCallout variant="warning" title="Manual execution loop" description="The current product is designed to guide execution before automating it." />
              <InfoCallout variant="warning" title="No AI backend required" description="Reviews and recommendations are deterministic right now." />
            </div>
          </div>

          <div className="surface-panel rounded-3xl p-6">
            <SectionHeader
              icon={Wrench}
              title="Future direction"
              description="These are future directions, not promises already implemented."
            />
            <div className="mt-5 grid gap-3">
              {[
                "Backend and auth",
                "AI-assisted recommendations",
                "Template packs and richer imports/exports",
                "Team and workspace support",
                "Scenario marketplace or shared library",
              ].map((item) => (
                <div key={item} className="surface-subtle rounded-2xl p-4 text-sm text-foreground">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <EmptyState
            icon={BookOpen}
            title="Use the Wiki as the onboarding layer"
            description="If the app starts feeling like a library again, come back here and realign around scenario, workflow, step, output, and review."
            primaryAction={
              <button
                onClick={() => onNavigate("dashboard")}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Go to dashboard
              </button>
            }
            secondaryAction={
              <button
                onClick={() => onNavigate("reviews")}
                className="rounded-xl border border-border bg-secondary/30 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary/50"
              >
                Open reviews
              </button>
            }
          />
        </section>
      </div>
    </div>
  )
}
