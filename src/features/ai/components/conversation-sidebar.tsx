import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Plus, PanelLeftClose, MessageSquare, Pin } from "lucide-react"
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
  onRename: (id: string) => void
  onTogglePin: (id: string) => void
  onClear: (id: string) => void
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
  onRename,
  onTogglePin,
  onClear,
  onDelete,
  onClose,
}: ConversationSidebarProps) {
  const filtered = searchQuery
    ? conversations.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.lastMessagePreview.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : conversations

  const sorted = [...filtered].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })

  const pinned = sorted.filter((c) => c.pinned)
  const unpinned = sorted.filter((c) => !c.pinned)

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

      <ScrollArea className="flex-1 px-2 pb-2" role="list" aria-label="Conversation list">
        <div className="space-y-0.5">
          {sorted.length === 0 ? (
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
            <>
              {pinned.length > 0 && (
                <div className="pb-1">
                  <div className="flex items-center gap-1 px-3 py-1.5" role="heading" aria-level={3}>
                    <Pin className="h-3 w-3 text-muted-foreground/60" />
                    <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60">
                      Pinned ({pinned.length})
                    </span>
                  </div>
                  {pinned.map((conversation) => (
                    <ConversationItem
                      key={conversation.id}
                      conversation={conversation}
                      isActive={conversation.id === activeConversationId}
                      onClick={() => onSelect(conversation.id)}
                      onRename={onRename}
                      onTogglePin={onTogglePin}
                      onClear={onClear}
                      onDelete={onDelete}
                    />
                  ))}
                </div>
              )}
              {unpinned.length > 0 && (
                <div>
                  {pinned.length > 0 && (
                    <div className="flex items-center gap-1 px-3 py-1.5" role="heading" aria-level={3}>
                      <MessageSquare className="h-3 w-3 text-muted-foreground/60" />
                      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60">
                        Recent
                      </span>
                    </div>
                  )}
                  {unpinned.map((conversation) => (
                    <ConversationItem
                      key={conversation.id}
                      conversation={conversation}
                      isActive={conversation.id === activeConversationId}
                      onClick={() => onSelect(conversation.id)}
                      onRename={onRename}
                      onTogglePin={onTogglePin}
                      onClear={onClear}
                      onDelete={onDelete}
                    />
                  ))}
                </div>
              )}
            </>
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
