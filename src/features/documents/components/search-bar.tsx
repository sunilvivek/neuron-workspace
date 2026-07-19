import { useState, useEffect, useRef } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  defaultValue?: string
}

export function SearchBar({ onSearch, placeholder = "Search documents...", defaultValue = "" }: SearchBarProps) {
  const [value, setValue] = useState(defaultValue)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => onSearch(value), 300)
    return () => clearTimeout(timerRef.current)
  }, [value, onSearch])

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-8"
        aria-label="Search"
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2"
          onClick={() => { setValue(""); onSearch("") }}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  )
}
