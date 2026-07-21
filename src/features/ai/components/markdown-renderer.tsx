import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { CodeBlock } from "./code-block"
import type { Components } from "react-markdown"

const components: Partial<Components> = {
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "")
    if (match) {
      return <CodeBlock className={className} children={String(children)} />
    }
    return (
      <code
        className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground"
        {...props}
      >
        {children}
      </code>
    )
  },
  pre({ children }) {
    return <>{children}</>
  },
  h1({ children }) {
    return <h1 className="mb-3 mt-5 text-xl font-bold text-foreground first:mt-0">{children}</h1>
  },
  h2({ children }) {
    return <h2 className="mb-2 mt-4 text-lg font-semibold text-foreground">{children}</h2>
  },
  h3({ children }) {
    return <h3 className="mb-1.5 mt-3 text-base font-semibold text-foreground">{children}</h3>
  },
  p({ children }) {
    return <p className="mb-3 leading-7 text-foreground last:mb-0">{children}</p>
  },
  ul({ children }) {
    return <ul className="mb-3 list-disc pl-6 space-y-1">{children}</ul>
  },
  ol({ children }) {
    return <ol className="mb-3 list-decimal pl-6 space-y-1">{children}</ol>
  },
  li({ children }) {
    return <li className="leading-7 text-foreground">{children}</li>
  },
  blockquote({ children }) {
    return (
      <blockquote className="mb-3 border-l-4 border-primary/30 pl-4 italic text-muted-foreground">
        {children}
      </blockquote>
    )
  },
  a({ href, children }) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
      >
        {children}
      </a>
    )
  },
  table({ children }) {
    return (
      <div className="mb-3 overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">{children}</table>
      </div>
    )
  },
  thead({ children }) {
    return <thead className="border-b bg-muted/50">{children}</thead>
  },
  tbody({ children }) {
    return <tbody>{children}</tbody>
  },
  tr({ children }) {
    return <tr className="border-b last:border-0 even:bg-muted/20">{children}</tr>
  },
  th({ children }) {
    return <th className="px-4 py-2.5 text-left font-medium text-foreground">{children}</th>
  },
  td({ children }) {
    return <td className="px-4 py-2.5 text-muted-foreground">{children}</td>
  },
  hr() {
    return <hr className="my-4 border-t" />
  },
}

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose-custom">
      <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
