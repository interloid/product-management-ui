import { CheckCircle2, CircleAlert, Info, TriangleAlert } from "lucide-react";
import { Toaster as Sonner } from "sonner";

export function ToasterMessage(props: React.ComponentProps<typeof Sonner>) {
  return (
    <Sonner
      {...props}
      position="bottom-right"
      duration={4000}
      gap={8}
      icons={{
        success: <CheckCircle2 className="size-4.5" />,
        error: <CircleAlert className="size-4.5" />,
        warning: <TriangleAlert className="size-4.5" />,
        info: <Info className="size-4.5" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "!relative !w-[min(360px,calc(100vw-2rem))] !overflow-hidden !rounded-xl !border !border-border/70 !bg-background !px-4 !py-3.5 !pr-10 !shadow-sm",
          title:
            "!text-sm !font-semibold !leading-5 !tracking-[-0.01em] !text-foreground",
          description: "!mt-1 !text-xs !leading-4 !text-muted-foreground",
          success: "!border-emerald-200/80 [&_[data-icon]]:!text-emerald-600",
          error: "!border-red-200/80 [&_[data-icon]]:!text-red-600",
          warning: "!border-amber-200/80 [&_[data-icon]]:!text-amber-600",
          info: "!border-blue-200/80 [&_[data-icon]]:!text-blue-600",
        },
      }}
    />
  );
}
