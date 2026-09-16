import type { FormError, ProductForm } from "@/types/product";

function parseRequiredNumber(
  value: string,
  fieldLabel: string,
  options?: { integer?: boolean; allowZero?: boolean },
): string | undefined {
  const trimmed = value.trim();

  if (!trimmed) {
    return `This ${fieldLabel.toLowerCase()} is required.`;
  }

  const parsed = Number(trimmed);

  if (!Number.isFinite(parsed)) {
    return `${fieldLabel} must be a valid number.`;
  }

  if (parsed < 0) {
    return `${fieldLabel} cannot be negative.`;
  }

  if (!options?.allowZero && parsed === 0) {
    return `${fieldLabel} cannot be zero.`;
  }

  if (options?.integer && !Number.isInteger(parsed)) {
    return `${fieldLabel} must be a whole number.`;
  }

  return undefined;
}

export function validateProductFields(form: ProductForm): FormError {
  const errors: FormError = {};

  if (!form.name.trim()) {
    errors.name = "This name is required.";
  }

  if (!form.sku.trim()) {
    errors.sku = "This SKU is required.";
  }

  if (!form.category) {
    errors.category = "This category is required.";
  }

  const priceError = parseRequiredNumber(form.price, "Price");
  if (priceError) {
    errors.price = priceError;
  }

  const stockError = parseRequiredNumber(form.stock, "Stock", {
    integer: true,
    allowZero: true,
  });
  if (stockError) {
    errors.stock = stockError;
  }

  return errors;
}
