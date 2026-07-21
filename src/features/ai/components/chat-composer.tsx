import { useState, useRef, useEffect } from "react"
import { Send, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ChatComposerProps {
  onSend: (message: string) => void
  disabled?: boolean
  placeholder?: string
}

const MAX_CHARS = 4000

export function ChatComposer({ onSend, disabled = false, placeholder = "Message Neuron AI..." }: ChatComposerProps) {
  const [value, setValue] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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

  function handleSend() {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue("")
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const charsLeft = MAX_CHARS - value.length

  return (
    <div className="border-t bg-background px-4 py-3">
      <div className="mx-auto flex max-w-3xl flex-col gap-2">
        <div className={cn(
          "flex items-end gap-2 rounded-xl border bg-muted/30 p-2 transition-colors",
          "focus-within:border-primary/50 focus-within:bg-background"
        )}>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
            disabled={disabled}
            aria-label="Attach file"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              if (e.target.value.length <= MAX_CHARS) {
                setValue(e.target.value)
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
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
            <Button
              size="icon"
              className="h-9 w-9 shrink-0"
              onClick={handleSend}
              disabled={disabled || !value.trim()}
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-center text-[10px] text-muted-foreground">
          Neuron AI may produce inaccurate information.
        </p>
      </div>
    </div>
  )
}
