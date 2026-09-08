import { useMemo, useState } from "react";
import { validateProductFields } from "../components/product-validation";
import type { FormError, ProductForm } from "@/types/data-type";

export function useProductFormSheet<T extends ProductForm | null>({
  initialForm,
  onOpenChange,
  isDirtyExtra = false,
  onReset,
}: {
  initialForm: T;
  onOpenChange: (open: boolean) => void;
  isDirtyExtra?: boolean;
  onReset?: () => void;
}) {
  const [form, setForm] = useState<T>(initialForm);
  const [errors, setErrors] = useState<FormError>({});
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);

  const isDirty = useMemo(() => {
    if (!form || !initialForm) {
      return false;
    }

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
    setForm((previous) => {
      if (!previous) {
        return previous;
      }

      return {
        ...previous,
        [field]: value,
      };
    });

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
    if (!form) {
      return false;
    }

    const validationErrors = validateProductFields(form);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }

  function handleSheetOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      onOpenChange(true);
      return;
    }

    if (!isDirty) {
      onReset?.();
      setForm(initialForm);
      setErrors({});
      onOpenChange(false);
      return;
    }

    setShowDiscardDialog(true);
  }

  function handleKeepEditing() {
    setShowDiscardDialog(false);
  }

  function handleDiscardAndClose() {
    onReset?.();
    setForm(initialForm);
    setErrors({});
    setShowDiscardDialog(false);
    onOpenChange(false);
  }

  return {
    form,
    setForm,
    errors,
    setErrors,
    isDirty,
    showDiscardDialog,
    setShowDiscardDialog,
    updateField,
    validateForm,
    handleKeepEditing,
    handleDiscardAndClose,
    handleSheetOpenChange,
  };
}