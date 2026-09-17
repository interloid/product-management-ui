import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProductCategoryFilter } from "@/types/product";
import type { ProductFiltersProps } from "@/types/props";
import { categories, statusFilters } from "@/lib/product-options";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ListRestart } from "lucide-react";

const priceRanges = [
  { value: "all", label: "All" },
  { value: "0-50", label: "$0–$50" },
  { value: "50-100", label: "$50–$100" },
  { value: "100-250", label: "$100–$250" },
  { value: "250-500", label: "$250–$500" },
  { value: "500+", label: "$500+" },
];

export function ProductFilters({
  category,
  status,
  priceRange,
  sort,
  searchQuery,
  page = 1,
  pageSize = 10,
  onCategoryChange,
  onStatusChange,
  onPriceChange,
  onReset,
  searchSlot,
  actionsSlot,
}: ProductFiltersProps) {
  const isDefaultFilters =
    category === "All" &&
    status === "All" &&
    priceRange === "all" &&
    sort.field === null &&
    (!searchQuery || !searchQuery.trim()) &&
    page === 1 &&
    pageSize === 10;

  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-3 min-w-0">
      <div className="flex flex-wrap items-center gap-2 min-w-0">
        <Select
          value={category}
          onValueChange={(value) =>
            onCategoryChange(value as ProductCategoryFilter)
          }
        >
          <SelectTrigger className="h-9 w-auto min-w-31.25 text-xs font-medium cursor-pointer">
            <span className="text-muted-foreground mr-1">Category:</span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            position="popper"
            side="bottom"
            align="start"
            sideOffset={4}
            className="w-44 p-1"
          >
            {categories.map((item) => (
              <SelectItem
                key={item.value}
                value={item.value}
                className="text-xs cursor-pointer hover:bg-primary-hover!"
              >
                {item.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex flex-wrap items-center gap-1">
          {statusFilters.map((item) => {
            const active = status === item.value;
            return (
              <Button
                key={item.value}
                type="button"
                variant={active ? "default" : "outline"}
                size="sm"
                className={
                  active
                    ? "h-9 rounded-md px-3 sm:px-4 cursor-pointer"
                    : "h-9 rounded-md px-3 font-normal hover:bg-primary-hover hover:border-primary sm:px-4 cursor-pointer"
                }
                onClick={() => onStatusChange(item.value)}
              >
                {item.label}
              </Button>
            );
          })}
        </div>

        <Select value={priceRange} onValueChange={onPriceChange}>
          <SelectTrigger className="h-9 w-auto min-w-26.25 text-xs font-medium cursor-pointer">
            <span className="text-muted-foreground mr-1">Price:</span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            position="popper"
            side="bottom"
            align="start"
            sideOffset={4}
            className="w-36 p-1"
          >
            {priceRanges.map((range) => (
              <SelectItem
                key={range.value}
                value={range.value}
                className="text-xs cursor-pointer hover:bg-primary-hover!"
              >
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-9 shrink-0 cursor-pointer"
              onClick={onReset}
              aria-label="Reset filters"
              disabled={isDefaultFilters}
            >
              <ListRestart className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Reset filters</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {(searchSlot || actionsSlot) && (
        <div className="flex items-center gap-2 min-w-0 w-full min-[1100px]:w-auto">
          {searchSlot}
          {actionsSlot}
        </div>
      )}
    </div>
  );
}
