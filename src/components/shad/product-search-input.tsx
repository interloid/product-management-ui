import { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSearch } from "@/hooks/use-search";

type ProductSearchInputProps = {
  className?: string;
};

export function ProductSearchInput({
  className = "",
}: ProductSearchInputProps) {
  const { searchQuery, setSearchQuery } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTypingElsewhere =
        target &&
        target !== inputRef.current &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        if (!isTypingElsewhere) {
          e.preventDefault();
          inputRef.current?.focus();
          inputRef.current?.select();
        }
      }

      if (e.key === "Escape" && document.activeElement === inputRef.current) {
        if (searchQuery) {
          setSearchQuery("");
        } else {
          inputRef.current?.blur();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchQuery, setSearchQuery]);

  return (
    <div className={`relative ${className}`}>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

      <Input
        ref={inputRef}
        type="search"
        placeholder="Search for products, SKU..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="h-9 w-full pl-9 pr-11 text-xs focus-visible:border-primary focus-visible:ring-primary/20 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
      />

      {searchQuery ? (
        <button
          type="button"
          onClick={() => {
            setSearchQuery("");
            inputRef.current?.focus();
          }}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
        >
          <X className="size-3.5" />
        </button>
      ) : (
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 hidden select-none items-center gap-0.5 rounded border border-border/80 bg-muted/70 px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground shadow-2xs sm:inline-flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      )}
    </div>
  );
}
