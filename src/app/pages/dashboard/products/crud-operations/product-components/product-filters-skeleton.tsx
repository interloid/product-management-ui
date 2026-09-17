import { Skeleton } from "@/components/ui/skeleton";

export function ProductFiltersSkeleton() {
  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-3 min-w-0">
      <div className="flex flex-wrap items-center gap-2 min-w-0">
        <Skeleton className="h-9 w-28 rounded-md" />
        <div className="flex flex-wrap items-center gap-1">
          <Skeleton className="h-9 w-14 rounded-md" />
          <Skeleton className="h-9 w-16 rounded-md" />
          <Skeleton className="h-9 w-16 rounded-md" />
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>
        <Skeleton className="h-9 w-24 rounded-md" />
        <Skeleton className="h-9 w-9 rounded-md" />
      </div>
      <div className="flex items-center gap-2 min-w-0 w-full min-[1100px]:w-auto">
        <Skeleton className="h-9 flex-1 min-[1100px]:w-64 min-[1100px]:flex-none rounded-md" />
        <Skeleton className="h-9 w-28 shrink-0 rounded-md" />
      </div>
    </div>
  );
}