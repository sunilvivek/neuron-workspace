import { Trash2 } from "lucide-react"
import type { FileAttachment } from "@/types/folder"
import { FileCard } from "./file-card"
import { EmptyState } from "./empty-state"

interface TrashViewProps {
  files: FileAttachment[]
  isLoading: boolean
  onPreview: (file: FileAttachment) => void
  onRestore: (id: string) => void
  onDelete: (id: string) => void
}

export function TrashView({ files, isLoading, onPreview, onRestore, onDelete }: TrashViewProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 rounded-xl border bg-card animate-pulse" />
        ))}
      </div>
    )
  }

  if (files.length === 0) {
    return (
      <EmptyState
        icon={Trash2}
        title="Trash is empty"
        description="Deleted files will appear here."
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Trash2 className="h-4 w-4" />
        <span>Files in trash can be restored or permanently deleted.</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {files.map((file) => (
          <FileCard
            key={file.id}
            file={file}
            onPreview={onPreview}
            onRename={() => {}}
            onDelete={onDelete}
            onMove={() => {}}
            onRestore={onRestore}
            inTrash
          />
        ))}
      </div>
    </div>
  )
}
