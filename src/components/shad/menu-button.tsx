import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

export function MobileMenuButton() {
  const { toggleSidebar } = useSidebar();
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="size-8.5 shrink-0 rounded-lg border-border/80 bg-background text-muted-foreground shadow-2xs hover:bg-muted/80 hover:text-foreground active:scale-95 cursor-pointer md:hidden"
      onClick={(event) => {
        event.stopPropagation();
        toggleSidebar();
      }}
      aria-label="Open navigation menu"
    >
      <Menu className="size-4 text-muted-foreground" strokeWidth={2.25} />
    </Button>
  );
}
