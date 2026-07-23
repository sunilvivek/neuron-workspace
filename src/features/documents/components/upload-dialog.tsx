import { useState, useRef } from "react"
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
import { Upload, FileText, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUploadFileMutation } from "@/app/store/api"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface UploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  folderId: string | null
}

const fileTypeOptions = [
  { value: "pdf", label: "PDF Document" },
  { value: "image", label: "Image (PNG/JPG)" },
  { value: "spreadsheet", label: "Spreadsheet (XLSX)" },
  { value: "code", label: "Code File (JS/TS)" },
  { value: "text", label: "Text File (TXT)" },
  { value: "markdown", label: "Markdown (MD)" },
  { value: "archive", label: "Archive (ZIP)" },
]

const sizeOptions: Record<string, number> = {
  pdf: 2457600, image: 1048576, spreadsheet: 524288, code: 81920,
  text: 2048, markdown: 4096, archive: 10485760,
}

const extOptions: Record<string, string> = {
  pdf: "pdf", image: "png", spreadsheet: "xlsx", code: "ts",
  text: "txt", markdown: "md", archive: "zip",
}

export function UploadDialog({ open, onOpenChange, folderId }: UploadDialogProps) {
  const [fileName, setFileName] = useState("")
  const [fileType, setFileType] = useState("pdf")
  const [dragging, setDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploadFile] = useUploadFileMutation()

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      const f = files[0]
      setFileName(f.name.replace(/\.[^/.]+$/, ""))
      setUploadedFile({ name: f.name, size: f.size })
      const ext = f.name.split(".").pop()?.toLowerCase() || ""
      if (ext === "pdf") setFileType("pdf")
      else if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) setFileType("image")
      else if (["xlsx", "xls", "csv"].includes(ext)) setFileType("spreadsheet")
      else if (["js", "ts", "jsx", "tsx", "json", "py", "rs"].includes(ext)) setFileType("code")
      else if (["txt"].includes(ext)) setFileType("text")
      else if (["md", "markdown"].includes(ext)) setFileType("markdown")
      else if (["zip", "tar", "gz"].includes(ext)) setFileType("archive")
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setDragging(true)
  }

  function handleDragLeave() {
    setDragging(false)
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) {
      setFileName(f.name.replace(/\.[^/.]+$/, ""))
      setUploadedFile({ name: f.name, size: f.size })
    }
  }

  async function handleUpload() {
    if (!fileName.trim()) return
    const name = `${fileName.trim()}.${extOptions[fileType] || "txt"}`
    const size = uploadedFile?.size || sizeOptions[fileType] || 1024
    await uploadFile({ name, type: fileType, size, folderId })
    setFileName("")
    setFileType("pdf")
    setUploadedFile(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div
            className={cn(
              "relative rounded-lg border-2 border-dashed p-8 text-center transition-colors cursor-pointer",
              dragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Drop files here or click to select"
          >
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={handleFileSelect}
              aria-hidden="true"
            />
            {uploadedFile ? (
              <div className="flex items-center justify-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                <div className="text-left">
                  <p className="text-sm font-medium">{uploadedFile.name}</p>
                  <p className="text-xs text-muted-foreground">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 ml-2"
                  onClick={(e) => { e.stopPropagation(); setUploadedFile(null); setFileName("") }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div>
                <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Drag and drop a file here, or click to select
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Supported: PDF, Images, Documents, Code, Archives
                </p>
              </div>
            )}
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
            <Select value={fileType} onValueChange={setFileType}>
              <SelectTrigger id="file-type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fileTypeOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
