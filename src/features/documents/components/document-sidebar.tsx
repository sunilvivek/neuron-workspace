import { Star, Clock, Archive, Trash2, FileText, LayoutGrid } from "lucide-react"
import { cn } from "@/lib/utils"
import { FolderTree } from "./folder-tree"
import type { DocumentFilter } from "@/types/document"

interface DocumentSidebarProps {
  activeFilter: DocumentFilter
  activeFolderId: string | null
  onFilterChange: (filter: DocumentFilter) => void
  onFolderChange: (folderId: string | null) => void
}

const filters: { value: DocumentFilter; label: string; icon: typeof FileText }[] = [
  { value: "all", label: "All Documents", icon: LayoutGrid },
  { value: "favorites", label: "Favorites", icon: Star },
  { value: "recent", label: "Recently Opened", icon: Clock },
  { value: "archived", label: "Archived", icon: Archive },
  { value: "trash", label: "Trash", icon: Trash2 },
]

export function DocumentSidebar({ activeFilter, activeFolderId, onFilterChange, onFolderChange }: DocumentSidebarProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        {filters.map((filter) => {
          const Icon = filter.icon
          return (
            <button
              key={filter.value}
              type="button"
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                activeFilter === filter.value && activeFolderId === null
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50"
              )}
              onClick={() => { onFilterChange(filter.value); onFolderChange(null) }}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span>{filter.label}</span>
            </button>
          )
        })}
      </div>
      <div className="border-t pt-4">
        <FolderTree activeFolderId={activeFolderId} onSelectFolder={(id) => { onFolderChange(id); onFilterChange("all") }} />
      </div>
    </div>
  )
}
