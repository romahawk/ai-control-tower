import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  hint?: string
  tone?: "default" | "success" | "warning" | "danger" | "knowledge"
  className?: string
}

const toneClasses = {
  default: "surface-panel",
  success: "border-success/20 bg-success/8",
  warning: "border-warning/20 bg-warning/8",
  danger: "border-destructive/20 bg-destructive/8",
  knowledge: "border-knowledge/20 bg-knowledge/8",
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = "default",
  className,
}: MetricCardProps) {
  return (
    <Card className={cn("rounded-2xl", toneClasses[tone], className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
            {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-background/40 text-foreground">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
