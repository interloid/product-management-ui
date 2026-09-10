import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { waitForImageReady } from "@/app/pages/dashboard/products/crud-operations/product-utils/product-utils";
import type { ImagePreviewDialogProps } from "@/types/props";
import type { PreviewImageItem } from "@/types/product";

function PreviewImage({ src, alt }: { src: string; alt: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const cancelLoadRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => cancelLoadRef.current?.();
  }, []);

  return (
    <div className="relative flex min-h-72 min-w-72 max-h-[75vh] w-full items-center justify-center overflow-hidden rounded-md bg-muted/40 bg-clip-padding">
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
        className="max-h-[75vh] max-w-full object-contain rounded-[inherit]"
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

function ImagePreviewSlider({
  images,
  initialIndex = 0,
}: {
  images: PreviewImageItem[];
  initialIndex?: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(() =>
    Math.max(0, Math.min(initialIndex, images.length - 1)),
  );

  const hasMultiple = images.length > 1;

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  useEffect(() => {
    if (!hasMultiple) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        handlePrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasMultiple, handlePrev, handleNext]);

  const currentImage = images[currentIndex];
  if (!currentImage) return null;

  return (
    <div className="relative flex flex-col items-center gap-3">
      <div className="relative flex items-center justify-center w-full">
        <PreviewImage
          key={currentImage.src}
          src={currentImage.src}
          alt={currentImage.alt ?? `Product image ${currentIndex + 1}`}
        />

        {hasMultiple && (
          <>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handlePrev}
              aria-label="Previous image"
              className="group absolute left-3 top-1/2 -translate-y-1/2 active:-translate-y-1/2! active:-translate-x-1! size-10 rounded-full bg-background/95 text-foreground border border-border shadow-lg backdrop-blur hover:bg-background hover:scale-105 active:scale-95 transition-all z-20"
            >
              <ChevronLeft className="size-5 transition-transform duration-150 group-hover:-translate-x-0.5 group-active:-translate-x-1" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleNext}
              aria-label="Next image"
              className="group absolute right-3 top-1/2 -translate-y-1/2 active:-translate-y-1/2! active:translate-x-1! size-10 rounded-full bg-background/95 text-foreground border border-border shadow-lg backdrop-blur hover:bg-background hover:scale-105 active:scale-95 transition-all z-20"
            >
              <ChevronRight className="size-5 transition-transform duration-150 group-hover:translate-x-0.5 group-active:translate-x-1" />
            </Button>
          </>
        )}
        {hasMultiple && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-2.5 py-0.5 text-xs text-white backdrop-blur-sm z-20">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
      {hasMultiple && (
        <div className="flex max-w-full gap-2 overflow-x-auto py-1 px-2">
          {images.map((img, idx) => (
            <button
              key={`${img.src}-${idx}`}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`relative size-10 shrink-0 overflow-hidden rounded border transition-all ${
                idx === currentIndex
                  ? "border-primary ring-2 ring-primary/30 scale-105"
                  : "border-border opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={img.src}
                alt={img.alt ?? ""}
                className="size-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ImagePreviewDialog({
  images: propImages,
  image,
  initialIndex = 0,
  open,
  onOpenChange,
}: ImagePreviewDialogProps) {
  const images: PreviewImageItem[] = propImages?.length
    ? propImages
    : image
      ? [image]
      : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl! w-fit overflow-hidden p-3 sm:p-4">
        {open && images.length > 0 && (
          <ImagePreviewSlider
            key={initialIndex}
            images={images}
            initialIndex={initialIndex}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
