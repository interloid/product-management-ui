import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductTableRow } from "./product-table-row";
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
    <div className="overflow-hidden rounded-lg border">
      <Table
        className="table-fixed min-w-240"
        containerClassName="max-h-[calc(100vh-270px)] overflow-y-auto"
      >
        <TableHeader className="sticky top-0 z-20 h-15! bg-muted/95 backdrop-blur-xs shadow-md [&_th]:bg-muted">
          <TableRow className="bg-muted text-xs text-muted-text hover:bg-muted">
            <TableHead className="w-[17%] min-w-38.75 pl-5!">SKU</TableHead>
            <TableHead className="w-[20%] min-w-40">PRODUCT NAME</TableHead>
            <TableHead className="hidden md:table-cell w-[10%] min-w-25">
              CATEGORY
            </TableHead>
            <SortableHeader
              label="PRICE"
              field="price"
              sort={sort}
              onSort={onSort}
              className="w-[9%] min-w-21.25"
            />
            <SortableHeader
              label="STOCK"
              field="stock"
              sort={sort}
              onSort={onSort}
              className="w-[7%] min-w-17.5"
            />
            <SortableHeader
              label="STATUS"
              field="status"
              sort={sort}
              onSort={onSort}
              className="w-[11%] min-w-28.75"
            />
            <SortableHeader
              label="UPDATED"
              field="updated"
              sort={sort}
              onSort={onSort}
              className="hidden md:table-cell w-[15%] min-w-40"
            />
            <TableHead className="w-[10%] min-w-23.75 text-center xl:text-left">
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
