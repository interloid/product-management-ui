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
  { value: "0-50", label: "$0-$50" },
  { value: "50-100", label: "$50-$100" },
  { value: "100-250", label: "$100-$250" },
  { value: "250-500", label: "$250-$500" },
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
    <div className="flex w-full flex-wrap items-center gap-2 min-[1448px]:flex-row-reverse min-[1440px]:justify-between">
      {(searchSlot || actionsSlot) && (
        <div className="flex min-w-0 items-center gap-2">
          {searchSlot}
          {actionsSlot}
        </div>
      )}
      <div className="flex flex-wrap min-w-0 items-center gap-1!">
        <Select
          value={category}
          onValueChange={(value) =>
            onCategoryChange(value as ProductCategoryFilter)
          }
        >
          <SelectTrigger className="h-9 w-fit hover:bg-primary-hover! hover:border-primary">
            <span className="text-sm">Category:</span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            position="popper"
            side="bottom"
            align="start"
            sideOffset={4}
            avoidCollisions={false}
            className="w-fit p-1! "
          >
            {categories.map((item) => (
              <SelectItem
                key={item.value}
                value={item.value}
                className="hover:bg-primary-hover!"
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
                    ? "h-9 rounded-md px-3 sm:px-4"
                    : "h-9 rounded-md px-3 font-normal hover:bg-primary-hover! hover:border-primary sm:px-4"
                }
                onClick={() => onStatusChange(item.value)}
              >
                {item.label}
              </Button>
            );
          })}
        </div>
        <div className="mx-1 hidden h-6 w-px bg-border md:block" />
        <Select value={priceRange} onValueChange={onPriceChange}>
          <SelectTrigger className="h-9 w-fit hover:bg-primary-hover! hover:border-primary">
            <span className="text-xs">Price</span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            position="popper"
            side="bottom"
            align="start"
            sideOffset={4}
            avoidCollisions={false}
            className="w-fit p-1"
          >
            {priceRanges.map((range) => (
              <SelectItem
                key={range.value}
                value={range.value}
                className="hover:bg-primary-hover!"
              >
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1 text-xs text-muted-text">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 px-3 hover:border-primary hover:bg-primary-hover!"
                onClick={onReset}
                aria-label="Reset filters"
                disabled={isDefaultFilters}
              >
                <ListRestart className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Clear Filters</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
