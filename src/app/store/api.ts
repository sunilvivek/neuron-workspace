import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { Note } from "@/types/note"
import type { DashboardStats, QuickAction } from "@/types/dashboard"
import type { Task } from "@/types/task"
import type { Notification } from "@/types/notification"
import type { TeamMember } from "@/types/team"
import type { ActivityItem } from "@/types/activity"
import type { CalendarEvent } from "@/types/calendar"
import type { StorageInfo } from "@/types/storage"

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Notes", "Stats", "Tasks", "Notifications", "Activity", "Calendar", "Storage", "Team"],
  endpoints: (builder) => ({
    getNotes: builder.query<Note[], void>({
      query: () => "/notes",
      providesTags: ["Notes"],
    }),
    getNoteById: builder.query<Note, string>({
      query: (id) => `/notes/${id}`,
      providesTags: (_result, _err, id) => [{ type: "Notes", id }],
    }),
    createNote: builder.mutation<Note, { title: string; content: string }>({
      query: (data) => ({
        url: "/notes",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Notes", "Stats"],
    }),
    updateNote: builder.mutation<Note, { id: string; title: string; content: string }>({
      query: ({ id, ...data }) => ({
        url: `/notes/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _err, { id }) => [{ type: "Notes", id }],
    }),
    deleteNote: builder.mutation<void, string>({
      query: (id) => ({
        url: `/notes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notes", "Stats"],
    }),
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => "/dashboard/stats",
      providesTags: ["Stats"],
    }),
    getWelcome: builder.query<{
      name: string
      greeting: string
      date: string
      time: string
      summary: { totalNotes: number; activeProjects: number; tasksToday: number; unreadNotifications: number }
    }, void>({
      query: () => "/dashboard/welcome",
    }),
    getQuickActions: builder.query<QuickAction[], void>({
      query: () => "/dashboard/quick-actions",
    }),
    getActivity: builder.query<ActivityItem[], void>({
      query: () => "/dashboard/activity",
      providesTags: ["Activity"],
    }),
    getTasks: builder.query<Task[], void>({
      query: () => "/dashboard/tasks",
      providesTags: ["Tasks"],
    }),
    toggleTask: builder.mutation<Task, string>({
      query: (id) => ({
        url: `/dashboard/tasks/${id}/read`,
        method: "POST",
      }),
      invalidatesTags: ["Tasks"],
    }),
    getNotifications: builder.query<Notification[], void>({
      query: () => "/dashboard/notifications",
      providesTags: ["Notifications"],
    }),
    markNotificationRead: builder.mutation<Notification, string>({
      query: (id) => ({
        url: `/dashboard/notifications/${id}/read`,
        method: "POST",
      }),
      invalidatesTags: ["Notifications"],
    }),
    markAllNotificationsRead: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: "/dashboard/notifications/read-all",
        method: "POST",
      }),
      invalidatesTags: ["Notifications"],
    }),
    getCalendar: builder.query<CalendarEvent[], void>({
      query: () => "/dashboard/calendar",
      providesTags: ["Calendar"],
    }),
    getStorage: builder.query<StorageInfo, void>({
      query: () => "/dashboard/storage",
      providesTags: ["Storage"],
    }),
    getTeam: builder.query<TeamMember[], void>({
      query: () => "/dashboard/team",
      providesTags: ["Team"],
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
  useGetWelcomeQuery,
  useGetQuickActionsQuery,
  useGetActivityQuery,
  useGetTasksQuery,
  useToggleTaskMutation,
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useGetCalendarQuery,
  useGetStorageQuery,
  useGetTeamQuery,
} = api
