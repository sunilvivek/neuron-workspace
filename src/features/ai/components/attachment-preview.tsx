import { X, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Attachment {
  id: string
  file: File
  preview?: string
}

interface AttachmentPreviewProps {
  attachments: Attachment[]
  onRemove: (id: string) => void
}

export function AttachmentPreview({ attachments, onRemove }: AttachmentPreviewProps) {
  if (attachments.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 px-1" role="list" aria-label="Attached files">
      {attachments.map((attachment) => {
        const isImage = attachment.file.type.startsWith("image/")

        return (
          <div
            key={attachment.id}
            className="group relative flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-1.5 pr-2"
            role="listitem"
          >
            {isImage && attachment.preview ? (
              <img
                src={attachment.preview}
                alt={attachment.file.name}
                className="h-8 w-8 rounded object-cover"
              />
            ) : (
              <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
            )}
            <div className="min-w-0 max-w-[120px]">
              <p className="truncate text-xs font-medium">{attachment.file.name}</p>
              <p className="text-[10px] text-muted-foreground">
                {(attachment.file.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onRemove(attachment.id)}
              aria-label={`Remove ${attachment.file.name}`}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )
      })}
    </div>
  )
}

export type { Attachment }
