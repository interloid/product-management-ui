import type { ImageErrorBannerProps } from "@/types/data-type";
import { AlertCircle } from "lucide-react";

export function ImageErrorBanner({
  error: { message, details },
}: ImageErrorBannerProps) {

  return (
    <div className="flex gap-3 rounded-md border border-destructive/30 bg-destructive/5 p-3">
      <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
      <div className="min-w-0">
        <p className="text-sm font-medium text-destructive">{message}</p>
        {details && (
          <p className="mt-1 text-xs text-muted-foreground">{details}</p>
        )}
      </div>
    </div>
  );
}
