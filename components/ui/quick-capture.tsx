"use client"

import { useMemo, useState } from "react"
import { CheckCircle2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatusBadge } from "@/components/ui/status-badge"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { QuickCaptureRecord, QuickCaptureType, Scenario, Workflow } from "@/types"

interface QuickCaptureProps {
  selectedScenario: Scenario
  selectedWorkflow?: Workflow
  quickCaptures: QuickCaptureRecord[]
  onSave: (params: {
    type: QuickCaptureType
    content: string
    scenarioId?: string
    workflowId?: string
  }) => void
  placeholder?: string
  submitLabel?: string
  variant?: "default" | "compact"
}

export function QuickCapture({
  selectedScenario,
  selectedWorkflow,
  quickCaptures,
  onSave,
  placeholder = "Capture task, prompt, idea, or decision...",
  submitLabel = "Save to Inbox",
  variant = "default",
}: QuickCaptureProps) {
  const [type, setType] = useState<QuickCaptureType>("task")
  const [content, setContent] = useState("")
  const [saved, setSaved] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const isCompact = variant === "compact"
  const recentCaptures = useMemo(
    () => quickCaptures.slice(0, isCompact ? 2 : 3),
    [isCompact, quickCaptures]
  )

  const handleSave = () => {
    if (!content.trim()) return

    onSave({
      type,
      content: content.trim(),
      scenarioId: selectedScenario.id,
      workflowId: selectedWorkflow?.id,
    })
    setContent("")
    setExpanded(false)
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1200)
  }

  return (
    <div className={cn("space-y-4", isCompact && "space-y-3")}>
      <div className={cn("rounded-3xl border border-border/60 bg-card/70 p-4", isCompact && "rounded-2xl p-3")}>
        <Textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          onFocus={() => setExpanded(true)}
          placeholder={placeholder}
          className={cn(
            "resize-none border-0 bg-transparent px-0 shadow-none focus-visible:ring-0",
            isCompact
              ? expanded || content
                ? "min-h-20"
                : "min-h-11"
              : "min-h-24"
          )}
        />
        <div className={cn("mt-3 flex flex-wrap items-center gap-2", isCompact && "mt-2")}>
          <div className={cn("w-[170px]", isCompact && "w-[132px]")}>
            <Select value={type} onValueChange={(value) => setType(value as QuickCaptureType)}>
              <SelectTrigger className={cn("rounded-xl", isCompact && "h-9 rounded-lg px-3 text-xs")}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="task">Task</SelectItem>
                <SelectItem value="prompt">Prompt</SelectItem>
                <SelectItem value="idea">Idea</SelectItem>
                <SelectItem value="decision">Decision</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSave} size={isCompact ? "sm" : "default"}>
            <Plus className="h-4 w-4" />
            {submitLabel}
          </Button>
          {saved ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-success">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Saved
            </span>
          ) : null}
        </div>
      </div>

      {recentCaptures.length > 0 ? (
        <div className="space-y-2">
          {recentCaptures.map((capture) => (
            <div
              key={capture.id}
              className={cn(
                "rounded-2xl border border-border/60 bg-secondary/15 p-3",
                isCompact && "rounded-xl px-3 py-2.5"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full border border-border bg-secondary/30 px-2.5 py-1 text-[11px] text-muted-foreground">
                  {capture.type}
                </span>
                <StatusBadge status="inbox" />
              </div>
              <p className={cn("mt-2 text-sm text-foreground", isCompact && "line-clamp-2 text-[13px]")}>
                {capture.content}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
