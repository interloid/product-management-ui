import { Skeleton } from "@/components/ui/skeleton";

export function ProductViewSkeleton() {
  return (
    <div
      className="flex h-full flex-col"
      aria-busy="true"
      aria-label="Loading product"
    >
      <div className="border-b px-5 py-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/5" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Skeleton className="aspect-16/10 w-full rounded-lg" />

            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              <Skeleton className="aspect-square rounded-md" />
              <Skeleton className="aspect-square rounded-md" />
              <Skeleton className="aspect-square rounded-md" />
              <Skeleton className="aspect-square rounded-md" />
            </div>
          </div>

          <div className="grid grid-cols-[120px_1fr] gap-x-4 gap-y-4">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-28" />

            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />

            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-20" />

            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-16" />

            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-6 w-20 rounded-full" />

            <Skeleton className="h-4 w-20" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/5" />
            </div>

            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-4 w-32" />

            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>

      <div className="border-t px-5 py-3">
        <div className="flex flex-row-reverse gap-2">
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-9 w-16" />
        </div>
      </div>
    </div>
  );
}
