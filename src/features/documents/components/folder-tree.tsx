import { useState } from "react"
import { useGetFolderTreeQuery, useCreateFolderMutation, useUpdateFolderMutation, useDeleteFolderMutation } from "@/app/store/api"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { FolderTreeNode } from "@/types/folder"

interface FolderTreeProps {
  activeFolderId: string | null
  onSelectFolder: (id: string | null) => void
}

function FolderNode({
  node,
  activeFolderId,
  onSelectFolder,
  level,
}: {
  node: FolderTreeNode
  activeFolderId: string | null
  onSelectFolder: (id: string | null) => void
  level: number
}) {
  const [expanded, setExpanded] = useState(level === 0)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(node.name)
  const [updateFolder] = useUpdateFolderMutation()
  const [deleteFolder] = useDeleteFolderMutation()
  const isActive = activeFolderId === node.id
  const hasChildren = node.children && node.children.length > 0

  function handleRename() {
    if (editName.trim() && editName !== node.name) {
      updateFolder({ id: node.id, name: editName.trim() })
    }
    setEditing(false)
  }

  return (
    <div>
      <div
        className={cn(
          "group flex items-center gap-1 rounded-md px-2 py-1 text-sm cursor-pointer transition-colors",
          isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/50"
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        <button
          type="button"
          className="shrink-0 p-0.5"
          onClick={(e) => {
            e.stopPropagation()
            setExpanded(!expanded)
          }}
          aria-label={expanded ? "Collapse folder" : "Expand folder"}
        >
          {hasChildren ? (
            expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <span className="w-3.5" />
          )}
        </button>
        <button
          type="button"
          className="flex flex-1 items-center gap-1.5 text-left"
          onClick={() => onSelectFolder(node.id)}
        >
          {isActive ? (
            <FolderOpen className="h-4 w-4 shrink-0 text-primary" />
          ) : (
            <Folder className="h-4 w-4 shrink-0" />
          )}
          {editing ? (
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRename()
                if (e.key === "Escape") setEditing(false)
              }}
              className="flex-1 bg-background px-1 py-0 text-sm border rounded"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="flex-1 truncate">{node.name}</span>
          )}
          {node.documentCount > 0 && (
            <span className="text-xs text-muted-foreground">{node.documentCount}</span>
          )}
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setEditing(true)}>
              <Pencil className="mr-2 h-3.5 w-3.5" /> Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => deleteFolder(node.id)} className="text-destructive">
              <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {expanded && hasChildren && (
        <div>
          {node.children!.map((child) => (
            <FolderNode
              key={child.id}
              node={child}
              activeFolderId={activeFolderId}
              onSelectFolder={onSelectFolder}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function FolderTree({ activeFolderId, onSelectFolder }: FolderTreeProps) {
  const { data: tree, isLoading } = useGetFolderTreeQuery()
  const [createFolder] = useCreateFolderMutation()
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState("")

  function handleCreate() {
    if (newName.trim()) {
      createFolder({ name: newName.trim() })
      setNewName("")
      setCreating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-2 p-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between px-2 py-1">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Folders</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setCreating(!creating)}
          aria-label="Create folder"
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
      {creating && (
        <div className="px-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={() => { if (!newName.trim()) setCreating(false) }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate()
              if (e.key === "Escape") setCreating(false)
            }}
            className="w-full bg-background px-2 py-1 text-sm border rounded"
            placeholder="Folder name"
            autoFocus
          />
        </div>
      )}
      <ScrollArea className="max-h-[300px]">
        <button
          type="button"
          className={cn(
            "flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-sm transition-colors",
            activeFolderId === null ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/50"
          )}
          onClick={() => onSelectFolder(null)}
        >
          <Folder className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left">All Documents</span>
        </button>
        {tree?.map((node) => (
          <FolderNode
            key={node.id}
            node={node}
            activeFolderId={activeFolderId}
            onSelectFolder={onSelectFolder}
            level={0}
          />
        ))}
      </ScrollArea>
    </div>
  )
}
