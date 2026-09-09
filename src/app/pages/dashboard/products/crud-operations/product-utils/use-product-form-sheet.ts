import { useMemo, useState } from "react";
import { validateProductFields } from "../product-components/product-validation";
import type { FormError, ProductForm, UseProductFormSheetOptions } from "@/types/data-type";

export function useProductFormSheet<T extends ProductForm>({
  initialForm,
  onOpenChange,
  isDirtyExtra = false,
  onReset,
}: UseProductFormSheetOptions<T>) {
  const [prevInitialForm, setPrevInitialForm] = useState(initialForm);
  const [form, setForm] = useState<T>(initialForm);
  const [errors, setErrors] = useState<FormError>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);

  if (initialForm !== prevInitialForm) {
    setPrevInitialForm(initialForm);
    if (!isDirtyExtra) {
      setForm(initialForm);
    }
  }

  const isDirty = useMemo(() => {
    return (
      isDirtyExtra ||
      form.name !== initialForm.name ||
      form.sku !== initialForm.sku ||
      form.category !== initialForm.category ||
      form.price !== initialForm.price ||
      form.stock !== initialForm.stock ||
      form.status !== initialForm.status ||
      form.description !== initialForm.description
    );
  }, [form, initialForm, isDirtyExtra]);

  function updateField<K extends keyof ProductForm>(
    field: K,
    value: ProductForm[K],
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => {
      if (!previous[field]) {
        return previous;
      }

      return {
        ...previous,
        [field]: undefined,
      };
    });
  }

  function validateForm() {
    const validationErrors = validateProductFields(form);

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  }

  function resetForm() {
    onReset?.();
    setForm(initialForm);
    setErrors({});
    setIsSubmitting(false);
    setShowDiscardDialog(false);
  }

  function handleSheetOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      onOpenChange(true);
      return;
    }

    if (!isDirty) {
      resetForm();
      onOpenChange(false);
      return;
    }

    setShowDiscardDialog(true);
  }

  function handleKeepEditing() {
    setShowDiscardDialog(false);
  }

  function handleDiscardAndClose() {
    resetForm();
    onOpenChange(false);
  }

  return {
    form,
    setForm,
    errors,
    setErrors,

    isSubmitting,
    setIsSubmitting,

    isDirty,

    showDiscardDialog,
    setShowDiscardDialog,
    updateField,
    validateForm,
    resetForm,
    handleKeepEditing,
    handleDiscardAndClose,
    handleSheetOpenChange,
  };
}
