import type { ImageErrorBannerProps } from "@/types/props";

export function ImageErrorBanner({
  error: { message, details },
}: ImageErrorBannerProps) {
  return (
    <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-2.5">
      <p className="text-[13px] font-semibold text-destructive">
        {message}
      </p>
      {details && (
        <p className="mt-0.5 text-xs text-muted-foreground">
          {details}
        </p>
      )}
    </div>
  );
}
