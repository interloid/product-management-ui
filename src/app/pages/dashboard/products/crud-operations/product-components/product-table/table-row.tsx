import {
  MoreHorizontal,
  SquareArrowOutUpRight,
  TriangleAlert,
} from "lucide-react";
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
  density = "normal",
  isAdmin = true,
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
  const isComfort = density === "comfort" || density === "comfortable";
  const rowPadding = isCompact ? "py-1.5" : isComfort ? "py-4" : "py-2.5";
  const imageSize = isCompact ? "size-8" : isComfort ? "size-10" : "size-9";
  const actionButtonSize = isCompact
    ? "size-7"
    : isComfort
      ? "size-8.5"
      : "size-8";
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
      className={cn(
        "group/row w-full transition-colors",
        isAdmin ? "cursor-pointer hover:bg-primary-hover" : "hover:bg-muted/40",
      )}
      onClick={isAdmin ? onView : undefined}
    >
      <TableCell
        className={cn(
          "relative overflow-hidden pl-5!",
          isAdmin &&
            "group-hover/row:shadow-[inset_3px_0_0_0_var(--primary)] before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-0.75 before:bg-primary before:opacity-0 group-hover/row:before:opacity-100 before:transition-opacity",
          rowPadding,
        )}
      >
        <div
          className={cn(
            "flex items-center min-w-0",
            isCompact ? "gap-2" : isComfort ? "gap-3" : "gap-2.5",
          )}
        >
          {primaryImage?.url ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={cn("shrink-0", isAdmin && "cursor-pointer")}
                  onClick={
                    isAdmin
                      ? (e) => {
                          e.stopPropagation();
                          onView();
                        }
                      : undefined
                  }
                >
                  <ProductImage
                    src={primaryImage.url}
                    alt={product.name}
                    size={imageSize}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                align="center"
                sideOffset={8}
                hideArrow
                data-image-tooltip="true"
                className=" flex flex-col items-center pointer-events-none z-50 p-0 bg-white! border-none! shadow-none!"
              >
                <img
                  src={primaryImage.url}
                  alt={product.name}
                  className="size-36 rounded-lg object-cover shadow-2xl border border-border/80"
                />
                <span className="max-w-36 truncate rounded-lg bg-background/95 px-3 py-0.5 text-center text-[11px] font-medium text-foreground shadow-xs border border-border/60">
                  {product.name}
                </span>
              </TooltipContent>
            </Tooltip>
          ) : (
            <ProductImage src={undefined} alt={product.name} size={imageSize} />
          )}
          <span
            className={cn(
              "font-mono text-muted-foreground truncate min-w-0 tabular-nums",
              isCompact ? "text-[11px]" : "text-xs",
            )}
          >
            {product.sku}
          </span>
        </div>
      </TableCell>
      <TableCell className={cn("overflow-hidden", rowPadding)}>
        {isAdmin ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onView();
            }}
            title={product.name}
            className={cn(
              "block w-full truncate text-left font-semibold text-foreground hover:text-primary transition-colors cursor-pointer",
              isCompact
                ? "text-xs"
                : isComfort
                  ? "text-sm font-medium"
                  : "text-[13px]",
            )}
          >
            {product.name}
          </button>
        ) : (
          <span
            title={product.name}
            className={cn(
              "block w-full truncate text-left font-semibold text-foreground select-text",
              isCompact
                ? "text-xs"
                : isComfort
                  ? "text-sm font-medium"
                  : "text-[13px]",
            )}
          >
            {product.name}
          </span>
        )}
      </TableCell>
      <TableCell className={cn("hidden truncate md:table-cell", rowPadding)}>
        <CategoryBadge
          name={product.category_name}
          className="max-w-full truncate"
        />
      </TableCell>
      <TableCell
        className={cn(
          "font-mono font-medium whitespace-nowrap tabular-nums",
          rowPadding,
          isCompact ? "text-xs" : "text-sm",
        )}
      >
        {formatPrice(product.price)}
      </TableCell>
      <TableCell
        className={cn(
          "font-medium whitespace-nowrap tabular-nums",
          rowPadding,
          isCompact ? "text-xs" : "text-sm",
        )}
      >
        {product.stock === 0 ? (
          <span
            title="Out of stock"
            className="inline-flex items-center gap-1 font-semibold text-destructive"
          >
            <TriangleAlert
              className={cn(isCompact ? "size-3" : "size-3.5", "shrink-0")}
            />
            <span>0</span>
          </span>
        ) : product.stock <= 10 ? (
          <span
            title={`Low stock (${product.stock} left)`}
            className="inline-flex items-center gap-1.5 font-medium text-amber-600 dark:text-amber-400"
          >
            <span>{product.stock}</span>
          </span>
        ) : (
          <span
            title={`In stock (${product.stock})`}
            className="inline-flex items-center gap-1.5 text-foreground"
          >
            <span>{product.stock}</span>
          </span>
        )}
      </TableCell>
      <TableCell className={cn("whitespace-nowrap", rowPadding)}>
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
      <TableCell
        className={cn(
          "hidden text-muted-foreground md:table-cell whitespace-nowrap overflow-hidden text-ellipsis tabular-nums",
          rowPadding,
          isCompact ? "text-[11px]" : "text-xs",
        )}
      >
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
      <TableCell
        className={cn(rowPadding)}
        onClick={(event) => event.stopPropagation()}
      >
        {isAdmin ? (
          <div className="flex items-center justify-end flex-row-reverse gap-1.5">
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "border-none! shadow-none! hover:bg-primary-hover hover:border-primary focus-visible:border-primary focus-visible:ring-primary/20",
                actionButtonSize,
              )}
              onClick={(event) => {
                event.stopPropagation();
                onView();
              }}
              title="View"
            >
              <SquareArrowOutUpRight
                className={isCompact ? "size-3.5" : "size-4"}
              />
            </Button>
            <DropdownMenu open={actionsOpen} onOpenChange={setActionsOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(
                    "hover:bg-primary-hover hover:border-primary focus-visible:border-primary focus-visible:ring-primary/20",
                    actionButtonSize,
                  )}
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <MoreHorizontal
                    className={isCompact ? "size-3.5" : "size-4"}
                  />
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
        ) : (
          <div className="flex items-center justify-start! pr-2 text-muted-foreground/40 text-xs select-none">
            —
          </div>
        )}
      </TableCell>
    </TableRow>
  );
});
