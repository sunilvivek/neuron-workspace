export type QuickActionType = "document" | "project" | "ai" | "upload" | "task"

export interface QuickAction {
  id: string
  type: QuickActionType
  label: string
  description: string
}

export interface DashboardStats {
  totalNotes: number
  totalWords: number
  weeklyActivity: { day: string; notes: number }[]
  totalDocuments: number
  activeProjects: number
  tasksCompleted: number
  aiConversations: number
  storageUsed: number
  storageTotal: number
  weeklyProductivity: { day: string; documents: number; tasks: number; aiUsage: number }[]
  monthlyProductivity: { month: string; productivity: number }[]
  documentCreation: { day: string; count: number }[]
  aiUsage: { day: string; count: number }[]
  taskCompletion: { day: string; count: number }[]
}
