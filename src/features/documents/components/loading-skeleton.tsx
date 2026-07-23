interface LoadingSkeletonProps {
  view?: "grid" | "list"
  count?: number
}

export function LoadingSkeleton({ view = "grid", count = 6 }: LoadingSkeletonProps) {
  if (view === "list") {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg border p-4">
            <div className="h-10 w-10 rounded-lg bg-muted animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 rounded bg-muted animate-pulse" />
              <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border bg-card">
          <div className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="h-5 w-2/3 rounded bg-muted animate-pulse" />
              <div className="h-5 w-5 rounded bg-muted animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full rounded bg-muted animate-pulse" />
              <div className="h-3 w-4/5 rounded bg-muted animate-pulse" />
              <div className="h-3 w-3/5 rounded bg-muted animate-pulse" />
            </div>
            <div className="h-3 w-16 rounded bg-muted animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}
