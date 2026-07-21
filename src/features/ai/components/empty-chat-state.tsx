import { Sparkles } from "lucide-react"

export function EmptyChatState() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
        <Sparkles className="h-8 w-8 text-primary" />
      </div>
      <h1 className="mb-2 text-2xl font-bold tracking-tight">How can I help you today?</h1>
      <p className="max-w-md text-muted-foreground">
        I'm your AI workspace assistant. Ask me to explain code, summarize documents, or help plan your next project.
      </p>
    </div>
  )
}
