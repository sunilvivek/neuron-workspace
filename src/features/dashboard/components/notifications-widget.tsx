import { useGetNotificationsQuery, useMarkNotificationReadMutation, useMarkAllNotificationsReadMutation } from "@/app/store/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Info, AlertTriangle, CheckCircle2, XCircle, Bell } from "lucide-react"
import type { NotificationCategory } from "@/types/notification"

const categoryConfig: Record<NotificationCategory, { icon: typeof Info; className: string }> = {
  info: { icon: Info, className: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
  warning: { icon: AlertTriangle, className: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" },
  success: { icon: CheckCircle2, className: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" },
  error: { icon: XCircle, className: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" },
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

export function NotificationsWidget() {
  const { data: notifications, isLoading } = useGetNotificationsQuery()
  const [markRead] = useMarkNotificationReadMutation()
  const [markAllRead] = useMarkAllNotificationsReadMutation()

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-28" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-8 w-8 rounded-full shrink-0" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (!notifications) return null

  const unread = notifications.filter((n) => !n.read)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Bell className="h-4 w-4" aria-hidden="true" />
          Notifications
          {unread.length > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              {unread.length}
            </span>
          )}
        </CardTitle>
        {unread.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => markAllRead()}
          >
            Mark all read
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notifications.map((notification) => {
            const { icon: Icon, className } = categoryConfig[notification.category]
            return (
              <button
                key={notification.id}
                type="button"
                onClick={() => !notification.read && markRead(notification.id)}
                className={`flex w-full items-start gap-3 rounded-lg p-2 text-left transition-colors hover:bg-accent/50 ${!notification.read ? "bg-accent/30" : ""}`}
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${className}`}>
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium leading-none ${!notification.read ? "" : "text-muted-foreground"}`}>
                    {notification.title}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground truncate">{notification.message}</p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatRelativeTime(notification.createdAt)}
                </span>
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
