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
      return "rounded-full border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium text-[11px] px-2.5 py-0.5 shadow-2xs";
    case "draft":
      return "rounded-full border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-400 font-medium text-[11px] px-2.5 py-0.5 shadow-2xs";
    case "out_of_stock":
      return "rounded-full border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-400 font-medium text-[11px] px-2.5 py-0.5 shadow-2xs";
    case "archived":
      return "rounded-full border-zinc-500/20 bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 font-medium text-[11px] px-2.5 py-0.5 shadow-2xs";
    default:
      return "rounded-full text-[11px] px-2.5 py-0.5";
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

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  const now = Date.now();
  const diffInSeconds = Math.floor((now - date.getTime()) / 1000);

  if (diffInSeconds < 0 || diffInSeconds < 60) {
    return "just now";
  }
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return "yesterday";
  }
  if (diffInDays < 30) {
    return `${diffInDays}d ago`;
  }
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}mo ago`;
  }
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}y ago`;
}
