import { useState } from "react"
import { useParams } from "react-router"
import { AnimatedPage } from "@/components/animated-page"
import { useGetDocumentsQuery, useCreateDocumentMutation, useToggleFavoriteMutation, useToggleArchiveMutation, useToggleTrashMutation, useMoveDocumentMutation } from "@/app/store/api"
import type { Document, DocumentFilter } from "@/types/document"
import { DocumentSidebar } from "../components/document-sidebar"
import { DocumentList } from "../components/document-list"
import { DocumentEditor } from "../components/document-editor"
import { SearchBar } from "../components/search-bar"
import { Breadcrumb } from "../components/breadcrumb"
import { MoveDialog } from "../components/move-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function DocumentsPage() {
  const { folderId } = useParams()
  const [activeFilter, setActiveFilter] = useState<DocumentFilter>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFolderId, setActiveFolderId] = useState<string | null>(folderId || null)
  const [editingDoc, setEditingDoc] = useState<Document | null>(null)
  const [moveDoc, setMoveDoc] = useState<Document | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [newTitle, setNewTitle] = useState("")

  const { data: documents, isLoading } = useGetDocumentsQuery({
    folderId: activeFolderId,
    search: searchQuery || undefined,
    filter: activeFilter,
  })

  const [createDocument] = useCreateDocumentMutation()
  const [toggleFavorite] = useToggleFavoriteMutation()
  const [toggleArchive] = useToggleArchiveMutation()
  const [toggleTrash] = useToggleTrashMutation()
  const [moveDocument] = useMoveDocumentMutation()

  if (editingDoc) {
    return (
      <DocumentEditor
        documentId={editingDoc.id}
        onClose={() => setEditingDoc(null)}
      />
    )
  }

  async function handleCreate() {
    if (!newTitle.trim()) return
    await createDocument({ title: newTitle.trim(), content: "<p></p>", folderId: activeFolderId })
    setNewTitle("")
    setCreateOpen(false)
  }

  return (
    <AnimatedPage>
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="hidden w-60 shrink-0 border-r p-4 md:block">
          <DocumentSidebar
            activeFilter={activeFilter}
            activeFolderId={activeFolderId}
            onFilterChange={setActiveFilter}
            onFolderChange={setActiveFolderId}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="mb-6 flex items-start justify-between">
            <div>
              {activeFolderId ? (
                <Breadcrumb folderId={activeFolderId} />
              ) : (
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    {activeFilter === "favorites" ? "Favorites" :
                     activeFilter === "archived" ? "Archived" :
                     activeFilter === "trash" ? "Trash" :
                     activeFilter === "recent" ? "Recent" : "Documents"}
                  </h1>
                  <p className="mt-1 text-muted-foreground">
                    {documents?.length || 0} document{(documents?.length || 0) !== 1 ? "s" : ""}
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="w-64">
                <SearchBar onSearch={setSearchQuery} placeholder="Search documents..." />
              </div>
              <Button onClick={() => setCreateOpen(true)} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                New
              </Button>
            </div>
          </div>

          <DocumentList
            documents={documents || []}
            isLoading={isLoading}
            onEdit={setEditingDoc}
            onFavorite={(id) => toggleFavorite(id)}
            onArchive={(id) => toggleArchive(id)}
            onTrash={(id) => toggleTrash(id)}
            onMove={setMoveDoc}
            onCreate={() => setCreateOpen(true)}
          />
        </div>
      </div>

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>New Document</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <Label htmlFor="doc-title">Title</Label>
            <Input
              id="doc-title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleCreate() }}
              placeholder="Untitled document"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!newTitle.trim()}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Move dialog */}
      <MoveDialog
        open={!!moveDoc}
        onOpenChange={(open) => { if (!open) setMoveDoc(null) }}
        onMove={(folderId) => { if (moveDoc) moveDocument({ id: moveDoc.id, folderId }); setMoveDoc(null) }}
      />
    </AnimatedPage>
  )
}
