import { useState } from "react"
import { AnimatedPage } from "@/components/animated-page"
import { useSearchQuery } from "@/app/store/api"
import { SearchBar } from "../components/search-bar"
import { DocumentCard } from "../components/document-card"
import { EmptyState } from "../components/empty-state"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { File, Search } from "lucide-react"

export default function SearchResultsPage() {
  const [query, setQuery] = useState("")
  const [type, setType] = useState("all")
  const { data: results, isLoading } = useSearchQuery(
    { q: query, type },
    { skip: query.length < 2 }
  )

  return (
    <AnimatedPage>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Search</h1>
          <p className="mt-1 text-muted-foreground">
            Search across all documents and files.
          </p>
        </div>

        <div className="mb-6 w-full max-w-lg">
          <SearchBar onSearch={setQuery} placeholder="Search documents, files..." />
        </div>

        {query.length >= 2 ? (
          <>
            <Tabs value={type} onValueChange={setType} className="mb-6">
              <TabsList>
                <TabsTrigger value="all">
                  All <Badge variant="secondary" className="ml-1.5">{(results?.documents.length || 0) + (results?.files.length || 0)}</Badge>
                </TabsTrigger>
                <TabsTrigger value="documents">
                  Documents <Badge variant="secondary" className="ml-1.5">{results?.documents.length || 0}</Badge>
                </TabsTrigger>
                <TabsTrigger value="files">
                  Files <Badge variant="secondary" className="ml-1.5">{results?.files.length || 0}</Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-48 rounded-xl border bg-card animate-pulse" />
                ))}
              </div>
            ) : (
              <>
                {(type === "all" || type === "documents") && results?.documents && results.documents.length > 0 && (
                  <div className="mb-8">
                    {type === "all" && <h2 className="text-sm font-medium text-muted-foreground mb-3">Documents</h2>}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {results.documents.map((doc) => (
                        <DocumentCard
                          key={doc.id}
                          document={doc}
                          onEdit={() => {}}
                          onFavorite={() => {}}
                          onArchive={() => {}}
                          onTrash={() => {}}
                          onMove={() => {}}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {(type === "all" || type === "files") && results?.files && results.files.length > 0 && (
                  <div>
                    {type === "all" && <h2 className="text-sm font-medium text-muted-foreground mb-3">Files</h2>}
                    <div className="space-y-2">
                      {results.files.map((file) => (
                        <div key={file.id} className="flex items-center gap-3 rounded-lg border p-3">
                          <File className="h-5 w-5 text-muted-foreground" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{file.type} · {Math.round(file.size / 1024)} KB</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(!results?.documents.length && !results?.files.length) && (
                  <EmptyState
                    icon={Search}
                    title="No results found"
                    description={`No documents or files match "${query}"`}
                  />
                )}
              </>
            )}
          </>
        ) : (
          <EmptyState
            icon={Search}
            title="Start searching"
            description="Type at least 2 characters to search across documents and files."
          />
        )}
      </div>
    </AnimatedPage>
  )
}
