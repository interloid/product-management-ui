import type { ApiProduct, ApiProductImage } from "@/types/data-type";

export function getPrimaryImage(
  product: ApiProduct,
): ApiProductImage | undefined {
  return (
    product.images?.find((image) => image.is_primary) ?? product.images?.[0]
  );
}

export function waitForImageReady(
  img: HTMLImageElement,
  callback: () => void,
): () => void {
  let cancelled = false;
  let rafId: number | undefined;

  function paint() {
    if (cancelled) return;
    rafId = requestAnimationFrame(() => {
      if (cancelled) return;
      rafId = requestAnimationFrame(() => {
        if (!cancelled) callback();
      });
    });
  }

  img.decode().finally(paint);

  return () => {
    cancelled = true;
    if (rafId !== undefined) {
      cancelAnimationFrame(rafId);
    }
  };
}
