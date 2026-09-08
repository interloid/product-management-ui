import { useSearch } from "@/features/search/use-search";
import type { HeaderActionsProps } from "@/types/data-type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { LogoutDialog } from "./logout-dialog";
import { getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AddProducts } from "@/features/products/crud/product-form";

export function HeaderActions({ user }: HeaderActionsProps) {
  const { searchQuery, setSearchQuery, refresh } = useSearch();
  const initials = getInitials(user?.name ?? "");

  return (
    <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2 md:w-3/4 lg:w-3/4 xl:w-3/4 2xl:w-1/2">  
      <Input
        type="search"
        placeholder="Search name or SKU..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="hidden h-9 w-1/2 md:w-full cursor-pointer focus-visible:border-primary focus-visible:ring-primary/20 sm:flex "
      />
      <AddProducts onProductCreated={refresh} />

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
            className="cursor-pointer bg-cancel-button-background! px-2.5 text-sm text-secondary hover:bg-destructive! sm:px-3"
          >
            Log out
          </Button>
        }
      />
    </div>
  );
}
