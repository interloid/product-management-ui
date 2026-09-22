import { Skeleton } from "@/components/ui/skeleton";

export function ProductFiltersSkeleton() {
  return (
    <div className="w-full min-w-0">
      <div className="flex flex-col gap-2.5 sm:gap-3 w-full rounded-xl border border-border/70 bg-card/95 backdrop-blur-sm p-2.5 sm:p-3 shadow-xs ring-1 ring-black/4 dark:ring-white/6 sm:hidden">
        <div className="flex items-center gap-2 w-full">
          <Skeleton className="h-9 flex-1 rounded-lg" />
          <Skeleton className="h-9 w-20 sm:w-28 shrink-0 rounded-lg" />
        </div>
        <div className="w-full border-b border-border/60" />
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 -mx-1 px-1">
          <Skeleton className="h-8 w-14 rounded-lg shrink-0" />
          <Skeleton className="h-8 w-18 rounded-lg shrink-0" />
          <Skeleton className="h-8 w-16 rounded-lg shrink-0" />
          <Skeleton className="h-8 w-24 rounded-lg shrink-0" />
          <Skeleton className="h-8 w-20 rounded-lg shrink-0" />
        </div>

        <div className="grid grid-cols-2 gap-2 w-full">
          <Skeleton className="h-9 w-full rounded-lg" />
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>

        <div className="flex items-center justify-between gap-1.5 w-full">
          <Skeleton className="h-9 flex-1 rounded-lg" />
          <div className="flex items-center gap-1.5 shrink-0">
            <Skeleton className="size-9 rounded-lg" />
            <Skeleton className="size-9 rounded-lg" />
          </div>
        </div>
      </div>

      <div className="hidden sm:flex w-full min-w-0 flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-card/95 backdrop-blur-sm p-2.5 sm:p-3 shadow-xs ring-1 ring-black/4 dark:ring-white/6">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <Skeleton className="h-9 w-28 rounded-lg" />
          <div className="flex flex-wrap items-center gap-1">
            <Skeleton className="h-9 w-14 rounded-lg" />
            <Skeleton className="h-9 w-16 rounded-lg" />
            <Skeleton className="h-9 w-16 rounded-lg" />
            <Skeleton className="h-9 w-20 rounded-lg" />
          </div>
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="h-9 w-9 rounded-lg" />
        </div>
        <div className="flex items-center gap-2 min-w-0 w-full min-[1300px]:w-auto">
          <Skeleton className="h-9 flex-1 min-[1100px]:w-100 min-[1100px]:flex-none min-[1300px]:w-64 rounded-lg" />
          <Skeleton className="h-9 w-28 shrink-0 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
