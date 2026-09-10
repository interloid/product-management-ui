import { useLocation } from "react-router-dom";
import type { HeaderActionsProps } from "@/types/props";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSearch } from "@/context/use-search";
import { LogoutDialog } from "./logout-dialog";
import { getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ProductSearchInput } from "./product-search-input";

export function HeaderActions({ user }: HeaderActionsProps) {
  const { triggerAddProduct } = useSearch();
  const { pathname } = useLocation();

  const isProductsPage = pathname === "/products";
  const initials = getInitials(user?.name ?? "");

  return (
    <div className="ml-auto flex shrink-0 items-center justify-end gap-1.5 sm:gap-2 md:w-3/4 lg:w-3/4 xl:w-3/4 2xl:w-1/2">
      {isProductsPage && (
        <>
          <ProductSearchInput className="hidden w-1/2 sm:flex md:w-full" />

          <Button
            type="button"
            className="cursor-pointer whitespace-nowrap px-2.5 sm:px-4"
            onClick={triggerAddProduct}
          >
            <span className="hidden sm:inline">Add Product</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </>
      )}

      <Avatar className="hidden size-9 lg:flex">
        <AvatarImage
          src={user?.avatar ?? undefined}
          alt={user?.name ?? "User"}
        />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      <LogoutDialog
        trigger={
          <Button
            variant="destructive"
            className="cursor-pointer bg-cancel-button-background! px-2.5 text-sm text-white hover:bg-destructive! sm:px-3"
          >
            Log out
          </Button>
        }
      />
    </div>
  );
}
