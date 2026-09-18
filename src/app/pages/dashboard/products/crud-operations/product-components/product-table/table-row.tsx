import { Check, Copy, Eye, MoreHorizontal, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TableCell, TableRow } from "@/components/ui/table";
import type { ProductTableRowProps } from "@/types/props";
import { ProductImage } from "./image";
import {
  formatDateTime,
  formatPrice,
  formatRelativeTime,
  getStatusClassName,
  getStatusLabel,
} from "@/lib/converters";
import { memo, useState } from "react";
import { getPrimaryImage } from "@/app/pages/dashboard/products/crud-operations/product-utils/helpers";
import { ProductActionConfirmationRow } from "./action-confirmation-row";
import { CategoryBadge } from "@/components/shad/category-badge";

export const ProductTableRow = memo(function ProductTableRow({
  product,
  isArchiving,
  isDeleting,
  isActionPending = false,
  density = "comfortable",
  onView,
  onEdit,
  onArchive,
  onCancelArchive,
  onConfirmArchive,
  onDelete,
  onCancelDelete,
  onConfirmDelete,
}: ProductTableRowProps) {
  const isCompact = density === "compact";
  const primaryImage = getPrimaryImage(product);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [isCopiedSku, setIsCopiedSku] = useState(false);

  if (isArchiving) {
    return (
      <ProductActionConfirmationRow
        image={primaryImage?.url}
        alt={product.name}
        title={`Archive "${product.name}"?`}
        description="It disappears from the active list."
        confirmLabel="Yes, archive"
        confirmTone="archive"
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
      className="group/row w-full cursor-pointer hover:bg-primary-hover transition-colors"
      onClick={onView}
    >
      <TableCell
        className={cn(
          "relative overflow-hidden pl-5! group-hover/row:shadow-[inset_3px_0_0_0_var(--primary)] before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-0.75 before:bg-primary before:opacity-0 group-hover/row:before:opacity-100 before:transition-opacity",
          isCompact ? "py-1.5" : "py-3",
        )}
      >
        <div className={cn("flex items-center min-w-0", isCompact ? "gap-2" : "gap-2.5")}>
          {primaryImage?.url ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="cursor-pointer shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onView();
                  }}
                >
                  <ProductImage
                    src={primaryImage.url}
                    alt={product.name}
                    size={isCompact ? "size-8" : "size-10"}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                align="center"
                sideOffset={8}
                hideArrow
                className="pointer-events-none z-50 rounded-lg border bg-popover p-1.5 text-popover-foreground shadow-xl"
              >
                <div className="flex flex-col items-center gap-1.5">
                  <img
                    src={primaryImage.url}
                    alt={product.name}
                    className="size-36 rounded-md object-cover"
                  />
                  <span className="max-w-36 truncate px-1 text-center text-[11px] font-medium text-muted-foreground">
                    {product.name}
                  </span>
                </div>
              </TooltipContent>
            </Tooltip>
          ) : (
            <ProductImage
              src={undefined}
              alt={product.name}
              size={isCompact ? "size-8" : "size-10"}
            />
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              void navigator.clipboard.writeText(product.sku);
              setIsCopiedSku(true);
              setTimeout(() => setIsCopiedSku(false), 1500);
            }}
            title={isCopiedSku ? "Copied!" : `Copy SKU: ${product.sku}`}
            className={cn(
              "group/sku inline-flex items-center gap-1 font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer truncate min-w-0",
              isCompact ? "text-[11px]" : "text-xs",
            )}
          >
            <span className="truncate tabular-nums">{product.sku}</span>
            {isCopiedSku ? (
              <Check className="size-3 text-emerald-600 shrink-0" />
            ) : (
              <Copy className="size-3 shrink-0 opacity-0 group-hover/sku:opacity-100 transition-opacity text-muted-foreground" />
            )}
          </button>
        </div>
      </TableCell>
      <TableCell className={cn("overflow-hidden", isCompact ? "py-1.5" : "py-3")}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onView();
          }}
          title={product.name}
          className={cn(
            "block w-full truncate text-left font-semibold text-foreground hover:text-primary transition-colors cursor-pointer",
            isCompact ? "text-xs" : "text-[13px]",
          )}
        >
          {product.name}
        </button>
      </TableCell>
      <TableCell className={cn("hidden truncate md:table-cell", isCompact ? "py-1.5" : "py-3")}>
        <CategoryBadge name={product.category_name} className="max-w-full truncate" />
      </TableCell>
      <TableCell className={cn("font-mono font-medium whitespace-nowrap tabular-nums", isCompact ? "py-1.5 text-xs" : "py-3 text-sm")}>
        {formatPrice(product.price)}
      </TableCell>
      <TableCell className={cn("font-mono whitespace-nowrap tabular-nums", isCompact ? "py-1.5 text-xs" : "py-3 text-sm")}>
        {product.stock === 0 ? (
          <span
            title="Out of stock"
            className="inline-flex items-center gap-1.5 font-semibold text-destructive"
          >
            <Package className={cn("shrink-0 text-destructive", isCompact ? "size-3" : "size-3.5")} />
            <span>0</span>
          </span>
        ) : product.stock <= 10 ? (
          <span
            title={`Low stock (${product.stock} left)`}
            className="inline-flex items-center gap-1.5 font-medium text-amber-600 dark:text-amber-400"
          >
            <Package className={cn("shrink-0 text-amber-500", isCompact ? "size-3" : "size-3.5")} />
            <span>{product.stock}</span>
          </span>
        ) : (
          <span
            title={`In stock (${product.stock})`}
            className="inline-flex items-center gap-1.5 text-foreground"
          >
            <Package className={cn("shrink-0 text-muted-foreground/70", isCompact ? "size-3" : "size-3.5")} />
            <span>{product.stock}</span>
          </span>
        )}
      </TableCell>
      <TableCell className={cn("whitespace-nowrap", isCompact ? "py-1.5" : "py-3")}>
        <Badge
          variant="outline"
          className={cn(
            getStatusClassName(product.status),
            isCompact && "text-[10px] px-2 py-0 h-4.5",
          )}
        >
          {getStatusLabel(product.status)}
        </Badge>
      </TableCell>
      <TableCell className={cn("hidden text-muted-foreground md:table-cell whitespace-nowrap overflow-hidden text-ellipsis tabular-nums", isCompact ? "py-1.5 text-[11px]" : "py-3 text-xs")}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-default border-b border-dotted border-muted-foreground/40 hover:text-foreground transition-colors">
              {formatRelativeTime(product.updated_at)}
            </span>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p className="text-xs">{formatDateTime(product.updated_at)}</p>
          </TooltipContent>
        </Tooltip>
      </TableCell>
      <TableCell className={cn(isCompact ? "py-1.5" : "py-3")} onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-end flex-row-reverse gap-1.5">
          <Button
            variant="outline"
            size="icon"
            className={cn("border-none! shadow-none!", isCompact ? "size-7" : "size-8")}
            onClick={(event) => {
              event.stopPropagation();
              onView();
            }}
            title="View"
          >
            <Eye className={isCompact ? "size-3.5" : "size-4"} />
          </Button>
          <DropdownMenu open={actionsOpen} onOpenChange={setActionsOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "hover:bg-primary-hover hover:border-primary focus-visible:border-primary focus-visible:ring-primary/20",
                  isCompact ? "size-7" : "size-8",
                )}
                onClick={(event) => {
                  event.stopPropagation();
                }}
              >
                <MoreHorizontal className={isCompact ? "size-3.5" : "size-4"} />
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
                  className="cursor-pointer hover:bg-primary-hover!"
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
                className="cursor-pointer hover:bg-primary-hover!"
              >
                Edit
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-destructive hover:bg-destructive/10! hover:text-destructive! cursor-pointer"
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
