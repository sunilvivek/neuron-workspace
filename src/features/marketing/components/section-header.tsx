import { cn } from "@/lib/utils"
import { Badge } from "./badge"

interface SectionHeaderProps {
  badge?: string
  title: string
  description: string
  className?: string
  align?: "center" | "left"
}

export function SectionHeader({ badge, title, description, className, align = "center" }: SectionHeaderProps) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {badge && (
        <Badge variant="secondary" className="mb-4">
          {badge}
        </Badge>
      )}
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-lg text-muted-foreground">
        {description}
      </p>
    </div>
  )
}
