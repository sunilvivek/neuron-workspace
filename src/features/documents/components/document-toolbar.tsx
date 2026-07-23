import { Search, X, ArrowUpDown, LayoutGrid, List } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { DocumentSortField, DocumentSortDirection } from "@/types/document"

interface DocumentToolbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  sortField: DocumentSortField
  sortDirection: DocumentSortDirection
  onSortFieldChange: (field: DocumentSortField) => void
  onSortDirectionToggle: () => void
  view: "grid" | "list"
  onViewChange: (view: "grid" | "list") => void
  totalItems: number
}

export function DocumentToolbar({
  searchQuery,
  onSearchChange,
  sortField,
  sortDirection,
  onSortFieldChange,
  onSortDirectionToggle,
  view,
  onViewChange,
  totalItems,
}: DocumentToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search documents..."
            className="pl-9 pr-8 h-9 text-sm"
            aria-label="Search documents"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
        <Select value={sortField} onValueChange={(v) => onSortFieldChange(v as DocumentSortField)}>
          <SelectTrigger className="w-[140px] h-9">
            <ArrowUpDown className="mr-1 h-3 w-3" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updatedAt">Last Modified</SelectItem>
            <SelectItem value="createdAt">Created</SelectItem>
            <SelectItem value="title">Name</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0"
          onClick={onSortDirectionToggle}
          aria-label={`Sort ${sortDirection === "asc" ? "descending" : "ascending"}`}
        >
          <span className="text-xs font-medium">{sortDirection === "asc" ? "A-Z" : "Z-A"}</span>
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <p className="text-xs text-muted-foreground">{totalItems} document{totalItems !== 1 ? "s" : ""}</p>
        <div className="flex items-center gap-1">
          <Button
            variant={view === "grid" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => onViewChange("grid")}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "list" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => onViewChange("list")}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
