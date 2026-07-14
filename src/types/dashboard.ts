export interface DashboardStats {
  totalNotes: number
  totalWords: number
  weeklyActivity: { day: string; notes: number }[]
}
