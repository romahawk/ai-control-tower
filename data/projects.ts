import type { Project } from "@/types"

const now = "2026-05-05T00:00:00.000Z"

export const PROJECTS: Project[] = [
  {
    id: "project-control-tower",
    name: "AI Control Tower",
    description: "Turn the scenario-first execution OS into a durable project workspace with clear roadmap sequencing.",
    status: "active",
    priority: "high",
    scenarioId: "product-development",
    workflowIds: ["pd-market-research", "pd-mvp-scope", "pd-build-kill-pivot"],
    nextAction: "Finish Phase 2 project foundations before expanding the backlog again.",
    ownerNote: "Primary product track for the current build cycle.",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "project-income-proof-system",
    name: "Income Proof System",
    description: "Build a repeatable proof and outreach engine for agency and portfolio work.",
    status: "active",
    priority: "high",
    scenarioId: "income-engine",
    workflowIds: ["agency-lead-generation", "product-case-study-extraction", "weekly-income-engine-review"],
    nextAction: "Extract one visible proof asset from shipped work and use it in outreach.",
    ownerNote: "Tie execution outputs directly to income-generation leverage.",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "project-weekly-focus-ops",
    name: "Weekly Focus Ops",
    description: "Reduce overload by keeping a small, explicit set of priorities aligned across scenarios.",
    status: "paused",
    priority: "medium",
    scenarioId: "life-strategy",
    workflowIds: ["weekly-focus-reset", "admin-inbox-reset"],
    nextAction: "Resume after the current product sprint stabilizes.",
    ownerNote: "Good support project, but not the primary build track this week.",
    createdAt: now,
    updatedAt: now,
  },
]
