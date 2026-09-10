import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import { ProductImage } from "./product-image";
import type { ProductActionConfirmationRowProps } from "@/types/props";

export function ProductActionConfirmationRow({
  image,
  alt,
  title,
  description,
  confirmLabel,
  isPending = false,
  onCancel,
  onConfirm,
}: ProductActionConfirmationRowProps) {
  return (
    <TableRow className="bg-red-50 hover:bg-red-50">
      <TableCell
        colSpan={8}
        className="border-l-2 border-l-cancel-button-background py-4"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <ProductImage src={image} alt={alt} />

            <div className="min-w-0">
              <p className="truncate text-start text-sm font-medium">
                {title}
              </p>

              <p className="text-sm text-muted-foreground">
                {description}
              </p>
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
              size="sm"
              className="bg-red-600 text-white hover:bg-red-700"
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
