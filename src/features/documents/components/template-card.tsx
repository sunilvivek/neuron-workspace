import type { Template } from "@/types/template"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  FolderOpen,
  BookOpen,
  FileText,
  Lightbulb,
  CheckSquare,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  Users, FolderOpen, BookOpen, FileText, Lightbulb, CheckSquare,
}

const categoryColors: Record<string, string> = {
  business: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  development: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  personal: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  productivity: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
}

interface TemplateCardProps {
  template: Template
  onUse: (template: Template) => void
}

export function TemplateCard({ template, onUse }: TemplateCardProps) {
  const Icon = iconMap[template.icon] || FileText

  return (
    <Card className="group cursor-pointer transition-shadow hover:shadow-md" onClick={() => onUse(template)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <Icon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          </div>
          <Badge className={categoryColors[template.category]} variant="secondary">
            {template.category}
          </Badge>
        </div>
        <CardTitle className="text-sm font-medium mt-3">{template.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{template.description}</p>
        <Button variant="outline" size="sm" className="w-full">
          Use Template
        </Button>
      </CardContent>
    </Card>
  )
}
