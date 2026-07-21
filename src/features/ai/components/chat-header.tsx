import { Bot, PanelLeftClose } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChatHeaderProps {
  conversationTitle?: string
  messageCount: number
  onToggleSidebar: () => void
}

export function ChatHeader({ conversationTitle, messageCount, onToggleSidebar }: ChatHeaderProps) {
  return (
    <div className="flex h-14 items-center justify-between border-b px-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 md:hidden"
          onClick={onToggleSidebar}
          aria-label="Open conversations"
        >
          <PanelLeftClose className="h-4 w-4" />
        </Button>
        {conversationTitle ? (
          <div>
            <h2 className="text-sm font-semibold truncate max-w-[200px] sm:max-w-[300px] lg:max-w-[400px]">
              {conversationTitle}
            </h2>
            <p className="text-xs text-muted-foreground">{messageCount} messages</p>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <h2 className="text-sm font-semibold">Neuron AI</h2>
          </div>
        )}
      </div>
    </div>
  )
}
