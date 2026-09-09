import type { ApiProduct, ApiProductImage } from "@/types/data-type";

export function getPrimaryImage(
  product: ApiProduct,
): ApiProductImage | undefined {
  return (
    product.images?.find((image) => image.is_primary) ?? product.images?.[0]
  );
}

export function waitForImagePaint(callback: () => void): void {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      callback();
    });
  });
}

export function waitForImageReady(
  img: HTMLImageElement,
  callback: () => void,
): void {
  img
    .decode()
    .finally(() => {
      waitForImagePaint(callback);
    });
}
