import { useState, useEffect } from "react"
import { useGetDocumentByIdQuery, useUpdateDocumentMutation } from "@/app/store/api"
import { RichTextEditor } from "@/components/rich-text-editor"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Save, ArrowLeft } from "lucide-react"
import { Breadcrumb } from "./breadcrumb"

interface DocumentEditorProps {
  documentId: string
  onClose: () => void
}

export function DocumentEditor({ documentId, onClose }: DocumentEditorProps) {
  const { data: document, isLoading } = useGetDocumentByIdQuery(documentId)
  const [updateDocument] = useUpdateDocumentMutation()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  /* eslint-disable react-hooks/set-state-in-effect -- syncing local state from async query data */
  useEffect(() => {
    if (document) {
      setTitle(document.title)
      setContent(document.content)
    }
  }, [document])
  /* eslint-enable react-hooks/set-state-in-effect */

  async function handleSave() {
    if (!document) return
    await updateDocument({ id: document.id, title, content })
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    )
  }

  if (!document) return null

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b px-6 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Back to documents">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Breadcrumb folderId={document.folderId} />
        </div>
        <Button onClick={handleSave} size="sm">
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
      </div>
      <div className="flex-1 overflow-auto p-6">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Document title"
          className="text-lg font-semibold border-0 px-0 mb-4 focus-visible:ring-0 shadow-none"
        />
        <RichTextEditor
          content={content}
          onChange={setContent}
          placeholder="Start writing..."
        />
      </div>
    </div>
  )
}
