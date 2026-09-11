import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldError } from "@/components/shad/field-error";
import { DetailLabel, DetailValue } from "@/components/shad/detail-label";
import {
  formatDateTime,
  formatPrice,
  getStatusClassName,
  getStatusLabel,
} from "@/lib/converters";
import { productCategories, statuses } from "@/lib/product-options";
import type {
  ApiProduct,
  FormError,
  FormFieldChange,
  ProductCategory,
  ProductForm,
  ProductStatus,
  PreviewImageItem,
} from "@/types/product";
import { ProductImagePreview } from "./product-image-preview";
import { ImageOverlayControls } from "./image-overlay-controls";
import { MAX_IMAGES } from "../product-utils/product-constants";

function fieldInputClass({
  error,
  mono = false,
}: {
  error?: string;
  mono?: boolean;
}) {
  return cn(
    "h-10 placeholder:text-xs focus-visible:ring-primary/20",
    mono && "font-mono",
    error
      ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
      : "focus-visible:border-primary",
  );
}

function ProductField({
  id,
  label,
  required,
  error,
  children,
}: {
  readonly id: string;
  readonly label: string;
  readonly required?: boolean;
  readonly error?: string;
  readonly children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id} className="text-[12px] font-medium">
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      <FieldError message={error} />
    </div>
  );
}

export function ProductFormFields({
  idPrefix,
  form,
  errors,
  onFieldChange,
}: {
  readonly idPrefix: string;
  readonly form: ProductForm;
  readonly errors: FormError;
  readonly onFieldChange: FormFieldChange;
}) {
  return (
    <>
      <ProductField
        id={`${idPrefix}-name`}
        label="Product Name"
        required
        error={errors.name}
      >
        <Input
          id={`${idPrefix}-name`}
          placeholder="e.g. Meridian Desk Lamp"
          value={form.name}
          onChange={(event) => onFieldChange("name", event.target.value)}
          aria-invalid={Boolean(errors.name)}
          className={fieldInputClass({ error: errors.name })}
        />
      </ProductField>

      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        <ProductField
          id={`${idPrefix}-sku`}
          label="SKU"
          required
          error={errors.sku}
        >
          <Input
            id={`${idPrefix}-sku`}
            value={form.sku}
            onChange={(event) => onFieldChange("sku", event.target.value)}
            aria-invalid={Boolean(errors.sku)}
            className={fieldInputClass({ error: errors.sku, mono: true })}
          />
        </ProductField>

        <ProductField
          id={`${idPrefix}-category`}
          label="Category"
          required
          error={errors.category}
        >
          <Select
            value={form.category}
            onValueChange={(value) =>
              onFieldChange("category", value as ProductCategory)
            }
          >
            <SelectTrigger
              id={`${idPrefix}-category`}
              aria-invalid={Boolean(errors.category)}
              className={cn(
                "h-9 w-full focus-visible:ring-primary/20",
                errors.category
                  ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
                  : "focus-visible:border-primary",
              )}
            >
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent
              position="popper"
              side="bottom"
              align="start"
              sideOffset={4}
              avoidCollisions={false}
            >
              {productCategories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </ProductField>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <ProductField
          id={`${idPrefix}-price`}
          label="Price"
          required
          error={errors.price}
        >
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              $
            </span>
            <Input
              id={`${idPrefix}-price`}
              type="number"
              min={0}
              step="0.01"
              value={form.price}
              onChange={(event) => onFieldChange("price", event.target.value)}
              aria-invalid={Boolean(errors.price)}
              className={cn(
                fieldInputClass({ error: errors.price, mono: true }),
                "pl-7",
              )}
            />
          </div>
        </ProductField>

        <ProductField
          id={`${idPrefix}-stock`}
          label="Stock"
          required
          error={errors.stock}
        >
          <Input
            id={`${idPrefix}-stock`}
            type="number"
            min={0}
            step="1"
            value={form.stock}
            onChange={(event) => onFieldChange("stock", event.target.value)}
            aria-invalid={Boolean(errors.stock)}
            className={fieldInputClass({ error: errors.stock, mono: true })}
          />
        </ProductField>

        <ProductField id={`${idPrefix}-status`} label="Status">
          <Select
            value={form.status}
            onValueChange={(value) =>
              onFieldChange("status", value as ProductStatus)
            }
          >
            <SelectTrigger id={`${idPrefix}-status`} className="h-9 w-full">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent
              position="popper"
              side="bottom"
              align="start"
              sideOffset={4}
              avoidCollisions={false}
            >
              {statuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </ProductField>
      </div>
    </>
  );
}

export function ProductDescriptionField({
  id,
  value,
  onChange,
  maxLength = 1000,
}: {
  readonly id: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly maxLength?: number;
}) {
  const currentLength = value?.length ?? 0;

  return (
    <div className="grid gap-1.5">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-[12px] font-medium">
          Description
        </Label>
        <span className="text-[11px] text-muted-foreground font-mono">
          {currentLength}/{maxLength}
        </span>
      </div>
      <Textarea
        id={id}
        value={value}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        className="h-25 resize-none leading-relaxed focus-visible:border-primary focus-visible:ring-primary/20"
      />
    </div>
  );
}

export function ProductFormActions({
  isSubmitting,
  submitLabel,
  onCancel,
  disabled = false,
}: {
  readonly isSubmitting: boolean;
  readonly submitLabel: string;
  readonly onCancel: () => void;
  readonly disabled?: boolean;
}) {
  return (
    <div className="flex h-16 shrink-0 items-center gap-2 border-t px-5">
      <div className="flex-1" />
      <Button
        type="button"
        variant="secondary"
        className="h-9 px-3.5 text-[13px] font-medium"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={isSubmitting || disabled}
        className="h-9 px-4 text-[13px] font-medium"
      >
        {isSubmitting ? (
          <>
            <Spinner className="size-3.5" />
            Saving…
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </div>
  );
}

export function ProductImageHeader({ count }: { readonly count: number }) {
  return (
    <div className="flex items-center justify-between">
      <Label className="gap-1 text-[12px] font-medium">
        Images{" "}
        <span className="text-[11px] font-bold">
          (Only JPG, PNG, and WEBP image formats are allowed.)
        </span>
      </Label>
      <span className="text-[11px] text-muted-foreground">
        {count}/{MAX_IMAGES}
      </span>
    </div>
  );
}

export function ProductImageGrid({ children }: { readonly children: React.ReactNode }) {
  return (
    <div className="flex gap-2 overflow-x-auto p-1 [scrollbar-thin] *:size-20 sm:*:size-24 *:shrink-0">
      {children}
    </div>
  );
}

export function ProductImageTile({
  src,
  alt,
  isPrimary,
  mode,
  images,
  initialIndex,
  onRemove,
  onSetPrimary,
}: {
  readonly src: string;
  readonly alt: string;
  readonly isPrimary: boolean;
  readonly mode: "new" | "existing" | "view";
  readonly images?: PreviewImageItem[];
  readonly initialIndex?: number;
  readonly onRemove?: () => void;
  readonly onSetPrimary?: () => void;
}) {
  return (
    <div
      className={cn(
        "relative aspect-square overflow-hidden rounded-md border bg-clip-padding",
        isPrimary ? "border-2 border-primary" : "border-border",
      )}
    >
      <ProductImagePreview
        src={src}
        alt={alt}
        images={images}
        initialIndex={initialIndex}
        className="h-full w-full rounded-[inherit]"
      />

      {mode !== "view" && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${alt}`}
          className="absolute right-1.5 top-1.5 z-20 flex size-4 items-center justify-center rounded-full border bg-background/90 text-muted-foreground shadow-sm backdrop-blur transition-colors hover:bg-background hover:text-destructive"
        >
          <X className="size-2" />
        </button>
      )}

      {mode !== "view" && (
        <ImageOverlayControls
          isPrimary={isPrimary}
          onSetPrimary={onSetPrimary}
        />
      )}
    </div>
  );
}

export function ProductImageDropzone({
  idPrefix,
  remainingSlots,
  isDragging,
  isSubmitting,
  dragHandlers,
  onFileChange,
}: {
  readonly idPrefix: string;
  readonly remainingSlots: number;
  readonly isDragging: boolean;
  readonly isSubmitting: boolean;
  readonly dragHandlers: {
    readonly onDragEnter: (event: React.DragEvent<HTMLLabelElement>) => void;
    readonly onDragOver: (event: React.DragEvent<HTMLLabelElement>) => void;
    readonly onDragLeave: (event: React.DragEvent<HTMLLabelElement>) => void;
    readonly onDrop: (event: React.DragEvent<HTMLLabelElement>) => void;
  };
  readonly onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <>
      <label
        htmlFor={`${idPrefix}-images`}
        onDragEnter={dragHandlers.onDragEnter}
        onDragOver={dragHandlers.onDragOver}
        onDragLeave={dragHandlers.onDragLeave}
        onDrop={dragHandlers.onDrop}
        className={cn(
          "group flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border border-dashed transition-all duration-200",
          isDragging
            ? "border-primary bg-primary/10 text-primary scale-[1.02]"
            : "border-border text-muted-foreground hover:border-primary hover:bg-primary-hover/50 hover:text-foreground",
          isSubmitting && "pointer-events-none opacity-60",
        )}
      >
        <span className="text-xl font-light leading-none transition-transform duration-150 group-hover:scale-110">
          +
        </span>
        <span className="mt-0.5 px-1 text-center text-[10px] font-medium">
          {isDragging ? "Drop images here" : "Add images"}
        </span>
        <span className="px-1 text-center text-[9px] text-muted-foreground">
          {remainingSlots} {remainingSlots === 1 ? "slot" : "slots"} left
        </span>
        <span className="font-mono text-[8px] text-muted-foreground/70">
          Max 5MB
        </span>
      </label>

      <Input
        id={`${idPrefix}-images`}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={onFileChange}
        disabled={isSubmitting || remainingSlots <= 0}
        className="hidden"
      />
    </>
  );
}

export function ProductDetailGrid({ product }: { readonly product: ApiProduct }) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-x-4 gap-y-3 text-[13px]">
      <DetailLabel>SKU</DetailLabel>
      <DetailValue className="font-mono text-xs">{product.sku}</DetailValue>

      <DetailLabel>Category</DetailLabel>
      <DetailValue>{product.category_name}</DetailValue>

      <DetailLabel>Price</DetailLabel>
      <DetailValue className="font-mono text-xs">
        {formatPrice(product.price)}
      </DetailValue>

      <DetailLabel>Stock</DetailLabel>
      <DetailValue className="font-mono text-xs">{product.stock}</DetailValue>

      <DetailLabel>Status</DetailLabel>
      <div>
        <Badge variant="outline" className={getStatusClassName(product.status)}>
          {getStatusLabel(product.status)}
        </Badge>
      </div>

      <DetailLabel>Description</DetailLabel>
      <DetailValue className="leading-relaxed">
        {product.description || "No description available."}
      </DetailValue>

      <DetailLabel>Created</DetailLabel>
      <DetailValue className="text-muted-foreground">
        {product.created_at ? formatDateTime(product.created_at) : "—"}
      </DetailValue>

      <DetailLabel>Updated</DetailLabel>
      <DetailValue className="text-muted-foreground">
        {product.updated_at ? formatDateTime(product.updated_at) : "—"}
      </DetailValue>
    </div>
  );
}
