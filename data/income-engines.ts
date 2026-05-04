import { SCENARIOS } from "@/data/scenarios"
import type { IncomeEngine } from "@/types"

// TODO: Remove this adapter once all legacy income-engine references are fully retired.
export const INCOME_ENGINES: IncomeEngine[] = SCENARIOS.filter(
  (scenario) => scenario.category === "income-engine"
).map((scenario) => ({
  id: scenario.id,
  name: scenario.name,
  priority: scenario.priority ? scenario.priority[0].toUpperCase() + scenario.priority.slice(1) : "Medium",
  description: scenario.description,
  status: scenario.status[0].toUpperCase() + scenario.status.slice(1),
  activeWorkflowId: scenario.defaultWorkflowIds?.[0] ?? "",
  nextAction: scenario.nextAction ?? "",
  targetOutput: scenario.targetOutput ?? "",
  linkedWorkflowIds: scenario.defaultWorkflowIds ?? [],
}))
