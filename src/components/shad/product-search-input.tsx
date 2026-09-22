import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useSearch } from "@/hooks/use-search";
import { cn } from "@/lib/utils";

type ProductSearchInputProps = {
  className?: string;
  placeholder?: string;
};

export function ProductSearchInput({
  className = "",
  placeholder = "Search products by name, SKU...",
}: ProductSearchInputProps) {
  const { searchQuery, setSearchQuery } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isMac] = useState(detectMacDevice);

  function detectMacDevice(): boolean {
    if (typeof navigator === "undefined") {
      return false;
    }

    return /Mac|iPhone|iPod|iPad/i.test(
      navigator.userAgent || navigator.platform || "",
    );
  }

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
    <div
      onClick={() => inputRef.current?.focus()}
      className={cn(
        "group relative flex h-9 w-full items-center rounded-lg border border-border/70 bg-background px-3 shadow-2xs transition-all duration-200 cursor-text",
        "hover:border-primary/40 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
        className,
      )}
    >
      <Search
        className={cn(
          "pointer-events-none mr-2.5 size-4 shrink-0 transition-colors duration-200",
          searchQuery
            ? "text-primary"
            : "text-muted-foreground/60 group-hover:text-muted-foreground/80 group-focus-within:text-primary",
        )}
      />

      <input
        ref={inputRef}
        type="text"
        role="searchbox"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="h-full flex-1 min-w-0 bg-transparent text-xs sm:text-sm font-normal text-foreground placeholder:text-muted-foreground/60 outline-none border-0 p-0 focus:outline-none focus:ring-0"
      />

      {searchQuery ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSearchQuery("");
            inputRef.current?.focus();
          }}
          aria-label="Clear search"
          title="Clear search (Esc)"
          className="flex flex-col size-5.5 shrink-0 items-center justify-center rounded-full bg-muted/80 text-muted-foreground/80 transition-all duration-150 hover:bg-muted hover:text-foreground active:scale-90 cursor-pointer"
        >
          <X className="size-3.5" />
        </button>
      ) : (
        <kbd className="pointer-events-none ml-2 hidden select-none items-center gap-0.5 rounded-md border border-border/70 bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground/80 shadow-2xs transition-colors group-hover:text-muted-foreground sm:inline-flex shrink-0 whitespace-nowrap leading-none">
          {isMac ? "⌘K" : "Ctrl\u00A0K"}
        </kbd>
      )}
    </div>
  );
}
