export type CalendarEventType = "task" | "deadline" | "meeting" | "reminder"

export interface CalendarEvent {
  id: string
  title: string
  date: string
  type: CalendarEventType
  time?: string
}
