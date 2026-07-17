export type ActivityType = "note" | "project" | "ai" | "task" | "file"

export interface ActivityItem {
  id: string
  type: ActivityType
  title: string
  description: string
  timestamp: string
}
