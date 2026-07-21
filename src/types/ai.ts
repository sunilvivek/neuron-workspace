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
}

export interface CreateConversationRequest {
  title: string
}

export interface SendMessageRequest {
  conversationId: string
  content: string
}
