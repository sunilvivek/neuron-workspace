export type TaskPriority = "low" | "medium" | "high" | "urgent"
export type TaskStatus = "todo" | "in_progress" | "done"

export interface Task {
  id: string
  title: string
  description: string
  priority: TaskPriority
  status: TaskStatus
  dueDate: string
  assignee: string
  createdAt: string
  updatedAt: string
}
