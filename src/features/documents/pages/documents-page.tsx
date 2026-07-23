import { useState } from "react"
import { useParams, useNavigate } from "react-router"
import { AnimatedPage } from "@/components/animated-page"
import {
  useGetDocumentsQuery,
  useGetRecentDocumentsQuery,
  useGetDocumentTagsQuery,
  useCreateDocumentMutation,
  useToggleFavoriteMutation,
  useTogglePinMutation,
  useToggleArchiveMutation,
  useToggleTrashMutation,
  useDuplicateDocumentMutation,
  useMoveDocumentMutation,
} from "@/app/store/api"
import type { Document, DocumentFilter, DocumentSortField, DocumentSortDirection, DocumentType } from "@/types/document"
import { DocumentSidebar } from "../components/document-sidebar"
import { DocumentCard } from "../components/document-card"
import { DocumentToolbar } from "../components/document-toolbar"
import { FilterPanel } from "../components/filter-panel"
import { RecentDocuments } from "../components/recent-documents"
import { LoadingSkeleton } from "../components/loading-skeleton"
import { EmptyState } from "../components/empty-state"
import { Breadcrumb } from "../components/breadcrumb"
import { MoveDialog } from "../components/move-dialog"
import { Button } from "@/components/ui/button"
import { Plus, FileText } from "lucide-react"
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
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState<DocumentFilter>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFolderId, setActiveFolderId] = useState<string | null>(folderId || null)
  const [selectedType, setSelectedType] = useState<DocumentType | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [sortField, setSortField] = useState<DocumentSortField>("updatedAt")
  const [sortDirection, setSortDirection] = useState<DocumentSortDirection>("desc")
  const [view, setView] = useState<"grid" | "list">("grid")
  const [moveDoc, setMoveDoc] = useState<Document | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [newTitle, setNewTitle] = useState("")

  const { data: paginated, isLoading } = useGetDocumentsQuery({
    folderId: activeFolderId,
    search: searchQuery || undefined,
    filter: activeFilter,
    type: selectedType,
    tag: selectedTag,
    sortField,
    sortDirection,
  })

  const { data: recentDocuments, isLoading: recentLoading } = useGetRecentDocumentsQuery()
  const { data: availableTags = [] } = useGetDocumentTagsQuery()
  const documents = paginated?.items || []

  const [createDocument] = useCreateDocumentMutation()
  const [toggleFavorite] = useToggleFavoriteMutation()
  const [togglePin] = useTogglePinMutation()
  const [toggleArchive] = useToggleArchiveMutation()
  const [toggleTrash] = useToggleTrashMutation()
  const [duplicateDocument] = useDuplicateDocumentMutation()
  const [moveDocument] = useMoveDocumentMutation()

  async function handleCreate() {
    if (!newTitle.trim()) return
    const doc = await createDocument({
      title: newTitle.trim(),
      content: "<p></p>",
      folderId: activeFolderId,
    }).unwrap()
    setNewTitle("")
    setCreateOpen(false)
    navigate(`/app/documents/${doc.id}`)
  }

  return (
    <AnimatedPage>
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="hidden w-60 shrink-0 border-r p-4 md:flex md:flex-col md:gap-6">
          <DocumentSidebar
            activeFilter={activeFilter}
            activeFolderId={activeFolderId}
            onFilterChange={setActiveFilter}
            onFolderChange={setActiveFolderId}
          />
          <RecentDocuments
            documents={recentDocuments || []}
            isLoading={recentLoading}
            onSelect={(doc) => navigate(`/app/documents/${doc.id}`)}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="mb-6 space-y-4">
            <div className="flex items-start justify-between">
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
                    <p className="mt-1 text-sm text-muted-foreground">
                      {paginated?.total || 0} document{(paginated?.total || 0) !== 1 ? "s" : ""}
                    </p>
                  </div>
                )}
              </div>
              <Button onClick={() => setCreateOpen(true)} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                New Document
              </Button>
            </div>
            <FilterPanel
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              selectedTag={selectedTag}
              onTagChange={setSelectedTag}
              availableTags={availableTags}
            />
            <DocumentToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortField={sortField}
              sortDirection={sortDirection}
              onSortFieldChange={setSortField}
              onSortDirectionToggle={() => setSortDirection(d => d === "asc" ? "desc" : "asc")}
              view={view}
              onViewChange={setView}
              totalItems={paginated?.total || 0}
            />
          </div>

          {isLoading ? (
            <LoadingSkeleton view={view} />
          ) : documents.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No documents found"
              description="Create your first document to get started."
              action={{ label: "New Document", onClick: () => setCreateOpen(true) }}
            />
          ) : view === "grid" ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {documents.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  onEdit={(d) => navigate(`/app/documents/${d.id}`)}
                  onFavorite={(id) => toggleFavorite(id)}
                  onArchive={(id) => toggleArchive(id)}
                  onTrash={(id) => toggleTrash(id)}
                  onMove={setMoveDoc}
                  onDuplicate={(id) => duplicateDocument(id)}
                  onPin={(id) => togglePin(id)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {documents.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  onEdit={(d) => navigate(`/app/documents/${d.id}`)}
                  onFavorite={(id) => toggleFavorite(id)}
                  onArchive={(id) => toggleArchive(id)}
                  onTrash={(id) => toggleTrash(id)}
                  onMove={setMoveDoc}
                  onDuplicate={(id) => duplicateDocument(id)}
                  onPin={(id) => togglePin(id)}
                />
              ))}
            </div>
          )}
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
        onMove={(fid) => { if (moveDoc) moveDocument({ id: moveDoc.id, folderId: fid }); setMoveDoc(null) }}
      />
    </AnimatedPage>
  )
}
