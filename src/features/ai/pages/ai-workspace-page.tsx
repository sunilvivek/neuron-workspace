import { useState, useRef, useEffect, useCallback } from "react"
import { ConversationSidebar } from "../components/conversation-sidebar"
import { ChatHeader } from "../components/chat-header"
import { MessageBubble } from "../components/message-bubble"
import { ChatComposer } from "../components/chat-composer"
import { EmptyChatState } from "../components/empty-chat-state"
import { PromptSuggestionCard } from "../components/prompt-suggestion-card"
import { ChatSkeleton } from "../components/chat-skeleton"
import {
  useGetConversationsQuery,
  useGetConversationMessagesQuery,
  useCreateConversationMutation,
  useSendMessageMutation,
  useDeleteConversationMutation,
} from "@/app/store/api"
import { AnimatedPage } from "@/components/animated-page"
import { ScrollArea } from "@/components/ui/scroll-area"

const SUGGESTED_PROMPTS = [
  "Explain this JavaScript code to me",
  "Summarize this document for a team meeting",
  "Generate meeting notes for a project kickoff",
  "Write a professional email to a client",
  "Create a project plan for a new feature launch",
  "Brainstorm ideas for improving team productivity",
]

export default function AIWorkspacePage() {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data: conversations = [], isLoading: convsLoading } = useGetConversationsQuery()
  const { data: messages = [], isLoading: msgsLoading } = useGetConversationMessagesQuery(
    activeConversationId || "",
    { skip: !activeConversationId }
  )
  const [createConversation] = useCreateConversationMutation()
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation()
  const [deleteConversation] = useDeleteConversationMutation()

  const activeConversation = conversations.find((c) => c.id === activeConversationId)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleNewChat = useCallback(async () => {
    const result = await createConversation({ title: "New conversation" })
    if (result.data) {
      setActiveConversationId(result.data.id)
      setSearchQuery("")
    }
  }, [createConversation])

  const handleSend = useCallback(async (content: string) => {
    if (!activeConversationId) {
      const result = await createConversation({ title: content.split(" ").slice(0, 5).join(" ") })
      if (result.data) {
        setActiveConversationId(result.data.id)
        await sendMessage({ conversationId: result.data.id, content })
      }
    } else {
      await sendMessage({ conversationId: activeConversationId, content })
    }
  }, [activeConversationId, createConversation, sendMessage])

  const handleDelete = useCallback(async (id: string) => {
    await deleteConversation(id)
    if (activeConversationId === id) {
      setActiveConversationId(null)
    }
  }, [activeConversationId, deleteConversation])

  const handleSelectConversation = useCallback((id: string) => {
    setActiveConversationId(id)
    setSidebarOpen(false)
  }, [])

  const handlePromptClick = useCallback((prompt: string) => {
    handleSend(prompt)
  }, [handleSend])

  const showEmpty = !activeConversationId && messages.length === 0
  const showSuggestions = showEmpty && !convsLoading
  const showMessages = activeConversationId && !msgsLoading

  return (
    <AnimatedPage>
      <div className="flex h-full">
        {/* Desktop sidebar */}
        <div className="hidden w-80 shrink-0 border-r md:block">
          <ConversationSidebar
            conversations={conversations}
            activeConversationId={activeConversationId}
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
            onSelect={handleSelectConversation}
            onNewChat={handleNewChat}
            onDelete={handleDelete}
          />
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-80 bg-background shadow-xl">
              <ConversationSidebar
                conversations={conversations}
                activeConversationId={activeConversationId}
                searchQuery={searchQuery}
                onSearch={setSearchQuery}
                onSelect={handleSelectConversation}
                onNewChat={handleNewChat}
                onDelete={handleDelete}
                onClose={() => setSidebarOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Main chat area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <ChatHeader
            conversationTitle={activeConversation?.title}
            messageCount={messages.length}
            onToggleSidebar={() => setSidebarOpen(true)}
          />

          <ScrollArea className="flex-1">
            <div className="mx-auto max-w-3xl">
              {showSuggestions && (
                <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] px-6">
                  <EmptyChatState />
                  <div className="mt-8 grid w-full max-w-2xl gap-3 sm:grid-cols-2">
                    {SUGGESTED_PROMPTS.map((prompt) => (
                      <PromptSuggestionCard
                        key={prompt}
                        prompt={prompt}
                        onClick={handlePromptClick}
                      />
                    ))}
                  </div>
                </div>
              )}
              {!showEmpty && showMessages && (
                <div className="py-4">
                  {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
              {!showEmpty && msgsLoading && <ChatSkeleton />}
              {!showSuggestions && !showMessages && !msgsLoading && (
                <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
                  <EmptyChatState />
                </div>
              )}
            </div>
          </ScrollArea>

          <ChatComposer onSend={handleSend} disabled={isSending} />
        </div>
      </div>
    </AnimatedPage>
  )
}
