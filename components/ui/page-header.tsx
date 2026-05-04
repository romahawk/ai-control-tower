import type { LucideIcon } from "lucide-react"
import { StatusBadge } from "@/components/ui/status-badge"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  description: string
  icon?: LucideIcon
  badge?: string
  actionLabel?: string
  actionIcon?: LucideIcon
  onAction?: () => void
  action?: React.ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  badge,
  actionLabel,
  actionIcon: ActionIcon,
  onAction,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-wrap items-start justify-between gap-4", className)}>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          {Icon ? (
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/12 text-primary">
              <Icon className="h-5 w-5" />
            </div>
          ) : null}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
              {badge ? <StatusBadge status={badge} /> : null}
            </div>
            <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
      {action ? (
        <div className="flex shrink-0 items-center gap-2">{action}</div>
      ) : actionLabel && onAction ? (
        <button
          onClick={onAction}
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          {ActionIcon ? <ActionIcon className="h-4 w-4" /> : null}
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}
