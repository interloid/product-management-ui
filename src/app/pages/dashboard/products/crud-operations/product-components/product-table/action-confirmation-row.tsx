import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import { ProductImage } from "./image";
import type { ProductActionConfirmationRowProps } from "@/types/props";

export function ProductActionConfirmationRow({
  image,
  alt,
  title,
  description,
  confirmLabel,
  confirmTone = "delete",
  isPending = false,
  onCancel,
  onConfirm,
}: Readonly<ProductActionConfirmationRowProps>) {
  return (
    <TableRow
      className={
        confirmTone === "archive"
          ? "bg-blue-50/90 hover:bg-blue-50/90 dark:bg-blue-950/40 dark:hover:bg-blue-950/40 transition-colors"
          : "bg-red-50/90 hover:bg-red-50/90 dark:bg-destructive/10 dark:hover:bg-destructive/10 transition-colors"
      }
    >
      <TableCell
        colSpan={8}
        className={
          confirmTone === "archive"
            ? "border-l-[3px] border-l-blue-600 dark:border-l-blue-500 py-3 sm:py-4 px-3 sm:px-5"
            : "border-l-[3px] border-l-cancel-button-background dark:border-l-destructive py-3 sm:py-4 px-3 sm:px-5"
        }
      >
        <div className="flex w-full flex-col gap-3 whitespace-normal sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <ProductImage src={image} alt={alt} />

            <div className="min-w-0 flex-1">
              <p className="text-start text-sm font-semibold text-foreground break-words line-clamp-2">
                {title}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground break-words">
                {description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              disabled={isPending}
              className="h-8 sm:h-9 px-3 text-xs sm:text-sm hover:border-primary hover:bg-primary-hover cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              variant={confirmTone === "archive" ? "default" : "destructive"}
              size="sm"
              className="h-8 sm:h-9 px-3 text-xs sm:text-sm cursor-pointer"
              onClick={onConfirm}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Spinner className="size-3.5" />
                  Working…
                </>
              ) : (
                confirmLabel
              )}
            </Button>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}
