import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { waitForImageReady } from "@/app/pages/dashboard/products/crud-operations/utils/product-utils";
import type { ProductImageProps } from "@/types/data-type";

export function ProductImage({ src, alt, className = "" }: ProductImageProps) {
  const [isLoading, setIsLoading] = useState(Boolean(src));
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`size-10 shrink-0 overflow-hidden rounded-md border bg-muted-foreground/30 ${className}`}
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
      className={`relative size-10 shrink-0 overflow-hidden rounded-md border bg-muted-foreground/30 ${className}`}
    >
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-muted-foreground">
          <Spinner className="size-4 text-background" />
        </div>
      )}
      <img
        src={src}
        alt={alt ?? "Product"}
        width={40}
        height={40}
        loading="eager"
        decoding="async"
        className="size-full object-cover"
        onLoad={(e) =>
          waitForImageReady(e.currentTarget, () => setIsLoading(false))
        }
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
}
