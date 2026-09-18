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
import { PriceSliderFilter } from "./price-slider-filter";

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
  categoryOptions = categories,
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

  const renderCategorySelect = (className?: string) => (
    <Select
      value={category}
      onValueChange={(value) =>
        onCategoryChange(value as ProductCategoryFilter)
      }
    >
      <SelectTrigger
        className={`h-9 text-xs font-medium cursor-pointer ${
          className ?? "w-auto min-w-31.25"
        }`}
      >
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
        {categoryOptions.map((item) => (
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
  );

  const renderPriceSelect = (className?: string) => (
    <PriceSliderFilter
      value={priceRange}
      onChange={onPriceChange}
      className={className ?? "w-auto min-w-26.25"}
    />
  );

  const renderResetButton = () => (
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
  );

  return (
    <div className="w-full min-w-0">
      <div className="flex flex-col gap-2.5 w-full sm:hidden">
        {(searchSlot || actionsSlot) && (
          <div className="flex items-center gap-2 w-full min-w-0">
            {searchSlot}
            {actionsSlot}
          </div>
        )}

        <div className="w-full border-b border-border/70" />

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 -mx-1 px-1">
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
                    ? "h-8 shrink-0 rounded-full px-3.5 text-xs font-medium cursor-pointer shadow-2xs"
                    : "h-8 shrink-0 rounded-full px-3.5 text-xs font-normal hover:bg-primary-hover hover:border-primary cursor-pointer"
                }
                onClick={() => onStatusChange(item.value)}
              >
                {item.label}
              </Button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 w-full">
          {renderCategorySelect("flex-1 min-w-0")}
          {renderPriceSelect("flex-1 min-w-0")}
          {renderResetButton()}
        </div>
      </div>

      <div className="hidden sm:flex w-full flex-wrap items-center justify-between gap-3 min-w-0">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          {renderCategorySelect()}

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

          {renderPriceSelect()}
          {renderResetButton()}
        </div>

        {(searchSlot || actionsSlot) && (
          <div className="flex items-center gap-2 min-w-0 w-full min-[1300px]:w-auto">
            {searchSlot}
            {actionsSlot}
          </div>
        )}
      </div>
    </div>
  );
}
