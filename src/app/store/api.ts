import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react"
import type { Note } from "@/types/note"
import type { DashboardStats } from "@/types/dashboard"

let notesDb: Note[] = [
  { id: "1", title: "Getting Started", content: "Welcome to Neuron Workspace!", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "2", title: "Ideas", content: "Brainstorm features for the next sprint.", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
]

const statsDb: DashboardStats = {
  totalNotes: 2,
  totalWords: 18,
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

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Notes", "Stats"],
  endpoints: (builder) => ({
    getNotes: builder.query<Note[], void>({
      queryFn: async () => {
        await delay(300)
        return { data: [...notesDb] }
      },
      providesTags: ["Notes"],
    }),
    getNoteById: builder.query<Note, string>({
      queryFn: async (id) => {
        await delay(200)
        const note = notesDb.find((n) => n.id === id)
        if (!note) return { error: new Error("Note not found") }
        return { data: note }
      },
      providesTags: (_result, _err, id) => [{ type: "Notes", id }],
    }),
    createNote: builder.mutation<Note, { title: string; content: string }>({
      queryFn: async (data) => {
        await delay(300)
        const newNote: Note = {
          id: String(Date.now()),
          title: data.title,
          content: data.content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        notesDb = [newNote, ...notesDb]
        statsDb.totalNotes = notesDb.length
        return { data: newNote }
      },
      invalidatesTags: ["Notes", "Stats"],
    }),
    updateNote: builder.mutation<Note, { id: string; title: string; content: string }>({
      queryFn: async ({ id, ...data }) => {
        await delay(300)
        const idx = notesDb.findIndex((n) => n.id === id)
        if (idx === -1) return { error: new Error("Note not found") }
        const updated: Note = {
          ...notesDb[idx],
          ...data,
          updatedAt: new Date().toISOString(),
        }
        notesDb[idx] = updated
        return { data: updated }
      },
      invalidatesTags: (_result, _err, { id }) => [{ type: "Notes", id }],
    }),
    deleteNote: builder.mutation<void, string>({
      queryFn: async (id) => {
        await delay(200)
        notesDb = notesDb.filter((n) => n.id !== id)
        statsDb.totalNotes = notesDb.length
        return { data: undefined }
      },
      invalidatesTags: ["Notes", "Stats"],
    }),
    getDashboardStats: builder.query<DashboardStats, void>({
      queryFn: async () => {
        await delay(400)
        statsDb.totalNotes = notesDb.length
        return { data: { ...statsDb } }
      },
      providesTags: ["Stats"],
    }),
  }),
})

export const {
  useGetNotesQuery,
  useGetNoteByIdQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
  useGetDashboardStatsQuery,
} = api
