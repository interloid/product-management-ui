import { toast } from "sonner";

let activeToastId: string | number | null = null;

type ToastType = "success" | "error" | "warning" | "info";

type NotifyOptions = {
  id?: string | number;
  description?: string;
};

export function notifyToast(
  type: ToastType,
  message: string,
  options: NotifyOptions = {},
): string | number {
  if (activeToastId !== null) {
    toast.dismiss(activeToastId);
  }

  const toastId = toast[type](message, {
    ...(options.description ? { description: options.description } : {}),
    id: options.id,
  });

  activeToastId = toastId;
  return toastId;
}
