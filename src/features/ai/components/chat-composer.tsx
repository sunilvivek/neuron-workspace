import { useState, useRef, useEffect } from "react"
import { Send, Paperclip, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AttachmentPreview } from "./attachment-preview"
import type { Attachment } from "./attachment-preview"

interface ChatComposerProps {
  onSend: (message: string) => void
  onStop?: () => void
  onAttach?: (files: File[]) => void
  disabled?: boolean
  isStreaming?: boolean
  placeholder?: string
}

const MAX_CHARS = 4000

export function ChatComposer({
  onSend,
  onStop,
  onAttach,
  disabled = false,
  isStreaming = false,
  placeholder = "Message Neuron AI...",
}: ChatComposerProps) {
  const [value, setValue] = useState("")
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function adjustHeight() {
    const el = textareaRef.current
    if (el) {
      el.style.height = "auto"
      el.style.height = Math.min(el.scrollHeight, 200) + "px"
    }
  }

  useEffect(() => {
    adjustHeight()
  }, [value])

  useEffect(() => {
    if (!disabled && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [disabled])

  function handleSend() {
    const trimmed = value.trim()
    if (!trimmed || disabled || isStreaming) return
    onSend(trimmed)
    setValue("")
    setAttachments([])
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
    if (e.key === "Escape" && isStreaming) {
      e.preventDefault()
      onStop?.()
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      addAttachments(files)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  function addAttachments(files: File[]) {
    const newAttachments: Attachment[] = files.map((file) => ({
      id: `att-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
    }))
    setAttachments((prev) => [...prev, ...newAttachments])
    onAttach?.(files)
  }

  function removeAttachment(id: string) {
    setAttachments((prev) => {
      const attachment = prev.find((a) => a.id === id)
      if (attachment?.preview) URL.revokeObjectURL(attachment.preview)
      return prev.filter((a) => a.id !== id)
    })
  }

  const charsLeft = MAX_CHARS - value.length

  return (
    <div className="border-t bg-background px-4 py-3">
      <div className="mx-auto flex max-w-3xl flex-col gap-2">
        <AttachmentPreview attachments={attachments} onRemove={removeAttachment} />
        <div className={cn(
          "flex items-end gap-2 rounded-xl border bg-muted/30 p-2 transition-colors",
          "focus-within:border-primary/50 focus-within:bg-background"
        )}>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
            disabled={disabled || isStreaming}
            onClick={() => fileInputRef.current?.click()}
            aria-label="Attach file"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
            aria-hidden="true"
            tabIndex={-1}
          />
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              if (e.target.value.length <= MAX_CHARS) {
                setValue(e.target.value)
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder={isStreaming ? "Waiting for response..." : placeholder}
            disabled={disabled || isStreaming}
            rows={1}
            className={cn(
              "min-h-[36px] flex-1 resize-none bg-transparent text-sm placeholder:text-muted-foreground",
              "focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
              "scrollbar-thin"
            )}
            aria-label="Message input"
          />
          <div className="flex items-center gap-2">
            {value.length > MAX_CHARS * 0.8 && (
              <span className={cn(
                "text-xs tabular-nums",
                charsLeft < 100 ? "text-destructive" : "text-muted-foreground"
              )}>
                {charsLeft}
              </span>
            )}
            {isStreaming ? (
              <Button
                size="icon"
                variant="secondary"
                className="h-9 w-9 shrink-0"
                onClick={onStop}
                aria-label="Stop generating"
              >
                <Square className="h-4 w-4 fill-current" />
              </Button>
            ) : (
              <Button
                size="icon"
                className="h-9 w-9 shrink-0"
                onClick={handleSend}
                disabled={disabled || !value.trim()}
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <p className="text-center text-[10px] text-muted-foreground">
          {isStreaming
            ? "Press Escape or click stop to cancel generation"
            : "Neuron AI may produce inaccurate information."}
        </p>
      </div>
    </div>
  )
}
