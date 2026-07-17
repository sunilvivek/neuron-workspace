import { useGetCalendarQuery } from "@/app/store/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CalendarDays, Clock, AlertCircle } from "lucide-react"
import type { CalendarEventType } from "@/types/calendar"

const typeConfig: Record<CalendarEventType, { color: string; label: string }> = {
  meeting: { color: "bg-blue-500", label: "Meeting" },
  task: { color: "bg-green-500", label: "Task" },
  deadline: { color: "bg-red-500", label: "Deadline" },
  reminder: { color: "bg-yellow-500", label: "Reminder" },
}

function getDaysUntil(dateStr: string): string {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const date = new Date(dateStr)
  date.setHours(0, 0, 0, 0)
  const diff = Math.round((date.getTime() - today.getTime()) / 86400000)
  if (diff === 0) return "Today"
  if (diff === 1) return "Tomorrow"
  if (diff < 0) return `${Math.abs(diff)}d ago`
  return `In ${diff}d`
}

export function CalendarWidget() {
  const { data: events, isLoading } = useGetCalendarQuery()

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-2 w-2 rounded-full shrink-0" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-3 w-16 shrink-0" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (!events) return null

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
          Upcoming
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events.map((event) => {
            const { color, label } = typeConfig[event.type]
            return (
              <div key={event.id} className="flex items-start gap-3">
                <div className="mt-1 flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${color}`} aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-none">{event.title}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{getDaysUntil(event.date)}</span>
                    {event.time && (
                      <>
                        <span aria-hidden="true">·</span>
                        <Clock className="h-3 w-3" aria-hidden="true" />
                        <span>{event.time}</span>
                      </>
                    )}
                  </div>
                </div>
                {event.type === "deadline" && (
                  <AlertCircle className="h-4 w-4 text-red-500 shrink-0" aria-label="Deadline" />
                )}
                <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {label}
                </span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
