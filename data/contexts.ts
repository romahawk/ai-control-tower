import type { ContextRecord } from "@/types"

const now = "2026-05-04T00:00:00.000Z"

export const CONTEXT_RECORDS: ContextRecord[] = [
  {
    id: "ctx-income-offer",
    title: "Agency offer guardrails",
    content:
      "Prioritize service businesses with visible conversion pain. Stay concrete, avoid generic redesign claims, and keep outreach tied to one observable issue.",
    type: "business",
    scenarioId: "income-engine",
    workflowId: "agency-lead-generation",
    tags: ["agency", "offer", "qualification"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "ctx-product-founder-constraints",
    title: "Solo founder validation constraints",
    content:
      "Optimize for learning speed, not elegance. Avoid building too early, prefer manual tests first, and only widen scope if evidence clearly supports it.",
    type: "business",
    projectId: "project-ai-control-tower",
    scenarioId: "product-development",
    tags: ["solo-founder", "validation", "constraints"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "ctx-product-icp",
    title: "Product Development ICP lens",
    content:
      "The strongest near-term opportunities are products that help solo operators, technical product people, or AI-heavy builders reduce decision drag and execution overhead.",
    type: "customer",
    projectId: "project-ai-control-tower",
    scenarioId: "product-development",
    workflowId: "pd-idea-intake",
    tags: ["icp", "founder", "product"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "ctx-weekly-focus-boundary",
    title: "Weekly focus boundary",
    content:
      "Do not carry more than one primary, one support, and one maintenance track per week. Excess parallelism creates false urgency and weak execution.",
    type: "decision",
    projectId: "project-weekly-focus-os",
    scenarioId: "life-strategy",
    workflowId: "weekly-focus-reset",
    tags: ["focus", "review"],
    createdAt: now,
    updatedAt: now,
  },
]
