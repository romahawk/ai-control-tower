import type { LucideIcon } from "lucide-react"
import { AlertTriangle, CheckCircle2, Info, ShieldAlert, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

type CalloutVariant = "info" | "success" | "warning" | "danger" | "neutral" | "knowledge"

interface InfoCalloutProps {
  variant?: CalloutVariant
  title: string
  description: string
  icon?: LucideIcon
  className?: string
}

const variantMap: Record<
  CalloutVariant,
  { wrapper: string; icon: LucideIcon }
> = {
  info: {
    wrapper: "border-primary/20 bg-primary/8 text-foreground",
    icon: Info,
  },
  success: {
    wrapper: "border-success/20 bg-success/10 text-foreground",
    icon: CheckCircle2,
  },
  warning: {
    wrapper: "border-warning/20 bg-warning/10 text-foreground",
    icon: AlertTriangle,
  },
  danger: {
    wrapper: "border-destructive/20 bg-destructive/10 text-foreground",
    icon: ShieldAlert,
  },
  neutral: {
    wrapper: "border-border bg-secondary/20 text-foreground",
    icon: Sparkles,
  },
  knowledge: {
    wrapper: "border-knowledge/20 bg-knowledge/10 text-foreground",
    icon: Sparkles,
  },
}

export function InfoCallout({
  variant = "info",
  title,
  description,
  icon,
  className,
}: InfoCalloutProps) {
  const Icon = icon ?? variantMap[variant].icon

  return (
    <div className={cn("rounded-2xl border p-4", variantMap[variant].wrapper, className)}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-background/40">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  )
}
