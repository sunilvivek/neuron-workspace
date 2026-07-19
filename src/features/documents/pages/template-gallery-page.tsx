import { useState } from "react"
import { AnimatedPage } from "@/components/animated-page"
import { useGetTemplatesQuery, useCreateDocumentMutation } from "@/app/store/api"
import type { Template } from "@/types/template"
import { TemplateCard } from "../components/template-card"
import { SearchBar } from "../components/search-bar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function TemplateGalleryPage() {
  const { data: templates, isLoading } = useGetTemplatesQuery()
  const [createDocument] = useCreateDocumentMutation()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [docTitle, setDocTitle] = useState("")

  const filtered = templates?.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  async function handleCreate() {
    if (!selectedTemplate || !docTitle.trim()) return
    await createDocument({
      title: docTitle.trim(),
      content: selectedTemplate.content,
      templateId: selectedTemplate.id,
    })
    setSelectedTemplate(null)
    setDocTitle("")
  }

  return (
    <AnimatedPage>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Templates</h1>
          <p className="mt-1 text-muted-foreground">
            Start with a pre-built template to save time.
          </p>
        </div>

        <div className="mb-6 w-full max-w-sm">
          <SearchBar onSearch={setSearchQuery} placeholder="Search templates..." />
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 rounded-xl border bg-card animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered?.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onUse={(t) => { setSelectedTemplate(t); setDocTitle(`${t.name}`) }}
              />
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selectedTemplate} onOpenChange={(open) => { if (!open) { setSelectedTemplate(null); setDocTitle("") } }}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Create from Template</DialogTitle>
          </DialogHeader>
          <div className="py-2 space-y-2">
            <p className="text-sm text-muted-foreground">
              Using template: <strong>{selectedTemplate?.name}</strong>
            </p>
            <Label htmlFor="template-doc-title">Document Title</Label>
            <Input
              id="template-doc-title"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleCreate() }}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setSelectedTemplate(null); setDocTitle("") }}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!docTitle.trim()}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AnimatedPage>
  )
}
