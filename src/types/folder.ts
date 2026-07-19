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

export interface FileAttachment {
  id: string
  name: string
  type: string
  size: number
  folderId: string | null
  uploadedAt: string
}
