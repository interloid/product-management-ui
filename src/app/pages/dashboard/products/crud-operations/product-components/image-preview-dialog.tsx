import { useEffect, useRef, useState, useCallback, useMemo } from "react";
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
    <div className="relative flex size-full items-center justify-center overflow-hidden rounded-md bg-transparent">
      <img
        src={src}
        alt={alt}
        loading="eager"
        decoding="async"
        draggable={false}
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
        className="max-h-full max-w-full object-contain rounded-[inherit] pointer-events-none select-none"
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
  const hasMultiple = images.length > 1;

  // Cloned slides: [LastImage, Image1, Image2, ..., ImageN, FirstImage] for infinite loop
  const slides = useMemo(() => {
    if (!hasMultiple) return images;
    return [images[images.length - 1], ...images, images[0]];
  }, [images, hasMultiple]);

  // Track position: 1 is the first real image
  const [currentIndex, setCurrentIndex] = useState(() =>
    hasMultiple ? initialIndex + 1 : 0,
  );
  const [enableTransition, setEnableTransition] = useState(true);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const isAnimatingRef = useRef(false);
  const pointerStartX = useRef<number | null>(null);
  const pointerStartTime = useRef<number>(0);
  const isPointerDownRef = useRef(false);
  const wheelLockRef = useRef(false);
  const wheelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Cleanup wheel timer on unmount
  useEffect(() => {
    return () => {
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
    };
  }, []);

  // 0-based index for dots & thumbnails
  const realIndex = hasMultiple
    ? (currentIndex - 1 + images.length) % images.length
    : 0;

  const handlePrev = useCallback(() => {
    if (!hasMultiple || isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setEnableTransition(true);
    setCurrentIndex((prev) => prev - 1);
  }, [hasMultiple]);

  const handleNext = useCallback(() => {
    if (!hasMultiple || isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setEnableTransition(true);
    setCurrentIndex((prev) => prev + 1);
  }, [hasMultiple]);

  const handleSelectImage = useCallback((idx: number) => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setEnableTransition(true);
    setCurrentIndex(idx + 1);
  }, []);

  // When animation finishes: silently teleport if we are on a sentinel clone
  const handleTransitionEnd = () => {
    isAnimatingRef.current = false;
    if (!hasMultiple) return;

    if (currentIndex >= slides.length - 1) {
      setEnableTransition(false);
      setCurrentIndex(1);
    } else if (currentIndex <= 0) {
      setEnableTransition(false);
      setCurrentIndex(images.length);
    }
  };

  // Re-enable transition after silent teleport
  useEffect(() => {
    if (!enableTransition) {
      const raf1 = requestAnimationFrame(() => {
        const raf2 = requestAnimationFrame(() => {
          setEnableTransition(true);
        });
        return () => cancelAnimationFrame(raf2);
      });
      return () => cancelAnimationFrame(raf1);
    }
  }, [enableTransition]);

  // Unified Pointer Drag & Swipe (Mouse, Touch, and Stylus)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!hasMultiple || isAnimatingRef.current) return;
    if (e.button !== 0) return; // Only primary mouse button or touch

    isPointerDownRef.current = true;
    pointerStartX.current = e.clientX;
    pointerStartTime.current = Date.now();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current || pointerStartX.current === null) return;
    const diff = e.clientX - pointerStartX.current;

    // Small deadzone of 4px to distinguish click from drag
    if (!isDragging && Math.abs(diff) > 4) {
      setIsDragging(true);
    }

    if (isDragging) {
      setDragOffset(diff);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // ignore
    }

    if (isDragging) {
      setIsDragging(false);
      const diff = dragOffset;
      const elapsed = Date.now() - pointerStartTime.current;
      const isQuickFlick = elapsed < 280 && Math.abs(diff) > 15;
      const isDragExceeded = Math.abs(diff) > 28;

      if (diff < 0 && (isQuickFlick || isDragExceeded)) {
        handleNext();
      } else if (diff > 0 && (isQuickFlick || isDragExceeded)) {
        handlePrev();
      }
    }

    setDragOffset(0);
    pointerStartX.current = null;
  };

  // Trackpad / Mouse Wheel Scroll (Light, responsive, and naturally unlocked)
  const handleWheel = (e: React.WheelEvent) => {
    if (!hasMultiple || isAnimatingRef.current || isDragging) return;

    // If currently in motion/cooldown, drop momentum events without extending lock
    if (wheelLockRef.current) return;

    const absX = Math.abs(e.deltaX);
    const absY = Math.abs(e.deltaY);

    // Ignore tiny noise
    if (absX < 8 && absY < 8) return;

    let shouldNext = false;
    let shouldPrev = false;

    if (absX >= absY) {
      // Horizontal swipe (trackpad)
      if (absX >= 10) {
        shouldNext = e.deltaX > 0;
        shouldPrev = e.deltaX < 0;
      }
    } else {
      // Vertical scroll (mouse wheel)
      if (absY >= 10) {
        shouldNext = e.deltaY > 0;
        shouldPrev = e.deltaY < 0;
      }
    }

    if (!shouldNext && !shouldPrev) return;

    e.stopPropagation();

    // Lock for exactly the animation duration so momentum doesn't multi-skip
    wheelLockRef.current = true;
    if (shouldNext) {
      handleNext();
    } else {
      handlePrev();
    }

    if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
    wheelTimerRef.current = setTimeout(() => {
      wheelLockRef.current = false;
    }, 320);
  };

  // Keyboard Navigation
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

  // Auto-scroll active thumbnail into view
  useEffect(() => {
    thumbnailRefs.current[realIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [realIndex]);

  if (!images.length) return null;

  return (
    <div className="relative flex flex-col items-center gap-3">
      {/* Main Image Row with Prev / Next Buttons flanking on the outside */}
      <div className="relative flex items-center justify-center gap-2 sm:gap-3 w-full">
        {hasMultiple && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label="Previous image"
            className="group size-9 sm:size-10 shrink-0 rounded-full bg-background/95 text-foreground border border-border shadow-md backdrop-blur hover:bg-background hover:scale-105 active:scale-95 transition-all"
          >
            <ChevronLeft className="size-5 transition-transform duration-150 group-hover:-translate-x-0.5" />
          </Button>
        )}

        {/* Silky-Smooth Infinite Looping Slider Viewport */}
        <div
          className="relative overflow-hidden rounded-lg bg-muted/40 w-[75vw] sm:w-[560px] md:w-[640px] lg:w-[700px] max-w-full h-[55vh] sm:h-[460px] md:h-[500px] lg:h-[540px] max-h-[78vh] flex items-center justify-center select-none cursor-grab active:cursor-grabbing touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
        >
          {/* Smooth Sliding Track */}
          <div
            onTransitionEnd={handleTransitionEnd}
            className="flex size-full will-change-transform"
            style={{
              transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`,
              transition:
                !enableTransition || isDragging
                  ? "none"
                  : "transform 320ms cubic-bezier(0.2, 0.8, 0.25, 1)",
            }}
          >
            {slides.map((img, idx) => (
              <div
                key={`${img.src}-${idx}`}
                className="size-full shrink-0 flex items-center justify-center p-2"
              >
                <PreviewImage
                  src={img.src}
                  alt={img.alt ?? `Product image ${idx + 1}`}
                />
              </div>
            ))}
          </div>

          {/* Clickable Dotted Indicators */}
          {hasMultiple && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1.5 backdrop-blur-sm z-20">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectImage(idx);
                  }}
                  aria-label={`Go to image ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === realIndex
                      ? "w-4 bg-white"
                      : "w-1.5 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {hasMultiple && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Next image"
            className="group size-9 sm:size-10 shrink-0 rounded-full bg-background/95 text-foreground border border-border shadow-md backdrop-blur hover:bg-background hover:scale-105 active:scale-95 transition-all"
          >
            <ChevronRight className="size-5 transition-transform duration-150 group-hover:translate-x-0.5" />
          </Button>
        )}
      </div>

      {/* Thumbnails row */}
      {hasMultiple && (
        <div className="flex max-w-full gap-2 overflow-x-auto py-1 px-2">
          {images.map((img, idx) => (
            <button
              key={`${img.src}-${idx}`}
              ref={(el) => {
                thumbnailRefs.current[idx] = el;
              }}
              type="button"
              onClick={() => handleSelectImage(idx)}
              className={`relative size-12 shrink-0 overflow-hidden rounded-md border transition-all ${
                idx === realIndex
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
      <DialogContent className="max-w-4xl! w-fit overflow-hidden p-3 sm:p-5">
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
