import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileText, Image, Table, Code, Archive, Music, File } from "lucide-react"
import type { FileAttachment } from "@/types/folder"

const typeIcons: Record<string, typeof FileText> = {
  pdf: FileText, document: FileText, image: Image, spreadsheet: Table,
  code: Code, archive: Archive, audio: Music,
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}

interface FilePreviewProps {
  file: FileAttachment | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FilePreview({ file, open, onOpenChange }: FilePreviewProps) {
  if (!file) return null
  const Icon = typeIcons[file.type] || File

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>File Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-muted">
              <Icon className="h-7 w-7 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{file.name}</p>
              <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Type</p>
              <Badge variant="secondary">{file.type}</Badge>
            </div>
            <div>
              <p className="text-muted-foreground">Size</p>
              <p>{formatFileSize(file.size)}</p>
            </div>
            <div className="col-span-2">
              <p className="text-muted-foreground">Uploaded</p>
              <p>{new Date(file.uploadedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
