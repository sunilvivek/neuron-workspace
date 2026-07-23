import type { FileAttachment } from "@/types/folder"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  FileText, Image, Table as TableIcon, Code, Archive, Music,
  File, Video, FileType, MoreHorizontal, Pencil, Trash2, Eye,
  FolderInput, Star, RotateCcw,
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

const typeLabels: Record<string, string> = {
  pdf: "PDF", image: "Image", spreadsheet: "Sheet",
  code: "Code", archive: "Archive", audio: "Audio", video: "Video",
  text: "Text", markdown: "Markdown",
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}

interface FileTableProps {
  files: FileAttachment[]
  onPreview: (file: FileAttachment) => void
  onRename: (file: FileAttachment) => void
  onDelete: (id: string) => void
  onMove: (file: FileAttachment) => void
  onFavorite?: (id: string) => void
  onRestore?: (id: string) => void
  inTrash?: boolean
}

export function FileTable({ files, onPreview, onRename, onDelete, onMove, onFavorite, onRestore, inTrash }: FileTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead className="w-20">Type</TableHead>
          <TableHead className="w-20">Size</TableHead>
          <TableHead className="w-28">Uploaded</TableHead>
          <TableHead className="w-16" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {files.map((file) => {
          const Icon = typeIcons[file.type] || File
          const typeLabel = typeLabels[file.type] || file.type
          return (
            <TableRow key={file.id} className="group cursor-pointer" onClick={() => onPreview(file)}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {onFavorite && !inTrash && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn("h-6 w-6 shrink-0", file.favorite ? "text-yellow-500" : "text-muted-foreground opacity-0 group-hover:opacity-100")}
                      onClick={(e) => { e.stopPropagation(); onFavorite(file.id) }}
                      aria-label={file.favorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Star className={cn("h-3.5 w-3.5", file.favorite && "fill-current")} />
                    </Button>
                  )}
                  <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="truncate">{file.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground text-xs">{typeLabel}</TableCell>
              <TableCell className="text-muted-foreground text-xs">{formatFileSize(file.size)}</TableCell>
              <TableCell className="text-muted-foreground text-xs">
                {new Date(file.uploadedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => e.stopPropagation()}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuItem onClick={() => onPreview(file)}>
                      <Eye className="mr-2 h-4 w-4" /> Preview
                    </DropdownMenuItem>
                    {!inTrash ? (
                      <>
                        <DropdownMenuItem onClick={() => onRename(file)}>
                          <Pencil className="mr-2 h-4 w-4" /> Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onMove(file)}>
                          <FolderInput className="mr-2 h-4 w-4" /> Move
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onDelete(file.id)} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        {onRestore && (
                          <DropdownMenuItem onClick={() => onRestore(file.id)}>
                            <RotateCcw className="mr-2 h-4 w-4" /> Restore
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => onDelete(file.id)} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Permanently
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
