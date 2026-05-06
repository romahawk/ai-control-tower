"use client"

import { ClipboardCheck, Compass, FolderKanban, GitBranch, MessageSquare, NotebookPen, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { ViewType } from "@/types"

type NewItemKind = "workflow" | "project" | "prompt" | "review" | "scenario" | "capture"

interface NewItemMenuProps {
  currentView: ViewType
  onSelect: (kind: NewItemKind) => void
}

const itemMeta = {
  workflow: { label: "New Workflow", icon: GitBranch, description: "Start or stage workflow work" },
  project: { label: "New Project", icon: FolderKanban, description: "Create an execution container for linked workflows" },
  prompt: { label: "New Prompt", icon: MessageSquare, description: "Capture reusable prompt logic" },
  review: { label: "New Review", icon: ClipboardCheck, description: "Create a fresh review record" },
  scenario: { label: "New Scenario", icon: Compass, description: "Set up a reusable operating context" },
  capture: { label: "New Capture", icon: NotebookPen, description: "Quickly save an inbox item" },
} as const

const defaultOrderByView: Partial<Record<ViewType, NewItemKind[]>> = {
  workflows: ["workflow", "project", "capture", "review", "prompt", "scenario"],
  projects: ["project", "workflow", "capture", "review", "prompt", "scenario"],
  prompts: ["prompt", "capture", "workflow", "project", "review", "scenario"],
  reviews: ["review", "workflow", "project", "capture", "prompt", "scenario"],
  scenarios: ["scenario", "project", "workflow", "prompt", "review", "capture"],
}

export function NewItemMenu({ currentView, onSelect }: NewItemMenuProps) {
  const orderedKinds = defaultOrderByView[currentView] ?? ["workflow", "project", "prompt", "review", "scenario", "capture"]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-11 rounded-xl px-4">
          <Plus className="h-4 w-4" />
          New
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[280px] rounded-2xl border-border/70 bg-card/95 p-2">
        <DropdownMenuLabel>Create</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {orderedKinds.map((kind) => {
          const item = itemMeta[kind]
          const Icon = item.icon
          return (
            <DropdownMenuItem key={kind} onClick={() => onSelect(kind)} className="items-start rounded-xl px-3 py-2.5">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
