import { http, HttpResponse } from "msw"
import type { Note } from "@/types/note"
import type { DashboardStats } from "@/types/dashboard"

let notes: Note[] = [
  {
    id: "1",
    title: "Getting Started",
    content: "<p>Welcome to <strong>Neuron Workspace</strong>! This is your productivity hub.</p>",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "2",
    title: "Ideas",
    content: "<p>Brainstorm features for the next sprint.</p><ul><li>Dark mode toggle</li><li>Rich text editor</li><li>Dashboard charts</li></ul>",
    createdAt: new Date(Date.now() - 43200000).toISOString(),
    updatedAt: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: "3",
    title: "Meeting Notes",
    content: "<p>Discuss the architecture decisions for the new project.</p><p>Key takeaways:</p><ol><li>Use feature-based structure</li><li>Keep components reusable</li><li>TypeScript everywhere</li></ol>",
    createdAt: new Date().toISOString(),
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
    const stats: DashboardStats = {
      totalNotes: notes.length,
      totalWords: notes.reduce((acc, note) => acc + countWords(note.content), 0),
      weeklyActivity: [
        { day: "Mon", notes: 2 },
        { day: "Tue", notes: 5 },
        { day: "Wed", notes: 3 },
        { day: "Thu", notes: 7 },
        { day: "Fri", notes: 4 },
        { day: "Sat", notes: 1 },
        { day: "Sun", notes: 0 },
      ],
    }
    return HttpResponse.json(stats)
  }),
]
