export type MessageRole = "user" | "assistant"

export interface Message {
  id: string
  conversationId: string
  role: MessageRole
  content: string
  createdAt: string
}

export interface Conversation {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  messageCount: number
  lastMessagePreview: string
  pinned: boolean
}

export interface CreateConversationRequest {
  title: string
}

export interface UpdateConversationRequest {
  id: string
  title?: string
  pinned?: boolean
}

export interface SendMessageRequest {
  conversationId: string
  content: string
}
