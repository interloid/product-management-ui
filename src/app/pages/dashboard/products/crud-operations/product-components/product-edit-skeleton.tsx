import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export interface ProductEditSkeletonProps {
  mode?: "add" | "edit";
  onClose?: () => void;
}

export function ProductEditSkeleton({
  mode = "edit",
  onClose,
}: ProductEditSkeletonProps = {}) {
  const isEdit = mode === "edit";

  return (
    <div
      className="flex h-full flex-col"
      aria-busy="true"
      aria-label={isEdit ? "Loading edit product form" : "Loading add product form"}
    >
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 flex flex-row items-center justify-between border-b border-border/70 bg-background/95 backdrop-blur-md px-4 sm:px-6 py-3.5 sm:py-4">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <Skeleton className="size-9 sm:size-10 rounded-xl shrink-0" />
          <div className="space-y-1.5 min-w-0">
            <Skeleton className="h-5 w-44 sm:w-56 rounded-md" />
            <Skeleton className="h-3.5 w-40 sm:w-48 rounded" />
          </div>
        </div>
        {onClose ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            className="size-8 sm:size-9 shrink-0 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
            aria-label={isEdit ? "Close edit drawer" : "Close add drawer"}
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
          <div className="lg:col-span-7 flex flex-col">
            <div className="rounded-2xl border border-border/70 bg-card p-3.5 sm:p-5 shadow-xs flex flex-col lg:h-full space-y-4 sm:space-y-5">
              <div className="border-b border-border/50 pb-3 space-y-1">
                <Skeleton className="h-4 w-36 rounded" />
                <Skeleton className="h-3 w-56 rounded" />
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Skeleton className="h-3.5 w-24 rounded" />
                    <Skeleton className="h-10 w-full rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <Skeleton className="h-3.5 w-16 rounded" />
                    <Skeleton className="h-10 w-full rounded-xl" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Skeleton className="h-3.5 w-20 rounded" />
                    <Skeleton className="h-10 w-full rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <Skeleton className="h-3.5 w-16 rounded" />
                    <Skeleton className="h-10 w-full rounded-xl" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Skeleton className="h-3.5 w-16 rounded" />
                    <Skeleton className="h-10 w-full rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <Skeleton className="h-3.5 w-16 rounded" />
                    <Skeleton className="h-10 w-full rounded-xl" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Skeleton className="h-3.5 w-24 rounded" />
                  <Skeleton className="h-20 w-full rounded-xl" />
                </div>
              </div>

              <div className="rounded-2xl border border-border/70 bg-card p-3.5 sm:p-5 shadow-xs space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-28 rounded" />
                    <Skeleton className="h-3 w-52 rounded" />
                  </div>
                  <Skeleton className="h-5 w-12 rounded-md" />
                </div>

                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/80 p-4 sm:p-8 text-center bg-muted/10 space-y-2.5">
                  <Skeleton className="size-10 sm:size-14 rounded-xl sm:rounded-2xl" />
                  <Skeleton className="h-4 w-52 rounded" />
                  <Skeleton className="h-3 w-40 rounded" />
                  <Skeleton className="h-5 w-28 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col">
            <div className="rounded-2xl border border-border/70 bg-card p-3.5 sm:p-5 shadow-xs flex flex-col justify-between gap-3.5 sm:gap-4 lg:h-full">
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32 rounded" />
                  <Skeleton className="h-3 w-36 rounded" />
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>

              <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-border/70 bg-muted/20 flex items-center justify-center shadow-xs">
                <Skeleton className="size-full rounded-2xl" />
              </div>

              <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto py-1 px-0.5">
                <Skeleton className="size-13 sm:size-18 shrink-0 rounded-xl" />
                <Skeleton className="size-13 sm:size-18 shrink-0 rounded-xl" />
                <Skeleton className="size-13 sm:size-18 shrink-0 rounded-xl" />
                <Skeleton className="size-13 sm:size-18 shrink-0 rounded-xl border-2 border-dashed" />
              </div>

              <div className="rounded-xl border border-border/60 bg-muted/20 p-3 sm:p-4 space-y-2.5 sm:space-y-3 mt-auto">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-4 w-36 rounded" />
                    <Skeleton className="h-3 w-24 rounded" />
                  </div>
                  <Skeleton className="h-5 w-18 rounded-full" />
                </div>

                <div className="flex items-baseline justify-between pt-2 border-t border-border/50">
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-10 rounded" />
                    <Skeleton className="h-6 w-20 rounded" />
                  </div>
                  <div className="space-y-1 text-right">
                    <Skeleton className="h-3 w-10 rounded ml-auto" />
                    <Skeleton className="h-5 w-16 rounded ml-auto" />
                  </div>
                </div>

                <div className="pt-2 border-t border-border/50 space-y-1.5">
                  <Skeleton className="h-3 w-16 rounded" />
                  <Skeleton className="h-3.5 w-full rounded" />
                  <Skeleton className="h-3.5 w-4/5 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Footer */}
      <div className="sticky bottom-0 z-20 flex h-14 sm:h-16 shrink-0 items-center justify-end gap-2 sm:gap-2.5 border-t border-border/80 bg-background/90 backdrop-blur-md px-4 sm:px-6">
        {onClose ? (
          <Button
            type="button"
            variant="outline"
            className="h-9 sm:h-10 rounded-full px-4 sm:px-5 text-xs font-medium cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </Button>
        ) : (
          <Skeleton className="h-9 sm:h-10 w-20 rounded-full" />
        )}
        <Skeleton className="h-9 sm:h-10 w-28 rounded-full" />
      </div>
    </div>
  );
}

export const ProductFormSkeleton = ProductEditSkeleton;

