import { Skeleton } from "@/components/ui/skeleton";

export function ProductFiltersSkeleton() {
  return (
    <div className="w-full min-w-0">
      <div className="flex flex-col gap-2.5 w-full sm:hidden">
        <div className="flex items-center gap-2 w-full">
          <Skeleton className="h-9 flex-1 rounded-md" />
          <Skeleton className="h-9 w-28 shrink-0 rounded-md" />
        </div>
        <div className="w-full border-b border-border/70" />
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 -mx-1 px-1">
          <Skeleton className="h-8 w-14 rounded-full shrink-0" />
          <Skeleton className="h-8 w-18 rounded-full shrink-0" />
          <Skeleton className="h-8 w-16 rounded-full shrink-0" />
          <Skeleton className="h-8 w-24 rounded-full shrink-0" />
          <Skeleton className="h-8 w-20 rounded-full shrink-0" />
        </div>

        <div className="flex items-center gap-2 w-full">
          <Skeleton className="h-9 flex-1 rounded-md" />
          <Skeleton className="h-9 flex-1 rounded-md" />
          <Skeleton className="h-9 w-9 shrink-0 rounded-md" />
        </div>
      </div>

      <div className="hidden sm:flex w-full flex-wrap items-center justify-between gap-3 min-w-0">
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
        <div className="flex items-center gap-2 min-w-0 w-full min-[1300px]:w-auto">
          <Skeleton className="h-9 flex-1 min-[1100px]:w-100 min-[1100px]:flex-none min-[1300px]:w-64 rounded-md" />
          <Skeleton className="h-9 w-28 shrink-0 rounded-md" />
        </div>
      </div>
    </div>
  );
}