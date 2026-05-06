import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface DetailPanelProps {
  title: string
  subtitle?: string
  icon?: LucideIcon
  badges?: React.ReactNode
  actions?: React.ReactNode
  metadata?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

export function DetailPanel({
  title,
  subtitle,
  icon: Icon,
  badges,
  actions,
  metadata,
  children,
  className,
}: DetailPanelProps) {
  return (
    <Card className={cn("surface-panel h-full rounded-3xl border-border/60 py-0", className)}>
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {Icon ? (
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
              ) : null}
              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold tracking-tight text-foreground">{title}</h2>
                {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
              </div>
            </div>
            {badges ? <div className="mt-3 flex flex-wrap gap-2">{badges}</div> : null}
          </div>
          {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
        </div>
        {metadata ? <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">{metadata}</div> : null}
        <div className="space-y-4">{children}</div>
      </CardContent>
    </Card>
  )
}
