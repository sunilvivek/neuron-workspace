import type { Document } from "@/types/document"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, MoreHorizontal, Pencil, Archive, Trash2, FolderInput, Copy } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface DocumentCardProps {
  document: Document
  onEdit: (doc: Document) => void
  onFavorite: (id: string) => void
  onArchive: (id: string) => void
  onTrash: (id: string) => void
  onMove: (doc: Document) => void
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
}

function formatDate(iso: string): string {
  const date = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function DocumentCard({ document, onEdit, onFavorite, onArchive, onTrash, onMove }: DocumentCardProps) {
  const preview = stripHtml(document.content)

  return (
    <Card
      className="group cursor-pointer transition-shadow hover:shadow-md"
      onClick={() => onEdit(document)}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium line-clamp-1 flex-1">{document.title}</CardTitle>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-7 w-7", document.favorite ? "text-yellow-500" : "text-muted-foreground opacity-0 group-hover:opacity-100")}
            onClick={(e) => { e.stopPropagation(); onFavorite(document.id) }}
            aria-label={document.favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Star className={cn("h-4 w-4", document.favorite && "fill-current")} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground opacity-0 group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(document) }}>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onMove(document) }}>
                <FolderInput className="mr-2 h-4 w-4" /> Move
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onFavorite(document.id) }}>
                <Copy className="mr-2 h-4 w-4" /> {document.favorite ? "Unfavorite" : "Favorite"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onArchive(document.id) }}>
                <Archive className="mr-2 h-4 w-4" /> {document.archived ? "Unarchive" : "Archive"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onTrash(document.id) }} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Trash
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground line-clamp-3 mb-3">{preview}</p>
        <p className="text-xs text-muted-foreground">{formatDate(document.updatedAt)}</p>
      </CardContent>
    </Card>
  )
}
