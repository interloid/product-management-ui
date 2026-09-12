import { statuses } from "@/lib/product-options";

const statusLabels = new Map<string, string>(
  statuses.map((item) => [item.value, item.label]),
);

export function getStatusLabel(status: string): string {
  return (
    statusLabels.get(status) ??
    status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}
export function getStatusClassName(status: string) {
  switch (status) {
    case "active":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-950/40 dark:text-emerald-400";
    case "draft":
      return "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800/50 dark:bg-sky-950/40 dark:text-sky-400";
    case "out_of_stock":
      return "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800/50 dark:bg-orange-950/40 dark:text-orange-400";
    case "archived":
      return "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400";
    default:
      return "";
  }
}

export function formatPrice(value: string | number): string {
  const price = typeof value === "number" ? value : Number(value);
  return Number.isFinite(price) ? `$${price.toFixed(2)}` : "—";
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
