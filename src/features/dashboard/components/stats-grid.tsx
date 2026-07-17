import { useGetDashboardStatsQuery } from "@/app/store/api"
import { StatCard, StatCardSkeleton } from "./stat-card"
import {
  FileText,
  FolderOpen,
  CheckSquare,
  MessageSquare,
  HardDrive,
  TrendingUp,
} from "lucide-react"

export function StatsGrid() {
  const { data: stats, isLoading } = useGetDashboardStatsQuery()

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!stats) return null

  const statCards = [
    {
      title: "Documents",
      value: stats.totalDocuments,
      description: "Total documents created",
      icon: FileText,
      trend: { value: 12, label: "from last week" },
    },
    {
      title: "Active Projects",
      value: stats.activeProjects,
      description: "Currently in progress",
      icon: FolderOpen,
      trend: { value: 8, label: "from last month" },
    },
    {
      title: "Tasks Completed",
      value: stats.tasksCompleted,
      description: "Done this month",
      icon: CheckSquare,
      trend: { value: 24, label: "from last month" },
    },
    {
      title: "AI Conversations",
      value: stats.aiConversations,
      description: "Active chat sessions",
      icon: MessageSquare,
      trend: { value: 15, label: "from last week" },
    },
    {
      title: "Storage Used",
      value: `${stats.storageUsed} GB`,
      description: `of ${stats.storageTotal} GB available`,
      icon: HardDrive,
      trend: { value: -2, label: "from last week" },
    },
    {
      title: "Productivity",
      value: `${Math.round((stats.weeklyProductivity.reduce((a, b) => a + b.documents + b.tasks + b.aiUsage, 0) / 63) * 100)}%`,
      description: "Weekly average score",
      icon: TrendingUp,
      trend: { value: 5, label: "from last week" },
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {statCards.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          description={stat.description}
          icon={stat.icon}
          trend={stat.trend}
        />
      ))}
    </div>
  )
}
