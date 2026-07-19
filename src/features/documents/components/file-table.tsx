import type { FileAttachment } from "@/types/folder"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { FileText, Image, Table as TableIcon, Code, Archive, Music, File, MoreHorizontal, Pencil, Trash2, Eye, FolderInput } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const typeIcons: Record<string, typeof FileText> = {
  pdf: FileText, document: FileText, image: Image, spreadsheet: TableIcon,
  code: Code, archive: Archive, audio: Music,
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
}

export function FileTable({ files, onPreview, onRename, onDelete, onMove }: FileTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead className="w-24">Type</TableHead>
          <TableHead className="w-24">Size</TableHead>
          <TableHead className="w-32">Uploaded</TableHead>
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {files.map((file) => {
          const Icon = typeIcons[file.type] || File
          return (
            <TableRow key={file.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="truncate">{file.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{file.type}</TableCell>
              <TableCell className="text-muted-foreground">{formatFileSize(file.size)}</TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(file.uploadedAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onPreview(file)}>
                      <Eye className="mr-2 h-4 w-4" /> Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onRename(file)}>
                      <Pencil className="mr-2 h-4 w-4" /> Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onMove(file)}>
                      <FolderInput className="mr-2 h-4 w-4" /> Move
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(file.id)} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
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
