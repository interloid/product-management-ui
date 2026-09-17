import type { ImageOverlayControlsProps } from "@/types/props";

export function ImageOverlayControls({
  isPrimary,
  onSetPrimary,
}: ImageOverlayControlsProps) {
  return isPrimary ? (
    <span className="absolute bottom-1.5 left-1.5 z-20 rounded-md bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground shadow-sm">
      Primary
    </span>
  ) : onSetPrimary ? (
    <button
      type="button"
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        onSetPrimary?.();
      }}
      className="absolute bottom-1.5 left-1.5 z-20 rounded-md border bg-background/90 px-1.5 lg:px-2 py-0.5 text-[10px] lg:text-[11px] font-medium text-muted-foreground shadow-sm backdrop-blur transition-colors hover:bg-background hover:text-foreground"
    >
      Set primary
    </button>
  ) : null;
}
