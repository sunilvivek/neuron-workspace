import { http, HttpResponse } from "msw"
import type { Note } from "@/types/note"
import type { DashboardStats } from "@/types/dashboard"

let notes: Note[] = [
  {
    id: "1",
    title: "Getting Started",
    content: "<p>Welcome to <strong>Neuron Workspace</strong>! This is your productivity hub.</p>",
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
  {
    id: "2",
    title: "Ideas",
    content: "<p>Brainstorm features for the next sprint.</p><ul><li>Dark mode toggle</li><li>Rich text editor</li><li>Dashboard charts</li></ul>",
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: "3",
    title: "Meeting Notes",
    content: "<p>Discuss the architecture decisions for the new project.</p><p>Key takeaways:</p><ol><li>Use feature-based structure</li><li>Keep components reusable</li><li>TypeScript everywhere</li></ol>",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "4",
    title: "Q3 Planning",
    content: "<p>Goals for Q3:</p><ul><li>Launch v2.0 dashboard</li><li>Improve onboarding flow</li><li>Add team collaboration features</li></ul>",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "5",
    title: "API Documentation",
    content: "<p>REST API endpoints for the workspace service:</p><ul><li>GET /api/notes - List all notes</li><li>POST /api/notes - Create a note</li><li>PUT /api/notes/:id - Update a note</li><li>DELETE /api/notes/:id - Delete a note</li></ul>",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

function countWords(html: string): number {
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
  return text ? text.split(" ").length : 0
}

export const handlers = [
  http.get("/api/notes", () => {
    return HttpResponse.json(notes)
  }),

  http.get("/api/notes/:id", ({ params }) => {
    const note = notes.find((n) => n.id === params.id)
    if (!note) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(note)
  }),

  http.post("/api/notes", async ({ request }) => {
    const body = (await request.json()) as { title: string; content: string }
    const newNote: Note = {
      id: String(Date.now()),
      title: body.title,
      content: body.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    notes = [newNote, ...notes]
    return HttpResponse.json(newNote, { status: 201 })
  }),

  http.put("/api/notes/:id", async ({ params, request }) => {
    const body = (await request.json()) as { title: string; content: string }
    const idx = notes.findIndex((n) => n.id === params.id)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    notes[idx] = {
      ...notes[idx],
      ...body,
      updatedAt: new Date().toISOString(),
    }
    return HttpResponse.json(notes[idx])
  }),

  http.delete("/api/notes/:id", ({ params }) => {
    notes = notes.filter((n) => n.id !== params.id)
    return HttpResponse.json({ success: true })
  }),

  http.get("/api/dashboard/stats", () => {
    const totalWords = notes.reduce((acc, note) => acc + countWords(note.content), 0)
    const stats: DashboardStats = {
      totalNotes: notes.length,
      totalWords,
      totalDocuments: 24,
      activeProjects: 8,
      tasksCompleted: 42,
      aiConversations: 15,
      storageUsed: 2.4,
      storageTotal: 10,
      weeklyActivity: [
        { day: "Mon", notes: 2 },
        { day: "Tue", notes: 5 },
        { day: "Wed", notes: 3 },
        { day: "Thu", notes: 7 },
        { day: "Fri", notes: 4 },
        { day: "Sat", notes: 1 },
        { day: "Sun", notes: 0 },
      ],
      weeklyProductivity: [
        { day: "Mon", documents: 3, tasks: 5, aiUsage: 2 },
        { day: "Tue", documents: 7, tasks: 8, aiUsage: 4 },
        { day: "Wed", documents: 5, tasks: 6, aiUsage: 3 },
        { day: "Thu", documents: 9, tasks: 10, aiUsage: 6 },
        { day: "Fri", documents: 6, tasks: 7, aiUsage: 5 },
        { day: "Sat", documents: 2, tasks: 3, aiUsage: 1 },
        { day: "Sun", documents: 0, tasks: 1, aiUsage: 0 },
      ],
      monthlyProductivity: [
        { month: "Jan", productivity: 65 },
        { month: "Feb", productivity: 72 },
        { month: "Mar", productivity: 80 },
        { month: "Apr", productivity: 68 },
        { month: "May", productivity: 85 },
        { month: "Jun", productivity: 92 },
      ],
      documentCreation: [
        { day: "Mon", count: 3 },
        { day: "Tue", count: 7 },
        { day: "Wed", count: 5 },
        { day: "Thu", count: 9 },
        { day: "Fri", count: 6 },
        { day: "Sat", count: 2 },
        { day: "Sun", count: 0 },
      ],
      aiUsage: [
        { day: "Mon", count: 2 },
        { day: "Tue", count: 4 },
        { day: "Wed", count: 3 },
        { day: "Thu", count: 6 },
        { day: "Fri", count: 5 },
        { day: "Sat", count: 1 },
        { day: "Sun", count: 0 },
      ],
      taskCompletion: [
        { day: "Mon", count: 5 },
        { day: "Tue", count: 8 },
        { day: "Wed", count: 6 },
        { day: "Thu", count: 10 },
        { day: "Fri", count: 7 },
        { day: "Sat", count: 3 },
        { day: "Sun", count: 1 },
      ],
    }
    return HttpResponse.json(stats)
  }),
]
