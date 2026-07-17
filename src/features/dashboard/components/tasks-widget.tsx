import { useGetTasksQuery, useToggleTaskMutation } from "@/app/store/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckCircle2, Circle, AlertTriangle, Clock } from "lucide-react"
import type { Task, TaskPriority, TaskStatus } from "@/types/task"

const priorityConfig: Record<TaskPriority, { label: string; className: string }> = {
  low: { label: "Low", className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
  medium: { label: "Medium", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  high: { label: "High", className: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  urgent: { label: "Urgent", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
}

function getStatusIcon(status: TaskStatus) {
  switch (status) {
    case "done":
      return <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
    case "in_progress":
      return <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
    default:
      return <Circle className="h-4 w-4 text-muted-foreground" />
  }
}

function formatDueDate(dueDate: string): string {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dueDate)
  due.setHours(0, 0, 0, 0)
  const diff = due.getTime() - today.getTime()
  const days = Math.round(diff / 86400000)
  if (days < 0) return `${Math.abs(days)}d overdue`
  if (days === 0) return "Today"
  if (days === 1) return "Tomorrow"
  return `${days}d`
}

function isOverdue(dueDate: string, status: TaskStatus): boolean {
  if (status === "done") return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dueDate)
  due.setHours(0, 0, 0, 0)
  return due.getTime() < today.getTime()
}

export function TasksWidget() {
  const { data: tasks, isLoading } = useGetTasksQuery()
  const [toggleTask] = useToggleTaskMutation()

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-24" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (!tasks) return null

  const todayTasks = tasks.filter(
    (t) => t.status !== "done" && !isOverdue(t.dueDate, t.status) && formatDueDate(t.dueDate) === "Today"
  )
  const overdueTasks = tasks.filter((t) => isOverdue(t.dueDate, t.status))
  const completedTasks = tasks.filter((t) => t.status === "done")

  function renderTask(task: Task) {
    const overdue = isOverdue(task.dueDate, task.status)
    return (
      <div
        key={task.id}
        className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/50"
      >
        <button
          type="button"
          onClick={() => toggleTask(task.id)}
          className="shrink-0"
          aria-label={task.status === "done" ? `Mark "${task.title}" as incomplete` : `Mark "${task.title}" as complete`}
        >
          {getStatusIcon(task.status)}
        </button>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium leading-none ${task.status === "done" ? "text-muted-foreground line-through" : ""}`}>
            {task.title}
          </p>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{formatDueDate(task.dueDate)}</span>
            {overdue && (
              <span className="flex items-center gap-0.5 text-xs text-red-600 dark:text-red-400">
                <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                Overdue
              </span>
            )}
          </div>
        </div>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${priorityConfig[task.priority].className}`}>
          {priorityConfig[task.priority].label}
        </span>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Tasks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {overdueTasks.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium text-red-600 dark:text-red-400">
              Overdue ({overdueTasks.length})
            </p>
            <div className="space-y-2">
              {overdueTasks.map(renderTask)}
            </div>
          </div>
        )}
        {todayTasks.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium">Today ({todayTasks.length})</p>
            <div className="space-y-2">
              {todayTasks.map(renderTask)}
            </div>
          </div>
        )}
        {completedTasks.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Completed ({completedTasks.length})
            </p>
            <div className="space-y-2">
              {completedTasks.map(renderTask)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
