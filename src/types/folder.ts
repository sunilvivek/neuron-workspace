export interface Folder {
  id: string
  name: string
  parentId: string | null
  createdAt: string
}

export interface FolderTreeNode extends Folder {
  children: FolderTreeNode[]
  documentCount: number
}

export type FileType = "pdf" | "image" | "audio" | "spreadsheet" | "archive" | "code" | "text" | "markdown" | "video" | "other"

export type FileFilter = "all" | "favorites" | "recent" | "trash"

export type FileSortField = "name" | "size" | "uploadedAt" | "type"

export type FileSortDirection = "asc" | "desc"

export interface FileAttachment {
  id: string
  name: string
  type: FileType
  size: number
  folderId: string | null
  uploadedAt: string
  favorite: boolean
  trashed: boolean
}

export interface FileSearchParams {
  folderId?: string | null
  search?: string
  filter?: FileFilter
  type?: FileType | null
  sortField?: FileSortField
  sortDirection?: FileSortDirection
  dateFrom?: string | null
  dateTo?: string | null
}

export interface StorageDashboardData {
  info: StorageInfo
  recentUploads: FileAttachment[]
  largestFiles: FileAttachment[]
}

import type { StorageInfo } from "./storage"
