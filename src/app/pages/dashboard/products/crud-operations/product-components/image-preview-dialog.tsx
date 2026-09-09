import { useEffect, useRef, useState } from "react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { waitForImageReady } from "@/app/pages/dashboard/products/crud-operations/product-utils/product-utils";

import type { ImagePreviewDialogProps } from "@/types/data-type";

function PreviewImage({ src, alt }: { src: string; alt: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const cancelLoadRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => cancelLoadRef.current?.();
  }, []);

  return (
    <div className="relative flex min-h-72 min-w-72 max-h-[80vh] items-center justify-center overflow-hidden rounded-md bg-muted/40 bg-clip-padding">
      <img
        src={src}
        alt={alt}
        loading="eager"
        decoding="async"
        onLoad={(e) => {
          cancelLoadRef.current?.();
          cancelLoadRef.current = waitForImageReady(e.currentTarget, () =>
            setIsLoading(false),
          );
        }}
        onError={() => {
          cancelLoadRef.current?.();
          cancelLoadRef.current = null;
          setIsLoading(false);
          setHasError(true);
        }}
        className="max-h-[75vh] h-full w-full object-contain rounded-[inherit]"
      />
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[inherit] bg-muted/50">
          <Spinner className="size-8 text-muted-foreground" />
        </div>
      )}
      {hasError && !isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[inherit] bg-muted/50">
          <span className="text-sm font-medium text-muted-foreground">
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
