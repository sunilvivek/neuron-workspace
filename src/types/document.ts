export type DocumentSortField = "title" | "createdAt" | "updatedAt"
export type DocumentSortDirection = "asc" | "desc"
export type DocumentFilter = "all" | "favorites" | "recent" | "archived" | "trash"

export interface Document {
  id: string
  title: string
  content: string
  folderId: string | null
  favorite: boolean
  archived: boolean
  trashed: boolean
  createdAt: string
  updatedAt: string
}

export interface DocumentSort {
  field: DocumentSortField
  direction: DocumentSortDirection
}
