import { Skeleton } from '@/components/ui/skeleton'

export default function MainLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex gap-4 mb-8">
        <Skeleton className="h-10 w-24 rounded-full" />
        <Skeleton className="h-10 w-24 rounded-full" />
        <Skeleton className="h-10 w-24 rounded-full" />
      </div>

      <div className="deal-grid">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="deal-card p-4 border border-border">
            <div className="flex gap-4 w-full">
              <Skeleton className="w-[120px] h-[120px] rounded-lg shrink-0" />
              <div className="flex flex-col gap-2 flex-1">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-1/3 mt-2" />
                <div className="mt-auto flex gap-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
