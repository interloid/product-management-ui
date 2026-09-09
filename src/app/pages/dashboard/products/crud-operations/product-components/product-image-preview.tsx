import { Eye } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ImagePreviewDialog } from "./image-preview-dialog";
import type { ProductImagePreviewProps } from "@/types/data-type";
import { Spinner } from "@/components/ui/spinner";
import { waitForImageReady } from "@/app/pages/dashboard/products/crud-operations/product-utils/product-utils";

export function ProductImagePreview({
  src,
  alt,
  className = "",
}: ProductImagePreviewProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const cancelLoadRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => cancelLoadRef.current?.();
  }, []);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    cancelLoadRef.current?.();
    cancelLoadRef.current = waitForImageReady(e.currentTarget, () =>
      setIsLoading(false),
    );
  };

  const handleError = () => {
    cancelLoadRef.current?.();
    cancelLoadRef.current = null;
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={isLoading || hasError}
        aria-label={`Preview ${alt}`}
        className={`group relative block overflow-hidden ${className}`}
      >
        <img
          src={src}
          alt={alt}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
        />
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center bg-muted">
            <Spinner className="size-5 text-muted-foreground" />
          </span>
        )}

        {hasError && (
          <span className="absolute inset-0 flex items-center justify-center bg-muted">
            <span className="text-[10px] font-medium text-muted-foreground">
              Failed to load image
            </span>
          </span>
        )}

        {!isLoading && !hasError && (
          <span className="pointer-events-none absolute inset-0 m-auto flex size-9 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white opacity-0 shadow-lg backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
            <Eye className="size-4" />
          </span>
        )}
      </button>
      <ImagePreviewDialog
        image={open ? { src, alt } : null}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
