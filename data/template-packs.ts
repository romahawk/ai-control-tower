import { CONTEXT_RECORDS } from "@/data/contexts"
import { PROMPTS } from "@/data/prompts"
import { SCENARIOS } from "@/data/scenarios"
import { TOOLS } from "@/data/tools"
import { WORKFLOWS } from "@/data/workflows"

export const TEMPLATE_PACKS = {
  scenarioTemplates: SCENARIOS,
  workflowTemplates: WORKFLOWS,
  promptTemplates: PROMPTS,
  toolTemplates: TOOLS,
  contextTemplates: CONTEXT_RECORDS,
}
