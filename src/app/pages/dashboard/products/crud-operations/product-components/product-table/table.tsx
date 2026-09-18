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
  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-border/80 bg-card shadow-xs ring-1 ring-black/4 dark:ring-white/6">
      <Table
        className="table-fixed min-w-[640px] md:min-w-240"
        containerClassName="max-h-[calc(100vh-270px)] overflow-y-auto"
      >
        <TableHeader className="sticky top-0 z-20 h-12 bg-muted/90 backdrop-blur-md [&_th]:bg-muted/90">
          <TableRow className="bg-muted/90 text-[11px] font-semibold tracking-wider uppercase hover:bg-muted/90">
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
    </div>
  );
}
