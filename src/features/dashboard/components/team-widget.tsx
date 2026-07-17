import { useGetTeamQuery } from "@/app/store/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Users } from "lucide-react"
import type { TeamMemberStatus } from "@/types/team"

const statusColors: Record<TeamMemberStatus, string> = {
  online: "bg-green-500",
  away: "bg-yellow-500",
  offline: "bg-gray-400",
}

const statusLabels: Record<TeamMemberStatus, string> = {
  online: "Online",
  away: "Away",
  offline: "Offline",
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

export function TeamWidget() {
  const { data: members, isLoading } = useGetTeamQuery()

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-24" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-2 w-2 rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (!members) return null

  const online = members.filter((m) => m.status === "online").length

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Users className="h-4 w-4" aria-hidden="true" />
          Team
          <span className="text-xs font-normal text-muted-foreground">
            ({online} online)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {members.map((member) => (
            <div key={member.id} className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">{member.avatar}</AvatarFallback>
                </Avatar>
                <div
                  className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background ${statusColors[member.status]}`}
                  aria-label={statusLabels[member.status]}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-none">{member.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{member.role}</p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">
                {formatRelativeTime(member.lastActive)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
