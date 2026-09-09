import { useState } from "react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { waitForImageReady } from "@/app/pages/dashboard/products/crud-operations/product-utils/product-utils";

import type { ImagePreviewDialogProps } from "@/types/data-type";

function PreviewImage({ src, alt }: { src: string; alt: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative flex min-h-72 min-w-72 max-h-[80vh] items-center justify-center overflow-hidden rounded-md bg-muted-foreground/30">
      <img
        src={src}
        alt={alt}
        loading="eager"
        decoding="async"
        onLoad={(e) =>
          waitForImageReady(e.currentTarget, () => setIsLoading(false))
        }
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        className="max-h-[75vh] h-full w-full object-contain"
      />
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-muted-foreground">
          <Spinner className="size-8 text-background" />
        </div>
      )}
      {hasError && !isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-muted-foreground">
          <span className="text-sm font-medium text-background">
            Failed to load image
          </span>
        </div>
      )}
    </div>
  );
}

export function ImagePreviewDialog({
  image,
  open,
  onOpenChange,
}: ImagePreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl! w-fit overflow-hidden p-2">
        {image && (
          <PreviewImage key={image.src} src={image.src} alt={image.alt} />
        )}
      </DialogContent>
    </Dialog>
  );
}
