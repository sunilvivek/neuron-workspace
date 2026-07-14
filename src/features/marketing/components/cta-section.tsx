import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Link } from "react-router"

interface CTASectionProps {
  title: string
  description: string
  ctaText: string
  ctaHref?: string
  secondaryText?: string
  secondaryHref?: string
  className?: string
}

export function CTASection({
  title,
  description,
  ctaText,
  ctaHref = "/app",
  secondaryText,
  secondaryHref = "/features",
  className,
}: CTASectionProps) {
  return (
    <section className={cn("py-20", className)} aria-labelledby="cta-heading">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div className="rounded-2xl border bg-muted/50 px-6 py-16 sm:px-12">
          <h2 id="cta-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            {description}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link to={ctaHref}>{ctaText}</Link>
            </Button>
            {secondaryText && (
              <Button size="lg" variant="outline" asChild>
                <Link to={secondaryHref}>{secondaryText}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
