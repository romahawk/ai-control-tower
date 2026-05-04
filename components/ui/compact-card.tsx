import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface CompactCardProps {
  title: string
  subtitle?: string
  icon?: LucideIcon
  badges?: React.ReactNode
  metadata?: React.ReactNode
  primaryAction?: React.ReactNode
  secondaryAction?: React.ReactNode
  children?: React.ReactNode
  onClick?: () => void
  isActive?: boolean
  className?: string
}

export function CompactCard({
  title,
  subtitle,
  icon: Icon,
  badges,
  metadata,
  primaryAction,
  secondaryAction,
  children,
  onClick,
  isActive,
  className,
}: CompactCardProps) {
  const Wrapper = onClick ? "button" : "div"

  return (
    <Card
      className={cn(
        "surface-panel overflow-hidden rounded-3xl border-border/60 py-0",
        isActive ? "border-primary/25 bg-primary/8" : "bg-card/70",
        className
      )}
    >
      <Wrapper
        {...(onClick ? { onClick, type: "button" as const } : {})}
        className={cn(
          "w-full text-left",
          onClick ? "transition hover:bg-secondary/10" : ""
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                {Icon ? (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                ) : null}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{title}</p>
                  {subtitle ? <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{subtitle}</p> : null}
                </div>
              </div>
              {badges ? <div className="mt-3 flex flex-wrap gap-2">{badges}</div> : null}
              {children ? <div className="mt-3">{children}</div> : null}
              {metadata ? <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted-foreground">{metadata}</div> : null}
            </div>
            {(primaryAction || secondaryAction) ? (
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                {secondaryAction}
                {primaryAction}
              </div>
            ) : null}
          </div>
        </CardContent>
      </Wrapper>
    </Card>
  )
}
