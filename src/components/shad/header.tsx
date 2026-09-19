import { useLocation } from "react-router-dom";
import { HeaderActions } from "./header-actions";
import type { HeaderProps } from "@/types/props";
import { MobileMenuButton } from "./menu-button";
import { ChevronRight } from "lucide-react";

const TITLES: Record<string, string> = {
  "/products": "Products",
  "/orders": "Orders",
  "/customers": "Customers",
  "/categories": "Categories",
  "/reports": "Reports",
  "/settings": "Settings",
};

export default function Header({ user, productCount = 0 }: HeaderProps) {
  const { pathname } = useLocation();
  const title = TITLES[pathname] ?? "Dashboard";

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/70 bg-background/80 backdrop-blur-md px-3 sm:px-4 transition-colors">
      <div className="flex items-center gap-2.5 min-w-0">
        <MobileMenuButton />
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs font-medium min-w-0"
        >
          <span className="hidden sm:inline text-muted-foreground/80 hover:text-foreground transition-colors select-none">
            Dashboard
          </span>
          <ChevronRight className="hidden sm:inline size-3 text-muted-foreground/40 shrink-0" />
          <h1 className="flex items-center gap-1.5 text-sm font-semibold text-foreground truncate">
            <span>{title}</span>
            {pathname === "/products" && (
              <span className="text-xs font-normal text-muted-foreground shrink-0">
                ({productCount})
              </span>
            )}
          </h1>
        </nav>
      </div>
      <HeaderActions user={user} />
    </header>
  );
}
