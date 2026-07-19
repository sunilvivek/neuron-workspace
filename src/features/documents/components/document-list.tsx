import { useState } from "react"
import type { Document, DocumentSortField, DocumentSortDirection } from "@/types/document"
import { DocumentCard } from "./document-card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LayoutGrid, List, ArrowUpDown } from "lucide-react"
import { EmptyState } from "./empty-state"
import { FileText } from "lucide-react"

interface DocumentListProps {
  documents: Document[]
  isLoading: boolean
  onEdit: (doc: Document) => void
  onFavorite: (id: string) => void
  onArchive: (id: string) => void
  onTrash: (id: string) => void
  onMove: (doc: Document) => void
  onCreate: () => void
}

export function DocumentList({ documents, isLoading, onEdit, onFavorite, onArchive, onTrash, onMove, onCreate }: DocumentListProps) {
  const [view, setView] = useState<"grid" | "list">("grid")
  const [sortField, setSortField] = useState<DocumentSortField>("updatedAt")
  const [sortDirection, setSortDirection] = useState<DocumentSortDirection>("desc")

  const sorted = [...documents].sort((a, b) => {
    const aVal = a[sortField]
    const bVal = b[sortField]
    return sortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
  })

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-48 rounded-xl border bg-card animate-pulse" />
        ))}
      </div>
    )
  }

  if (sorted.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No documents found"
        description="Create your first document to get started."
        action={{ label: "New Document", onClick: onCreate }}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Select value={sortField} onValueChange={(v) => setSortField(v as DocumentSortField)}>
            <SelectTrigger className="w-[140px] h-8">
              <ArrowUpDown className="mr-1 h-3 w-3" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updatedAt">Last Modified</SelectItem>
              <SelectItem value="createdAt">Created</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
            aria-label={`Sort ${sortDirection === "asc" ? "descending" : "ascending"}`}
          >
            <span className="text-xs">{sortDirection === "asc" ? "A-Z" : "Z-A"}</span>
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant={view === "grid" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setView("grid")}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "list" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setView("list")}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onEdit={onEdit}
              onFavorite={onFavorite}
              onArchive={onArchive}
              onTrash={onTrash}
              onMove={onMove}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onEdit={onEdit}
              onFavorite={onFavorite}
              onArchive={onArchive}
              onTrash={onTrash}
              onMove={onMove}
            />
          ))}
        </div>
      )}
    </div>
  )
}
