import { Skeleton } from "@/components/ui/skeleton";

export function ProductEditSkeleton() {
  return (
    <div
      className="flex h-full flex-col"
      aria-busy="true"
      aria-label="Loading product"
    >
      <div className="border-b px-5 py-4">
        <Skeleton className="h-5 w-3/5" />
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-5">
        <div className="grid gap-1.5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-4 w-full" />
        </div>

        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-4 w-full" />
          </div>

          <div className="grid gap-1.5">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-9 w-full rounded-md" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="grid gap-1.5">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-4 w-full" />
          </div>

          <div className="grid gap-1.5">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-4 w-full" />
          </div>

          <div className="grid gap-1.5">
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-9 w-full rounded-md" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>

        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-48" />
            <Skeleton className="h-3 w-10" />
          </div>

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            <Skeleton className="aspect-square rounded-md" />
            <Skeleton className="aspect-square rounded-md" />
            <Skeleton className="aspect-square rounded-md" />
            <Skeleton className="aspect-square rounded-md" />
          </div>
        </div>

        <div className="grid gap-1.5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-20 w-full rounded-md" />
        </div>
      </div>

      <div className="flex h-16 shrink-0 items-center gap-2 border-t px-5">
        <div className="flex-1" />
        <Skeleton className="h-9 w-16 rounded-md" />
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>
    </div>
  );
}
