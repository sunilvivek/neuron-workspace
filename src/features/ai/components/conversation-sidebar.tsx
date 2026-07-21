import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Plus, PanelLeftClose, MessageSquare } from "lucide-react"
import { ConversationSearch } from "./conversation-search"
import { ConversationItem } from "./conversation-item"
import type { Conversation } from "@/types/ai"

interface ConversationSidebarProps {
  conversations: Conversation[]
  activeConversationId: string | null
  searchQuery: string
  onSearch: (query: string) => void
  onSelect: (id: string) => void
  onNewChat: () => void
  onDelete: (id: string) => void
  onClose?: () => void
}

export function ConversationSidebar({
  conversations,
  activeConversationId,
  searchQuery,
  onSearch,
  onSelect,
  onNewChat,
  onDelete,
  onClose,
}: ConversationSidebarProps) {
  const filtered = searchQuery
    ? conversations.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.lastMessagePreview.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : conversations

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h2 className="text-sm font-semibold">Conversations</h2>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onNewChat} aria-label="New conversation">
            <Plus className="h-4 w-4" />
          </Button>
          {onClose && (
            <Button variant="ghost" size="icon" className="h-8 w-8 md:hidden" onClick={onClose} aria-label="Close sidebar">
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <ConversationSearch onSearch={onSearch} />

      <ScrollArea className="flex-1 px-2 pb-2">
        <div className="space-y-0.5">
          {filtered.length === 0 ? (
            <div className="px-3 py-8 text-center">
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "No conversations found" : "No conversations yet"}
              </p>
              {!searchQuery && (
                <Button variant="outline" size="sm" className="mt-3" onClick={onNewChat}>
                  <Plus className="mr-2 h-4 w-4" />
                  Start a chat
                </Button>
              )}
            </div>
          ) : (
            filtered.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={conversation.id === activeConversationId}
                onClick={() => onSelect(conversation.id)}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      </ScrollArea>

      <div className="border-t p-3">
        <Button variant="outline" size="sm" className="w-full" onClick={onNewChat}>
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>
    </div>
  )
}
