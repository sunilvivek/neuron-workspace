import { useGetNotesQuery, useDeleteNoteMutation } from "@/app/store/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import type { Note } from "@/types/note"
import { CreateNoteDialog } from "./create-note-dialog"
import { EditNoteDialog } from "./edit-note-dialog"
import { useState } from "react"

function NoteCard({ note }: { note: Note }) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteNote] = useDeleteNoteMutation()

  return (
    <>
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <CardTitle className="text-lg">{note.title}</CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setEditOpen(true)}
              aria-label={`Edit ${note.title}`}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => deleteNote(note.id)}
              aria-label={`Delete ${note.title}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {note.content}
          </p>
          <p className="mt-2 text-xs text-muted-foreground/60">
            Updated {new Date(note.updatedAt).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
      <EditNoteDialog note={note} open={editOpen} onOpenChange={setEditOpen} />
    </>
  )
}

export function NotesList() {
  const { data: notes, isLoading, error } = useGetNotesQuery()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-12 text-center text-destructive">
        Failed to load notes. Please try again.
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notes</h1>
          <p className="text-muted-foreground">Manage your notes and ideas.</p>
        </div>
        <CreateNoteDialog />
      </div>

      {!notes?.length ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <p>No notes yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  )
}
