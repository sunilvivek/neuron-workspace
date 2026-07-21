import { cn } from "@/lib/utils"
import { Bot, User } from "lucide-react"
import { MarkdownRenderer } from "./markdown-renderer"
import type { Message } from "@/types/ai"

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user"

  return (
    <div
      className={cn(
        "flex gap-3 px-4 py-5",
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
        <div className="mb-1 text-xs font-medium text-muted-foreground">
          {isUser ? "You" : "Neuron AI"}
        </div>
        <div className="text-sm leading-7">
          {isUser ? (
            <p className="text-foreground">{message.content}</p>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
        </div>
      </div>
    </div>
  )
}
