import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function JobSkeleton() {
  return (
    <Card className="border-slate-200">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3 flex-1">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" /> {/* Company */}
              <Skeleton className="h-6 w-3/4" /> {/* Title */}
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
          <div className="flex flex-col gap-2 min-w-[140px]">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}