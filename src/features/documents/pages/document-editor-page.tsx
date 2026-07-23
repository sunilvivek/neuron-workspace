import { useParams, useNavigate } from "react-router"
import { AnimatedPage } from "@/components/animated-page"
import { DocumentEditor } from "../components/document-editor"

export default function DocumentEditorPage() {
  const { documentId } = useParams()
  const navigate = useNavigate()

  if (!documentId) return null

  return (
    <AnimatedPage>
      <DocumentEditor
        documentId={documentId}
        onClose={() => navigate("/app/documents")}
      />
    </AnimatedPage>
  )
}
