import { Search, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { HeaderActions } from "./header-actions";
import { Input } from "@/components/ui/input";
import { useSearch } from "@/context/use-search";
import type { HeaderProps } from "@/types/data-type";
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
  const { searchQuery, setSearchQuery } = useSearch();
  const title = TITLES[pathname] ?? "Dashboard";

  return (
    <header className="flex min-h-16 w-full flex-col border-b sm:min-h-16 sm:flex-row sm:items-center">
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
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full pl-9 pr-8 focus-visible:border-primary focus-visible:ring-primary/20 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
