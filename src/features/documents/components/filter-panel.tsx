import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import type { DocumentType } from "@/types/document"

interface FilterPanelProps {
  selectedType: DocumentType | null
  onTypeChange: (type: DocumentType | null) => void
  selectedTag: string | null
  onTagChange: (tag: string | null) => void
  availableTags: string[]
}

const typeLabels: Record<DocumentType, string> = {
  document: "Documents",
  note: "Notes",
  journal: "Journals",
  plan: "Plans",
  brainstorm: "Brainstorms",
}

export function FilterPanel({
  selectedType,
  onTypeChange,
  selectedTag,
  onTagChange,
  availableTags,
}: FilterPanelProps) {
  const hasFilters = selectedType || selectedTag

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex flex-wrap items-center gap-1">
        {(["document", "note", "journal", "plan", "brainstorm"] as DocumentType[]).map((type) => (
          <Button
            key={type}
            variant={selectedType === type ? "secondary" : "ghost"}
            size="sm"
            className="h-7 text-xs"
            onClick={() => onTypeChange(selectedType === type ? null : type)}
          >
            {typeLabels[type]}
          </Button>
        ))}
      </div>
      {availableTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-xs text-muted-foreground mx-1">|</span>
          {availableTags.slice(0, 6).map((tag) => (
            <Badge
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              className="cursor-pointer text-xs"
              onClick={() => onTagChange(selectedTag === tag ? null : tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs text-muted-foreground"
          onClick={() => { onTypeChange(null); onTagChange(null) }}
        >
          <X className="mr-1 h-3 w-3" />
          Clear filters
        </Button>
      )}
    </div>
  )
}
