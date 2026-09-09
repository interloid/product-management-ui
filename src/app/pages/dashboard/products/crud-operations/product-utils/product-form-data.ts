import { PRODUCT_FORM_FIELDS } from "../product-components/product-form-fields";
import type { ProductForm } from "@/types/data-type";

export function appendProductFormData(
  formData: FormData,
  form: ProductForm,
  removedImageIds: string[] = [],
) {
  formData.append(PRODUCT_FORM_FIELDS.NAME, form.name.trim());
  formData.append(PRODUCT_FORM_FIELDS.SKU, form.sku.trim());
  formData.append(PRODUCT_FORM_FIELDS.CATEGORY, form.category);
  formData.append(PRODUCT_FORM_FIELDS.PRICE, String(Number(form.price)));
  formData.append(PRODUCT_FORM_FIELDS.STOCK, String(Number(form.stock)));
  formData.append(PRODUCT_FORM_FIELDS.STATUS, form.status);
  formData.append(PRODUCT_FORM_FIELDS.DESCRIPTION, form.description.trim());
  formData.append(
    PRODUCT_FORM_FIELDS.REMOVED_IMAGE_IDS,
    JSON.stringify(removedImageIds),
  );
}
