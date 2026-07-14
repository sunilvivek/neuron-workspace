import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

interface TestimonialCardProps {
  quote: string
  name: string
  role: string
  avatarUrl?: string
  initials: string
}

export function TestimonialCard({ quote, name, role, avatarUrl, initials }: TestimonialCardProps) {
  return (
    <Card className="border-0 bg-muted/50">
      <CardContent className="p-6">
        <Quote className="mb-4 h-8 w-8 text-muted-foreground/30" aria-hidden="true" />
        <blockquote className="text-sm leading-relaxed text-muted-foreground">
          &ldquo;{quote}&rdquo;
        </blockquote>
        <div className="mt-6 flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">{name}</p>
            <p className="text-xs text-muted-foreground">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
