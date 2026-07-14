import { AnimatedPage } from "@/components/animated-page"
import { NotesList } from "../components/notes-list"

export default function NotesPage() {
  return (
    <AnimatedPage>
      <div className="p-6">
        <NotesList />
      </div>
    </AnimatedPage>
  )
}
