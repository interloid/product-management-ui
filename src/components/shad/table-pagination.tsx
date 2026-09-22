import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PaginationProps } from "@/types/props";

export function TablePagination({
  page,
  pageSize,
  productCount,
  totalPages,
  setPage,
  setPageSize,
}: PaginationProps) {
  const lastPage = Math.max(totalPages, 1);

  const startItem = productCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, productCount);

  const isFirstPage = page <= 1;
  const isLastPage = page >= lastPage;
  const isEmpty = productCount === 0;

  return (
    <div className="flex flex-col gap-2.5 sm:gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center justify-between pl-1 sm:justify-start gap-2 w-full sm:w-auto">
        <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
          Rows per page
        </span>
        <Select
          value={String(pageSize)}
          onValueChange={(value) => {
            setPageSize(Number(value));
            setPage(1);
          }}
        >
          <SelectTrigger className="h-8 w-16.25 rounded-lg border-border/70 bg-background hover:border-primary/50 hover:bg-muted/40 focus-visible:border-primary focus-visible:ring-primary/20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            position="popper"
            side="top"
            align="start"
            sideOffset={4}
            className="min-w-20 p-1"
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <SelectItem
                key={size}
                value={String(size)}
                className="text-xs cursor-pointer hover:bg-primary-hover!"
              >
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col min-[340px]:flex-row items-center justify-between sm:justify-end gap-2 sm:gap-4 w-full sm:w-auto">
        <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap text-center sm:text-right">
          {productCount === 0 ? (
            "0 products"
          ) : (
            <>
              Page <span className="font-medium text-foreground">{page}</span>{" "}
              of <span className="font-medium text-foreground">{lastPage}</span>{" "}
              <span className="hidden min-[480px]:inline text-muted-foreground">
                ({startItem}–{endItem} of {productCount}{" "}
                {productCount === 1 ? "product" : "products"})
              </span>
              <span className="min-[480px]:hidden text-muted-foreground">
                ({startItem}–{endItem})
              </span>
            </>
          )}
        </span>

        <div className="flex items-center justify-center gap-1 shrink-0">
          <Button
            variant="outline"
            size="icon"
            className="size-8 rounded-lg border-border/70 bg-background hover:border-primary/50 hover:bg-muted/40 focus-visible:border-primary focus-visible:ring-primary/20 cursor-pointer disabled:opacity-40"
            disabled={isFirstPage || isEmpty}
            onClick={() => setPage(1)}
            aria-label="Go to first page"
          >
            <ChevronsLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8 rounded-lg border-border/70 bg-background hover:border-primary/50 hover:bg-muted/40 focus-visible:border-primary focus-visible:ring-primary/20 cursor-pointer disabled:opacity-40"
            disabled={isFirstPage || isEmpty}
            onClick={() => setPage((current) => current - 1)}
            aria-label="Go to previous page"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8 rounded-lg border-border/70 bg-background hover:border-primary/50 hover:bg-muted/40 focus-visible:border-primary focus-visible:ring-primary/20 cursor-pointer disabled:opacity-40"
            disabled={isLastPage || isEmpty}
            onClick={() =>
              setPage((current) => Math.min(current + 1, lastPage))
            }
            aria-label="Go to next page"
          >
            <ChevronRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8 rounded-lg border-border/70 bg-background hover:border-primary/50 hover:bg-muted/40 focus-visible:border-primary focus-visible:ring-primary/20 cursor-pointer disabled:opacity-40"
            disabled={isLastPage || isEmpty}
            onClick={() => setPage(lastPage)}
            aria-label="Go to last page"
          >
            <ChevronsRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
