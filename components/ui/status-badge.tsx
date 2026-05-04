import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getStatusMeta } from "@/lib/ui-meta"

interface StatusBadgeProps {
  status: string
  className?: string
}

const toneClasses = {
  active: "border-primary/25 bg-primary/12 text-primary",
  completed: "border-success/25 bg-success/12 text-success",
  blocked: "border-destructive/25 bg-destructive/12 text-destructive",
  paused: "border-warning/25 bg-warning/12 text-warning",
  pending: "border-warning/25 bg-warning/12 text-warning",
  draft: "border-border bg-secondary/40 text-muted-foreground",
  review: "border-knowledge/25 bg-knowledge/12 text-knowledge",
  archived: "border-border bg-secondary/30 text-muted-foreground",
  neutral: "border-border bg-secondary/30 text-foreground",
} as const

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const meta = getStatusMeta(status as never)
  const Icon = meta.icon

  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold", toneClasses[meta.tone], className)}
    >
      <Icon className="h-3.5 w-3.5" />
      {meta.label}
    </Badge>
  )
}
