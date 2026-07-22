import { useState, useRef, useEffect, useCallback } from "react"
import { ConversationSidebar } from "../components/conversation-sidebar"
import { ChatHeader } from "../components/chat-header"
import { MessageBubble } from "../components/message-bubble"
import { ChatComposer } from "../components/chat-composer"
import { EmptyChatState } from "../components/empty-chat-state"
import { PromptSuggestionCard } from "../components/prompt-suggestion-card"
import { ChatSkeleton } from "../components/chat-skeleton"
import { TypingIndicator } from "../components/typing-indicator"
import { ErrorState } from "../components/error-state"
import { RenameDialog } from "../components/rename-dialog"
import { DragAndDropArea } from "../components/drag-and-drop-area"
import {
  useGetConversationsQuery,
  useGetConversationMessagesQuery,
  useCreateConversationMutation,
  useSendMessageMutation,
  useDeleteConversationMutation,
  useUpdateConversationMutation,
  useClearConversationMutation,
} from "@/app/store/api"
import { AnimatedPage } from "@/components/animated-page"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

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

  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [showTyping, setShowTyping] = useState(false)
  const streamCancelRef = useRef(false)

  const [renameTarget, setRenameTarget] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const { data: conversations = [], isLoading: convsLoading, isError: convsError } = useGetConversationsQuery()
  const {
    data: messages = [],
    isLoading: msgsLoading,
    isError: msgsError,
    refetch: refetchMessages,
  } = useGetConversationMessagesQuery(activeConversationId || "", { skip: !activeConversationId })

  const [createConversation] = useCreateConversationMutation()
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation()
  const [deleteConversation] = useDeleteConversationMutation()
  const [updateConversation] = useUpdateConversationMutation()
  const [clearConversation] = useClearConversationMutation()

  const activeConversation = conversations.find((c) => c.id === activeConversationId)
  const lastAiMessage = [...messages].reverse().find((m) => m.role === "assistant")

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, showTyping])

  const startStreaming = useCallback((messageId: string) => {
    setStreamingMessageId(messageId)
    setIsStreaming(true)
    streamCancelRef.current = false
  }, [])

  const handleStreamComplete = useCallback(() => {
    if (streamCancelRef.current) return
    setStreamingMessageId(null)
    setIsStreaming(false)
    setShowTyping(false)
  }, [])

  const handleStopStreaming = useCallback(() => {
    streamCancelRef.current = true
    setStreamingMessageId(null)
    setIsStreaming(false)
    setShowTyping(false)
  }, [])

  const handleNewChat = useCallback(async () => {
    try {
      const result = await createConversation({ title: "New conversation" }).unwrap()
      setActiveConversationId(result.id)
      setSearchQuery("")
      setError(null)
    } catch {
      toast.error("Failed to create conversation")
    }
  }, [createConversation])

  const handleSend = useCallback(async (content: string) => {
    setError(null)
    const sendToConv = activeConversationId

    try {
      let convId = sendToConv

      if (!convId) {
        const result = await createConversation({ title: content.split(" ").slice(0, 5).join(" ") }).unwrap()
        convId = result.id
        setActiveConversationId(convId)
      }

      setShowTyping(true)
      const result = await sendMessage({ conversationId: convId, content }).unwrap()
      setShowTyping(false)
      startStreaming(result.aiMessage.id)
    } catch {
      setShowTyping(false)
      setError("Failed to send message. Please try again.")
      toast.error("Failed to send message")
    }
  }, [activeConversationId, createConversation, sendMessage, startStreaming])

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteConversation(id).unwrap()
      toast.success("Conversation deleted")
      if (activeConversationId === id) {
        setActiveConversationId(null)
        setStreamingMessageId(null)
        setIsStreaming(false)
      }
    } catch {
      toast.error("Failed to delete conversation")
    }
  }, [activeConversationId, deleteConversation])

  const handleRename = useCallback(async (id: string) => {
    setRenameTarget(id)
  }, [])

  const handleRenameSubmit = useCallback(async (name: string) => {
    if (!renameTarget) return
    try {
      await updateConversation({ id: renameTarget, title: name }).unwrap()
      toast.success("Conversation renamed")
    } catch {
      toast.error("Failed to rename conversation")
    }
    setRenameTarget(null)
  }, [renameTarget, updateConversation])

  const handleTogglePin = useCallback(async (id: string) => {
    const conv = conversations.find((c) => c.id === id)
    if (!conv) return
    try {
      await updateConversation({ id, pinned: !conv.pinned }).unwrap()
      toast.success(conv.pinned ? "Conversation unpinned" : "Conversation pinned")
    } catch {
      toast.error("Failed to update conversation")
    }
  }, [conversations, updateConversation])

  const handleClearChat = useCallback(async (id: string) => {
    try {
      await clearConversation(id).unwrap()
      if (activeConversationId === id) {
        setStreamingMessageId(null)
        setIsStreaming(false)
      }
      toast.success("Chat cleared")
    } catch {
      toast.error("Failed to clear chat")
    }
  }, [activeConversationId, clearConversation])

  const handleSelectConversation = useCallback((id: string) => {
    setActiveConversationId(id)
    setSidebarOpen(false)
    setError(null)
    setStreamingMessageId(null)
    setIsStreaming(false)
  }, [])

  const handlePromptClick = useCallback((prompt: string) => {
    handleSend(prompt)
  }, [handleSend])

  const handleCopy = useCallback(async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      toast.success("Copied to clipboard")
    } catch {
      toast.error("Failed to copy")
    }
  }, [])

  const handleRetry = useCallback(async () => {
    if (messages.length < 2) return
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user")
    if (lastUserMsg) {
      setError(null)
      setShowTyping(true)
      try {
        const result = await sendMessage({ conversationId: activeConversationId!, content: lastUserMsg.content }).unwrap()
        setShowTyping(false)
        startStreaming(result.aiMessage.id)
      } catch {
        setShowTyping(false)
        toast.error("Failed to retry")
      }
    }
  }, [messages, activeConversationId, sendMessage, startStreaming])

  const handleRegenerate = useCallback(async () => {
    if (messages.length < 2) return
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user")
    if (lastUserMsg) {
      setShowTyping(true)
      try {
        const result = await sendMessage({ conversationId: activeConversationId!, content: lastUserMsg.content }).unwrap()
        setShowTyping(false)
        startStreaming(result.aiMessage.id)
        toast.success("Response regenerated")
      } catch {
        setShowTyping(false)
        toast.error("Failed to regenerate")
      }
    }
  }, [messages, activeConversationId, sendMessage, startStreaming])

  const handleAttach = useCallback((files: File[]) => {
    toast.success(`${files.length} file(s) attached (mock)`)
  }, [])

  const showEmpty = !activeConversationId && messages.length === 0
  const showSuggestions = showEmpty && !convsLoading
  const showMessages = activeConversationId && !msgsLoading && !msgsError
  const renameConv = renameTarget ? conversations.find((c) => c.id === renameTarget) : null

  async function handleChatHeaderRename() {
    if (activeConversationId) setRenameTarget(activeConversationId)
  }

  async function handleChatHeaderTogglePin() {
    if (activeConversationId) await handleTogglePin(activeConversationId)
  }

  async function handleChatHeaderClearChat() {
    if (activeConversationId) await handleClearChat(activeConversationId)
  }

  async function handleChatHeaderDelete() {
    if (activeConversationId) await handleDelete(activeConversationId)
  }

  return (
    <AnimatedPage>
      <div className="flex h-full">
        <div className="hidden w-80 shrink-0 border-r md:block">
          <ConversationSidebar
            conversations={conversations}
            activeConversationId={activeConversationId}
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
            onSelect={handleSelectConversation}
            onNewChat={handleNewChat}
            onRename={handleRename}
            onTogglePin={handleTogglePin}
            onClear={handleClearChat}
            onDelete={handleDelete}
          />
        </div>

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
                onRename={handleRename}
                onTogglePin={handleTogglePin}
                onClear={handleClearChat}
                onDelete={handleDelete}
                onClose={() => setSidebarOpen(false)}
              />
            </div>
          </div>
        )}

        <DragAndDropArea onAttach={handleAttach}>
          <div className="flex flex-1 flex-col overflow-hidden">
            <ChatHeader
              conversationTitle={activeConversation?.title}
              messageCount={messages.length}
              isPinned={activeConversation?.pinned}
              onToggleSidebar={() => setSidebarOpen(true)}
              onRename={handleChatHeaderRename}
              onTogglePin={handleChatHeaderTogglePin}
              onClearChat={handleChatHeaderClearChat}
              onDelete={handleChatHeaderDelete}
            />

            <ScrollArea className="flex-1" ref={messagesContainerRef}>
              <div className="mx-auto max-w-3xl">
                <AnimatePresence mode="wait">
                  {convsError && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <ErrorState
                        title="Failed to load conversations"
                        onRetry={() => refetchMessages()}
                      />
                    </motion.div>
                  )}

                  {showSuggestions && (
                    <motion.div
                      key="suggestions"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] px-6"
                    >
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
                    </motion.div>
                  )}

                  {msgsError && activeConversationId && (
                    <motion.div
                      key="msgs-error"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <ErrorState
                        title="Failed to load messages"
                        onRetry={refetchMessages}
                      />
                    </motion.div>
                  )}

                  {error && !msgsError && (
                    <motion.div
                      key="send-error"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ErrorState
                        title="Failed to send message"
                        message={error}
                        onRetry={handleRetry}
                      />
                    </motion.div>
                  )}

                  {!showEmpty && showMessages && !msgsError && (
                    <motion.div
                      key="messages"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="py-4"
                    >
                      {messages.map((message, index) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.5) }}
                        >
                          <MessageBubble
                            message={message}
                            isStreaming={
                              message.id === streamingMessageId &&
                              message.id === lastAiMessage?.id
                            }
                            onStreamComplete={handleStreamComplete}
                            onCopy={handleCopy}
                            onRetry={
                              message.role === "assistant" && index === messages.length - 1
                                ? handleRetry
                                : undefined
                            }
                            onRegenerate={
                              message.role === "assistant" && index === messages.length - 1 &&
                              !isStreaming
                                ? handleRegenerate
                                : undefined
                            }
                          />
                        </motion.div>
                      ))}
                      {showTyping && (
                        <motion.div
                          key="typing"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <TypingIndicator />
                        </motion.div>
                      )}
                      <div ref={messagesEndRef} />
                    </motion.div>
                  )}

                  {!showEmpty && msgsLoading && !msgsError && (
                    <motion.div
                      key="skeleton"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <ChatSkeleton />
                    </motion.div>
                  )}

                  {!showSuggestions && !showMessages && !msgsLoading && !msgsError && !error && (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center min-h-[calc(100vh-12rem)]"
                    >
                      <EmptyChatState />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollArea>

            <ChatComposer
              onSend={handleSend}
              onStop={handleStopStreaming}
              onAttach={handleAttach}
              disabled={isSending}
              isStreaming={isStreaming}
            />
          </div>
        </DragAndDropArea>
      </div>

      <RenameDialog
        open={!!renameTarget}
        onOpenChange={(open) => { if (!open) setRenameTarget(null) }}
        currentName={renameConv?.title || ""}
        onRename={handleRenameSubmit}
      />
    </AnimatedPage>
  )
}
