import type { FileAttachment } from "@/types/folder"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  FileText, Image, Table as TableIcon, Code, Archive, Music,
  File, Video, FileType, Star, MoreHorizontal, Eye, Pencil,
  FolderInput, Trash2, RotateCcw,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const typeIcons: Record<string, typeof FileText> = {
  pdf: FileText, document: FileText, image: Image, spreadsheet: TableIcon,
  code: Code, archive: Archive, audio: Music, video: Video,
  text: FileType, markdown: FileType,
}

const typeColors: Record<string, string> = {
  pdf: "text-red-500", image: "text-blue-500", spreadsheet: "text-green-500",
  code: "text-purple-500", archive: "text-yellow-500", audio: "text-pink-500",
  video: "text-orange-500", text: "text-gray-500", markdown: "text-cyan-500",
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
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

interface FileCardProps {
  file: FileAttachment
  onPreview: (file: FileAttachment) => void
  onRename: (file: FileAttachment) => void
  onDelete: (id: string) => void
  onMove: (file: FileAttachment) => void
  onFavorite?: (id: string) => void
  onRestore?: (id: string) => void
  inTrash?: boolean
}

export function FileCard({ file, onPreview, onRename, onDelete, onMove, onFavorite, onRestore, inTrash }: FileCardProps) {
  const Icon = typeIcons[file.type] || File
  const colorClass = typeColors[file.type] || "text-muted-foreground"

  return (
    <Card className="group cursor-pointer transition-shadow hover:shadow-md" onClick={() => onPreview(file)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg bg-muted", colorClass)}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-0.5">
            {onFavorite && !inTrash && (
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-7 w-7",
                  file.favorite ? "text-yellow-500" : "text-muted-foreground opacity-0 group-hover:opacity-100"
                )}
                onClick={(e) => { e.stopPropagation(); onFavorite(file.id) }}
                aria-label={file.favorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Star className={cn("h-4 w-4", file.favorite && "fill-current")} />
              </Button>
            )}
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
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onPreview(file) }}>
                  <Eye className="mr-2 h-4 w-4" /> Preview
                </DropdownMenuItem>
                {!inTrash && (
                  <>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onRename(file) }}>
                      <Pencil className="mr-2 h-4 w-4" /> Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onMove(file) }}>
                      <FolderInput className="mr-2 h-4 w-4" /> Move
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete(file.id) }} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </>
                )}
                {inTrash && onRestore && (
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onRestore(file.id) }}>
                    <RotateCcw className="mr-2 h-4 w-4" /> Restore
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="mt-3 space-y-1">
          <p className="text-sm font-medium truncate">{file.name}</p>
          <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
          <p className="text-xs text-muted-foreground">{formatDate(file.uploadedAt)}</p>
        </div>
      </CardContent>
    </Card>
  )
}
