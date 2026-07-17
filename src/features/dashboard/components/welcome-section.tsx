import { useGetWelcomeQuery } from "@/app/store/api"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, Clock } from "lucide-react"

export function WelcomeSection() {
  const { data, isLoading } = useGetWelcomeQuery()

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64 mb-4" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data) return null

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {data.greeting}, {data.name.split(" ")[0]}
        </h2>
        <p className="mt-1 text-muted-foreground">
          Here&apos;s what&apos;s happening in your workspace today.
        </p>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            <span>{data.date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" aria-hidden="true" />
            <span>{data.time}</span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Notes", value: data.summary.totalNotes },
            { label: "Projects", value: data.summary.activeProjects },
            { label: "Tasks Today", value: data.summary.tasksToday },
            { label: "Notifications", value: data.summary.unreadNotifications },
          ].map((item) => (
            <div key={item.label} className="rounded-lg bg-muted/50 px-3 py-2">
              <p className="text-lg font-semibold">{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
