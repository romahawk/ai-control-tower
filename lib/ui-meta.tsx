import type { LucideIcon } from "lucide-react"
import {
  AlertTriangle,
  Archive,
  BookOpen,
  Bot,
  CheckCircle2,
  CircleDashed,
  ClipboardCheck,
  Compass,
  Database,
  FileText,
  GitBranch,
  LayoutDashboard,
  ListChecks,
  MessageSquare,
  NotebookText,
  OctagonAlert,
  PauseCircle,
  PlayCircle,
  SearchCheck,
  Wrench,
  type LucideProps,
} from "lucide-react"
import type { ContextType, ReviewType, ScenarioCategory, SessionStatus, StepExecutionStatus, WorkflowStatus } from "@/types"

export type StatusTone = "active" | "completed" | "blocked" | "paused" | "pending" | "draft" | "review" | "archived" | "neutral"

export function getStatusMeta(
  status:
    | SessionStatus
    | StepExecutionStatus
    | WorkflowStatus
    | "review"
    | "next"
    | "archived"
    | "not-started"
    | "inbox"
    | "clarify"
    | "waiting"
    | "done"
    | "blocked"
    | "healthy"
    | "at-risk"
    | "stale"
    | "misaligned"
) {
  const record: Record<string, { label: string; tone: StatusTone; icon: LucideIcon }> = {
    active: { label: "Active", tone: "active", icon: PlayCircle },
    completed: { label: "Completed", tone: "completed", icon: CheckCircle2 },
    blocked: { label: "Blocked", tone: "blocked", icon: OctagonAlert },
    paused: { label: "Paused", tone: "paused", icon: PauseCircle },
    pending: { label: "Pending", tone: "pending", icon: AlertTriangle },
    review: { label: "Review", tone: "review", icon: SearchCheck },
    archived: { label: "Archived", tone: "archived", icon: Archive },
    draft: { label: "Draft", tone: "draft", icon: CircleDashed },
    ready: { label: "Ready", tone: "pending", icon: ListChecks },
    "not-started": { label: "Not started", tone: "draft", icon: CircleDashed },
    skipped: { label: "Skipped", tone: "neutral", icon: CircleDashed },
    next: { label: "Next", tone: "active", icon: PlayCircle },
    inbox: { label: "Inbox", tone: "neutral", icon: CircleDashed },
    clarify: { label: "Clarify", tone: "review", icon: BookOpen },
    waiting: { label: "Waiting", tone: "pending", icon: PauseCircle },
    done: { label: "Done", tone: "completed", icon: CheckCircle2 },
    healthy: { label: "Healthy", tone: "completed", icon: CheckCircle2 },
    "at-risk": { label: "At Risk", tone: "pending", icon: AlertTriangle },
    stale: { label: "Stale", tone: "draft", icon: CircleDashed },
    misaligned: { label: "Misaligned", tone: "review", icon: AlertTriangle },
  }

  return record[status] ?? { label: status, tone: "neutral" as const, icon: CircleDashed }
}

export function getScenarioIcon(category?: ScenarioCategory): LucideIcon {
  const record: Record<ScenarioCategory, LucideIcon> = {
    "income-engine": LayoutDashboard,
    "product-development": Compass,
    "life-strategy": Compass,
    "admin-tasks": ListChecks,
    "family-home": FileText,
    "sport-health": PlayCircle,
    learning: BookOpen,
    custom: LayoutDashboard,
  }

  return category ? record[category] : LayoutDashboard
}

export function getEntityIcon(entity: "workflow" | "step" | "prompt" | "tool" | "context" | "output" | "review" | "wiki") {
  const record = {
    workflow: GitBranch,
    step: ListChecks,
    prompt: MessageSquare,
    tool: Wrench,
    context: Database,
    output: NotebookText,
    review: ClipboardCheck,
    wiki: BookOpen,
  }

  return record[entity]
}

export function getContextIcon(type?: ContextType): LucideIcon {
  const record: Record<ContextType, LucideIcon> = {
    project: FileText,
    personal: BookOpen,
    business: LayoutDashboard,
    customer: MessageSquare,
    technical: Bot,
    decision: ClipboardCheck,
    reference: Database,
  }

  return type ? record[type] : Database
}

export function getReviewIcon(type?: ReviewType): LucideIcon {
  const record: Record<ReviewType, LucideIcon> = {
    daily: ClipboardCheck,
    weekly: SearchCheck,
    scenario: Compass,
    workflow: GitBranch,
  }

  return type ? record[type] : ClipboardCheck
}

export function withIconDefaults(Icon: LucideIcon, props?: LucideProps) {
  return <Icon className={props?.className ?? "h-4 w-4"} />
}
