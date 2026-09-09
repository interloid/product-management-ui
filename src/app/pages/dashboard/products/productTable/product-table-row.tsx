import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import type { ProductTableRowProps } from "@/types/data-type";
import { ProductImage } from "./product-image";
import {
  formatDateTime,
  getStatusClassName,
  getStatusLabel,
} from "@/lib/converters";
import { memo, useState } from "react";
import { getPrimaryImage } from "@/app/pages/dashboard/products/crud-operations/product-utils/product-utils";
import { ProductActionConfirmationRow } from "./product-action-confirmation-row";

export const ProductTableRow = memo(function ProductTableRow({
  product,
  isArchiving,
  isDeleting,
  isActionPending = false,
  onEdit,
  onView,
  onArchive,
  onCancelArchive,
  onConfirmArchive,
  onDelete,
  onCancelDelete,
  onConfirmDelete,
}: ProductTableRowProps) {
  const primaryImage = getPrimaryImage(product);
  const [actionsOpen, setActionsOpen] = useState(false);

  if (isArchiving) {
    return (
      <ProductActionConfirmationRow
        image={primaryImage?.url}
        alt={product.name}
        title={`Archive "${product.name}"?`}
        description="It disappears from the active list."
        confirmLabel="Yes, archive"
        isPending={isActionPending}
        onCancel={onCancelArchive}
        onConfirm={onConfirmArchive}
      />
    );
  }
  if (isDeleting) {
    return (
      <ProductActionConfirmationRow
        image={primaryImage?.url}
        alt={product.name}
        title={`Delete "${product.name}"?`}
        description="This permanently removes the product."
        confirmLabel="Yes, delete"
        isPending={isActionPending}
        onCancel={onCancelDelete}
        onConfirm={onConfirmDelete}
      />
    );
  }
  return (
    <TableRow
      className="relative cursor-pointer hover:bg-primary-hover"
      onClick={onView}
    >
      <TableCell>
        <div className="flex items-center gap-3">
          <ProductImage src={primaryImage?.url} alt={product.name} />
          <span className="hidden font-mono text-xs text-muted-foreground min-[420px]:inline">
            {product.sku}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <button
          type="button"
          onClick={onView}
          className="max-w-40 truncate text-center text-sm font-semibold hover:underline sm:max-w-none"
        >
          {product.name}
        </button>
      </TableCell>
      <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
        {product.category_name}
      </TableCell>
      <TableCell className="text-center font-mono text-sm">
        ${Number(product.price).toFixed(2)}
      </TableCell>
      <TableCell className="text-center text-sm">{product.stock}</TableCell>
      <TableCell>
        <Badge variant="outline" className={getStatusClassName(product.status)}>
          {getStatusLabel(product.status)}
        </Badge>
      </TableCell>
      <TableCell className="hidden text-center text-xs text-muted-foreground md:table-cell">
        {formatDateTime(product.updated_at)}
      </TableCell>
      <TableCell
        className="relative z-20"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-8 hover:bg-primary-hover hover:border-primary focus-visible:border-primary focus-visible:ring-primary/20"
            onClick={(event) => {
              event.stopPropagation();
              onView();
            }}
          >
            View
          </Button>
          <DropdownMenu open={actionsOpen} onOpenChange={setActionsOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="size-8 hover:bg-primary-hover hover:border-primary focus-visible:border-primary focus-visible:ring-primary/20"
                onClick={(event) => {
                  event.stopPropagation();
                }}
              >
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Product actions</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => event.stopPropagation()}
            >
              {product.status !== "archived" && (
                <DropdownMenuItem
                  onSelect={(event) => {
                    event.preventDefault();

                    setActionsOpen(false);
                    onArchive();
                  }}
                  className="cursor-pointer"
                >
                  Archive
                </DropdownMenuItem>
              )}

              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();

                  setActionsOpen(false);
                  onEdit();
                }}
                className="cursor-pointer"
              >
                Edit
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-cancel-button-background hover:text-red-600! hover:bg-primary cursor-pointer"
                onSelect={(event) => {
                  event.preventDefault();

                  setActionsOpen(false);
                  onDelete();
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
});
