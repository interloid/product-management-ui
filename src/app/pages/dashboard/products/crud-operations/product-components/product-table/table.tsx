import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ProductTableRow } from "./table-row";
import { SortableHeader } from "@/components/shad/sortable-header";
import EmptyProductTableRow from "@/components/shad/empty-products";
import type { ProductTableProps } from "@/types/props";
import { useTableColumnResize } from "./use-table-column-resize";
import { ColumnResizeHandle } from "./column-resize-handle";

export function ProductTable({
  products,
  archiveId,
  deleteId,
  isActionPending = false,
  showNoResults = false,
  density = "normal",
  isAdmin = true,
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

  const {
    columnWidths,
    totalTableWidth,
    resizingCol,
    isCustomized,
    isMd,
    handleStartResize,
    handleResetColumn,
    handleResetAll,
  } = useTableColumnResize(containerRef);

  const checkScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const hasOverflow = el.scrollWidth > el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(
      hasOverflow && el.scrollLeft < el.scrollWidth - el.clientWidth - 4,
    );
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll, products, density, columnWidths]);

  const isCompact = density === "compact";
  const isComfort = density === "comfort" || density === "comfortable";

  const colStyle = (key: keyof typeof columnWidths) =>
    isMd
      ? {
          width: `${columnWidths[key]}px`,
          minWidth: `${columnWidths[key]}px`,
        }
      : undefined;

  const tableStyle =
    isMd && totalTableWidth
      ? {
          minWidth: `${totalTableWidth}px`,
        }
      : undefined;

  return (
    <div className="relative w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-border/80 bg-card shadow-xs ring-1 ring-black/4 dark:ring-white/6">
      <Table
        containerRef={containerRef}
        onContainerScroll={checkScroll}
        style={tableStyle}
        className="w-full table-fixed min-w-160"
        containerClassName="max-h-[calc(100vh-320px)] overflow-y-auto"
      >
        <TableHeader className="sticky top-0 z-20 bg-slate-50/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-border/80 [&_th]:bg-slate-50/95 dark:[&_th]:bg-zinc-900/95">
          <TableRow
            className={cn(
              "bg-slate-50/95 dark:bg-zinc-900/95 text-[11px] font-semibold tracking-wider uppercase hover:bg-slate-50/95 dark:hover:bg-zinc-900/95",
              isCompact ? "h-9" : isComfort ? "h-13" : "h-11",
            )}
          >
            <TableHead
              style={colStyle("sku")}
              className="relative group/th w-[22%] md:w-auto pl-5! text-[11px] font-semibold tracking-wider uppercase"
            >
              SKU
              <ColumnResizeHandle
                columnKey="sku"
                label="SKU"
                isResizing={resizingCol === "sku"}
                onStartResize={handleStartResize}
                onResetColumn={handleResetColumn}
              />
            </TableHead>
            <TableHead
              style={colStyle("name")}
              className="relative group/th w-[26%] md:w-auto text-[11px] font-semibold tracking-wider uppercase"
            >
              PRODUCT NAME
              <ColumnResizeHandle
                columnKey="name"
                label="Product Name"
                isResizing={resizingCol === "name"}
                onStartResize={handleStartResize}
                onResetColumn={handleResetColumn}
              />
            </TableHead>
            <TableHead
              style={colStyle("category")}
              className="relative group/th hidden md:table-cell md:w-auto text-[11px] font-semibold tracking-wider uppercase"
            >
              CATEGORY
              <ColumnResizeHandle
                columnKey="category"
                label="Category"
                isResizing={resizingCol === "category"}
                onStartResize={handleStartResize}
                onResetColumn={handleResetColumn}
              />
            </TableHead>
            <SortableHeader
              label="PRICE"
              field="price"
              sort={sort}
              onSort={onSort}
              style={colStyle("price")}
              className="w-[14%] md:w-auto"
            >
              <ColumnResizeHandle
                columnKey="price"
                label="Price"
                isResizing={resizingCol === "price"}
                onStartResize={handleStartResize}
                onResetColumn={handleResetColumn}
              />
            </SortableHeader>
            <SortableHeader
              label="STOCK"
              field="stock"
              sort={sort}
              onSort={onSort}
              style={colStyle("stock")}
              className="w-[12%] md:w-auto"
            >
              <ColumnResizeHandle
                columnKey="stock"
                label="Stock"
                isResizing={resizingCol === "stock"}
                onStartResize={handleStartResize}
                onResetColumn={handleResetColumn}
              />
            </SortableHeader>
            <SortableHeader
              label="STATUS"
              field="status"
              sort={sort}
              onSort={onSort}
              style={colStyle("status")}
              className="w-[14%] md:w-auto"
            >
              <ColumnResizeHandle
                columnKey="status"
                label="Status"
                isResizing={resizingCol === "status"}
                onStartResize={handleStartResize}
                onResetColumn={handleResetColumn}
              />
            </SortableHeader>
            <SortableHeader
              label="UPDATED"
              field="updated"
              sort={sort}
              onSort={onSort}
              style={colStyle("updated")}
              className="hidden md:table-cell md:w-auto"
            >
              <ColumnResizeHandle
                columnKey="updated"
                label="Updated"
                isResizing={resizingCol === "updated"}
                onStartResize={handleStartResize}
                onResetColumn={handleResetColumn}
              />
            </SortableHeader>
            <TableHead
              style={colStyle("actions")}
              className="group/actions w-[12%] md:w-auto text-[11px] font-semibold tracking-wider uppercase pr-4"
            >
              <div className="flex items-center justify-between gap-1.5">
                <span>ACTIONS</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleResetAll();
                      }}
                      className={cn(
                        "cursor-pointer p-1 rounded transition-all outline-none",
                        isCustomized
                          ? "text-primary hover:bg-primary-hover hover:text-primary"
                          : "text-muted-foreground/50 opacity-0 group-hover/actions:opacity-100 hover:text-foreground hover:bg-muted/80",
                      )}
                      aria-label="Reset column widths"
                    >
                      <RotateCcw className="size-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p className="text-xs">Reset column widths</p>
                  </TooltipContent>
                </Tooltip>
              </div>
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
                isAdmin={isAdmin}
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
      {canScrollLeft && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 bottom-0 z-20 w-6 bg-linear-to-r from-black/10 dark:from-black/35 to-transparent transition-opacity"
        />
      )}

      {canScrollRight && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 bottom-0 z-20 w-6 bg-linear-to-l from-black/10 dark:from-black/35 to-transparent transition-opacity"
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
