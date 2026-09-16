import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ProductImage } from "./productTable/product-image";
import type { ProductActionConfirmDialogProps } from "@/types/props";

export function ProductActionConfirmDialog({
  open,
  image,
  alt,
  title,
  description,
  confirmLabel,
  confirmTone = "delete",
  isPending = false,
  onCancel,
  onConfirm,
}: Readonly<ProductActionConfirmDialogProps>) {
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value && !isPending) {
          onCancel();
        }
      }}
    >
      <DialogContent
        showCloseButton={!isPending}
        className="max-w-lg p-6"
      >
<DialogHeader>
          <div className="flex items-center gap-4">
            {image && (
              <ProductImage
                src={image}
                alt={alt}
                size="size-16"
                className="rounded-lg"
              />
            )}

            <div className="min-w-0">
              <DialogTitle className="truncate text-base font-semibold">
                {title}
              </DialogTitle>

              <DialogDescription className="mt-1 text-sm">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
            className="hover:border-primary hover:bg-primary-hover"
          >
            Cancel
          </Button>
          <Button
            className={
              confirmTone === "archive"
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-red-600 text-white hover:bg-red-700"
            }
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}