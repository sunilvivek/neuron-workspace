import { Link } from "react-router"
import { ChevronRight, Home } from "lucide-react"
import { useGetFolderPathQuery } from "@/app/store/api"
import { Skeleton } from "@/components/ui/skeleton"

interface BreadcrumbProps {
  folderId: string | null
  rootLabel?: string
  rootTo?: string
}

export function Breadcrumb({ folderId, rootLabel = "Documents", rootTo = "/app/documents" }: BreadcrumbProps) {
  const { data: path, isLoading } = useGetFolderPathQuery(folderId || "", { skip: !folderId })

  if (isLoading) {
    return (
      <div className="flex items-center gap-1.5">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
      </div>
    )
  }

  const items = path || []

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground">
      <Link to={rootTo} className="flex items-center gap-1 hover:text-foreground transition-colors">
        <Home className="h-3.5 w-3.5" />
        <span>{rootLabel}</span>
      </Link>
      {items.map((item) => (
        <span key={item.id} className="flex items-center gap-1">
          <ChevronRight className="h-3.5 w-3.5" />
          <Link
            to={`${rootTo}/folder/${item.id}`}
            className="hover:text-foreground transition-colors"
          >
            {item.name}
          </Link>
        </span>
      ))}
    </nav>
  )
}
