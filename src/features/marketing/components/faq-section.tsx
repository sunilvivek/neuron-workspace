import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface FAQItem {
  question: string
  answer: string
}

interface FAQSectionProps {
  items: FAQItem[]
  title?: string
  description?: string
}

function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="divide-y rounded-lg border" role="list">
      {items.map((item, i) => (
        <div key={i} className="px-6 py-4">
          <button
            type="button"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 text-left text-sm font-medium"
            aria-expanded={openIndex === i}
          >
            <span>{item.question}</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                openIndex === i && "rotate-180"
              )}
              aria-hidden="true"
            />
          </button>
          {openIndex === i && (
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {item.answer}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

export function FAQSection({ items, title = "Frequently Asked Questions", description }: FAQSectionProps) {
  return (
    <section className="py-20" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 id="faq-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h2>
          {description && (
            <p className="mt-4 text-lg text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="mt-12">
          <FAQAccordion items={items} />
        </div>
      </div>
    </section>
  )
}
