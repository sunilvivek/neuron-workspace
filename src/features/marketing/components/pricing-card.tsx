import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "./badge"

interface PricingCardProps {
  name: string
  monthlyPrice: number
  annualPrice: number
  description: string
  features: string[]
  cta: string
  highlighted?: boolean
  badge?: string
  annual?: boolean
}

export function PricingCard({
  name,
  monthlyPrice,
  annualPrice,
  description,
  features,
  cta,
  highlighted = false,
  badge,
  annual = false,
}: PricingCardProps) {
  const price = annual ? annualPrice : monthlyPrice

  return (
    <Card
      className={cn(
        "relative flex flex-col",
        highlighted && "border-primary shadow-lg shadow-primary/10"
      )}
    >
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge>{badge}</Badge>
        </div>
      )}
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{name}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="mb-6">
          <span className="text-4xl font-bold">${price}</span>
          {price > 0 && (
            <span className="text-sm text-muted-foreground">/{annual ? "yr" : "mo"}</span>
          )}
        </div>
        <ul className="space-y-3" role="list">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant={highlighted ? "default" : "outline"}
          asChild
        >
          <a href="/app">{cta}</a>
        </Button>
      </CardFooter>
    </Card>
  )
}

export function PricingToggle({
  annual,
  onChange,
}: {
  annual: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center gap-3">
      <span className={cn("text-sm", !annual && "font-semibold")}>Monthly</span>
      <button
        type="button"
        role="switch"
        aria-checked={annual}
        onClick={() => onChange(!annual)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          annual ? "bg-primary" : "bg-muted"
        )}
      >
        <span
          className={cn(
            "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
            annual ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
      <span className={cn("text-sm", annual && "font-semibold")}>
        Annual
        <Badge variant="secondary" className="ml-2">Save 20%</Badge>
      </span>
    </div>
  )
}
