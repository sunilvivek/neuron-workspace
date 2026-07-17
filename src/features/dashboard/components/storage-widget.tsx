import { useGetStorageQuery } from "@/app/store/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { HardDrive } from "lucide-react"

export function StorageWidget() {
  const { data: storage, isLoading } = useGetStorageQuery()

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-28" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-3 w-full rounded-full" />
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!storage) return null

  const percentage = Math.round((storage.used / storage.total) * 100)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <HardDrive className="h-4 w-4" aria-hidden="true" />
          Storage
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="mb-2 flex items-baseline justify-between text-sm">
            <span className="font-medium">{storage.used} GB used</span>
            <span className="text-muted-foreground">of {storage.total} GB</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${percentage}%` }}
              role="progressbar"
              aria-valuenow={percentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${percentage}% storage used`}
            />
          </div>
        </div>

        <div className="space-y-2">
          {storage.breakdown.map((item) => (
              <div key={item.type} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary/60" aria-hidden="true" />
                  <span className="text-muted-foreground">{item.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{item.count} files</span>
                  <span className="font-medium">{item.size} GB</span>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}
