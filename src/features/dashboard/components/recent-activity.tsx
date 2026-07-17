import { useGetActivityQuery } from "@/app/store/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText, MessageSquare, CheckSquare, FolderOpen, Upload } from "lucide-react"
import type { ActivityType } from "@/types/activity"

const iconMap: Record<ActivityType, typeof FileText> = {
  note: FileText,
  ai: MessageSquare,
  task: CheckSquare,
  project: FolderOpen,
  file: Upload,
}

const colorMap: Record<ActivityType, string> = {
  note: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  ai: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  task: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  project: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  file: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400",
}

function formatRelativeTime(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function RecentActivity() {
  const { data, isLoading } = useGetActivityQuery()

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-8 w-8 rounded-full shrink-0" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-3 w-12 shrink-0" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (!data) return null

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item) => {
            const Icon = iconMap[item.type]
            return (
              <div key={item.id} className="flex items-start gap-3">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${colorMap[item.type]}`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-none">{item.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground truncate">{item.description}</p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatRelativeTime(item.timestamp)}
                </span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
