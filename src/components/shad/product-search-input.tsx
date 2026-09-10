import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSearch } from "@/context/use-search";

type ProductSearchInputProps = {
  className?: string;
};

export function ProductSearchInput({
  className = "",
}: ProductSearchInputProps) {
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <div className={`relative ${className}`}>
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
  );
}