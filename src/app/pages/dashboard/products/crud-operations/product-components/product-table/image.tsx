import { useEffect, useRef, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { waitForImageReady } from "@/app/pages/dashboard/products/crud-operations/product-utils/helpers";
import type { ProductImageProps } from "@/types/props";

export function ProductImage({
  src,
  alt,
  className = "",
  size = "size-10",
  interactive = false,
}: Readonly<ProductImageProps>) {
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

  if (!src || hasError) {
    return (
      <div
        className={`${size} shrink-0 overflow-hidden rounded-md border bg-muted ${className}`}
      >
        <div
          className="size-full"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(0,0,0,0.06) 4px, rgba(0,0,0,0.06) 6px)",
          }}
        />
      </div>
    );
  }
  return (
    <div
      className={`relative ${size} shrink-0 overflow-hidden rounded-md border bg-muted/40 bg-clip-padding ${interactive ? "group/img cursor-pointer" : ""} ${className}`}
    >
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[inherit] bg-muted/50">
          <Spinner className="size-4 text-muted-foreground" />
        </div>
      )}
      <img
        src={src}
        alt={alt ?? "Product"}
        loading="lazy"
        decoding="async"
        className={`size-full object-cover rounded-[inherit] ${interactive ? "transition-transform duration-300 ease-out group-hover/img:scale-110" : ""}`}
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
      />
      {!isLoading && !hasError && interactive && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-[inherit] transition-opacity duration-200 ">
        </div>
      )}
    </div>
  );
}
