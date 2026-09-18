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
          ? "bg-blue-50 hover:bg-blue-50"
          : "bg-red-50 hover:bg-red-50"
      }
    >
      <TableCell
        colSpan={8}
        className={
          confirmTone === "archive"
            ? "border-l-[3px] border-l-blue-600 py-4"
            : "border-l-[3px] border-l-cancel-button-background py-4"
        }
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <ProductImage src={image} alt={alt} />

            <div className="min-w-0">
              <p className="truncate text-start text-sm font-medium">{title}</p>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              disabled={isPending}
              className="hover:border-primary hover:bg-primary-hover"
            >
              Cancel
            </Button>

            <Button
              variant={confirmTone === "archive" ? "default" : "destructive"}
              size="sm"
              className="cursor-pointer"
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
