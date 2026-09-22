import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function CustomSidebarTrigger({
  className,
  ...props
}: React.ComponentProps<"button">) {
  const { state, toggleSidebar } = useSidebar();

  const isCollapsed = state === "collapsed";

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-md border border-border/70 hover:bg-primary-hover shadow-xs transition-all cursor-pointer focus-visible:border-primary! focus-visible:ring-2! focus-visible:ring-primary/20! focus-visible:outline-none",
        className,
      )}
      {...props}
    >
      {isCollapsed ? (
        <ChevronRight className="size-4 stroke-[2.25] text-primary font-extrabold" />
      ) : (
        <ChevronLeft className="size-4 stroke-[2.25] text-primary font-extrabold" />
      )}
    </button>
  );
}
