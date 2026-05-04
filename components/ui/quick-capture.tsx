"use client"

import { useMemo, useState } from "react"
import { CheckCircle2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatusBadge } from "@/components/ui/status-badge"
import { Textarea } from "@/components/ui/textarea"
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
}

export function QuickCapture({
  selectedScenario,
  selectedWorkflow,
  quickCaptures,
  onSave,
  placeholder = "Capture task, prompt, idea, or decision...",
  submitLabel = "Save to Inbox",
}: QuickCaptureProps) {
  const [type, setType] = useState<QuickCaptureType>("task")
  const [content, setContent] = useState("")
  const [saved, setSaved] = useState(false)

  const recentCaptures = useMemo(() => quickCaptures.slice(0, 3), [quickCaptures])

  const handleSave = () => {
    if (!content.trim()) return

    onSave({
      type,
      content: content.trim(),
      scenarioId: selectedScenario.id,
      workflowId: selectedWorkflow?.id,
    })
    setContent("")
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1200)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-border/60 bg-card/70 p-4">
        <Textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder={placeholder}
          className="min-h-24 resize-none border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="w-[170px]">
            <Select value={type} onValueChange={(value) => setType(value as QuickCaptureType)}>
              <SelectTrigger className="rounded-xl">
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
          <Button onClick={handleSave}>
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
            <div key={capture.id} className="rounded-2xl border border-border/60 bg-secondary/15 p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full border border-border bg-secondary/30 px-2.5 py-1 text-[11px] text-muted-foreground">
                  {capture.type}
                </span>
                <StatusBadge status="inbox" />
              </div>
              <p className="mt-2 text-sm text-foreground">{capture.content}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
