import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { FileType } from "@/types/folder"

interface FileFilterPanelProps {
  selectedType: FileType | null
  onTypeChange: (type: FileType | null) => void
  dateFrom: string | null
  dateTo: string | null
  onDateFromChange: (date: string | null) => void
  onDateToChange: (date: string | null) => void
}

const typeLabels: Partial<Record<FileType, string>> = {
  pdf: "PDF",
  image: "Image",
  audio: "Audio",
  spreadsheet: "Sheet",
  code: "Code",
  archive: "Archive",
  video: "Video",
  text: "Text",
  markdown: "Markdown",
}

export function FileFilterPanel({
  selectedType,
  onTypeChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
}: FileFilterPanelProps) {
  const hasFilters = selectedType || dateFrom || dateTo

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex flex-wrap items-center gap-1">
        {(["pdf", "image", "spreadsheet", "code", "archive", "video", "text", "markdown"] as FileType[]).map((type) => (
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
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={dateFrom || ""}
          onChange={(e) => onDateFromChange(e.target.value || null)}
          className="h-7 rounded-md border border-input bg-background px-2 text-xs"
          aria-label="From date"
        />
        <span className="text-xs text-muted-foreground">-</span>
        <input
          type="date"
          value={dateTo || ""}
          onChange={(e) => onDateToChange(e.target.value || null)}
          className="h-7 rounded-md border border-input bg-background px-2 text-xs"
          aria-label="To date"
        />
      </div>
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs text-muted-foreground"
          onClick={() => { onTypeChange(null); onDateFromChange(null); onDateToChange(null) }}
        >
          <X className="mr-1 h-3 w-3" />
          Clear filters
        </Button>
      )}
    </div>
  )
}
