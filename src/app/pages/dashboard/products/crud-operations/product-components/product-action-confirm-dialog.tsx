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
import { ProductImage } from "./product-table";
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
        className="w-full sm:max-w-lg p-6"
      >
        <DialogHeader>
          <div className="flex items-center gap-4">
            {image && (
              <ProductImage
                src={image}
                alt={alt}
                size="size-16"
                className="rounded-lg shadow-xs"
              />
            )}

            <div className="min-w-0 flex-1">
              <DialogTitle className="text-base sm:text-[17px] font-semibold leading-snug text-foreground">
                {title}
              </DialogTitle>

              <DialogDescription className="mt-1 text-sm text-muted-foreground leading-normal">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogFooter className="mt-1 gap-2 sm:space-x-0">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
            className="h-9 px-3.5 text-sm hover:border-primary hover:bg-primary-hover cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant={confirmTone === "archive" ? "default" : "destructive"}
            className="h-9 px-4 text-sm cursor-pointer"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Spinner className="mr-1.5 size-4" />
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
