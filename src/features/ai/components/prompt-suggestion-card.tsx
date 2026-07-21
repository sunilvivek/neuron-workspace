import { cn } from "@/lib/utils"
import { Sparkles } from "lucide-react"

interface PromptSuggestionCardProps {
  prompt: string
  onClick: (prompt: string) => void
}

export function PromptSuggestionCard({ prompt, onClick }: PromptSuggestionCardProps) {

  return (
    <button
      onClick={() => onClick(prompt)}
      className={cn(
        "group flex items-start gap-3 rounded-xl border p-4 text-left transition-all",
        "hover:border-primary/50 hover:bg-accent/50 hover:shadow-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      )}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
        <Sparkles className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{prompt}</p>
      </div>
    </button>
  )
}
