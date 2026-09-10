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
import { formatDateTime, getStatusClassName, getStatusLabel } from "@/lib/converters";
import {
  productCategories,
  statuses,
  type ApiProduct,
  type FormError,
  type FormFieldChange,
  type ProductCategory,
  type ProductForm,
  type ProductStatus,
  type PreviewImageItem,
} from "@/types/data-type";
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
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
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
  idPrefix: string;
  form: ProductForm;
  errors: FormError;
  onFieldChange: FormFieldChange;
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
        <ProductField id={`${idPrefix}-sku`} label="SKU" required error={errors.sku}>
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
        <ProductField id={`${idPrefix}-price`} label="Price" required error={errors.price}>
          <Input
            id={`${idPrefix}-price`}
            type="number"
            min={0}
            step="0.01"
            value={form.price}
            onChange={(event) => onFieldChange("price", event.target.value)}
            aria-invalid={Boolean(errors.price)}
            className={fieldInputClass({ error: errors.price, mono: true })}
          />
        </ProductField>

        <ProductField id={`${idPrefix}-stock`} label="Stock" required error={errors.stock}>
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
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id} className="text-[12px] font-medium">
        Description
      </Label>
      <Textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-20 resize-none leading-relaxed focus-visible:border-primary focus-visible:ring-primary/20"
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
  isSubmitting: boolean;
  submitLabel: string;
  onCancel: () => void;
  disabled?: boolean;
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

export function ProductImageHeader({ count }: { count: number }) {
  return (
    <div className="flex items-center justify-between">
      <Label className="gap-1 text-[12px] font-medium">
        Images
        <span className="text-[11px] font-bold">
          (Only JPG, PNG, and WEBP image formats are allowed.)
        </span>
      </Label>
      <span className="text-[11px] text-muted-foreground">{count}/{MAX_IMAGES}</span>
    </div>
  );
}

export function ProductImageGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">{children}</div>;
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
  src: string;
  alt: string;
  isPrimary: boolean;
  mode: "new" | "existing" | "view";
  images?: PreviewImageItem[];
  initialIndex?: number;
  onRemove?: () => void;
  onSetPrimary?: () => void;
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
  idPrefix: string;
  remainingSlots: number;
  isDragging: boolean;
  isSubmitting: boolean;
  dragHandlers: {
    onDragEnter: (event: React.DragEvent<HTMLLabelElement>) => void;
    onDragOver: (event: React.DragEvent<HTMLLabelElement>) => void;
    onDragLeave: (event: React.DragEvent<HTMLLabelElement>) => void;
    onDrop: (event: React.DragEvent<HTMLLabelElement>) => void;
  };
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
          "flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border border-dashed transition-colors",
          isDragging
            ? "border-primary bg-primary/10 text-primary"
            : "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
          isSubmitting && "pointer-events-none opacity-60",
        )}
      >
        <span className="text-2xl font-light leading-none">+</span>
        <span className="mt-1 px-2 text-center text-[10px] font-medium">
          {isDragging ? "Drop images here" : "Add images"}
        </span>
        <span className="mt-0.5 px-2 text-center text-[9px] text-muted-foreground">
          {remainingSlots} {remainingSlots === 1 ? "slot" : "slots"} left
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

export function ProductDetailGrid({ product }: { product: ApiProduct }) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-x-4 gap-y-3 text-[13px]">
      <DetailLabel>SKU</DetailLabel>
      <DetailValue className="font-mono text-xs">{product.sku}</DetailValue>

      <DetailLabel>Category</DetailLabel>
      <DetailValue>{product.category_name}</DetailValue>

      <DetailLabel>Price</DetailLabel>
      <DetailValue className="font-mono text-xs">
        ${Number(product.price).toFixed(2)}
      </DetailValue>

      <DetailLabel>Stock</DetailLabel>
      <DetailValue className="font-mono text-xs">{product.stock}</DetailValue>

      <DetailLabel>Status</DetailLabel>
      <div>
        <Badge
          variant="outline"
          className={getStatusClassName(product.status)}
        >
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
