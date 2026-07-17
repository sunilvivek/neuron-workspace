export type NotificationCategory = "info" | "warning" | "success" | "error"

export interface Notification {
  id: string
  title: string
  message: string
  category: NotificationCategory
  read: boolean
  createdAt: string
}
