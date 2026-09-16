import { PRODUCT_FORM_FIELDS } from "./product-form-fields";
import type { ProductForm } from "@/types/product";

function toNumericString(value: string): string {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? String(parsed) : "";
}

export function appendProductFormData(
  formData: FormData,
  form: ProductForm,
  removedImageIds: string[] = [],
) {
  formData.append(PRODUCT_FORM_FIELDS.NAME, form.name.trim());
  formData.append(PRODUCT_FORM_FIELDS.SKU, form.sku.trim());
  formData.append(PRODUCT_FORM_FIELDS.CATEGORY, form.category);
  formData.append(PRODUCT_FORM_FIELDS.PRICE, toNumericString(form.price));
  formData.append(PRODUCT_FORM_FIELDS.STOCK, toNumericString(form.stock));
  formData.append(PRODUCT_FORM_FIELDS.STATUS, form.status);
  formData.append(PRODUCT_FORM_FIELDS.DESCRIPTION, form.description.trim());
  formData.append(
    PRODUCT_FORM_FIELDS.REMOVED_IMAGE_IDS,
    JSON.stringify(removedImageIds),
  );
}
