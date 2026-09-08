import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { createProduct, updateProduct } from "@/services/product-service";
import {
  type AddProductsProps,
  type ApiProduct,
  type ApiProductImage,
  type ImageError,
  type ProductEditProps,
  type ProductForm,
  type ProductImage,
  type ProductViewProps,
} from "@/types/data-type";
import { revokeImageUrls } from "@/lib/utils";
import { getUserFriendlyErrorMessage } from "@/lib/error-messsege";
import { getPrimaryImage } from "@/lib/product-utils";
import { UnsavedChangesDialog } from "@/components/shad/unsaved-changes-dialog";
import { ImageErrorBanner } from "./components/image-error-banner";
import { MAX_IMAGES, validateImage } from "./components/product-constants";
import { PRODUCT_FORM_FIELDS } from "./components/product-form-fields";
import { ProductEditSkeleton } from "./components/product-edit-skeleton";
import { ProductViewSkeleton } from "./components/product-view-skeleton";
import { useProductImages } from "@/hooks/use-product-images";
import { ProductImagePreview } from "../preview-image/product-image-preview";
import {
  ProductDescriptionField,
  ProductDetailGrid,
  ProductFormActions,
  ProductFormFields,
  ProductImageDropzone,
  ProductImageGrid,
  ProductImageHeader,
  ProductImageTile,
} from "./utils/product-utils";
import { RotateCcw } from "lucide-react";
import { useProductFormSheet } from "./utils/use-product-form-sheet";
import { appendProductFormData } from "./utils/product-form-data";

export function ProductView({
  product,
  open,
  loading,
  onOpenChange,
  onEdit,
}: ProductViewProps) {
  const primaryImage = product ? getPrimaryImage(product) : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="gap-0 sm:max-w-xl!">
        {loading || !product ? (
          <ProductViewSkeleton />
        ) : (
          <>
            <SheetHeader className="border-b px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <SheetTitle className="truncate text-[15px] font-semibold">
                    {product.name}
                  </SheetTitle>

                  <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                    {product.sku}
                  </p>
                </div>
              </div>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto p-5">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <div className="aspect-16/10 overflow-hidden rounded-lg border bg-muted">
                    {primaryImage?.url ? (
                      <ProductImagePreview
                        src={primaryImage.url}
                        alt={product.name}
                        className="h-full w-full"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-xs text-muted-foreground">
                          No image available
                        </span>
                      </div>
                    )}
                  </div>

                  {product.images && product.images.length > 0 && (
                    <ProductImageGrid>
                      {product.images.map((image) => (
                        <ProductImageTile
                          key={image.id}
                          src={image.url}
                          alt={`${product.name} image`}
                          isPrimary={image.is_primary}
                          mode="view"
                        />
                      ))}
                    </ProductImageGrid>
                  )}
                </div>

                <ProductDetailGrid product={product} />
              </div>
            </div>

            <SheetFooter className="border-t px-5 py-3">
              <div className="flex w-full flex-row-reverse justify-start gap-2">
                <Button variant="default" onClick={() => onEdit?.(product)}>
                  Edit
                </Button>

                <SheetClose asChild>
                  <Button variant="outline">Close</Button>
                </SheetClose>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

const blankForm: ProductForm = {
  name: "",
  sku: "",
  category: "",
  price: "",
  stock: "",
  status: "active",
  description: "",
};

export function AddProducts({ onProductCreated }: AddProductsProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const maxNewImages = MAX_IMAGES;
  const {
    images: newImages,
    imageError,
    isDragging,
    handleImageChange: handleNewImageChange,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    removeImage,
    setPrimaryImage,
    clearImages,
  } = useProductImages({
    maxImages: maxNewImages,
    isSubmitting,
    shouldAutoSetPrimary: () => true,
  });

  const totalImageCount = newImages.length;
  const remainingSlots = Math.max(MAX_IMAGES - totalImageCount, 0);

  const primaryNewImage = newImages.find((image) => image.isPrimary);

  const {
    form,
    setForm,
    errors,
    setErrors,
    showDiscardDialog,
    setShowDiscardDialog,
    updateField,
    validateForm,
    handleKeepEditing,
    handleDiscardAndClose,
    handleSheetOpenChange,
  } = useProductFormSheet({
    initialForm: blankForm,
    onOpenChange: setOpen,
    isDirtyExtra: newImages.length > 0,
    onReset: clearImages,
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (totalImageCount > MAX_IMAGES) {
      toast.error(`You can have a maximum of ${MAX_IMAGES} images.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      appendProductFormData(formData, form);

      const orderedImages = primaryNewImage
        ? [
            primaryNewImage,
            ...newImages.filter((image) => image.id !== primaryNewImage.id),
          ]
        : newImages;

      for (const image of orderedImages) {
        formData.append(PRODUCT_FORM_FIELDS.IMAGES, image.file);
      }

      await createProduct(formData);

      toast.success("Product created successfully");

      clearImages();
      setForm(blankForm);
      setErrors({});
      setOpen(false);
      onProductCreated?.();
    } catch (error) {
      toast.error(getUserFriendlyErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Sheet open={open} onOpenChange={handleSheetOpenChange}>
        <SheetTrigger asChild>
          <Button
            type="button"
            className="cursor-pointer whitespace-nowrap px-2.5 sm:px-4"
          >
            <span className="hidden sm:inline">Add Product</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </SheetTrigger>
        <SheetContent className="gap-0 p-0 sm:max-w-xl!">
          <SheetHeader className="flex flex-row items-center gap-3 border-b px-5 py-4">
            <div className="min-w-0 flex-1">
              <SheetTitle className="text-[15px] font-semibold">
                Add Product
              </SheetTitle>
            </div>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="contents" noValidate>
            <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-5">
              <ProductFormFields
                idPrefix="add-product"
                form={form}
                errors={errors}
                onFieldChange={updateField}
              />

              <div className="grid gap-3">
                <ProductImageHeader count={totalImageCount} />

                <ProductImageGrid>
                  {newImages.map((image) => (
                    <ProductImageTile
                      key={image.id}
                      src={image.previewUrl}
                      alt={image.file.name}
                      isPrimary={image.isPrimary}
                      mode="new"
                      onRemove={() => removeImage(image.id)}
                      onSetPrimary={() => setPrimaryImage(image.id)}
                    />
                  ))}

                  {remainingSlots > 0 && (
                    <ProductImageDropzone
                      idPrefix="add-product"
                      remainingSlots={remainingSlots}
                      isDragging={isDragging}
                      isSubmitting={isSubmitting}
                      dragHandlers={{
                        onDragEnter: handleDragEnter,
                        onDragOver: handleDragOver,
                        onDragLeave: handleDragLeave,
                        onDrop: handleDrop,
                      }}
                      onFileChange={handleNewImageChange}
                    />
                  )}
                </ProductImageGrid>
                {imageError && <ImageErrorBanner error={imageError} />}
              </div>
              <ProductDescriptionField
                id="add-product-description"
                value={form.description}
                onChange={(value) => updateField("description", value)}
              />
            </div>
            <ProductFormActions
              isSubmitting={isSubmitting}
              submitLabel="Create product"
              onCancel={() => handleSheetOpenChange(false)}
            />
          </form>
        </SheetContent>
      </Sheet>
      <UnsavedChangesDialog
        open={showDiscardDialog}
        onOpenChange={setShowDiscardDialog}
        onKeepEditing={handleKeepEditing}
        onDiscard={handleDiscardAndClose}
      />
    </>
  );
}

function getInitialForm(product: ApiProduct): ProductForm {
  return {
    name: product.name ?? "",
    sku: product.sku ?? "",
    category: product.category_name ?? "",
    price: String(product.price ?? ""),
    stock: String(product.stock ?? ""),
    status: product.status,
    description: product.description ?? "",
  };
}

function getEmptyForm(): ProductForm {
  return {
    name: "",
    sku: "",
    category: "",
    price: "",
    stock: "",
    status: "draft",
    description: "",
  };
}

function getPrimaryExistingImage(
  images: ApiProductImage[],
  removedIds: Set<string>,
): ApiProductImage | undefined {
  return images.find((image) => !removedIds.has(image.id) && image.is_primary);
}

function getPrimaryNewImage(images: ProductImage[]): ProductImage | undefined {
  return images.find((image) => image.isPrimary);
}

export function ProductEdit({
  product,
  open,
  loading,
  onOpenChange,
  onUpdated,
}: ProductEditProps) {
  const [existingImages, setExistingImages] = useState<ApiProductImage[]>(
    () => product?.images ?? [],
  );
  const [newImages, setNewImages] = useState<ProductImage[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<Set<string>>(
    new Set(),
  );
  const [imageError, setImageError] = useState<ImageError | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [originalPrimaryImageId, setOriginalPrimaryImageId] = useState<
    string | null
  >(product ? (getPrimaryImage(product)?.id ?? null) : null);

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

  const activeImageCount = activeExistingImages.length + newImages.length;
  const remainingSlots = Math.max(MAX_IMAGES - activeImageCount, 0);
  const primaryExistingImage = useMemo(
    () => getPrimaryExistingImage(existingImages, removedImageIds),
    [existingImages, removedImageIds],
  );

  const primaryNewImage = useMemo(
    () => getPrimaryNewImage(newImages),
    [newImages],
  );

  const currentPrimaryImageId = primaryExistingImage?.id ?? null;
  const currentPrimaryNewImageIndex = primaryNewImage
    ? newImages.findIndex((image) => image.id === primaryNewImage.id)
    : -1;

  function resetProductImages() {
    if (!product) {
      return;
    }

    revokeImageUrls(newImages);
    const images = product.images ?? [];
    const primaryImage = getPrimaryImage(product);

    setExistingImages(images);
    setRemovedImageIds(new Set());
    setNewImages([]);
    setImageError(null);
    setIsDragging(false);
    setOriginalPrimaryImageId(primaryImage?.id ?? null);
  }

  const {
    form,
    errors,
    showDiscardDialog,
    setShowDiscardDialog,
    updateField,
    validateForm,
    handleKeepEditing,
    handleDiscardAndClose,
    handleSheetOpenChange,
  } = useProductFormSheet({
    initialForm: product ? getInitialForm(product) : getEmptyForm(),
    onOpenChange,
    isDirtyExtra:
      removedImageIds.size > 0 ||
      newImages.length > 0 ||
      currentPrimaryImageId !== originalPrimaryImageId ||
      currentPrimaryNewImageIndex >= 0,
     onReset: resetProductImages,
  });

  function setExistingImagePrimary(id: string) {
    const imageExists = activeExistingImages.some((image) => image.id === id);

    if (!imageExists) {
      return;
    }

    setExistingImages((images) =>
      images.map((image) => ({
        ...image,
        is_primary: image.id === id,
      })),
    );

    setNewImages((images) =>
      images.map((image) => ({
        ...image,
        isPrimary: false,
      })),
    );
  }

  function setNewImagePrimary(id: string) {
    const imageExists = newImages.some((image) => image.id === id);

    if (!imageExists) {
      return;
    }

    setExistingImages((images) =>
      images.map((image) => ({
        ...image,
        is_primary: false,
      })),
    );

    setNewImages((images) =>
      images.map((image) => ({
        ...image,
        isPrimary: image.id === id,
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

    if (isRemoving && image.is_primary) {
      const fallbackExisting = existingImages.find(
        (item) => item.id !== id && !nextRemovedIds.has(item.id),
      );

      if (fallbackExisting) {
        setExistingImagePrimary(fallbackExisting.id);
        return;
      }

      const fallbackNew = newImages[0];

      if (fallbackNew) {
        setNewImagePrimary(fallbackNew.id);
      }
    }
  }

  function processFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList);

    if (files.length === 0) {
      return;
    }

    setImageError(null);

    if (remainingSlots <= 0) {
      setImageError({
        message: `You can upload a maximum of ${MAX_IMAGES} images.`,
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

  function handleNewImageChange(event: ChangeEvent<HTMLInputElement>) {
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

    if (remainingSlots <= 0) {
      setImageError({
        message: `Maximum ${MAX_IMAGES} images allowed.`,
      });
      return;
    }

    processFiles(event.dataTransfer.files);
  }

  function removeNewImage(id: string) {
    const image = newImages.find((item) => item.id === id);

    if (!image) {
      return;
    }

    URL.revokeObjectURL(image.previewUrl);

    const remainingImages = newImages.filter((item) => item.id !== id);

    if (image.isPrimary) {
      const fallbackNew = remainingImages[0];

      if (fallbackNew) {
        setExistingImages((images) =>
          images.map((item) => ({
            ...item,
            is_primary: false,
          })),
        );

        setNewImages(
          remainingImages.map((item) => ({
            ...item,
            isPrimary: item.id === fallbackNew.id,
          })),
        );

        return;
      }

      const fallbackExisting = activeExistingImages[0];

      if (fallbackExisting) {
        setExistingImagePrimary(fallbackExisting.id);
        setNewImages(remainingImages);
        return;
      }
    }

    setNewImages(remainingImages);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!product || !form) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    if (activeImageCount > MAX_IMAGES) {
      toast.error(`You can have a maximum of ${MAX_IMAGES} images.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      appendProductFormData(formData, form, [...removedImageIds]);

      const primaryNewImage = getPrimaryNewImage(newImages);
      const orderedNewImages = primaryNewImage
        ? [
            primaryNewImage,
            ...newImages.filter((image) => image.id !== primaryNewImage.id),
          ]
        : newImages;

      for (const image of orderedNewImages) {
        formData.append(PRODUCT_FORM_FIELDS.IMAGES, image.file);
      }

      if (primaryExistingImage) {
        formData.append(
          PRODUCT_FORM_FIELDS.PRIMARY_IMAGE_ID,
          primaryExistingImage.id,
        );
      }

      const updated = await updateProduct(product.id, formData);
      toast.success("Product updated successfully");
      revokeImageUrls(newImages);
      setNewImages([]);

      onOpenChange(false);
      onUpdated?.(updated);
    } catch (error) {
      const errorMessage = getUserFriendlyErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Sheet open={open} onOpenChange={handleSheetOpenChange}>
        <SheetContent className="gap-0 p-0 sm:max-w-xl!">
          {loading || !product ? (
            <ProductEditSkeleton />
          ) : (
            <>
              <SheetHeader className="flex flex-row items-center gap-3 border-b px-5 py-4">
                <div className="min-w-0 flex-1">
                  <SheetTitle className="text-[15px] font-semibold">
                    {product.name}
                  </SheetTitle>
                </div>
              </SheetHeader>

              <form onSubmit={handleSubmit} className="contents" noValidate>
                <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-5">
                  <ProductFormFields
                    idPrefix="edit-product"
                    form={form}
                    errors={errors}
                    onFieldChange={updateField}
                  />

                  <div className="grid gap-3">
                    <ProductImageHeader count={activeImageCount} />

                    <ProductImageGrid>
                      {activeExistingImages.map((image) => (
                        <ProductImageTile
                          key={image.id}
                          src={image.url}
                          alt={`${product.name} image`}
                          isPrimary={image.is_primary}
                          mode="existing"
                          onRemove={() => toggleRemoveExistingImage(image.id)}
                          onSetPrimary={() => setExistingImagePrimary(image.id)}
                        />
                      ))}
                      {removedExistingImages.map((image) => (
                        <div
                          key={`removed-${image.id}`}
                          className="relative flex aspect-square items-center justify-center rounded-md border border-dashed border-destructive bg-destructive/5"
                        >
                          <span className="px-2 text-center text-[10px] font-medium text-destructive">
                            Removed on save
                          </span>

                          <button
                            type="button"
                            onClick={() => toggleRemoveExistingImage(image.id)}
                            aria-label="Restore image"
                            className="absolute right-1.5 top-1.5 flex size-5 items-center justify-center rounded-full border bg-background text-muted-foreground shadow-sm transition-colors hover:text-foreground"
                          >
                            <RotateCcw className="size-3" />
                          </button>
                        </div>
                      ))}
                      {newImages.map((image) => (
                        <ProductImageTile
                          key={image.id}
                          src={image.previewUrl}
                          alt={image.file.name}
                          isPrimary={image.isPrimary}
                          mode="new"
                          onRemove={() => removeNewImage(image.id)}
                          onSetPrimary={() => setNewImagePrimary(image.id)}
                        />
                      ))}
                      {remainingSlots > 0 && (
                        <ProductImageDropzone
                          idPrefix="edit-product"
                          remainingSlots={remainingSlots}
                          isDragging={isDragging}
                          isSubmitting={isSubmitting}
                          dragHandlers={{
                            onDragEnter: handleDragEnter,
                            onDragOver: handleDragOver,
                            onDragLeave: handleDragLeave,
                            onDrop: handleDrop,
                          }}
                          onFileChange={handleNewImageChange}
                        />
                      )}
                    </ProductImageGrid>
                    {imageError && <ImageErrorBanner error={imageError} />}
                  </div>
                  <ProductDescriptionField
                    id="edit-product-description"
                    value={form.description}
                    onChange={(value) => updateField("description", value)}
                  />
                </div>

                <ProductFormActions
                  isSubmitting={isSubmitting}
                  submitLabel="Save changes"
                  onCancel={() => handleSheetOpenChange(false)}
                />
              </form>
            </>
          )}
        </SheetContent>
      </Sheet>
      <UnsavedChangesDialog
        open={showDiscardDialog}
        onOpenChange={setShowDiscardDialog}
        onKeepEditing={handleKeepEditing}
        onDiscard={handleDiscardAndClose}
      />
    </>
  );
}
