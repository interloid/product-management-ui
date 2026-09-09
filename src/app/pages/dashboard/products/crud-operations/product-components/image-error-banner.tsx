import type { ImageErrorBannerProps } from "@/types/data-type";

export function ImageErrorBanner({
  error: { message, details },
}: ImageErrorBannerProps) {
  return (
    <div className="rounded-lg border border-red-200 bg-[#fff5f5] px-4 py-2.5 dark:border-red-900/40 dark:bg-red-950/20">
      <p className="text-[13px] font-semibold text-red-600 dark:text-red-400">
        {message}
      </p>
      {details && (
        <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
          {details}
        </p>
      )}
    </div>
  );
}
