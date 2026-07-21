import { cn } from "@/lib/utils"
import { MessageSquare, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Conversation } from "@/types/ai"

interface ConversationItemProps {
  conversation: Conversation
  isActive: boolean
  onClick: () => void
  onDelete: (id: string) => void
}

export function ConversationItem({ conversation, isActive, onClick, onDelete }: ConversationItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex w-full flex-col gap-0.5 rounded-lg px-3 py-2.5 text-left transition-colors",
        isActive
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <MessageSquare className="h-4 w-4 shrink-0" />
          <span className="truncate text-sm font-medium">{conversation.title}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => { e.stopPropagation(); onDelete(conversation.id) }}
          aria-label={`Delete ${conversation.title}`}
        >
          <Trash2 className="h-3.5 w-3.5 text-destructive" />
        </Button>
      </div>
      {conversation.lastMessagePreview && (
        <p className="truncate text-xs text-muted-foreground pl-6">{conversation.lastMessagePreview}</p>
      )}
      <p className="pl-6 text-[10px] text-muted-foreground/60">
        {conversation.messageCount} messages
      </p>
    </button>
  )
}
