import { useState, useEffect, useRef } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface ConversationSearchProps {
  onSearch: (query: string) => void
}

export function ConversationSearch({ onSearch }: ConversationSearchProps) {
  const [value, setValue] = useState("")
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => onSearch(value), 300)
    return () => clearTimeout(timerRef.current)
  }, [value, onSearch])

  return (
    <div className="relative px-3 pb-2">
      <Search className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search conversations..."
        className="pl-9 h-9 text-sm"
        aria-label="Search conversations"
      />
    </div>
  )
}
