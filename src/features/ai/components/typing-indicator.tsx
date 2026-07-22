export function TypingIndicator() {
  return (
    <div className="flex gap-3 px-4 py-5 bg-muted/30" role="status" aria-label="AI is typing">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
        <span className="text-xs font-bold">AI</span>
      </div>
      <div className="flex items-center gap-1 pt-2" aria-hidden="true">
        <span className="h-2 w-2 animate-bounce rounded-full bg-foreground/40" style={{ animationDelay: "0ms" }} />
        <span className="h-2 w-2 animate-bounce rounded-full bg-foreground/40" style={{ animationDelay: "150ms" }} />
        <span className="h-2 w-2 animate-bounce rounded-full bg-foreground/40" style={{ animationDelay: "300ms" }} />
      </div>
      <span className="sr-only">Neuron AI is generating a response</span>
    </div>
  )
}
