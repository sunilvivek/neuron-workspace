import { AnimatedPage } from "@/components/animated-page"
import { WelcomeSection } from "../components/welcome-section"
import { QuickActions } from "../components/quick-actions"
import { StatsGrid } from "../components/stats-grid"
import { RecentActivity } from "../components/recent-activity"
import { ProductivityCharts } from "../components/productivity-charts"
import { TasksWidget } from "../components/tasks-widget"
import { NotificationsWidget } from "../components/notifications-widget"
import { CalendarWidget } from "../components/calendar-widget"
import { StorageWidget } from "../components/storage-widget"
import { TeamWidget } from "../components/team-widget"

export default function DashboardPage() {
  return (
    <AnimatedPage>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Welcome to your workspace.
          </p>
        </div>

        <WelcomeSection />
        <QuickActions />
        <StatsGrid />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <RecentActivity />
            <ProductivityCharts />
          </div>

          <div className="space-y-6">
            <CalendarWidget />
            <TasksWidget />
            <NotificationsWidget />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <StorageWidget />
          <TeamWidget />
        </div>
      </div>
    </AnimatedPage>
  )
}
