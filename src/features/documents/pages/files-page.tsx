import { useState } from "react"
import { useParams } from "react-router"
import { AnimatedPage } from "@/components/animated-page"
import { useGetFilesQuery, useDeleteFileMutation, useRenameFileMutation, useMoveFileMutation } from "@/app/store/api"
import type { FileAttachment } from "@/types/folder"
import { Breadcrumb } from "../components/breadcrumb"
import { FileTable } from "../components/file-table"
import { FilePreview } from "../components/file-preview"
import { RenameDialog } from "../components/rename-dialog"
import { MoveDialog } from "../components/move-dialog"
import { UploadDialog } from "../components/upload-dialog"
import { EmptyState } from "../components/empty-state"
import { FolderTree } from "../components/folder-tree"
import { Button } from "@/components/ui/button"
import { Upload, FolderOpen } from "lucide-react"

export default function FilesPage() {
  const { folderId } = useParams()
  const activeFolderId = folderId || null

  const { data: files, isLoading } = useGetFilesQuery({ folderId: activeFolderId })
  const [deleteFile] = useDeleteFileMutation()
  const [renameFile] = useRenameFileMutation()
  const [moveFile] = useMoveFileMutation()

  const [previewFile, setPreviewFile] = useState<FileAttachment | null>(null)
  const [renameTarget, setRenameTarget] = useState<FileAttachment | null>(null)
  const [moveTarget, setMoveTarget] = useState<FileAttachment | null>(null)
  const [uploadOpen, setUploadOpen] = useState(false)

  return (
    <AnimatedPage>
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="hidden w-60 shrink-0 border-r p-4 md:block">
          <FolderTree activeFolderId={activeFolderId} onSelectFolder={() => {}} />
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <Breadcrumb
                folderId={activeFolderId}
                rootLabel="Files"
                rootTo="/app/files"
              />
              <h1 className="mt-2 text-2xl font-bold tracking-tight">Files</h1>
              <p className="mt-1 text-muted-foreground">
                {files?.length || 0} file{(files?.length || 0) !== 1 ? "s" : ""}
              </p>
            </div>
            <Button onClick={() => setUploadOpen(true)} size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 rounded-lg border bg-card animate-pulse" />
              ))}
            </div>
          ) : files && files.length > 0 ? (
            <FileTable
              files={files}
              onPreview={setPreviewFile}
              onRename={setRenameTarget}
              onDelete={(id) => deleteFile(id)}
              onMove={setMoveTarget}
            />
          ) : (
            <EmptyState
              icon={FolderOpen}
              title="No files here"
              description="Upload your first file to get started."
              action={{ label: "Upload File", onClick: () => setUploadOpen(true) }}
            />
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
        onMove={(folderId) => { if (moveTarget) moveFile({ id: moveTarget.id, folderId }); setMoveTarget(null) }}
      />

      <UploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        folderId={activeFolderId}
      />
    </AnimatedPage>
  )
}
