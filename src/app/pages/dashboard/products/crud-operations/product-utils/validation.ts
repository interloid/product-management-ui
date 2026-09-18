import type { FormError, ProductForm } from "@/types/product";

function parseRequiredNumber(
  value: string,
  fieldLabel: string,
  options?: { integer?: boolean; allowZero?: boolean; max?: number },
): string | undefined {
  const trimmed = value.trim();

  if (!trimmed) {
    return `${fieldLabel} is required.`;
  }

  // Reject scientific notation or invalid characters
  if (options?.integer) {
    if (!/^\d+$/.test(trimmed)) {
      return `${fieldLabel} must be a whole positive number.`;
    }
  } else if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) {
    return `${fieldLabel} must be a valid positive amount (up to 2 decimal places).`;
  }

  const parsed = Number(trimmed);

  if (!Number.isFinite(parsed)) {
    return `${fieldLabel} must be a valid number.`;
  }

  if (parsed < 0) {
    return `${fieldLabel} cannot be negative.`;
  }

  if (!options?.allowZero && parsed === 0) {
    return `${fieldLabel} must be greater than zero.`;
  }

  if (options?.integer && !Number.isInteger(parsed)) {
    return `${fieldLabel} must be a whole number.`;
  }

  if (options?.max !== undefined && parsed > options.max) {
    return `${fieldLabel} cannot exceed ${options.max.toLocaleString()}.`;
  }

  return undefined;
}

export function validateProductFields(form: ProductForm): FormError {
  const errors: FormError = {};

  const trimmedName = form.name.trim();
  if (!trimmedName) {
    errors.name = "Product name is required.";
  } else if (trimmedName.length > 200) {
    errors.name = "Product name cannot exceed 200 characters.";
  }

  const trimmedSku = form.sku.trim();
  if (!trimmedSku) {
    errors.sku = "SKU is required.";
  } else if (trimmedSku.length > 50) {
    errors.sku = "SKU cannot exceed 50 characters.";
  }

  if (!form.category) {
    errors.category = "Please select a category.";
  }

  const priceError = parseRequiredNumber(form.price, "Price", {
    max: 1_000_000,
  });
  if (priceError) {
    errors.price = priceError;
  }

  const stockError = parseRequiredNumber(form.stock, "Stock", {
    integer: true,
    allowZero: true,
    max: 1_000_000,
  });
  if (stockError) {
    errors.stock = stockError;
  }

  return errors;
}
