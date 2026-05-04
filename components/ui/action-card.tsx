import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ActionCardProps {
  icon: LucideIcon
  eyebrow?: string
  title: string
  description: string
  meta?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

export function ActionCard({
  icon: Icon,
  eyebrow,
  title,
  description,
  meta,
  action,
  className,
}: ActionCardProps) {
  return (
    <Card className={cn("surface-emphasis overflow-hidden rounded-2xl", className)}>
      <CardContent className="p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 max-w-3xl">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              {eyebrow ? <span className="text-xs font-semibold uppercase tracking-wide text-primary/85">{eyebrow}</span> : null}
            </div>
            <h3 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
            {meta ? <div className="mt-4 flex flex-wrap gap-2">{meta}</div> : null}
          </div>
          {action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
        </div>
      </CardContent>
    </Card>
  )
}
