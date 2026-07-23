import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { Note } from "@/types/note"
import type { DashboardStats, QuickAction } from "@/types/dashboard"
import type { Task } from "@/types/task"
import type { Notification } from "@/types/notification"
import type { TeamMember } from "@/types/team"
import type { ActivityItem } from "@/types/activity"
import type { CalendarEvent } from "@/types/calendar"
import type { StorageInfo } from "@/types/storage"
import type { Document, DocumentFilter, DocumentSortField, DocumentSortDirection, PaginatedResult, DocumentType } from "@/types/document"
import type { Folder, FileAttachment, FolderTreeNode } from "@/types/folder"
import type { Template } from "@/types/template"
import type { Conversation, Message, CreateConversationRequest, UpdateConversationRequest } from "@/types/ai"

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: [
    "Notes", "Stats", "Tasks", "Notifications", "Activity", "Calendar", "Storage", "Team",
    "Documents", "Folders", "Files", "Templates", "AI",
  ],
  endpoints: (builder) => ({
    // Notes
    getNotes: builder.query<Note[], void>({
      query: () => "/notes",
      providesTags: ["Notes"],
    }),
    getNoteById: builder.query<Note, string>({
      query: (id) => `/notes/${id}`,
      providesTags: (_result, _err, id) => [{ type: "Notes", id }],
    }),
    createNote: builder.mutation<Note, { title: string; content: string }>({
      query: (data) => ({ url: "/notes", method: "POST", body: data }),
      invalidatesTags: ["Notes", "Stats"],
    }),
    updateNote: builder.mutation<Note, { id: string; title: string; content: string }>({
      query: ({ id, ...data }) => ({ url: `/notes/${id}`, method: "PUT", body: data }),
      invalidatesTags: (_result, _err, { id }) => [{ type: "Notes", id }],
    }),
    deleteNote: builder.mutation<void, string>({
      query: (id) => ({ url: `/notes/${id}`, method: "DELETE" }),
      invalidatesTags: ["Notes", "Stats"],
    }),

    // Dashboard
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => "/dashboard/stats",
      providesTags: ["Stats"],
    }),
    getWelcome: builder.query<{
      name: string; greeting: string; date: string; time: string
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
      query: (id) => ({ url: `/dashboard/tasks/${id}/read`, method: "POST" }),
      invalidatesTags: ["Tasks"],
    }),
    getNotifications: builder.query<Notification[], void>({
      query: () => "/dashboard/notifications",
      providesTags: ["Notifications"],
    }),
    markNotificationRead: builder.mutation<Notification, string>({
      query: (id) => ({ url: `/dashboard/notifications/${id}/read`, method: "POST" }),
      invalidatesTags: ["Notifications"],
    }),
    markAllNotificationsRead: builder.mutation<{ success: boolean }, void>({
      query: () => ({ url: "/dashboard/notifications/read-all", method: "POST" }),
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

    // Documents
    getDocuments: builder.query<PaginatedResult<Document>, {
      folderId?: string | null; search?: string; filter?: DocumentFilter
      sortField?: DocumentSortField; sortDirection?: DocumentSortDirection
      type?: DocumentType | null; tag?: string | null
      page?: number; pageSize?: number
    }>({
      query: (params) => {
        const searchParams = new URLSearchParams()
        if (params.folderId) searchParams.set("folderId", params.folderId)
        if (params.search) searchParams.set("search", params.search)
        if (params.filter && params.filter !== "all") searchParams.set("filter", params.filter)
        if (params.sortField) searchParams.set("sortField", params.sortField)
        if (params.sortDirection) searchParams.set("sortDirection", params.sortDirection)
        if (params.type) searchParams.set("type", params.type)
        if (params.tag) searchParams.set("tag", params.tag)
        if (params.page && params.page > 1) searchParams.set("page", String(params.page))
        if (params.pageSize) searchParams.set("pageSize", String(params.pageSize))
        const qs = searchParams.toString()
        return `/documents${qs ? `?${qs}` : ""}`
      },
      providesTags: ["Documents"],
    }),
    getRecentDocuments: builder.query<Document[], void>({
      query: () => "/documents/recent",
      providesTags: ["Documents"],
    }),
    getDocumentActivity: builder.query<Document[], void>({
      query: () => "/documents/activity",
      providesTags: ["Documents"],
    }),
    getDocumentById: builder.query<Document, string>({
      query: (id) => `/documents/${id}`,
      providesTags: (_result, _err, id) => [{ type: "Documents", id }],
    }),
    createDocument: builder.mutation<Document, { title: string; content: string; folderId?: string | null; templateId?: string }>({
      query: (data) => ({ url: "/documents", method: "POST", body: data }),
      invalidatesTags: ["Documents", "Stats"],
    }),
    duplicateDocument: builder.mutation<Document, string>({
      query: (id) => ({ url: `/documents/${id}/duplicate`, method: "POST" }),
      invalidatesTags: ["Documents", "Stats"],
    }),
    updateDocument: builder.mutation<Document, { id: string } & Partial<Document>>({
      query: ({ id, ...data }) => ({ url: `/documents/${id}`, method: "PUT", body: data }),
      invalidatesTags: (_result, _err, { id }) => [{ type: "Documents", id }],
    }),
    deleteDocument: builder.mutation<void, string>({
      query: (id) => ({ url: `/documents/${id}`, method: "DELETE" }),
      invalidatesTags: ["Documents", "Stats"],
    }),
    toggleFavorite: builder.mutation<Document, string>({
      query: (id) => ({ url: `/documents/${id}/favorite`, method: "POST" }),
      invalidatesTags: ["Documents"],
    }),
    togglePin: builder.mutation<Document, string>({
      query: (id) => ({ url: `/documents/${id}/pin`, method: "POST" }),
      invalidatesTags: ["Documents"],
    }),
    toggleArchive: builder.mutation<Document, string>({
      query: (id) => ({ url: `/documents/${id}/archive`, method: "POST" }),
      invalidatesTags: ["Documents"],
    }),
    toggleTrash: builder.mutation<Document, string>({
      query: (id) => ({ url: `/documents/${id}/trash`, method: "POST" }),
      invalidatesTags: ["Documents"],
    }),
    restoreDocument: builder.mutation<Document, string>({
      query: (id) => ({ url: `/documents/${id}/restore`, method: "POST" }),
      invalidatesTags: ["Documents"],
    }),
    moveDocument: builder.mutation<Document, { id: string; folderId: string | null }>({
      query: ({ id, folderId }) => ({ url: `/documents/${id}/move`, method: "POST", body: { folderId } }),
      invalidatesTags: ["Documents", "Folders"],
    }),
    getDocumentTags: builder.query<string[], void>({
      query: () => "/documents/tags",
    }),

    // Folders
    getFolders: builder.query<(Folder & { documentCount: number })[], { parentId?: string | null }>({
      query: (params) => {
        const searchParams = new URLSearchParams()
        if (params.parentId) searchParams.set("parentId", params.parentId)
        const qs = searchParams.toString()
        return `/folders${qs ? `?${qs}` : ""}`
      },
      providesTags: ["Folders"],
    }),
    getFolderTree: builder.query<FolderTreeNode[], void>({
      query: () => "/folders/tree",
      providesTags: ["Folders"],
    }),
    getFolderPath: builder.query<{ id: string; name: string }[], string>({
      query: (id) => `/folders/${id}/path`,
      providesTags: ["Folders"],
    }),
    createFolder: builder.mutation<Folder, { name: string; parentId?: string | null }>({
      query: (data) => ({ url: "/folders", method: "POST", body: data }),
      invalidatesTags: ["Folders"],
    }),
    updateFolder: builder.mutation<Folder, { id: string; name: string }>({
      query: ({ id, ...data }) => ({ url: `/folders/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["Folders"],
    }),
    deleteFolder: builder.mutation<void, string>({
      query: (id) => ({ url: `/folders/${id}`, method: "DELETE" }),
      invalidatesTags: ["Folders", "Documents"],
    }),

    // Files
    getFiles: builder.query<FileAttachment[], { folderId?: string | null }>({
      query: (params) => {
        const searchParams = new URLSearchParams()
        if (params.folderId) searchParams.set("folderId", params.folderId)
        const qs = searchParams.toString()
        return `/files${qs ? `?${qs}` : ""}`
      },
      providesTags: ["Files"],
    }),
    uploadFile: builder.mutation<FileAttachment, { name: string; type: string; size: number; folderId?: string | null }>({
      query: (data) => ({ url: "/files/upload", method: "POST", body: data }),
      invalidatesTags: ["Files", "Storage"],
    }),
    renameFile: builder.mutation<FileAttachment, { id: string; name: string }>({
      query: ({ id, ...data }) => ({ url: `/files/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["Files"],
    }),
    deleteFile: builder.mutation<void, string>({
      query: (id) => ({ url: `/files/${id}`, method: "DELETE" }),
      invalidatesTags: ["Files", "Storage"],
    }),
    moveFile: builder.mutation<FileAttachment, { id: string; folderId: string | null }>({
      query: ({ id, folderId }) => ({ url: `/files/${id}/move`, method: "POST", body: { folderId } }),
      invalidatesTags: ["Files", "Folders"],
    }),

    // Templates
    getTemplates: builder.query<Template[], void>({
      query: () => "/templates",
      providesTags: ["Templates"],
    }),

    // AI
    getConversations: builder.query<Conversation[], void>({
      query: () => "/ai/conversations",
      providesTags: ["AI"],
    }),
    getConversationMessages: builder.query<Message[], string>({
      query: (conversationId) => `/ai/conversations/${conversationId}/messages`,
      providesTags: (_result, _err, id) => [{ type: "AI", id }],
    }),
    createConversation: builder.mutation<Conversation, CreateConversationRequest>({
      query: (data) => ({ url: "/ai/conversations", method: "POST", body: data }),
      invalidatesTags: ["AI"],
    }),
    sendMessage: builder.mutation<{ userMessage: Message; aiMessage: Message }, { conversationId: string; content: string }>({
      query: ({ conversationId, ...data }) => ({
        url: `/ai/conversations/${conversationId}/messages`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _err, { conversationId }) => [{ type: "AI", id: conversationId }, "AI"],
    }),
    deleteConversation: builder.mutation<void, string>({
      query: (id) => ({ url: `/ai/conversations/${id}`, method: "DELETE" }),
      invalidatesTags: ["AI"],
    }),
    updateConversation: builder.mutation<Conversation, UpdateConversationRequest>({
      query: ({ id, ...data }) => ({ url: `/ai/conversations/${id}`, method: "PUT", body: data }),
      invalidatesTags: (_result, _err, { id }) => [{ type: "AI", id }, "AI"],
    }),
    clearConversation: builder.mutation<{ success: boolean }, string>({
      query: (conversationId) => ({
        url: `/ai/conversations/${conversationId}/clear`,
        method: "POST",
      }),
      invalidatesTags: (_result, _err, id) => [{ type: "AI", id }, "AI"],
    }),

    // Search
    search: builder.query<{ documents: Document[]; files: FileAttachment[] }, { q: string; type?: string }>({
      query: (params) => {
        const searchParams = new URLSearchParams({ q: params.q })
        if (params.type) searchParams.set("type", params.type)
        return `/search?${searchParams.toString()}`
      },
    }),
  }),
})

export const {
  // Notes
  useGetNotesQuery, useGetNoteByIdQuery, useCreateNoteMutation, useUpdateNoteMutation, useDeleteNoteMutation,
  // Dashboard
  useGetDashboardStatsQuery, useGetWelcomeQuery, useGetQuickActionsQuery, useGetActivityQuery,
  useGetTasksQuery, useToggleTaskMutation, useGetNotificationsQuery,
  useMarkNotificationReadMutation, useMarkAllNotificationsReadMutation,
  useGetCalendarQuery, useGetStorageQuery, useGetTeamQuery,
  // Documents
  useGetDocumentsQuery, useGetRecentDocumentsQuery, useGetDocumentByIdQuery,
  useCreateDocumentMutation, useDuplicateDocumentMutation, useUpdateDocumentMutation, useDeleteDocumentMutation,
  useToggleFavoriteMutation, useTogglePinMutation, useToggleArchiveMutation, useToggleTrashMutation,
  useRestoreDocumentMutation, useMoveDocumentMutation, useGetDocumentActivityQuery, useGetDocumentTagsQuery,
  // Folders
  useGetFoldersQuery, useGetFolderTreeQuery, useGetFolderPathQuery,
  useCreateFolderMutation, useUpdateFolderMutation, useDeleteFolderMutation,
  // Files
  useGetFilesQuery, useUploadFileMutation, useRenameFileMutation,
  useDeleteFileMutation, useMoveFileMutation,
  // Templates
  useGetTemplatesQuery,
  // AI
  useGetConversationsQuery, useGetConversationMessagesQuery, useCreateConversationMutation,
  useSendMessageMutation, useDeleteConversationMutation, useUpdateConversationMutation,
  useClearConversationMutation,
  // Search
  useSearchQuery,
} = api
