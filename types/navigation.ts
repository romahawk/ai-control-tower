export type { ViewType } from "@/types"

export interface ContextListItem {
  id: string
  name: string
  description: string
  itemCount: number
  lastModified: string
  type: "document" | "custom" | "api"
}
