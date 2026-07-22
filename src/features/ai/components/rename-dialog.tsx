import { useState, useEffect } from "react"
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

interface RenameDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentName: string
  onRename: (name: string) => void
}

export function RenameDialog({ open, onOpenChange, currentName, onRename }: RenameDialogProps) {
  const [name, setName] = useState(currentName)

  /* eslint-disable react-hooks/set-state-in-effect -- syncing name when dialog opens */
  useEffect(() => {
    setName(currentName)
  }, [currentName, open])
  /* eslint-enable react-hooks/set-state-in-effect */

  function handleRename() {
    if (name.trim() && name !== currentName) {
      onRename(name.trim())
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[350px]">
        <DialogHeader>
          <DialogTitle>Rename conversation</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <Label htmlFor="rename-ai-conv">Name</Label>
          <Input
            id="rename-ai-conv"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleRename() }}
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleRename} disabled={!name.trim() || name === currentName}>Rename</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
