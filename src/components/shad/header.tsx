import { useLocation } from "react-router-dom";
import { HeaderActions } from "./header-actions";
import type { HeaderProps } from "@/types/props";
import { MobileMenuButton } from "./menu-button";

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
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background px-3 sm:px-4">
      <div className="flex items-center gap-2 min-w-0">
        <MobileMenuButton />
        <h1 className="flex items-center gap-1 line-clamp-1 text-md font-bold truncate">
          {title}
          {pathname === "/products" && (
            <span className="text-sm font-normal text-muted-foreground shrink-0">
              ({productCount})
            </span>
          )}
        </h1>
      </div>
      <HeaderActions user={user} />
    </header>
  );
}
