import { http, HttpResponse, delay } from "msw"
import type { Task } from "@/types/task"
import type { Notification } from "@/types/notification"
import type { TeamMember } from "@/types/team"
import type { ActivityItem } from "@/types/activity"
import type { CalendarEvent } from "@/types/calendar"
import type { StorageInfo } from "@/types/storage"
import type { QuickAction } from "@/types/dashboard"

const tasks: Task[] = [
  {
    id: "t1",
    title: "Review design mockups",
    description: "Review the new dashboard design mockups and provide feedback",
    priority: "high",
    status: "in_progress",
    dueDate: new Date().toISOString().split("T")[0],
    assignee: "Demo User",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "t2",
    title: "Update API documentation",
    description: "Document the new dashboard endpoints",
    priority: "medium",
    status: "todo",
    dueDate: new Date().toISOString().split("T")[0],
    assignee: "Demo User",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "t3",
    title: "Fix login redirect bug",
    description: "Users are not being redirected to the dashboard after login",
    priority: "urgent",
    status: "todo",
    dueDate: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    assignee: "Demo User",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "t4",
    title: "Write unit tests",
    description: "Add unit tests for the authentication module",
    priority: "medium",
    status: "todo",
    dueDate: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    assignee: "Demo User",
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "t5",
    title: "Deploy v1.2 to staging",
    description: "Deploy the latest changes to the staging environment",
    priority: "low",
    status: "done",
    dueDate: new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0],
    assignee: "Demo User",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
]

let notifications: Notification[] = [
  {
    id: "n1",
    title: "Task overdue",
    message: "Fix login redirect bug is past its due date",
    category: "error",
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "n2",
    title: "AI conversation saved",
    message: "Your conversation about architecture has been saved",
    category: "success",
    read: true,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "n3",
    title: "Storage warning",
    message: "You've used 24% of your storage quota",
    category: "warning",
    read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "n4",
    title: "Welcome back",
    message: "Ready to continue where you left off?",
    category: "info",
    read: true,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
]

const teamMembers: TeamMember[] = [
  {
    id: "tm1",
    name: "Demo User",
    email: "demo@neuron.com",
    role: "Admin",
    avatar: "DU",
    status: "online",
    lastActive: new Date().toISOString(),
  },
  {
    id: "tm2",
    name: "Sarah Chen",
    email: "sarah@neuron.com",
    role: "Developer",
    avatar: "SC",
    status: "online",
    lastActive: new Date(Date.now() - 1200000).toISOString(),
  },
  {
    id: "tm3",
    name: "Marcus Rivera",
    email: "marcus@neuron.com",
    role: "Designer",
    avatar: "MR",
    status: "away",
    lastActive: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "tm4",
    name: "Aisha Patel",
    email: "aisha@neuron.com",
    role: "Product Manager",
    avatar: "AP",
    status: "online",
    lastActive: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: "tm5",
    name: "James Wilson",
    email: "james@neuron.com",
    role: "Developer",
    avatar: "JW",
    status: "offline",
    lastActive: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "tm6",
    name: "Elena Kowalski",
    email: "elena@neuron.com",
    role: "QA Engineer",
    avatar: "EK",
    status: "offline",
    lastActive: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
]

const activityItems: ActivityItem[] = [
  {
    id: "a1",
    type: "note",
    title: "Edited API Documentation",
    description: "Updated endpoint descriptions for the new dashboard API",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: "a2",
    type: "ai",
    title: "AI: Architecture discussion",
    description: "Generated a summary of microservices patterns",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "a3",
    type: "task",
    title: "Completed: Deploy v1.2 to staging",
    description: "Marked as done and verified on staging",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "a4",
    type: "project",
    title: "Created project: Dashboard Redesign",
    description: "New project for the Q3 dashboard overhaul",
    timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "a5",
    type: "file",
    title: "Uploaded: design-spec.pdf",
    description: "Design specification for the new workspace layout",
    timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "a6",
    type: "note",
    title: "Created: Q3 Planning",
    description: "Added goals and milestones for Q3",
    timestamp: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
]

function makeCalendarEvents(): CalendarEvent[] {
  const today = new Date()
  return [
    {
      id: "ce1",
      title: "Sprint planning",
      date: today.toISOString().split("T")[0],
      type: "meeting",
      time: "10:00 AM",
    },
    {
      id: "ce2",
      title: "Review design mockups",
      date: today.toISOString().split("T")[0],
      type: "task",
      time: "2:00 PM",
    },
    {
      id: "ce3",
      title: "API docs deadline",
      date: new Date(today.getTime() + 86400000).toISOString().split("T")[0],
      type: "deadline",
      time: "5:00 PM",
    },
    {
      id: "ce4",
      title: "Team standup",
      date: new Date(today.getTime() + 2 * 86400000).toISOString().split("T")[0],
      type: "meeting",
      time: "9:30 AM",
    },
    {
      id: "ce5",
      title: "Staging deploy reminder",
      date: new Date(today.getTime() + 3 * 86400000).toISOString().split("T")[0],
      type: "reminder",
    },
  ]
}

const quickActions: QuickAction[] = [
  { id: "qa1", type: "document", label: "New Document", description: "Create a rich text document" },
  { id: "qa2", type: "project", label: "New Project", description: "Start a new project" },
  { id: "qa3", type: "ai", label: "Open AI Chat", description: "Chat with AI assistant" },
  { id: "qa4", type: "upload", label: "Upload File", description: "Upload a file to workspace" },
  { id: "qa5", type: "task", label: "Create Task", description: "Add a new task" },
]

const storageInfo: StorageInfo = {
  used: 2.4,
  total: 10,
  breakdown: [
    { type: "Documents", size: 1.2, count: 24 },
    { type: "Images", size: 0.8, count: 15 },
    { type: "AI Conversations", size: 0.3, count: 42 },
    { type: "Other", size: 0.1, count: 8 },
  ],
}

export const dashboardHandlers = [
  http.get("/api/dashboard/welcome", () => {
    return HttpResponse.json({
      name: "Demo User",
      greeting: "Good evening",
      date: new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      summary: {
        totalNotes: 5,
        activeProjects: 8,
        tasksToday: 2,
        unreadNotifications: 1,
      },
    })
  }),

  http.get("/api/dashboard/quick-actions", () => {
    return HttpResponse.json(quickActions)
  }),

  http.get("/api/dashboard/activity", () => {
    return HttpResponse.json(activityItems)
  }),

  http.get("/api/dashboard/tasks", () => {
    return HttpResponse.json(tasks)
  }),

  http.post("/api/dashboard/tasks/:id/read", async ({ params }) => {
    await delay(100)
    const task = tasks.find((t) => t.id === params.id)
    if (!task) return HttpResponse.json({ message: "Task not found" }, { status: 404 })
    task.status = task.status === "done" ? "todo" : "done"
    task.updatedAt = new Date().toISOString()
    return HttpResponse.json(task)
  }),

  http.get("/api/dashboard/notifications", () => {
    return HttpResponse.json(notifications)
  }),

  http.post("/api/dashboard/notifications/:id/read", async ({ params }) => {
    await delay(100)
    const notification = notifications.find((n) => n.id === params.id)
    if (!notification) return HttpResponse.json({ message: "Notification not found" }, { status: 404 })
    notification.read = true
    return HttpResponse.json(notification)
  }),

  http.post("/api/dashboard/notifications/read-all", async () => {
    await delay(100)
    notifications = notifications.map((n) => ({ ...n, read: true }))
    return HttpResponse.json({ success: true })
  }),

  http.get("/api/dashboard/calendar", () => {
    return HttpResponse.json(makeCalendarEvents())
  }),

  http.get("/api/dashboard/storage", () => {
    return HttpResponse.json(storageInfo)
  }),

  http.get("/api/dashboard/team", () => {
    return HttpResponse.json(teamMembers)
  }),
]
