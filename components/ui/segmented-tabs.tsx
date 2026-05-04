import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface SegmentedTabsProps {
  tabs: Array<{
    value: string
    label: string
    badge?: string
  }>
  className?: string
}

export function SegmentedTabs({ tabs, className }: SegmentedTabsProps) {
  return (
    <TabsList className={cn("h-auto rounded-2xl border border-border/70 bg-secondary/20 p-1", className)}>
      {tabs.map((tab) => (
        <TabsTrigger key={tab.value} value={tab.value} className="rounded-xl px-4 py-2">
          <span>{tab.label}</span>
          {tab.badge ? (
            <span className="rounded-full bg-secondary/70 px-1.5 py-0.5 text-[10px] text-muted-foreground">
              {tab.badge}
            </span>
          ) : null}
        </TabsTrigger>
      ))}
    </TabsList>
  )
}
