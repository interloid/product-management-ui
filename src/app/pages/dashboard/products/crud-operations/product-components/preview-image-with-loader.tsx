import { useEffect, useRef, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { waitForImageReady } from "@/app/pages/dashboard/products/crud-operations/product-utils/helpers";
import { cn } from "@/lib/utils";

export interface FormProductPreviewImageProps {
  src: string;
  alt: string;
  isRemoved?: boolean;
  className?: string;
}

export function FormProductPreviewImage({
  src,
  alt,
  isRemoved = false,
  className,
}: FormProductPreviewImageProps) {
  const [prevSrc, setPrevSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(Boolean(src));
  const [hasError, setHasError] = useState(false);
  const cancelLoadRef = useRef<(() => void) | null>(null);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setIsLoading(Boolean(src));
    setHasError(false);
  }

  useEffect(() => {
    return () => {
      cancelLoadRef.current?.();
      cancelLoadRef.current = null;
    };
  }, []);

  return (
    <>
      <img
        src={src}
        alt={alt}
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
        className={cn(
          "size-full object-contain sm:object-cover rounded-2xl transition-transform duration-300 ease-out group-hover:scale-105",
          isRemoved && "opacity-35 grayscale",
          className,
        )}
      />
      {isLoading && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-muted/40 backdrop-blur-xs"
          aria-label="Loading preview image"
        >
          <Spinner className="size-7 text-muted-foreground" />
        </div>
      )}
      {hasError && !isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-muted/50">
          <span className="text-xs font-medium text-muted-foreground">
            Image unavailable
          </span>
        </div>
      )}
    </>
  );
}

export interface PreviewThumbnailImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function PreviewThumbnailImage({
  src,
  alt,
  className = "size-full object-cover",
}: PreviewThumbnailImageProps) {
  const [prevSrc, setPrevSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(Boolean(src));
  const [hasError, setHasError] = useState(false);
  const cancelLoadRef = useRef<(() => void) | null>(null);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setIsLoading(Boolean(src));
    setHasError(false);
  }

  useEffect(() => {
    return () => {
      cancelLoadRef.current?.();
      cancelLoadRef.current = null;
    };
  }, []);

  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 z-5 flex items-center justify-center rounded-[inherit] bg-muted/60 backdrop-blur-2xs">
          <Spinner className="size-3.5 text-muted-foreground" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
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
        className={className}
      />
      {hasError && !isLoading && (
        <div className="absolute inset-0 z-5 flex items-center justify-center rounded-[inherit] bg-muted/80">
          <span className="text-[10px] font-medium text-muted-foreground">
            !
          </span>
        </div>
      )}
    </>
  );
}
