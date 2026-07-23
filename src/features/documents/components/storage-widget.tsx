import { HardDrive, FileText, Image, Table, Code, Archive, Music, Video, File } from "lucide-react"
import { cn } from "@/lib/utils"
import type { StorageDashboardData } from "@/types/folder"

const typeColors: Record<string, string> = {
  pdf: "bg-red-500", image: "bg-blue-500", spreadsheet: "bg-green-500",
  code: "bg-purple-500", archive: "bg-yellow-500", audio: "bg-pink-500",
  video: "bg-orange-500", text: "bg-gray-500", markdown: "bg-cyan-500",
  other: "bg-muted",
}

const typeIcons: Record<string, typeof FileText> = {
  pdf: FileText, image: Image, spreadsheet: Table, code: Code,
  archive: Archive, audio: Music, video: Video, text: File, markdown: FileText,
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(1)} MB`
  return `${(bytes / 1073741824).toFixed(1)} GB`
}

interface StorageWidgetProps {
  data: StorageDashboardData | undefined
  isLoading: boolean
}

export function StorageWidget({ data, isLoading }: StorageWidgetProps) {
  if (isLoading) {
    return (
      <div className="space-y-4 rounded-xl border bg-card p-5">
        <div className="h-5 w-32 rounded bg-muted animate-pulse" />
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-muted animate-pulse" />
          <div className="h-3 w-3/4 rounded bg-muted animate-pulse" />
        </div>
      </div>
    )
  }

  if (!data) return null

  const { info, recentUploads, largestFiles } = data
  const usedPercent = Math.round((info.used / info.total) * 100)

  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <HardDrive className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-sm font-semibold">Storage</h3>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{formatBytes(info.used)} used</span>
          <span className="text-muted-foreground">{formatBytes(info.total)}</span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all", usedPercent > 80 ? "bg-red-500" : usedPercent > 60 ? "bg-yellow-500" : "bg-primary")}
            style={{ width: `${usedPercent}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">{usedPercent}% used</p>
      </div>

      {info.breakdown.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">File Type Breakdown</p>
          <div className="space-y-1.5">
            {info.breakdown.slice().sort((a, b) => b.size - a.size).map((item) => {
              const Icon = typeIcons[item.type] || File
              const percent = Math.round((item.size / info.used) * 100)
              return (
                <div key={item.type} className="flex items-center gap-2 text-xs">
                  <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="capitalize truncate">{item.type}</span>
                      <span className="text-muted-foreground">{percent}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted mt-0.5">
                      <div className={cn("h-full rounded-full", typeColors[item.type] || "bg-muted-foreground")} style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {recentUploads.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Recent Uploads</p>
          <div className="space-y-1">
            {recentUploads.map((f) => {
              const Icon = typeIcons[f.type] || File
              return (
                <div key={f.id} className="flex items-center gap-2 text-xs">
                  <Icon className="h-3 w-3 text-muted-foreground shrink-0" />
                  <span className="truncate flex-1">{f.name}</span>
                  <span className="text-muted-foreground shrink-0">{formatBytes(f.size)}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {largestFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Largest Files</p>
          <div className="space-y-1">
            {largestFiles.map((f) => {
              const Icon = typeIcons[f.type] || File
              return (
                <div key={f.id} className="flex items-center gap-2 text-xs">
                  <Icon className="h-3 w-3 text-muted-foreground shrink-0" />
                  <span className="truncate flex-1">{f.name}</span>
                  <span className="text-muted-foreground shrink-0">{formatBytes(f.size)}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
