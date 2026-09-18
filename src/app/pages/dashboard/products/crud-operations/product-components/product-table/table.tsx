import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductTableRow } from "./table-row";
import { SortableHeader } from "@/components/shad/sortable-header";
import EmptyProductTableRow from "@/components/shad/empty-products";
import type { ProductTableProps } from "@/types/props";

export function ProductTable({
  products,
  archiveId,
  deleteId,
  isActionPending = false,
  showNoResults = false,
  density = "comfortable",
  sort,
  onSort,
  onView,
  onEdit,
  onArchive,
  onCancelArchive,
  onConfirmArchive,
  onDelete,
  onCancelDelete,
  onConfirmDelete,
  onResetFilters,
}: Readonly<ProductTableProps>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const hasOverflow = el.scrollWidth > el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(hasOverflow && el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll, products, density]);

  const isCompact = density === "compact";

  return (
    <div className="relative w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-border/80 bg-card shadow-xs ring-1 ring-black/4 dark:ring-white/6">
      <Table
        containerRef={containerRef}
        onContainerScroll={checkScroll}
        className="table-fixed min-w-[640px] md:min-w-240"
        containerClassName="max-h-[calc(100vh-270px)] overflow-y-auto"
      >
        <TableHeader className="sticky top-0 z-20 bg-muted/90 backdrop-blur-md [&_th]:bg-muted/90">
          <TableRow
            className={cn(
              "bg-muted/90 text-[11px] font-semibold tracking-wider uppercase hover:bg-muted/90",
              isCompact ? "h-9" : "h-12",
            )}
          >
            <TableHead className="w-[22%] md:w-[17%] min-w-32 md:min-w-38.75 pl-5! text-[11px] font-semibold tracking-wider uppercase">
              SKU
            </TableHead>
            <TableHead className="w-[26%] md:w-[20%] min-w-36 md:min-w-40 text-[11px] font-semibold tracking-wider uppercase">
              PRODUCT NAME
            </TableHead>
            <TableHead className="hidden md:table-cell md:w-[10%] min-w-25 text-[11px] font-semibold tracking-wider uppercase">
              CATEGORY
            </TableHead>
            <SortableHeader
              label="PRICE"
              field="price"
              sort={sort}
              onSort={onSort}
              className="w-[14%] md:w-[9%] min-w-20 md:min-w-21.25"
            />
            <SortableHeader
              label="STOCK"
              field="stock"
              sort={sort}
              onSort={onSort}
              className="w-[12%] md:w-[7%] min-w-18 md:min-w-20"
            />
            <SortableHeader
              label="STATUS"
              field="status"
              sort={sort}
              onSort={onSort}
              className="w-[14%] md:w-[11%] min-w-24 md:min-w-28.75"
            />
            <SortableHeader
              label="UPDATED"
              field="updated"
              sort={sort}
              onSort={onSort}
              className="hidden md:table-cell md:w-[15%] min-w-40"
            />
            <TableHead className="w-[12%] md:w-[10%] min-w-20 md:min-w-23.75 text-center xl:text-left text-[11px] font-semibold tracking-wider uppercase">
              ACTIONS
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length > 0 ? (
            products.map((product) => (
              <ProductTableRow
                key={product.id}
                product={product}
                density={density}
                isArchiving={archiveId === product.id}
                isDeleting={deleteId === product.id}
                isActionPending={isActionPending}
                onView={() => onView(product)}
                onEdit={() => onEdit(product)}
                onArchive={() => onArchive(product.id)}
                onCancelArchive={onCancelArchive}
                onConfirmArchive={() => onConfirmArchive(product.id)}
                onDelete={() => onDelete(product.id)}
                onCancelDelete={onCancelDelete}
                onConfirmDelete={() => onConfirmDelete(product.id)}
              />
            ))
          ) : (
            <EmptyProductTableRow
              showNoResults={showNoResults}
              onResetFilters={onResetFilters}
            />
          )}
        </TableBody>
      </Table>

      {/* Horizontal scroll indicators */}
      {canScrollLeft && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 bottom-0 z-20 w-6 bg-gradient-to-r from-black/10 dark:from-black/35 to-transparent transition-opacity"
        />
      )}

      {canScrollRight && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 bottom-0 z-20 w-6 bg-gradient-to-l from-black/10 dark:from-black/35 to-transparent transition-opacity"
        />
      )}

      {canScrollRight && (
        <div className="pointer-events-none absolute right-2.5 bottom-2.5 z-25 flex items-center gap-1 rounded-full border border-border/80 bg-background/95 px-2 py-0.5 text-[10px] font-medium text-muted-foreground shadow-xs backdrop-blur-xs md:hidden animate-pulse">
          <span>Swipe</span>
          <ChevronRight className="size-3" />
        </div>
      )}
    </div>
  );
}
