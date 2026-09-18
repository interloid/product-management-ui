import { useMemo, useState, type FormEvent } from "react";
import { Archive, RotateCcw, Trash2, X } from "lucide-react";
import { notifyToast } from "@/lib/toast";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { UnsavedChangesDialog } from "@/components/shad/unsaved-changes-dialog";

import type {
  ApiProduct,
  ProductForm as ProductFormData,
} from "@/types/product";
import type { ProductFormProps } from "@/types/props";

import { createProduct, updateProduct } from "@/services/product-service";

import { getUserFriendlyErrorMessage } from "@/lib/errors";
import { getPrimaryImage } from "./product-utils/helpers";
import { useProductImages } from "@/hooks/use-product-images";
import { useProductFormSheet } from "@/hooks/use-product-form-sheet";
import { appendProductFormData } from "./product-utils/form-data";

import { PRODUCT_FORM_FIELDS } from "./product-utils/form-fields";
import { MAX_IMAGES } from "./product-utils/constants";
import { ImageErrorBanner } from "./product-components/image-error-banner";
import { ProductEditSkeleton } from "./product-components/product-edit-skeleton";
import { ProductViewSkeleton } from "./product-components/product-view-skeleton";

import { ProductImagePreview } from "./product-components/product-image-preview";

import {
  ProductDescriptionField,
  ProductDetailGrid,
  ProductFormActions,
  ProductFormFields,
  ProductImageDropzone,
  ProductImageGrid,
  ProductImageHeader,
  ProductImageTile,
} from "./product-components/product-form-ui";

const blankForm: ProductFormData = {
  name: "",
  sku: "",
  category: "",
  price: "",
  stock: "",
  status: "active",
  description: "",
};

function getInitialForm(product: ApiProduct): ProductFormData {
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

function getForm(
  mode: ProductFormProps["mode"],
  product: ApiProduct | null,
): ProductFormData {
  if (product) {
    return getInitialForm(product);
  }

  if (mode === "add") {
    return blankForm;
  }

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

export function ProductForm(props: ProductFormProps) {
  const { mode, open, onOpenChange, categoryOptions } = props;

  const product = props.product ?? null;
  const loading = props.loading ?? false;

  const [prevImages, setPrevImages] = useState(product?.images);
  const [existingImages, setExistingImages] = useState(
    () => product?.images ?? [],
  );

  if (product?.images !== prevImages) {
    setPrevImages(product?.images);
    setExistingImages(product?.images ?? []);
  }

  const [isSubmitting, setIsSubmitting] = useState(false);

  const imageState = useProductImages({
    existingImages,
    isSubmitting,
    maxImages: MAX_IMAGES,
  });

  const {
    removedExistingImages,
    removedImageIds,
    orderedActiveImages,
    imageError,
    isDragging,
    totalImageCount,
    remainingSlots,
    primaryExistingImage,
    primaryNewImage,
    isDirty: isImageDirty,
    reorderImages,
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
  } = imageState;

  const initialForm = useMemo(() => getForm(mode, product), [mode, product]);

  const formState = useProductFormSheet({
    initialForm,
    onOpenChange,
    isDirtyExtra: mode !== "view" && isImageDirty,
    onReset: () => {
      clearImages();
      setExistingImages(product?.images ?? []);
      setIsSubmitting(false);
    },
  });

  const {
    form,
    errors,
    isDirty,
    showDiscardDialog,
    setShowDiscardDialog,
    updateField,
    validateForm,
    resetForm,
    handleKeepEditing,
    handleDiscardAndClose,
    handleSheetOpenChange,
  } = formState;

  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [prevProductId, setPrevProductId] = useState(product?.id);
  if (product?.id !== prevProductId) {
    setPrevProductId(product?.id);
    setSelectedImageId(null);
  }

  const allImages = (product?.images ?? []).map((img) => ({
    src: img.url,
    alt: product?.name,
  }));

  const activeViewImage = useMemo(() => {
    const images = product?.images ?? [];
    if (!images.length) return null;
    return (
      images.find((img) => img.id === selectedImageId) ??
      (product ? getPrimaryImage(product) : null) ??
      images[0]
    );
  }, [product, selectedImageId]);

  const activeViewIndex = useMemo(() => {
    if (!activeViewImage) return 0;
    const idx = (product?.images ?? []).findIndex(
      (img) => img.id === activeViewImage.id,
    );
    return idx >= 0 ? idx : 0;
  }, [product?.images, activeViewImage]);

  const [draggedTileIndex, setDraggedTileIndex] = useState<number | null>(null);
  const [dragOverTileIndex, setDragOverTileIndex] = useState<number | null>(
    null,
  );

  const handleTileDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    index: number,
  ) => {
    e.dataTransfer.setData("application/x-product-image-index", String(index));
    e.dataTransfer.effectAllowed = "move";
    setDraggedTileIndex(index);
  };

  const handleTileDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    index: number,
  ) => {
    e.preventDefault();
    if (draggedTileIndex === null || draggedTileIndex === index) {
      return;
    }
    e.dataTransfer.dropEffect = "move";
    if (dragOverTileIndex !== index) {
      setDragOverTileIndex(index);
    }
  };

  const handleTileDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverTileIndex(null);
    }
  };

  const handleTileDrop = (
    e: React.DragEvent<HTMLDivElement>,
    index: number,
  ) => {
    e.preventDefault();
    if (draggedTileIndex !== null && draggedTileIndex !== index) {
      reorderImages(draggedTileIndex, index);
    }
    setDraggedTileIndex(null);
    setDragOverTileIndex(null);
  };

  const handleTileDragEnd = () => {
    setDraggedTileIndex(null);
    setDragOverTileIndex(null);
  };

  function resetProductForm() {
    clearImages();
    setExistingImages(product?.images ?? []);
    setIsSubmitting(false);
    resetForm();
    setDraggedTileIndex(null);
    setDragOverTileIndex(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (mode === "view" || (mode === "edit" && !product)) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    if (totalImageCount > MAX_IMAGES) {
      notifyToast("error", `You can have a maximum of ${MAX_IMAGES} images.`, {
        id: "max-images",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      appendProductFormData(
        formData,
        form,
        mode === "edit" ? [...removedImageIds] : [],
      );

      if (mode === "edit" && primaryExistingImage) {
        formData.append(
          PRODUCT_FORM_FIELDS.PRIMARY_IMAGE_ID,
          primaryExistingImage.id,
        );
      }

      const orderedNewImages = orderedActiveImages
        .filter((img) => img.type === "new")
        .map((img) => img.raw);

      const orderedImages = primaryNewImage
        ? [
            primaryNewImage,
            ...orderedNewImages.filter(
              (image) => image.id !== primaryNewImage.id,
            ),
          ]
        : orderedNewImages;

      for (const image of orderedImages) {
        formData.append(PRODUCT_FORM_FIELDS.IMAGES, image.file);
      }

      if (mode === "add") {
        await createProduct(formData);
        notifyToast("success", "Product created successfully", {
          id: "create-success",
        });
        resetProductForm();
        onOpenChange(false);
        props.onCreated?.();
        return;
      }

      const updated = await updateProduct(product!.id, formData);

      notifyToast("success", "Product updated successfully", {
        id: "update-success",
      });

      resetProductForm();
      onOpenChange(false);
      props.onUpdated?.(updated);
    } catch (error) {
      notifyToast(
        "error",
        getUserFriendlyErrorMessage(
          error,
          mode === "add"
            ? "Unable to create product. Please check the form and try again."
            : "Unable to update product. Please check the form and try again.",
        ),
        { id: "save-error" },
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function renderView() {
    if (loading || !product) {
      return <ProductViewSkeleton />;
    }

    return (
      <>
        <SheetHeader className="sticky top-0 z-10 border-b border-border/80 bg-background/85 backdrop-blur-md px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <SheetTitle className="truncate text-[15px] font-semibold">
                {product.name}
              </SheetTitle>
              <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                {product.sku}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => onOpenChange(false)}
              className="size-8 shrink-0 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
              aria-label="Close view drawer"
            >
              <X className="size-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <div className="aspect-16/10 overflow-hidden rounded-lg border bg-muted/40 bg-clip-padding">
                {activeViewImage?.url ? (
                  <ProductImagePreview
                    key={activeViewImage.id}
                    src={activeViewImage.url}
                    alt={product.name}
                    images={allImages}
                    initialIndex={activeViewIndex}
                    className="h-full w-full rounded-[inherit]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center rounded-[inherit] bg-muted/20">
                    <span className="text-xs text-muted-foreground">
                      No image available
                    </span>
                  </div>
                )}
              </div>

              {product.images?.length > 0 && (
                <ProductImageGrid>
                  {product.images.map((image) => (
                    <ProductImageTile
                      key={image.id}
                      src={image.url}
                      alt={`${product.name} image`}
                      isPrimary={image.is_primary}
                      isSelected={image.id === activeViewImage?.id}
                      onSelect={() => setSelectedImageId(image.id)}
                      mode="view"
                    />
                  ))}
                </ProductImageGrid>
              )}
            </div>

            <ProductDetailGrid product={product} />
          </div>
        </div>

        <SheetFooter className="sticky bottom-0 z-10 border-t border-border/80 bg-background/85 backdrop-blur-md px-2 md:px-5 py-3">
          <div className="flex w-full flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-2 sm:flex">
                {product.status !== "archived" && props.onArchive && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => props.onArchive?.(product)}
                    className="gap-1.5 text-xs text-primary hover:border-primary hover:bg-primary-hover hover:text-hover-text!"
                  >
                    <Archive className="size-3.5" />
                    <span>Archive</span>
                  </Button>
                )}

                {props.onDelete && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => props.onDelete?.(product)}
                    className="gap-1.5 text-xs text-destructive hover:border-destructive hover:bg-destructive/10! hover:text-destructive!"
                  >
                    <Trash2 className="size-3.5" />
                    <span>Delete</span>
                  </Button>
                )}
              </div>

              <div className="sm:hidden">
                {(product.status !== "archived" && props.onArchive) ||
                props.onDelete ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-xs  hover:border-primary hover:bg-primary-hover hover:text-hover-text!"
                      >
                        <span>Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-44!">
                      {product.status !== "archived" && props.onArchive && (
                        <DropdownMenuItem
                          onClick={() => props.onArchive?.(product)}
                          className="gap-2 text-xs text-primary"
                        >
                          <Archive className="size-3.5" />
                          <span>Archive</span>
                        </DropdownMenuItem>
                      )}
                      {props.onDelete && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => props.onDelete?.(product)}
                            className="gap-2 text-xs text-destructive focus:text-destructive!"
                          >
                            <Trash2 className="size-3.5" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : null}
              </div>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <SheetClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="hover:border-primary hover:bg-primary-hover hover:text-hover-text!"
                >
                  Close
                </Button>
              </SheetClose>

              <Button
                type="button"
                variant="default"
                onClick={() => props.onEdit?.(product)}
              >
                Edit
              </Button>
            </div>
          </div>
        </SheetFooter>
      </>
    );
  }

  function renderForm() {
    const isEdit = mode === "edit";
    if (isEdit && (loading || !product)) {
      return <ProductEditSkeleton />;
    }

    return (
      <>
        <SheetHeader className="sticky top-0 z-10 flex flex-row items-center justify-between gap-3 border-b border-border/80 bg-background/85 backdrop-blur-md px-5 py-4">
          <div className="min-w-0 flex-1">
            <SheetTitle className="text-[15px] font-semibold">
              {isEdit ? product?.name : "Add Product"}
            </SheetTitle>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => handleSheetOpenChange(false)}
            className="size-8 shrink-0 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
            aria-label={isEdit ? "Close edit drawer" : "Close add drawer"}
          >
            <X className="size-4" />
          </Button>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="contents" noValidate>
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-5">
            <ProductFormFields
              idPrefix={isEdit ? "edit-product" : "add-product"}
              form={form}
              errors={errors}
              onFieldChange={updateField}
              categoryOptions={categoryOptions}
            />

            <div className="grid gap-3">
              <ProductImageHeader count={totalImageCount} />

              <ProductImageGrid>
                {orderedActiveImages.map((image, index) => (
                  <ProductImageTile
                    key={image.id}
                    src={image.url}
                    alt={
                      image.type === "new"
                        ? image.file.name
                        : `${product?.name ?? "Product"} image`
                    }
                    isPrimary={image.isPrimary}
                    images={orderedActiveImages.map((img) => ({
                      src: img.url,
                      alt:
                        img.type === "new"
                          ? img.file.name
                          : `${product?.name ?? "Product"} image`,
                    }))}
                    initialIndex={index}
                    mode={image.type}
                    draggable={!isSubmitting && orderedActiveImages.length > 1}
                    isDraggingThis={draggedTileIndex === index}
                    isDragOverThis={dragOverTileIndex === index}
                    onDragStart={(e) => handleTileDragStart(e, index)}
                    onDragOver={(e) => handleTileDragOver(e, index)}
                    onDragLeave={handleTileDragLeave}
                    onDrop={(e) => handleTileDrop(e, index)}
                    onDragEnd={handleTileDragEnd}
                    onRemove={
                      image.type === "existing"
                        ? isEdit
                          ? () => toggleRemoveExistingImage(image.id)
                          : undefined
                        : () => removeImage(image.id)
                    }
                    onSetPrimary={
                      image.type === "existing"
                        ? isEdit
                          ? () => setExistingImagePrimary(image.id)
                          : undefined
                        : () => setPrimaryImage(image.id)
                    }
                  />
                ))}

                {removedExistingImages.map((image) => (
                  <div
                    key={`removed-${image.id}`}
                    className="relative flex aspect-square items-center justify-center rounded-md border border-dashed border-destructive bg-destructive/5"
                  >
                    <span className="px-2 text-center text-[11px] font-medium text-destructive">
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

                {remainingSlots > 0 && (
                  <ProductImageDropzone
                    idPrefix={isEdit ? "edit-product" : "add-product"}
                    remainingSlots={remainingSlots}
                    isDragging={isDragging}
                    isSubmitting={isSubmitting}
                    dragHandlers={{
                      onDragEnter: handleDragEnter,
                      onDragOver: handleDragOver,
                      onDragLeave: handleDragLeave,
                      onDrop: handleDrop,
                    }}
                    onFileChange={handleImageChange}
                  />
                )}
              </ProductImageGrid>

              {imageError && <ImageErrorBanner error={imageError} />}
            </div>

            <ProductDescriptionField
              id={
                isEdit ? "edit-product-description" : "add-product-description"
              }
              value={form.description}
              onChange={(value) => updateField("description", value)}
            />
          </div>

          <ProductFormActions
            isSubmitting={isSubmitting}
            submitLabel={isEdit ? "Save changes" : "Create product"}
            onCancel={() => handleSheetOpenChange(false)}
            disabled={isEdit && !isDirty}
          />
        </form>
      </>
    );
  }

  return (
    <>
      <Sheet
        open={open}
        onOpenChange={mode === "view" ? onOpenChange : handleSheetOpenChange}
      >
        <SheetContent
          showCloseButton={false}
          className={
            mode === "view" ? "gap-0 sm:max-w-xl!" : "gap-0 p-0 sm:max-w-xl!"
          }
        >
          {mode === "view" ? renderView() : renderForm()}
        </SheetContent>
      </Sheet>

      {mode !== "view" && (
        <UnsavedChangesDialog
          open={showDiscardDialog}
          onOpenChange={setShowDiscardDialog}
          onKeepEditing={handleKeepEditing}
          onDiscard={handleDiscardAndClose}
        />
      )}
    </>
  );
}
