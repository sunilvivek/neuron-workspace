export type TemplateCategory = "productivity" | "development" | "personal" | "business"

export interface Template {
  id: string
  name: string
  description: string
  content: string
  category: TemplateCategory
  icon: string
}
