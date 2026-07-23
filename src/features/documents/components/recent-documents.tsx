import { Clock, FileText } from "lucide-react"
import { format } from "@/lib/date-utils"
import type { Document } from "@/types/document"

interface RecentDocumentsProps {
  documents: Document[]
  isLoading: boolean
  onSelect: (doc: Document) => void
}

export function RecentDocuments({ documents, isLoading, onSelect }: RecentDocumentsProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Recent Activity</h3>
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-12 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    )
  }

  if (documents.length === 0) return null

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">Recent Activity</h3>
      </div>
      <div className="space-y-1">
        {documents.map((doc) => (
          <button
            key={doc.id}
            onClick={() => onSelect(doc)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-accent/50"
          >
            <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{doc.title}</p>
              <p className="text-xs text-muted-foreground">{format(doc.updatedAt)}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
