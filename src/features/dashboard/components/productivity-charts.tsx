import { useGetDashboardStatsQuery } from "@/app/store/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
} from "recharts"

const tooltipStyle = {
  backgroundColor: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "var(--radius)",
  color: "hsl(var(--popover-foreground))",
}

function ChartSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-4 w-36" />
      <Skeleton className="h-[200px] w-full rounded-lg" />
    </div>
  )
}

export function ProductivityCharts() {
  const { data: stats, isLoading } = useGetDashboardStatsQuery()

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <ChartSkeleton />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Weekly Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="day" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="notes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Activity Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={stats.weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="day" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip contentStyle={tooltipStyle} />
              <Area
                type="monotone"
                dataKey="notes"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Monthly Productivity</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={stats.monthlyProductivity}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip contentStyle={tooltipStyle} />
              <Line
                type="monotone"
                dataKey="productivity"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--chart-2))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Weekly Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.weeklyProductivity}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="day" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="documents" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="tasks" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="aiUsage" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
