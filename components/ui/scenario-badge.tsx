import { getScenarioIcon } from "@/lib/ui-meta"
import { cn } from "@/lib/utils"
import type { Scenario } from "@/types"

interface ScenarioBadgeProps {
  scenario: Scenario
  className?: string
}

export function ScenarioBadge({ scenario, className }: ScenarioBadgeProps) {
  const Icon = getScenarioIcon(scenario.category)

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-secondary/25 px-2.5 py-1 text-[11px] font-medium text-muted-foreground",
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {scenario.name}
    </span>
  )
}
