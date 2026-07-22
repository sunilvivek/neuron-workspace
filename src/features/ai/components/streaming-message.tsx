import { useEffect, useRef, useState } from "react"
import { MarkdownRenderer } from "./markdown-renderer"

interface StreamingMessageProps {
  content: string
  onComplete: () => void
}

const CHARS_PER_TICK = 4
const TICK_MS = 40

export function StreamingMessage({ content, onComplete }: StreamingMessageProps) {
  const [revealed, setRevealed] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setRevealed((prev) => {
        const next = prev + CHARS_PER_TICK
        if (next >= content.length) {
          clearInterval(intervalRef.current)
          return content.length
        }
        return next
      })
    }, TICK_MS)

    return () => clearInterval(intervalRef.current)
  }, [content])

  useEffect(() => {
    if (revealed >= content.length) {
      onComplete()
    }
  }, [revealed, content.length, onComplete])

  const partialContent = content.slice(0, revealed)
  const isComplete = revealed >= content.length

  return (
    <div className="text-sm leading-7">
      <MarkdownRenderer content={partialContent} />
      {!isComplete && (
        <span className="inline-block h-4 w-2 animate-pulse bg-foreground/60 ml-0.5 align-text-bottom" aria-hidden="true" />
      )}
    </div>
  )
}
