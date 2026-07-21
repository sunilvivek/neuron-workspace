import { Skeleton } from "@/components/ui/skeleton"

export function ChatSkeleton() {
  return (
    <div className="space-y-6 p-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className={`flex gap-3 px-4 py-5 ${i % 2 === 0 ? "" : "bg-muted/30"}`}>
          <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2 pt-0.5">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className={`h-4 ${i % 2 === 0 ? "w-3/4" : "w-5/6"}`} />
            {i % 2 === 1 && (
              <>
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
