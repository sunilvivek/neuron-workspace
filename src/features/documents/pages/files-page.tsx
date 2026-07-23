import { useState } from "react"
import { useParams, useNavigate } from "react-router"
import { AnimatedPage } from "@/components/animated-page"
import {
  useGetFilesQuery,
  useDeleteFileMutation,
  useRenameFileMutation,
  useMoveFileMutation,
  useToggleFileFavoriteMutation,
  useRestoreFileMutation,
} from "@/app/store/api"
import type { FileAttachment, FileFilter, FileSortField, FileSortDirection, FileType } from "@/types/folder"
import { Breadcrumb } from "../components/breadcrumb"
import { FileTable } from "../components/file-table"
import { FileCard } from "../components/file-card"
import { FileToolbar } from "../components/file-toolbar"
import { FileFilterPanel } from "../components/file-filter-panel"
import { FilePreview } from "../components/file-preview"
import { RenameDialog } from "../components/rename-dialog"
import { MoveDialog } from "../components/move-dialog"
import { UploadDialog } from "../components/upload-dialog"
import { TrashView } from "../components/trash-view"
import { EmptyState } from "../components/empty-state"
import { FolderTree } from "../components/folder-tree"
import { LoadingSkeleton } from "../components/loading-skeleton"
import { StorageWidget } from "../components/storage-widget"
import { useGetStorageDashboardQuery } from "@/app/store/api"
import { Button } from "@/components/ui/button"
import { Filter, FolderOpen, HardDrive, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

type FileView = "all" | "trash" | "storage"

export default function FilesPage() {
  const { folderId } = useParams()
  const navigate = useNavigate()
  const activeFolderId = folderId || null

  const [view, setView] = useState<FileView>("all")
  const [displayView, setDisplayView] = useState<"grid" | "list">("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<FileSortField>("uploadedAt")
  const [sortDirection, setSortDirection] = useState<FileSortDirection>("desc")
  const [selectedType, setSelectedType] = useState<FileType | null>(null)
  const [dateFrom, setDateFrom] = useState<string | null>(null)
  const [dateTo, setDateTo] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<FileFilter>("all")

  const [previewFile, setPreviewFile] = useState<FileAttachment | null>(null)
  const [renameTarget, setRenameTarget] = useState<FileAttachment | null>(null)
  const [moveTarget, setMoveTarget] = useState<FileAttachment | null>(null)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const { data: files, isLoading } = useGetFilesQuery({
    folderId: view === "trash" ? undefined : activeFolderId,
    search: searchQuery || undefined,
    filter: view === "trash" ? "trash" : activeFilter === "all" ? undefined : activeFilter,
    type: selectedType || undefined,
    sortField,
    sortDirection,
    dateFrom,
    dateTo,
  })

  const { data: storageData, isLoading: storageLoading } = useGetStorageDashboardQuery()

  const [deleteFile] = useDeleteFileMutation()
  const [renameFile] = useRenameFileMutation()
  const [moveFile] = useMoveFileMutation()
  const [toggleFavorite] = useToggleFileFavoriteMutation()
  const [restoreFile] = useRestoreFileMutation()

  const activeFiles = files || []
  const trashFiles = view === "trash" ? activeFiles : []
  const displayFiles = view === "trash" ? [] : activeFiles

  const sidebarViews: { id: FileView; label: string; icon: typeof FolderOpen }[] = [
    { id: "all", label: "All Files", icon: FolderOpen },
    { id: "trash", label: "Trash", icon: Trash2 },
    { id: "storage", label: "Storage", icon: HardDrive },
  ]

  return (
    <AnimatedPage>
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="hidden w-60 shrink-0 border-r p-4 md:flex md:flex-col md:gap-4">
          <nav className="space-y-1" aria-label="Files navigation">
            {sidebarViews.map((sv) => (
              <button
                key={sv.id}
                type="button"
                onClick={() => setView(sv.id)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  view === sv.id ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/50"
                )}
              >
                <sv.icon className="h-4 w-4" />
                <span>{sv.label}</span>
              </button>
            ))}
          </nav>
          {view !== "storage" && view !== "trash" && (
            <>
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Folders</span>
              </div>
              <FolderTree activeFolderId={activeFolderId} onSelectFolder={(id) => navigate(id ? `/app/files/folder/${id}` : "/app/files")} />
            </>
          )}
          {view === "storage" && (
            <StorageWidget data={storageData} isLoading={storageLoading} />
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto p-6">
          {view === "storage" ? (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">Storage Dashboard</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Monitor your storage usage and file distribution
                </p>
              </div>
              <div className="md:hidden mb-6">
                <StorageWidget data={storageData} isLoading={storageLoading} />
              </div>
              {storageData && (
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-xl border bg-card p-5">
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <HardDrive className="h-4 w-4 text-muted-foreground" />
                      Recent Uploads
                    </h3>
                    {storageData.recentUploads.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No recent uploads</p>
                    ) : (
                      <div className="space-y-2">
                        {storageData.recentUploads.map((f) => (
                          <div key={f.id} className="flex items-center gap-3 text-sm cursor-pointer hover:bg-accent/50 rounded-md px-2 py-1.5" onClick={() => setPreviewFile(f)}>
                            <FileCard
                              file={f}
                              onPreview={setPreviewFile}
                              onRename={setRenameTarget}
                              onDelete={(id) => deleteFile(id)}
                              onMove={setMoveTarget}
                              onFavorite={(id) => toggleFavorite(id)}

                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="rounded-xl border bg-card p-5">
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                      Largest Files
                    </h3>
                    {storageData.largestFiles.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No files</p>
                    ) : (
                      <div className="space-y-2">
                        {storageData.largestFiles.map((f) => (
                          <div key={f.id} className="flex items-center gap-3 text-sm cursor-pointer hover:bg-accent/50 rounded-md px-2 py-1.5" onClick={() => setPreviewFile(f)}>
                            <FileCard
                              file={f}
                              onPreview={setPreviewFile}
                              onRename={setRenameTarget}
                              onDelete={(id) => deleteFile(id)}
                              onMove={setMoveTarget}
                              onFavorite={(id) => toggleFavorite(id)}

                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : view === "trash" ? (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">Trash</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Files moved to trash are stored here until permanently deleted
                </p>
              </div>
              <TrashView
                files={trashFiles}
                isLoading={isLoading}
                onPreview={setPreviewFile}
                onRestore={(id) => restoreFile(id)}
                onDelete={(id) => deleteFile(id)}
              />
            </div>
          ) : (
            <div>
              <div className="mb-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <Breadcrumb
                      folderId={activeFolderId}
                      rootLabel="Files"
                      rootTo="/app/files"
                    />
                    <h1 className="mt-2 text-2xl font-bold tracking-tight">
                      {activeFolderId ? "" : "All Files"}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {activeFiles.length} file{activeFiles.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={activeFilter === "all" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setActiveFilter("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={activeFilter === "favorites" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setActiveFilter(activeFilter === "favorites" ? "all" : "favorites")}
                  >
                    Favorites
                  </Button>
                  <Button
                    variant={activeFilter === "recent" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setActiveFilter(activeFilter === "recent" ? "all" : "recent")}
                  >
                    Recently Modified
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn("h-7 text-xs gap-1", showFilters && "text-foreground")}
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="h-3 w-3" />
                    Filters
                  </Button>
                </div>

                {showFilters && (
                  <FileFilterPanel
                    selectedType={selectedType}
                    onTypeChange={setSelectedType}
                    dateFrom={dateFrom}
                    dateTo={dateTo}
                    onDateFromChange={setDateFrom}
                    onDateToChange={setDateTo}
                  />
                )}

                <FileToolbar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSortFieldChange={setSortField}
                  onSortDirectionToggle={() => setSortDirection(d => d === "asc" ? "desc" : "asc")}
                  view={displayView}
                  onViewChange={setDisplayView}
                  totalItems={displayFiles.length}
                  onUpload={() => setUploadOpen(true)}
                />
              </div>

              {isLoading ? (
                <LoadingSkeleton view={displayView} />
              ) : displayFiles.length === 0 ? (
                <EmptyState
                  icon={FolderOpen}
                  title="No files here"
                  description="Upload your first file to get started."
                  action={{ label: "Upload File", onClick: () => setUploadOpen(true) }}
                />
              ) : displayView === "grid" ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {displayFiles.map((file) => (
                    <FileCard
                      key={file.id}
                      file={file}
                      onPreview={setPreviewFile}
                      onRename={setRenameTarget}
                      onDelete={(id) => deleteFile(id)}
                      onMove={setMoveTarget}
                      onFavorite={(id) => toggleFavorite(id)}
                      />
                  ))}
                </div>
              ) : (
                <FileTable
                  files={displayFiles}
                  onPreview={setPreviewFile}
                  onRename={setRenameTarget}
                  onDelete={(id) => deleteFile(id)}
                  onMove={setMoveTarget}
                  onFavorite={(id) => toggleFavorite(id)}
                />
              )}
            </div>
          )}
        </div>
      </div>

      <FilePreview
        file={previewFile}
        open={!!previewFile}
        onOpenChange={(open) => { if (!open) setPreviewFile(null) }}
      />

      <RenameDialog
        open={!!renameTarget}
        onOpenChange={(open) => { if (!open) setRenameTarget(null) }}
        currentName={renameTarget?.name || ""}
        onRename={(name) => { if (renameTarget) renameFile({ id: renameTarget.id, name }); setRenameTarget(null) }}
      />

      <MoveDialog
        open={!!moveTarget}
        onOpenChange={(open) => { if (!open) setMoveTarget(null) }}
        onMove={(fid) => { if (moveTarget) moveFile({ id: moveTarget.id, folderId: fid }); setMoveTarget(null) }}
      />

      <UploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        folderId={activeFolderId}
      />
    </AnimatedPage>
  )
}
