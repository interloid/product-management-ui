import { useLocation } from "react-router-dom";
import { HeaderActions } from "./header-actions";
import type { HeaderProps } from "@/types/props";
import { MobileMenuButton } from "./menu-button";
import { ProductSearchInput } from "./product-search-input";

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
    <header className="sticky top-0 z-30 flex min-h-16 w-full flex-col border-b sm:min-h-16 sm:flex-row sm:items-center">
      <div className="flex min-h-16 flex-1 items-center gap-2 px-3 sm:px-4 md:w-1/2">
        <div className="flex flex-1 items-center gap-2 md:w-1/4 lg:w-1/4 xl:w-1/4">
          <MobileMenuButton />
          <h1 className="line-clamp-1 w-fit text-sm font-medium">
            {title}
            {pathname === "/products" && (
              <span className="text-sm font-normal text-muted-foreground">
                ({productCount})
              </span>
            )}
          </h1>
        </div>
        <HeaderActions user={user} />
      </div>
      {pathname === "/products" && (
        <div className="flex items-center border-t px-3 py-2 sm:hidden sm:border-t-0 sm:px-4 sm:py-0">
          <ProductSearchInput className="w-full" />
        </div>
      )}
    </header>
  );
}
