import { Copy, RefreshCw, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface MessageToolbarProps {
  onCopy: () => void
  onRetry?: () => void
  onRegenerate?: () => void
  isUser: boolean
  isStreaming?: boolean
}

export function MessageToolbar({ onCopy, onRetry, onRegenerate, isUser, isStreaming }: MessageToolbarProps) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    onCopy()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn(
      "flex items-center gap-1 pt-2",
      "opacity-0 group-hover:opacity-100 transition-opacity"
    )}>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={handleCopy}
        aria-label={copied ? "Copied" : "Copy message"}
      >
        <Copy className={cn("h-3.5 w-3.5", copied && "text-green-500")} />
      </Button>
      {!isUser && !isStreaming && (
        <>
          {onRegenerate && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onRegenerate}
              aria-label="Regenerate response"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          )}
        </>
      )}
      {!isUser && onRetry && (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onRetry}
          aria-label="Retry"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  )
}
