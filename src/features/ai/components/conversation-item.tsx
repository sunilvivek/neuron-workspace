import { cn } from "@/lib/utils"
import { Pin } from "lucide-react"
import { ConversationActions } from "./conversation-actions"
import type { Conversation } from "@/types/ai"
import { format } from "@/lib/date-utils"

interface ConversationItemProps {
  conversation: Conversation
  isActive: boolean
  onClick: () => void
  onRename: (id: string) => void
  onTogglePin: (id: string) => void
  onClear: (id: string) => void
  onDelete: (id: string) => void
}

export function ConversationItem({
  conversation,
  isActive,
  onClick,
  onRename,
  onTogglePin,
  onClear,
  onDelete,
}: ConversationItemProps) {
  const timeAgo = format(conversation.updatedAt)

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex w-full flex-col gap-0.5 rounded-lg px-3 py-2.5 text-left transition-colors",
        isActive
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
      )}
      aria-current={isActive ? "true" : undefined}
    >
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-2 min-w-0">
          {conversation.pinned && (
            <Pin className="h-3 w-3 shrink-0 fill-primary/30 text-primary/60" aria-label="Pinned" />
          )}
          <span className="truncate text-sm font-medium">
            {conversation.pinned && !isActive ? "— " : ""}{conversation.title}
          </span>
        </div>
        <ConversationActions
          isPinned={conversation.pinned}
          onRename={() => onRename(conversation.id)}
          onTogglePin={() => onTogglePin(conversation.id)}
          onClear={() => onClear(conversation.id)}
          onDelete={() => onDelete(conversation.id)}
        />
      </div>
      {conversation.lastMessagePreview && (
        <p className="truncate text-xs text-muted-foreground pl-5">{conversation.lastMessagePreview}</p>
      )}
      <div className="flex items-center gap-2 pl-5">
        <p className="text-[10px] text-muted-foreground/60">{timeAgo}</p>
        <span className="text-[10px] text-muted-foreground/40">&middot;</span>
        <p className="text-[10px] text-muted-foreground/60">{conversation.messageCount} messages</p>
      </div>
    </button>
  )
}
