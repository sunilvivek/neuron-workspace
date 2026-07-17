import { useGetQuickActionsQuery } from "@/app/store/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText, FolderPlus, MessageSquare, Upload, CheckSquare } from "lucide-react"
import type { QuickActionType } from "@/types/dashboard"

const iconMap: Record<QuickActionType, typeof FileText> = {
  document: FileText,
  project: FolderPlus,
  ai: MessageSquare,
  upload: Upload,
  task: CheckSquare,
}

export function QuickActions() {
  const { data, isLoading } = useGetQuickActionsQuery()

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-28" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data) return null

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {data.map((action) => {
            const Icon = iconMap[action.type]
            return (
              <button
                key={action.id}
                className="flex flex-col items-center gap-2 rounded-lg border bg-background p-3 text-center transition-colors hover:bg-accent"
                type="button"
              >
                <Icon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <span className="text-xs font-medium">{action.label}</span>
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
