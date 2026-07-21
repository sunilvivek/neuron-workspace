import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface CodeBlockProps {
  className?: string
  children?: string
}

export function CodeBlock({ className, children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const match = /language-(\w+)/.exec(className || "")
  const language = match ? match[1] : ""
  const code = String(children || "").replace(/\n$/, "")

  async function handleCopy() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group relative my-3 rounded-lg border">
      {language && (
        <div className="flex items-center justify-between rounded-t-lg border-b bg-muted/50 px-4 py-1.5">
          <span className="text-xs font-medium text-muted-foreground">{language}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleCopy}
            aria-label={copied ? "Copied" : "Copy code"}
          >
            {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>
        </div>
      )}
      <SyntaxHighlighter
        style={oneDark}
        language={language || "text"}
        PreTag="div"
        customStyle={{ margin: 0, borderRadius: language ? "0 0 0.5rem 0.5rem" : "0.5rem", fontSize: "0.875rem" }}
        showLineNumbers={false}
        wrapLines
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}
