export type DocumentSortField = "title" | "createdAt" | "updatedAt"
export type DocumentSortDirection = "asc" | "desc"
export type DocumentFilter = "all" | "favorites" | "recent" | "archived" | "trash"
export type DocumentType = "document" | "note" | "journal" | "plan" | "brainstorm"

export interface Document {
  id: string
  title: string
  content: string
  folderId: string | null
  type: DocumentType
  tags: string[]
  favorite: boolean
  archived: boolean
  trashed: boolean
  pinned: boolean
  createdAt: string
  updatedAt: string
}

export interface DocumentSort {
  field: DocumentSortField
  direction: DocumentSortDirection
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
