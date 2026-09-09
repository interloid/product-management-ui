import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";

import type {
  ApiProductImage,
  ImageError,
  ProductImage,
} from "@/types/data-type";

import { revokeImageUrls } from "@/lib/utils";

import {
  MAX_IMAGES,
  validateImage,
} from "@/app/pages/dashboard/products/crud-operations/product-components/product-constants";

type UseProductImagesProps = {
  maxImages?: number;
  isSubmitting?: boolean;
  existingImages?: ApiProductImage[];
};

export function useProductImages({
  maxImages = MAX_IMAGES,
  isSubmitting = false,
  existingImages = [],
}: UseProductImagesProps = {}) {
  const [newImages, setNewImages] = useState<ProductImage[]>([]);

  const [removedImageIds, setRemovedImageIds] = useState<Set<string>>(
    new Set(),
  );

  const [primaryExistingImageId, setPrimaryExistingImageId] = useState<
    string | null
  >(() => existingImages.find((image) => image.is_primary)?.id ?? null);

  const [imageError, setImageError] = useState<ImageError | null>(null);

  const [isDragging, setIsDragging] = useState(false);

  const newImagesRef = useRef<ProductImage[]>([]);

  useEffect(() => {
    newImagesRef.current = newImages;
  }, [newImages]);

  useEffect(() => {
    return () => {
      revokeImageUrls(newImagesRef.current);
    };
  }, []);

  const activeExistingImages = useMemo(
    () => existingImages.filter((image) => !removedImageIds.has(image.id)),
    [existingImages, removedImageIds],
  );

  const removedExistingImages = useMemo(
    () => existingImages.filter((image) => removedImageIds.has(image.id)),
    [existingImages, removedImageIds],
  );

  const totalImageCount = activeExistingImages.length + newImages.length;

  const remainingSlots = Math.max(maxImages - totalImageCount, 0);

  const primaryExistingImage = activeExistingImages.find(
    (image) => image.id === primaryExistingImageId,
  );

  const primaryNewImage = newImages.find((image) => image.isPrimary);

  const currentPrimaryImageId =
    primaryExistingImageId ?? primaryNewImage?.id ?? null;

  const initialPrimaryExistingImageId = useRef(
    existingImages.find((image) => image.is_primary)?.id ?? null,
  );

  const isDirty =
    newImages.length > 0 ||
    removedImageIds.size > 0 ||
    primaryExistingImageId !== initialPrimaryExistingImageId.current;

  function processFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList);

    if (files.length === 0) {
      return;
    }

    setImageError(null);

    if (remainingSlots <= 0) {
      setImageError({
        message: `You can upload a maximum of ${maxImages} images.`,
      });

      return;
    }

    let firstError: ImageError | null = null;

    if (files.length > remainingSlots) {
      firstError = {
        message: `You can only add ${remainingSlots} more image${
          remainingSlots === 1 ? "" : "s"
        }.`,
      };
    }

    const filesToProcess = files.slice(0, remainingSlots);

    const addedImages: ProductImage[] = [];

    for (const file of filesToProcess) {
      const validationError = validateImage(file);

      if (validationError) {
        firstError ??= validationError;

        continue;
      }

      const shouldBecomePrimary =
        activeExistingImages.length === 0 &&
        newImages.length === 0 &&
        addedImages.length === 0;

      addedImages.push({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
        isPrimary: shouldBecomePrimary,
      });
    }

    if (addedImages.length > 0) {
      setNewImages((previous) => [...previous, ...addedImages]);
    }

    setImageError(firstError);
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    processFiles(event.target.files ?? []);

    event.target.value = "";
  }

  function handleDragEnter(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (isSubmitting || remainingSlots <= 0) {
      return;
    }

    setIsDragging(true);
  }

  function handleDragOver(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (isSubmitting || remainingSlots <= 0) {
      return;
    }

    event.dataTransfer.dropEffect = "copy";

    setIsDragging(true);
  }

  function handleDragLeave(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (event.currentTarget.contains(event.relatedTarget as Node)) {
      return;
    }

    setIsDragging(false);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    event.stopPropagation();

    setIsDragging(false);

    if (isSubmitting) {
      return;
    }

    processFiles(event.dataTransfer.files);
  }

  function removeImage(id: string) {
    const image = newImages.find((item) => item.id === id);

    if (!image) {
      return;
    }

    revokeImageUrls([image]);

    const remainingImages = newImages.filter((item) => item.id !== id);

    if (image.isPrimary) {
      const fallback = remainingImages[0];

      if (fallback) {
        setNewImages(
          remainingImages.map((item) => ({
            ...item,
            isPrimary: item.id === fallback.id,
          })),
        );

        return;
      }

      if (activeExistingImages.length > 0) {
        setExistingImagePrimary(activeExistingImages[0].id);
      }
    }

    setNewImages(remainingImages);
  }

  function setPrimaryImage(id: string) {
    const imageExists = newImages.some((image) => image.id === id);

    if (!imageExists) {
      return;
    }

    setPrimaryExistingImageId(null);

    setNewImages((images) =>
      images.map((image) => ({
        ...image,
        isPrimary: image.id === id,
      })),
    );
  }
  function setExistingImagePrimary(id: string) {
    const imageExists = activeExistingImages.some((image) => image.id === id);

    if (!imageExists) {
      return;
    }

    setPrimaryExistingImageId(id);

    setNewImages((images) =>
      images.map((image) => ({
        ...image,
        isPrimary: false,
      })),
    );
  }

  function toggleRemoveExistingImage(id: string) {
    const image = existingImages.find((item) => item.id === id);

    if (!image) {
      return;
    }

    const isRemoving = !removedImageIds.has(id);

    const nextRemovedIds = new Set(removedImageIds);

    if (isRemoving) {
      nextRemovedIds.add(id);
    } else {
      nextRemovedIds.delete(id);
    }

    setRemovedImageIds(nextRemovedIds);

    if (isRemoving && primaryExistingImageId === id) {
      const fallbackExisting = existingImages.find(
        (item) => item.id !== id && !nextRemovedIds.has(item.id),
      );

      if (fallbackExisting) {
        setExistingImagePrimary(fallbackExisting.id);
        return;
      }

      const fallbackNew = newImages[0];

      if (fallbackNew) {
        setPrimaryImage(fallbackNew.id);
      }
    }
  }

  function clearImages() {
    revokeImageUrls(newImages);

    setNewImages([]);
    setRemovedImageIds(new Set());
    setPrimaryExistingImageId(
      existingImages.find((image) => image.is_primary)?.id ?? null,
    );
    setImageError(null);
    setIsDragging(false);
  }

  return {
    newImages,
    existingImages,
    activeExistingImages,
    removedExistingImages,
    removedImageIds,
    imageError,
    isDragging,
    totalImageCount,
    remainingSlots,
    primaryExistingImage,
    primaryExistingImageId,
    primaryNewImage,
    currentPrimaryImageId,
    isDirty,
    handleImageChange,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    removeImage,
    setPrimaryImage,
    setExistingImagePrimary,
    toggleRemoveExistingImage,
    clearImages,
    setNewImages,
    setRemovedImageIds,
    setImageError,
    setIsDragging,
  };
}
