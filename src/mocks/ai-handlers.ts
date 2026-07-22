import { http, HttpResponse } from "msw"
import type { Conversation, Message } from "@/types/ai"

const mockAiResponse = (userMessage: string): string => {
  const greetings = ["hello", "hi", "hey", "greetings"]
  const isGreeting = greetings.some((g) => userMessage.toLowerCase().includes(g))

  if (isGreeting) {
    return `Hello! I'm Neuron AI, your intelligent workspace assistant. I can help you with a wide range of tasks:

**Here's what I can do for you:**

- Explain complex code and technical concepts
- Summarize documents and meeting notes
- Generate meeting agendas and project plans
- Write and refine emails
- Brainstorm creative ideas
- Answer questions about best practices

> *"The best way to predict the future is to create it."* — Peter Drucker

**Try asking me something like:**
1. "Explain this JavaScript function to me"
2. "Help me write a project proposal"
3. "What are the best practices for React components?"

I'm here to help you work smarter and faster!`
  }

  if (userMessage.toLowerCase().includes("code") || userMessage.toLowerCase().includes("explain")) {
    return `Here's an explanation of the concept you're asking about:

## Understanding the Pattern

This is a common pattern in modern web development. Let me break it down:

### Key Concepts

1. **Asynchronous Operations** — The function uses async/await to handle promises
2. **Error Handling** — A try/catch block wraps the operation
3. **Data Transformation** — The response is mapped to a cleaner structure

### Example Implementation

\`\`\`typescript
async function fetchUserData(userId: string): Promise<UserData> {
  try {
    const response = await fetch(\`/api/users/\${userId}\`)
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`)
    }
    const data = await response.json()
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
    }
  } catch (error) {
    console.error("Failed to fetch user:", error)
    throw error
  }
}
\`\`\`

### Best Practices

| Practice | Why It Matters |
|----------|---------------|
| Type safety | Catch errors at compile time |
| Error boundaries | Graceful failure handling |
| Loading states | Better user experience |
| Data validation | Prevent runtime errors |

### Summary

This pattern ensures your application handles data fetching reliably while maintaining a clean separation of concerns.

\`\`\`bash
# Run the type checker
npm run typecheck

# Run the linter
npm run lint
\`\`\`

Let me know if you'd like me to elaborate on any part of this explanation!`
  }

  if (userMessage.toLowerCase().includes("meeting") || userMessage.toLowerCase().includes("summarize")) {
    return `## Summary

Based on the content provided, here's a comprehensive summary:

### Key Points

- The discussion centered around **Q3 product roadmap** priorities
- Three main initiatives were identified
- Timeline was adjusted to accommodate resource constraints

### Action Items

| Task | Owner | Deadline |
|------|-------|----------|
| Finalize design specs | Design Team | This Friday |
| Complete API integration | Engineering | Next Tuesday |
| User testing preparation | Product | Next Friday |

### Decisions Made

1. **Tech Stack** will remain React + TypeScript for the frontend
2. **Launch date** moved to October 15th
3. **Beta testing** will include 50 external users

### Next Steps

> *"The next meeting will focus on reviewing the prototype."*

I can generate a full meeting agenda or help you prepare for the follow-up session. Would you like me to do that?`
  }

  return `Here's my response to your query:

## Analysis

I've processed your request and here's what I recommend:

### Key Insights

1. **Approach** — Start with a clear problem definition
2. **Strategy** — Break down complex tasks into manageable steps
3. **Execution** — Use iterative development with regular feedback

### Recommended Actions

- Review existing documentation first
- Create a structured plan with milestones
- Set up regular check-ins with stakeholders

### Resources

Here's a useful reference:

\`\`\`javascript
const workflow = {
  phase: "planning",
  steps: ["research", "design", "implement", "test", "deploy"],
  status: "in_progress",
}
\`\`\`

---

*I'm continuously learning to provide better assistance. Is there anything specific you'd like me to elaborate on?*`
}

let conversations: Conversation[] = [
  {
    id: "conv-1",
    title: "Explain this code",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    messageCount: 6,
    lastMessagePreview: "That makes sense now, thanks for the detailed explanation!",
    pinned: true,
  },
  {
    id: "conv-2",
    title: "Summarize meeting notes",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    messageCount: 4,
    lastMessagePreview: "Here's a summary of the key points from the meeting...",
    pinned: false,
  },
  {
    id: "conv-3",
    title: "Project planning ideas",
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    messageCount: 8,
    lastMessagePreview: "Let me outline a comprehensive project plan for you.",
    pinned: false,
  },
]

const messages: Record<string, Message[]> = {
  "conv-1": [
    {
      id: "msg-1-1",
      conversationId: "conv-1",
      role: "user",
      content: "Can you explain how async/await works in JavaScript?",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "msg-1-2",
      conversationId: "conv-1",
      role: "assistant",
      content: mockAiResponse("Can you explain how async/await works in JavaScript?"),
      createdAt: new Date(Date.now() - 86300000).toISOString(),
    },
    {
      id: "msg-1-3",
      conversationId: "conv-1",
      role: "user",
      content: "Can you show me an example with error handling?",
      createdAt: new Date(Date.now() - 80000000).toISOString(),
    },
    {
      id: "msg-1-4",
      conversationId: "conv-1",
      role: "assistant",
      content: "Sure! Here's an example with try/catch error handling:\n\n```typescript\nasync function fetchData(url: string) {\n  try {\n    const response = await fetch(url)\n    if (!response.ok) {\n      throw new Error(`Request failed: ${response.statusText}`)\n    }\n    return await response.json()\n  } catch (error) {\n    console.error('Fetch error:', error)\n    throw error\n  }\n}\n```\n\nThis pattern ensures errors are caught and logged appropriately.",
      createdAt: new Date(Date.now() - 79000000).toISOString(),
    },
    {
      id: "msg-1-5",
      conversationId: "conv-1",
      role: "user",
      content: "That makes sense now, thanks for the detailed explanation!",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "msg-1-6",
      conversationId: "conv-1",
      role: "assistant",
      content: "You're welcome! Feel free to ask if you have any more questions about asynchronous JavaScript patterns.",
      createdAt: new Date(Date.now() - 3500000).toISOString(),
    },
  ],
  "conv-2": [
    {
      id: "msg-2-1",
      conversationId: "conv-2",
      role: "user",
      content: "Can you summarize the Q3 planning meeting notes?",
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: "msg-2-2",
      conversationId: "conv-2",
      role: "assistant",
      content: mockAiResponse("Can you summarize the Q3 planning meeting notes?"),
      createdAt: new Date(Date.now() - 2 * 86400000 + 3600000).toISOString(),
    },
  ],
  "conv-3": [
    {
      id: "msg-3-1",
      conversationId: "conv-3",
      role: "user",
      content: "I need help planning a new project. Where should I start?",
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    },
    {
      id: "msg-3-2",
      conversationId: "conv-3",
      role: "assistant",
      content: mockAiResponse("project planning"),
      createdAt: new Date(Date.now() - 7 * 86400000 + 3600000).toISOString(),
    },
  ],
}

export const aiHandlers = [
  http.get("/api/ai/conversations", () => {
    return HttpResponse.json(conversations)
  }),

  http.get("/api/ai/conversations/:conversationId/messages", ({ params }) => {
    const conversationMessages = messages[params.conversationId as string] || []
    return HttpResponse.json(conversationMessages)
  }),

  http.post("/api/ai/conversations", async ({ request }) => {
    const body = (await request.json()) as { title: string }
    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      title: body.title || "New conversation",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messageCount: 0,
      lastMessagePreview: "",
      pinned: false,
    }
    messages[newConversation.id] = []
    conversations = [newConversation, ...conversations]
    return HttpResponse.json(newConversation, { status: 201 })
  }),

  http.put("/api/ai/conversations/:conversationId", async ({ params, request }) => {
    const body = (await request.json()) as { title?: string; pinned?: boolean }
    const idx = conversations.findIndex((c) => c.id === params.conversationId)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    conversations[idx] = {
      ...conversations[idx],
      ...body,
      updatedAt: new Date().toISOString(),
    }
    return HttpResponse.json(conversations[idx])
  }),

  http.post("/api/ai/conversations/:conversationId/messages", async ({ params, request }) => {
    const body = (await request.json()) as { content: string }
    const conversationId = params.conversationId as string

    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      conversationId,
      role: "user",
      content: body.content,
      createdAt: new Date().toISOString(),
    }

    if (!messages[conversationId]) {
      messages[conversationId] = []
    }
    messages[conversationId].push(userMessage)

    const aiContent = mockAiResponse(body.content)
    const aiMessage: Message = {
      id: `msg-${Date.now()}-ai`,
      conversationId,
      role: "assistant",
      content: aiContent,
      createdAt: new Date(Date.now() + 100).toISOString(),
    }
    messages[conversationId].push(aiMessage)

    const convIdx = conversations.findIndex((c) => c.id === conversationId)
    if (convIdx !== -1) {
      conversations[convIdx] = {
        ...conversations[convIdx],
        messageCount: messages[conversationId].length,
        lastMessagePreview: body.content.length > 60 ? body.content.slice(0, 60) + "..." : body.content,
        updatedAt: new Date().toISOString(),
      }
      if (conversations[convIdx].title === "New conversation") {
        const titleWords = body.content.split(" ").slice(0, 5).join(" ")
        conversations[convIdx].title = titleWords.length > 40 ? titleWords.slice(0, 40) + "..." : titleWords
      }
    }

    return HttpResponse.json({ userMessage, aiMessage }, { status: 201 })
  }),

  http.post("/api/ai/conversations/:conversationId/clear", ({ params }) => {
    const conversationId = params.conversationId as string
    if (messages[conversationId]) {
      messages[conversationId] = []
    }
    const idx = conversations.findIndex((c) => c.id === conversationId)
    if (idx !== -1) {
      conversations[idx] = {
        ...conversations[idx],
        messageCount: 0,
        lastMessagePreview: "",
        updatedAt: new Date().toISOString(),
      }
    }
    return HttpResponse.json({ success: true })
  }),

  http.delete("/api/ai/conversations/:conversationId", ({ params }) => {
    const conversationId = params.conversationId as string
    conversations = conversations.filter((c) => c.id !== conversationId)
    delete messages[conversationId]
    return HttpResponse.json({ success: true })
  }),
]
