import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function ProductViewSkeleton({ onClose }: { onClose?: () => void } = {}) {
  return (
    <div
      className="flex h-full flex-col"
      aria-busy="true"
      aria-label="Loading product details"
    >
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 flex flex-row items-center justify-between border-b border-border/70 bg-background/95 backdrop-blur-md px-4 sm:px-6 py-3.5 sm:py-4">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <Skeleton className="size-9 sm:size-10 rounded-xl shrink-0" />
          <div className="space-y-1.5 min-w-0">
            <Skeleton className="h-5 w-44 sm:w-64 rounded-md" />
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-3.5 w-24 rounded" />
              <Skeleton className="size-4 rounded" />
            </div>
          </div>
        </div>
        {onClose ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            className="size-8 sm:size-9 shrink-0 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
            aria-label="Close view drawer"
            title="Close"
          >
            <X className="size-4" />
          </Button>
        ) : (
          <Skeleton className="size-8 sm:size-9 rounded-full shrink-0" />
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-muted/20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:items-stretch">
          <div className="lg:col-span-5 flex flex-col">
            <div className="rounded-2xl border border-border/70 bg-card p-3.5 sm:p-5 shadow-xs flex flex-col justify-between gap-3 sm:gap-4 lg:h-full">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-28 rounded" />
                    <Skeleton className="h-3 w-20 rounded" />
                  </div>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>

                <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-border/70 bg-muted/20 flex items-center justify-center shadow-xs">
                  <Skeleton className="size-full rounded-2xl" />
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto py-1 px-0.5 mt-auto">
                <Skeleton className="size-13 sm:size-18 shrink-0 rounded-xl" />
                <Skeleton className="size-13 sm:size-18 shrink-0 rounded-xl" />
                <Skeleton className="size-13 sm:size-18 shrink-0 rounded-xl" />
                <Skeleton className="size-13 sm:size-18 shrink-0 rounded-xl" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col">
            <div className="rounded-2xl border border-border/70 bg-card p-3.5 sm:p-5 shadow-xs flex flex-col lg:h-full space-y-3 sm:space-y-4">
              <div className="border-b border-border/50 pb-3 space-y-1">
                <Skeleton className="h-4 w-40 rounded" />
                <Skeleton className="h-3 w-56 rounded" />
              </div>

              <div className="flex-1">
                <div className="grid grid-cols-[85px_1fr] sm:grid-cols-[120px_1fr] gap-x-3 sm:gap-x-4 gap-y-3 sm:gap-y-3.5 items-center text-xs sm:text-[13px]">
                  <Skeleton className="h-4 w-12 rounded" />
                  <Skeleton className="h-4 w-28 rounded" />

                  <Skeleton className="h-4 w-16 rounded" />
                  <Skeleton className="h-5 w-24 rounded-full" />

                  <Skeleton className="h-4 w-12 rounded" />
                  <Skeleton className="h-5 w-20 rounded" />

                  <Skeleton className="h-4 w-12 rounded" />
                  <Skeleton className="h-4 w-16 rounded" />

                  <Skeleton className="h-4 w-14 rounded" />
                  <Skeleton className="h-5 w-20 rounded-full" />

                  <Skeleton className="h-4 w-20 self-start mt-1 rounded" />
                  <div className="space-y-2">
                    <Skeleton className="h-3.5 w-full rounded" />
                    <Skeleton className="h-3.5 w-4/5 rounded" />
                    <Skeleton className="h-3.5 w-3/5 rounded" />
                  </div>

                  <Skeleton className="h-4 w-14 rounded" />
                  <Skeleton className="h-3.5 w-36 rounded" />

                  <Skeleton className="h-4 w-14 rounded" />
                  <Skeleton className="h-3.5 w-36 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 z-20 flex h-14 sm:h-16 shrink-0 items-center justify-between border-t border-border/80 bg-background/90 backdrop-blur-md px-3 sm:px-6">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Skeleton className="h-8.5 sm:h-10 w-20 sm:w-24 rounded-full" />
          <Skeleton className="h-8.5 sm:h-10 w-20 sm:w-24 rounded-full" />
        </div>
        <div className="flex items-center gap-2 sm:gap-2.5">
          {onClose ? (
            <Button
              type="button"
              variant="outline"
              className="h-8.5 sm:h-10 rounded-full px-3.5 sm:px-5 text-xs font-medium cursor-pointer hover:border-primary hover:bg-primary-hover hover:text-hover-text!"
              onClick={onClose}
            >
              Close
            </Button>
          ) : (
            <Skeleton className="h-8.5 sm:h-10 w-18 sm:w-20 rounded-full" />
          )}
          <Skeleton className="h-8.5 sm:h-10 w-18 sm:w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}
