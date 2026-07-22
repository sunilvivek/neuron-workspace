import { Bot, PanelLeftClose, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ChatHeaderProps {
  conversationTitle?: string
  messageCount: number
  isPinned?: boolean
  onToggleSidebar: () => void
  onRename?: () => void
  onTogglePin?: () => void
  onClearChat?: () => void
  onDelete?: () => void
}

export function ChatHeader({
  conversationTitle,
  messageCount,
  isPinned,
  onToggleSidebar,
  onRename,
  onTogglePin,
  onClearChat,
  onDelete,
}: ChatHeaderProps) {
  return (
    <div className="flex h-14 items-center justify-between border-b px-4">
      <div className="flex items-center gap-3 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 md:hidden shrink-0"
          onClick={onToggleSidebar}
          aria-label="Open conversations"
        >
          <PanelLeftClose className="h-4 w-4" />
        </Button>
        {conversationTitle ? (
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold max-w-[200px] sm:max-w-[300px] lg:max-w-[400px]">
              {conversationTitle}
            </h2>
            <p className="text-xs text-muted-foreground">{messageCount} messages</p>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary shrink-0" />
            <h2 className="text-sm font-semibold">Neuron AI</h2>
          </div>
        )}
      </div>
      {conversationTitle && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" aria-label="Chat actions">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            {onRename && (
              <DropdownMenuItem onClick={onRename}>Rename</DropdownMenuItem>
            )}
            {onTogglePin && (
              <DropdownMenuItem onClick={onTogglePin}>
                {isPinned ? "Unpin" : "Pin"}
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            {onClearChat && (
              <DropdownMenuItem onClick={onClearChat}>Clear chat</DropdownMenuItem>
            )}
            {onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
                  Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
