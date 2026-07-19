import { useState } from "react"
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
import { Upload } from "lucide-react"
import { useUploadFileMutation } from "@/app/store/api"

interface UploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  folderId: string | null
}

export function UploadDialog({ open, onOpenChange, folderId }: UploadDialogProps) {
  const [fileName, setFileName] = useState("")
  const [fileType, setFileType] = useState("document")
  const [uploadFile] = useUploadFileMutation()

  async function handleUpload() {
    if (!fileName.trim()) return
    const extensions: Record<string, string> = {
      document: "pdf", image: "png", spreadsheet: "xlsx", code: "js",
    }
    const sizes: Record<string, number> = {
      document: 1048576, image: 2097152, spreadsheet: 524288, code: 40960,
    }
    await uploadFile({
      name: `${fileName}.${extensions[fileType] || "txt"}`,
      type: fileType,
      size: sizes[fileType] || 1024,
      folderId,
    })
    setFileName("")
    setFileType("document")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="rounded-lg border-2 border-dashed p-6 text-center">
            <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              Mock file upload — enter file details below
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="file-name">File Name</Label>
            <Input
              id="file-name"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="my-document"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="file-type">File Type</Label>
            <select
              id="file-type"
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="document">Document (PDF)</option>
              <option value="image">Image (PNG)</option>
              <option value="spreadsheet">Spreadsheet (XLSX)</option>
              <option value="code">Code (JS)</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleUpload} disabled={!fileName.trim()}>Upload</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
