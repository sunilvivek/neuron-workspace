import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useGetFolderTreeQuery } from "@/app/store/api"
import { Folder, FolderOpen, ChevronRight, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import type { FolderTreeNode } from "@/types/folder"

interface MoveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onMove: (folderId: string | null) => void
}

function FolderOption({
  node,
  selected,
  onSelect,
  level,
}: {
  node: FolderTreeNode
  selected: string | null
  onSelect: (id: string | null) => void
  level: number
}) {
  const [expanded, setExpanded] = useState(false)
  const hasChildren = node.children && node.children.length > 0
  const isSelected = selected === node.id

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-1 rounded-md px-2 py-1.5 text-sm cursor-pointer transition-colors",
          isSelected ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => onSelect(node.id)}
      >
        {hasChildren && (
          <button
            type="button"
            className="p-0.5"
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded) }}
          >
            {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </button>
        )}
        {isSelected ? <FolderOpen className="h-4 w-4 text-primary" /> : <Folder className="h-4 w-4" />}
        <span className="flex-1">{node.name}</span>
      </div>
      {expanded && hasChildren && (
        <div>
          {node.children!.map((child) => (
            <FolderOption key={child.id} node={child} selected={selected} onSelect={onSelect} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export function MoveDialog({ open, onOpenChange, onMove }: MoveDialogProps) {
  const { data: tree } = useGetFolderTreeQuery()
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Move to Folder</DialogTitle>
        </DialogHeader>
        <div className="max-h-[300px] overflow-auto space-y-1 py-2">
          <div
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm cursor-pointer transition-colors",
              selected === null ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
            )}
            onClick={() => setSelected(null)}
          >
            <Folder className="h-4 w-4" />
            <span>Root (No folder)</span>
          </div>
          {tree?.map((node) => (
            <FolderOption key={node.id} node={node} selected={selected} onSelect={setSelected} level={0} />
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => { onMove(selected); onOpenChange(false) }}>Move</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
