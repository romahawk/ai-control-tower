import type { LucideIcon } from "lucide-react"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  primaryAction?: React.ReactNode
  secondaryAction?: React.ReactNode
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  primaryAction,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <Empty className="surface-subtle rounded-2xl border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon className="h-5 w-5" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {(primaryAction || secondaryAction) ? (
        <EmptyContent className="flex-row flex-wrap justify-center">
          {primaryAction}
          {secondaryAction}
        </EmptyContent>
      ) : null}
    </Empty>
  )
}
