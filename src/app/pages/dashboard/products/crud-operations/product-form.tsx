import { useMemo, useState, type FormEvent } from "react";
import {
  Archive,
  Check,
  Copy,
  ImageIcon,
  Package,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { notifyToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { CategoryBadge } from "@/components/shad/category-badge";
import { Input } from "@/components/ui/input";
import {
  formatPrice,
  getStatusClassName,
  getStatusLabel,
} from "@/lib/converters";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { UnsavedChangesDialog } from "@/components/shad/unsaved-changes-dialog";

import type {
  ApiProduct,
  ProductForm as ProductFormData,
  PreviewImageItem,
} from "@/types/product";
import type { ProductFormProps } from "@/types/props";

import { createProduct, updateProduct } from "@/services/product-service";

import { getUserFriendlyErrorMessage } from "@/lib/errors";
import { getPrimaryImage } from "./product-utils/helpers";
import { useAuth } from "@/hooks/use-auth";
import { useProductImages } from "@/hooks/use-product-images";
import { useProductFormSheet } from "@/hooks/use-product-form-sheet";
import { appendProductFormData } from "./product-utils/form-data";

import { PRODUCT_FORM_FIELDS } from "./product-utils/form-fields";
import { MAX_IMAGES } from "./product-utils/constants";
import { ImageErrorBanner } from "./product-components/image-error-banner";
import { ProductEditSkeleton } from "./product-components/product-edit-skeleton";
import { ProductViewSkeleton } from "./product-components/product-view-skeleton";

import { ProductImagePreview } from "./product-components/product-image-preview";
import { ImagePreviewDialog } from "./product-components/image-preview-dialog";
import {
  FormProductPreviewImage,
  PreviewThumbnailImage,
} from "./product-components/preview-image-with-loader";

import {
  ProductDescriptionField,
  ProductDetailGrid,
  ProductFormActions,
  ProductFormFields,
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
  const { user } = useAuth();
  const isAdmin =
    props.isAdmin ??
    Boolean(user?.isAdmin || user?.role?.toLowerCase() === "admin");

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
  const [isCopiedSku, setIsCopiedSku] = useState(false);

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
  const [previewImageId, setPreviewImageId] = useState<string | null>(null);
  const [isPreviewSliderOpen, setIsPreviewSliderOpen] = useState(false);
  const [prevProductId, setPrevProductId] = useState(product?.id);
  if (product?.id !== prevProductId) {
    setPrevProductId(product?.id);
    setSelectedImageId(null);
    setPreviewImageId(null);
    setIsPreviewSliderOpen(false);
  }

  const activePreviewImage = useMemo(() => {
    if (previewImageId) {
      const activeMatch = orderedActiveImages.find(
        (img) => img.id === previewImageId,
      );
      if (activeMatch) return { ...activeMatch, isRemoved: false };

      const removedMatch = removedExistingImages.find(
        (img) => img.id === previewImageId,
      );
      if (removedMatch) {
        return {
          id: removedMatch.id,
          type: "existing" as const,
          url: removedMatch.url,
          isPrimary: false,
          isRemoved: true,
          raw: removedMatch,
        };
      }
    }

    const primary = orderedActiveImages.find((img) => img.isPrimary);
    if (primary) return { ...primary, isRemoved: false };

    if (orderedActiveImages.length > 0) {
      return { ...orderedActiveImages[0], isRemoved: false };
    }

    if (removedExistingImages.length > 0) {
      const firstRemoved = removedExistingImages[0];
      return {
        id: firstRemoved.id,
        type: "existing" as const,
        url: firstRemoved.url,
        isPrimary: false,
        isRemoved: true,
        raw: firstRemoved,
      };
    }

    return null;
  }, [orderedActiveImages, removedExistingImages, previewImageId]);

  const previewSliderImages = useMemo<PreviewImageItem[]>(() => {
    const activeList = orderedActiveImages.map((img, i) => ({
      src: img.url,
      alt: `${form.name || "Product"} image ${i + 1}`,
    }));
    const removedList = removedExistingImages.map((img, i) => ({
      src: img.url,
      alt: `${form.name || "Product"} (Removed) ${i + 1}`,
    }));
    return [...activeList, ...removedList];
  }, [orderedActiveImages, removedExistingImages, form.name]);

  const activeSliderIndex = useMemo(() => {
    if (!activePreviewImage) return 0;
    const idx = previewSliderImages.findIndex(
      (img) => img.src === activePreviewImage.url,
    );
    return idx >= 0 ? idx : 0;
  }, [previewSliderImages, activePreviewImage]);

  const categoryLabel = useMemo(() => {
    if (!form.category) return "";
    const match = (categoryOptions ?? []).find(
      (c) => c.value === form.category,
    );
    return match ? match.label : form.category;
  }, [categoryOptions, form.category]);

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

    if (!isAdmin || mode === "view" || (mode === "edit" && !product)) {
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
      return (
        <ProductViewSkeleton
          onClose={() => onOpenChange(false)}
          isAdmin={isAdmin}
        />
      );
    }

    return (
      <>
        <SheetHeader className="sticky top-0 z-20 flex flex-row items-center justify-between border-b border-border/70 bg-muted/40! backdrop-blur-md px-4 sm:px-6 py-3.5 sm:py-4">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 ">
            <div className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-xs">
              <Package className="size-4.5 sm:size-5" />
            </div>
            <div className="min-w-0">
              <SheetTitle className="text-sm sm:text-base font-semibold truncate leading-snug">
                {product.name}
              </SheetTitle>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="font-mono text-xs text-muted-foreground">
                  {product.sku}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    void navigator.clipboard.writeText(product.sku);
                    setIsCopiedSku(true);
                    notifyToast("success", "SKU copied to clipboard");
                    setTimeout(() => setIsCopiedSku(false), 1500);
                  }}
                  title={isCopiedSku ? "Copied!" : `Copy SKU: ${product.sku}`}
                  className="inline-flex items-center justify-center size-5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer shrink-0"
                  aria-label={`Copy SKU: ${product.sku}`}
                >
                  {isCopiedSku ? (
                    <Check className="size-3 text-emerald-600" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => onOpenChange(false)}
              className="size-8 sm:size-9 shrink-0 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
              aria-label="Close view drawer"
              title="Close"
            >
              <X className="size-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-muted/90">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:items-stretch">
            <div className="lg:col-span-7 flex flex-col">
              <div className="rounded-2xl border border-border/70 bg-card p-3.5 sm:p-5 shadow-xs flex flex-col lg:h-full space-y-3 sm:space-y-4">
                <div className="border-b border-border/50 pb-3">
                <h3 className="text-sm font-semibold text-foreground">
                    Product Specifications
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Detailed inventory and metadata attributes.
                  </p>
                </div>
                <div className="flex-1">
                  <ProductDetailGrid product={product} />
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 flex flex-col">
              <div className="rounded-2xl border border-border/70 bg-card p-3.5 sm:p-5 shadow-xs flex flex-col justify-between gap-3 sm:gap-4 lg:h-full">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between border-b border-border/50 pb-3">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">
                        Product Media
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {product.images?.length ?? 0}{" "}
                        {product.images?.length === 1 ? "image" : "images"}{" "}
                        available
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={getStatusClassName(product.status)}
                    >
                      {getStatusLabel(product.status)}
                    </Badge>
                  </div>

                  <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-border/70 bg-muted/20 flex items-center justify-center shadow-xs">
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
                      <div className="flex flex-col items-center justify-center gap-2 p-6 text-center text-muted-foreground/60">
                        <ImageIcon className="size-8 stroke-1" />
                        <span className="text-xs text-muted-foreground">
                          No image available
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {product.images && product.images.length > 0 && (
                  <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto py-1 px-0.5 [scrollbar-thin] mt-auto">
                    {product.images.map((image) => {
                      const isSelected = image.id === activeViewImage?.id;
                      return (
                        <button
                          key={image.id}
                          type="button"
                          onClick={() => setSelectedImageId(image.id)}
                          aria-label={`Select ${product.name} image`}
                          className={cn(
                            "group relative size-13 sm:size-18 shrink-0 rounded-xl overflow-hidden border-2 cursor-pointer transition-all select-none",
                            isSelected
                              ? "border-primary ring-2 ring-primary/25 shadow-sm scale-102"
                              : "border-border/70 hover:border-primary/50 opacity-80 hover:opacity-100",
                          )}
                        >
                          <PreviewThumbnailImage
                            src={image.url}
                            alt={`${product.name} image`}
                            className="size-full object-cover transition-transform duration-300 ease-out group-hover:scale-110"
                          />
                          {image.is_primary && (
                            <span
                              className="absolute bottom-1 left-1 text-[8px] sm:text-[10px] bg-primary/90 p-0.5 rounded-sm sm:rounded-md text-white backdrop-blur-xs"
                              title="Primary image"
                            >
                              Primary
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="sticky bottom-0 z-20 flex h-14 sm:h-16 shrink-0 items-center justify-between border-t border-border/80 bg-muted/40! backdrop-blur-md px-3 sm:px-6">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="hidden items-center gap-1.5 sm:flex sm:gap-2">
                {product.status !== "archived" && props.onArchive && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => props.onArchive?.(product)}
                    className="h-8.5 sm:h-10 px-2.5 sm:px-4 gap-1 sm:gap-1.5 text-xs text-primary hover:border-primary hover:bg-primary-hover hover:text-hover-text! cursor-pointer"
                    title="Archive product"
                  >
                    <Archive className="size-3 sm:size-3.5" />
                    <span className="hidden sm:inline">Archive</span>
                  </Button>
                )}

                {props.onDelete && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => props.onDelete?.(product)}
                    className="h-8.5 sm:h-10  px-2.5 sm:px-4 gap-1 sm:gap-1.5 text-xs text-destructive hover:border-destructive hover:bg-destructive/10! hover:text-destructive! cursor-pointer"
                    title="Delete product"
                  >
                    <Trash2 className="size-3 sm:size-3.5" />
                    <span className="hidden sm:inline">Delete</span>
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
                        className="h-8.5 rounded-full px-2.5 gap-1 text-xs text-muted-foreground hover:border-primary hover:bg-primary-hover hover:text-hover-text! cursor-pointer"
                        title="Product actions"
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

            <div className="flex items-center gap-2 sm:gap-2.5">
              <Button
                type="button"
                variant="outline"
                className="h-8.5 sm:h-10 px-3.5 sm:px-5 text-xs font-medium cursor-pointer hover:border-primary hover:bg-primary-hover hover:text-hover-text!"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>

              <Button
                type="button"
                variant="default"
                className="h-8.5 sm:h-10 px-4 sm:px-6 text-xs font-semibold shadow-md bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                onClick={() => props.onEdit?.(product)}
              >
                <Pencil className="size-3.5 mr-1" />
                Edit
              </Button>
            </div>
          </div>
        )}
      </>
    );
  }

  function renderForm() {
    const isEdit = mode === "edit";
    if (isEdit && (loading || !product)) {
      return (
        <ProductEditSkeleton
          mode="edit"
          onClose={() => handleSheetOpenChange(false)}
        />
      );
    }
    if (!isEdit && loading) {
      return (
        <ProductEditSkeleton
          mode="add"
          onClose={() => handleSheetOpenChange(false)}
        />
      );
    }

    const idPrefix = isEdit ? "edit-product" : "add-product";

    return (
      <>
        <SheetHeader className="sticky top-0 z-20 flex flex-row items-center justify-between border-b border-border/70 bg-muted/40! backdrop-blur-md px-4 sm:px-6 py-3.5 sm:py-4">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-xs">
              <Package className="size-4.5 sm:size-5" />
            </div>
            <div className="min-w-0">
              <SheetTitle className="text-sm sm:text-base font-semibold truncate leading-snug">
                {isEdit ? `Edit: ${product?.name ?? ""}` : "Add New Product"}
              </SheetTitle>
              <p className="text-[11px] sm:text-xs text-muted-foreground truncate">
                Configure specifications & pricing
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => handleSheetOpenChange(false)}
            className="size-8 sm:size-9 shrink-0 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
            aria-label={isEdit ? "Close edit drawer" : "Close add drawer"}
          >
            <X className="size-4" />
          </Button>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="contents" noValidate>
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-muted/90">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:items-stretch">
              <div className="lg:col-span-7 flex flex-col">
                <div className="rounded-2xl border border-border/70 bg-card p-3.5 sm:p-5 shadow-xs flex flex-col lg:h-full space-y-4 sm:space-y-5">
                  <div className="border-b border-border/50 pb-3">
                    <h3 className="text-sm font-semibold text-foreground">
                      Product Information
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Basic product details, classification, and inventory.
                    </p>
                  </div>

                  <ProductFormFields
                    idPrefix={idPrefix}
                    form={form}
                    errors={errors}
                    onFieldChange={updateField}
                    categoryOptions={categoryOptions}
                  />

                  <ProductDescriptionField
                    id={`${idPrefix}-description`}
                    value={form.description}
                    onChange={(value) => updateField("description", value)}
                  />
                  <div className="rounded-2xl border border-border/70 bg-card p-3.5 sm:p-5 shadow-xs space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between border-b border-border/50 pb-3">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">
                          Product Media
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Upload up to {MAX_IMAGES} product images (JPG, PNG,
                          WEBP).
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="font-mono text-xs px-2 py-0.5"
                      >
                        {totalImageCount}/{MAX_IMAGES}
                      </Badge>
                    </div>

                    <label
                      htmlFor={`${idPrefix}-images`}
                      onDragEnter={handleDragEnter}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={cn(
                        "group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-4 sm:p-8 transition-all cursor-pointer select-none text-center",
                        isDragging
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border/80 hover:border-primary/60 bg-muted/20 hover:bg-primary/5 text-muted-foreground",
                        (isSubmitting || remainingSlots <= 0) &&
                          "pointer-events-none opacity-60",
                      )}
                    >
                      <div className="flex size-10 sm:size-14 items-center justify-center rounded-xl sm:rounded-2xl bg-background border border-border/60 shadow-xs group-hover:scale-105 group-hover:border-primary/40 transition-all mb-2.5 sm:mb-3 text-muted-foreground group-hover:text-primary">
                        <UploadCloud className="size-5 sm:size-6" />
                      </div>

                      <div className="space-y-0.5 sm:space-y-1">
                        <p className="text-xs sm:text-sm font-medium text-foreground">
                          Upload product image, or{" "}
                          <span className="text-primary underline underline-offset-4">
                            browse
                          </span>
                        </p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">
                          PNG, JPG or WEBP (Max 5 MB each)
                        </p>
                      </div>

                      <div className="mt-2.5 sm:mt-3 inline-flex items-center gap-1.5 rounded-full bg-background/80 px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-medium border border-border/60 text-muted-foreground">
                        {remainingSlots > 0 ? (
                          <span>
                            {remainingSlots}{" "}
                            {remainingSlots === 1 ? "slot" : "slots"} left
                          </span>
                        ) : (
                          <span className="text-amber-600 dark:text-amber-400 font-semibold">
                            Max images reached (5/5)
                          </span>
                        )}
                      </div>

                      <Input
                        id={`${idPrefix}-images`}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        onChange={handleImageChange}
                        disabled={isSubmitting || remainingSlots <= 0}
                        className="hidden"
                      />
                    </label>

                    {imageError && <ImageErrorBanner error={imageError} />}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col">
                <div className="rounded-2xl border border-border/70 bg-card p-3.5 sm:p-5 shadow-xs flex flex-col justify-between gap-3.5 sm:gap-4 lg:justify-start lg:gap-4 lg:h-full">
                  <div className="flex items-center justify-between border-b border-border/50 pb-3">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">
                        Product Preview
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Live store representation
                      </p>
                    </div>
                    {form.status && (
                      <Badge
                        variant="outline"
                        className={getStatusClassName(form.status)}
                      >
                        {getStatusLabel(form.status)}
                      </Badge>
                    )}
                  </div>

                  <div
                    onClick={() => {
                      if (activePreviewImage) setIsPreviewSliderOpen(true);
                    }}
                    className={cn(
                      "relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-border/70 bg-muted/20 flex items-center justify-center group shadow-xs",
                      activePreviewImage && "cursor-pointer",
                    )}
                  >
                    {activePreviewImage ? (
                      <>
                        <FormProductPreviewImage
                          src={activePreviewImage.url}
                          alt={form.name || "Product preview"}
                          isRemoved={activePreviewImage.isRemoved}
                        />
                        {activePreviewImage.isRemoved ? (
                          <>
                            <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-destructive/95 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm select-none">
                              <RotateCcw className="size-3" />
                              Removed on save
                            </span>
                            <div className="absolute inset-0 bg-destructive/10 flex flex-col items-center justify-center gap-2.5 backdrop-blur-xs">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setIsPreviewSliderOpen(true);
                                  }}
                                  title="View full image slider"
                                  aria-label="View full image slider"
                                  className="flex size-9 items-center justify-center rounded-full bg-background/90 text-foreground  shadow-md border border-border/60 hover:text-primary transition-all cursor-pointer"
                                >
                                </button>
                                <Button
                                  type="button"
                                  variant="default"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleRemoveExistingImage(
                                      activePreviewImage.id,
                                    );
                                  }}
                                  className="rounded-full text-xs font-medium cursor-pointer shadow-md bg-destructive hover:bg-destructive/90 text-white"
                                >
                                  <RotateCcw className="size-3.5 mr-1.5" />
                                  Restore Image
                                </Button>
                              </div>
                              <span className="text-[11px] font-medium text-destructive bg-background/90 px-2.5 py-0.5 rounded-md shadow-xs border border-destructive/20 select-none">
                                Will be deleted permanently on save
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            {activePreviewImage.isPrimary ? (
                              <span className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-sm bg-primary/95 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-primary-foreground shadow-sm select-none">
                                Primary
                              </span>
                            ) : (
                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (activePreviewImage.type === "existing") {
                                    if (isEdit)
                                      setExistingImagePrimary(
                                        activePreviewImage.id,
                                      );
                                  } else {
                                    setPrimaryImage(activePreviewImage.id);
                                  }
                                }}
                                className="absolute bottom-3 left-3 z-10 text-[11px] inline-flex items-center gap-1.5 bg-background/95 hover:bg-background text-foreground hover:text-primary backdrop-blur-md px-2 py-1 font-medium shadow-md border border-border/70 transition-all cursor-pointer"
                              >
                                Set as Primary
                              </Button>
                            )}
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (activePreviewImage.type === "existing") {
                                  if (isEdit)
                                    toggleRemoveExistingImage(
                                      activePreviewImage.id,
                                    );
                                } else {
                                  removeImage(activePreviewImage.id);
                                }
                              }}
                              className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 border-none bg-destructive/90 hover:bg-destructive text-white shadow-md px-2.5 py-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              title="Remove image"
                            >
                              <Trash2 className="size-3.5 mr-0.5" />
                              Remove
                            </Button>
                            <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity flex items-center justify-center backdrop-blur-xs pointer-events-none">
                              <span className="flex items-center justify-center text-white shadow-xl backdrop-blur-xs scale-80 group-hover:scale-100 transition-all duration-200">
                              </span>
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2 p-6 text-center text-muted-foreground/60">
                        <div className="flex size-14 items-center justify-center rounded-2xl bg-muted/50 border border-border/50">
                          <ImageIcon className="size-7 stroke-1" />
                        </div>
                        <span className="text-xs font-medium">
                          No image uploaded
                        </span>
                        <span className="text-[11px] text-muted-foreground/80 max-w-45">
                          Upload images via the Dropzone or add button below.
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto py-1 px-0.5 [scrollbar-thin]">
                    {orderedActiveImages.map((image, index) => {
                      const isSelected = activePreviewImage?.id === image.id;
                      return (
                        <div
                          key={image.id}
                          draggable={
                            !isSubmitting && orderedActiveImages.length > 1
                          }
                          onDragStart={(e) => handleTileDragStart(e, index)}
                          onDragOver={(e) => handleTileDragOver(e, index)}
                          onDragLeave={handleTileDragLeave}
                          onDrop={(e) => handleTileDrop(e, index)}
                          onDragEnd={handleTileDragEnd}
                          onClick={() => setPreviewImageId(image.id)}
                          className={cn(
                            "relative size-13 sm:size-18 shrink-0 rounded-xl overflow-hidden border-2 cursor-pointer transition-all group select-none",
                            isSelected
                              ? "border-primary ring-2 ring-primary/25 shadow-sm scale-102"
                              : "border-border/70 hover:border-primary/50 opacity-80 hover:opacity-100",
                            draggedTileIndex === index &&
                              "opacity-30 border-dashed border-primary",
                            dragOverTileIndex === index &&
                              "ring-2 ring-primary border-primary",
                          )}
                        >
                          <PreviewThumbnailImage
                            src={image.url}
                            alt={`Thumbnail ${index + 1}`}
                            className="size-full object-cover transition-transform duration-300 ease-out group-hover:scale-110"
                          />
                          {image.isPrimary && (
                            <span
                              className="absolute bottom-1 left-1 text-[8px] sm:text-[10px] bg-primary/90 p-1 rounded-sm text-white backdrop-blur-xs"
                              title="Primary image"
                            >
                              Primary
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (image.type === "existing") {
                                if (isEdit) toggleRemoveExistingImage(image.id);
                              } else {
                                removeImage(image.id);
                              }
                            }}
                            title="Remove image"
                            className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-background/90 text-muted-foreground hover:text-destructive hover:bg-background shadow-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            <X className="size-2.5" />
                          </button>
                        </div>
                      );
                    })}

                    {removedExistingImages.map((image) => {
                      const isSelected = activePreviewImage?.id === image.id;
                      return (
                        <div
                          key={`removed-${image.id}`}
                          onClick={() => setPreviewImageId(image.id)}
                          className={cn(
                            "relative size-13 sm:size-18 shrink-0 rounded-xl overflow-hidden border-2 border-dashed border-destructive/60 bg-destructive/5 flex items-center justify-center cursor-pointer transition-all group select-none",
                            isSelected
                              ? "border-destructive ring-2 ring-destructive/30 shadow-sm scale-102"
                              : "opacity-85 hover:opacity-100 hover:border-destructive",
                          )}
                          title="Removed image (will be deleted on save) - click to preview or restore"
                        >
                          <PreviewThumbnailImage
                            src={image.url}
                            alt="Removed product image"
                            className="size-full object-cover opacity-25 grayscale"
                          />
                          <div className="absolute inset-0 bg-destructive/10 flex flex-col items-center justify-center p-1 text-center pointer-events-none">
                            <span className="text-[8px] sm:text-[9.5px] font-bold text-destructive leading-tight line-clamp-2 px-0.5">
                              Removed on save
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRemoveExistingImage(image.id);
                            }}
                            title="Restore image"
                            aria-label="Restore image"
                            className="absolute top-1 right-1 flex size-4 sm:size-5 items-center justify-center rounded-full bg-destructive text-white shadow-xs hover:bg-destructive/85 transition-colors cursor-pointer z-10"
                          >
                            <RotateCcw className="size-2.5 sm:size-3" />
                          </button>
                        </div>
                      );
                    })}

                    {remainingSlots > 0 && (
                      <label
                        htmlFor={`${idPrefix}-images`}
                        title={`Add images (${remainingSlots} slots left)`}
                        className={cn(
                          "flex size-13 sm:size-18 shrink-0 flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/80 hover:border-primary/60 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all cursor-pointer",
                          (isSubmitting || remainingSlots <= 0) &&
                            "pointer-events-none opacity-50",
                        )}
                      >
                        <Plus className="size-4 sm:size-5" />
                        <span className="text-[10px] font-semibold mt-0.5">
                          Add
                        </span>
                      </label>
                    )}
                  </div>

                  <div className="rounded-xl border border-border/60 bg-muted/20 p-3 sm:p-4 space-y-2.5 sm:space-y-3 mt-auto">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold text-foreground truncate">
                          {form.name || "Product Name"}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono mt-0.5">
                          SKU: {form.sku || "—"}
                        </div>
                      </div>
                      {categoryLabel && <CategoryBadge name={categoryLabel} />}
                    </div>

                    <div className="flex items-baseline justify-between pt-2 border-t border-border/50">
                      <div>
                        <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
                          Price
                        </span>
                        <div className="text-lg font-bold text-primary font-mono leading-tight">
                          {form.price
                            ? formatPrice(Number(form.price))
                            : "$0.00"}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
                          Stock
                        </span>
                        <div className="text-sm font-semibold font-mono text-foreground leading-tight">
                          {form.stock ? `${form.stock} units` : "0 units"}
                        </div>
                      </div>
                    </div>

                    {form.description && (
                      <div className="pt-2 border-t border-border/50">
                        <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
                          Description
                        </span>
                        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed mt-0.5">
                          {form.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ProductFormActions
            isSubmitting={isSubmitting}
            submitLabel={isEdit ? "Save changes" : "Add Product"}
            onCancel={() => handleSheetOpenChange(false)}
            disabled={isEdit && !isDirty}
          />
        </form>
      </>
    );
  }

  if (!isAdmin && mode !== "view") {
    return null;
  }

  return (
    <>
      <Sheet
        open={open}
        onOpenChange={mode === "view" ? onOpenChange : handleSheetOpenChange}
      >
        <SheetContent
          showCloseButton={false}
          className={cn(
            "gap-0 p-0 overflow-hidden rounded-2xl border border-border/80 shadow-2xl transition-all duration-200 bg-background",
            "data-[side=right]:border data-[side=right]:inset-y-2.5 data-[side=right]:right-2.5 data-[side=right]:h-[calc(100vh-1.25rem)]",
            "sm:data-[side=right]:inset-y-3 sm:data-[side=right]:right-3 sm:data-[side=right]:h-[calc(100vh-1.5rem)]",
            "w-[70%]! max-w-[70%]! data-[side=right]:w-[70%]! data-[side=right]:max-w-[70%]!",
            "sm:w-[70%]! sm:max-w-[70%]! sm:data-[side=right]:w-[70%]! sm:data-[side=right]:max-w-[70%]!",
          )}
        >
          {mode === "view" ? renderView() : renderForm()}
        </SheetContent>
      </Sheet>

      {mode !== "view" && (
        <>
          <UnsavedChangesDialog
            open={showDiscardDialog}
            onOpenChange={setShowDiscardDialog}
            onKeepEditing={handleKeepEditing}
            onDiscard={handleDiscardAndClose}
          />
          <ImagePreviewDialog
            images={previewSliderImages}
            initialIndex={activeSliderIndex}
            open={isPreviewSliderOpen}
            onOpenChange={setIsPreviewSliderOpen}
          />
        </>
      )}
    </>
  );
}
