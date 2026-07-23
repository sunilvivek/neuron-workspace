import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  FileText, Image, Table as TableIcon, Code, Archive, Music,
  File, Video, FileType, Star,} from "lucide-react"
import type { FileAttachment } from "@/types/folder"

const typeIcons: Record<string, typeof FileText> = {
  pdf: FileText, document: FileText, image: Image, spreadsheet: TableIcon,
  code: Code, archive: Archive, audio: Music, video: Video,
  text: FileType, markdown: FileType,
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

  function renderPreview() {
    if (file.type === "image") {
      return (
        <div className="flex items-center justify-center rounded-lg bg-muted/50 p-4 min-h-[200px]">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Image className="h-12 w-12" />
            <p className="text-xs">Image preview mockup</p>
          </div>
        </div>
      )
    }
    if (file.type === "text") {
      return (
        <div className="rounded-lg bg-muted/50 p-4 min-h-[150px]">
          <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">
            This is a text file preview for {file.name}.
          </pre>
        </div>
      )
    }
    if (file.type === "markdown") {
      return (
        <div className="rounded-lg bg-muted/50 p-4 min-h-[150px] prose prose-sm dark:prose-invert max-w-none">
          <h3>README</h3>
          <p>This is a preview of a markdown file: <strong>{file.name}</strong>.</p>
          <ul>
            <li>Markdown rendering mockup</li>
            <li>Supports headings, lists, and formatting</li>
          </ul>
        </div>
      )
    }
    if (file.type === "pdf") {
      return (
        <div className="flex items-center justify-center rounded-lg bg-muted/50 p-4 min-h-[200px]">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <FileText className="h-12 w-12" />
            <p className="text-xs">PDF preview (mock)</p>
          </div>
        </div>
      )
    }
    return (
      <div className="flex items-center justify-center rounded-lg bg-muted/50 p-4 min-h-[150px]">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Icon className="h-12 w-12" />
          <p className="text-xs">No preview available</p>
        </div>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="truncate">{file.name}</span>
            {file.favorite && <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 shrink-0" />}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {renderPreview()}
          <Separator />
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Type</p>
              <Badge variant="secondary" className="mt-0.5">{file.type}</Badge>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Size</p>
              <p className="mt-0.5">{formatFileSize(file.size)}</p>
            </div>
            <div className="col-span-2">
              <p className="text-muted-foreground text-xs">Uploaded</p>
              <p className="mt-0.5">{new Date(file.uploadedAt).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
