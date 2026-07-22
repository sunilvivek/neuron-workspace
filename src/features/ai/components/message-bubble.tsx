import { cn } from "@/lib/utils"
import { Bot, User } from "lucide-react"
import { MarkdownRenderer } from "./markdown-renderer"
import { StreamingMessage } from "./streaming-message"
import { MessageToolbar } from "./message-toolbar"
import type { Message } from "@/types/ai"
import { format } from "@/lib/date-utils"

interface MessageBubbleProps {
  message: Message
  isStreaming?: boolean
  onStreamComplete?: () => void
  onCopy: (content: string) => void
  onRetry?: () => void
  onRegenerate?: () => void
}

export function MessageBubble({
  message,
  isStreaming,
  onStreamComplete,
  onCopy,
  onRetry,
  onRegenerate,
}: MessageBubbleProps) {
  const isUser = message.role === "user"

  return (
    <div
      className={cn(
        "group flex gap-3 px-4 py-5",
        isUser ? "bg-background" : "bg-muted/30"
      )}
    >
      <div className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
        isUser ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
      )}>
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            {isUser ? "You" : "Neuron AI"}
          </span>
          <span className="text-[10px] text-muted-foreground/50" aria-label={`Sent at ${message.createdAt}`}>
            {format(message.createdAt)}
          </span>
        </div>
        <div className="text-sm leading-7">
          {isUser ? (
            <p className="text-foreground whitespace-pre-wrap">{message.content}</p>
          ) : isStreaming && onStreamComplete ? (
            <StreamingMessage content={message.content} onComplete={onStreamComplete} />
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
        </div>
        <MessageToolbar
          onCopy={() => onCopy(message.content)}
          onRetry={onRetry}
          onRegenerate={onRegenerate}
          isUser={isUser}
          isStreaming={isStreaming}
        />
      </div>
    </div>
  )
}
