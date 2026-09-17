import { Skeleton } from "@/components/ui/skeleton";

export function ProductFiltersSkeleton() {
  return (
    <div className="flex w-full flex-wrap items-center gap-2 min-[1448px]:flex-row-reverse min-[1440px]:justify-between">
      <div className="flex min-w-0 items-center gap-2">
        <Skeleton className="h-9 min-w-44 flex-1 rounded-md lg:w-80 lg:flex-none" />
        <Skeleton className="h-9 w-32 shrink-0 rounded-md" />
      </div>
      <div className="flex flex-wrap min-w-0 items-center gap-1!">
        <Skeleton className="h-9 w-28 rounded-md" />
        <div className="flex flex-wrap items-center gap-1">
          <Skeleton className="h-9 w-16 rounded-md" />
          <Skeleton className="h-9 w-16 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>
        <div className="mx-1 hidden h-6 w-px bg-border md:block" />
        <Skeleton className="mx-1 hidden h-9 w-20 rounded-md md:block" />
        <Skeleton className="h-9 w-10 rounded-md" />
      </div>
    </div>
  );
}