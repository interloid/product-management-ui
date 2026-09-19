import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProductCategoryFilter } from "@/types/product";
import type { ProductFiltersProps, TableDensity } from "@/types/props";
import { categories, statusFilters } from "@/lib/product-options";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FunnelX, RotateCcw, Rows2, Rows3, Rows4 } from "lucide-react";
import { PriceSliderFilter } from "./price-slider-filter";
import { triggerResetColumnWidths } from "./product-table/use-table-column-resize";

export function ProductFilters({
  category,
  status,
  priceRange,
  sort,
  searchQuery,
  page = 1,
  pageSize = 10,
  density = "normal",
  onToggleDensity,
  onDensityChange,
  onCategoryChange,
  onStatusChange,
  onPriceChange,
  onReset,
  onResetColumns,
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
        className={cn(
          "h-9 text-xs xl:text-sm font-medium cursor-pointer hover:border-primary hover:bg-primary-hover focus-visible:border-primary focus-visible:ring-primary/20",
          className ?? "w-auto min-w-31.25",
        )}
      >
        <span className="mr-1 xl:text-sm">Category:</span>
        <SelectValue className="text-xs xl:text-sm font-medium" />
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
            className="text-xs xl:text-sm cursor-pointer hover:bg-primary-hover!"
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
      className={className ?? "w-auto min-w-34 sm:min-w-38"}
    />
  );

  const renderDensityDropdown = (className?: string) => {
    if (!onDensityChange && !onToggleDensity) return null;
    const isCompact = density === "compact";
    const isComfort = density === "comfort" || density === "comfortable";
    const canonicalDensity = isCompact
      ? "compact"
      : isComfort
        ? "comfort"
        : "normal";

    const densityLabel = isCompact
      ? "Compact"
      : isComfort
        ? "Comfort"
        : "Normal";

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "h-9 px-3 text-xs xl:text-sm font-medium cursor-pointer gap-1.5 hover:border-primary hover:bg-primary-hover focus-visible:border-primary focus-visible:ring-primary/20 shrink-0",
              className,
            )}
            aria-label={`Table density: ${densityLabel}`}
          >
            {isCompact ? (
              <Rows4 className="size-4 shrink-0 text-muted-foreground" />
            ) : isComfort ? (
              <Rows2 className="size-4 shrink-0 text-muted-foreground" />
            ) : (
              <Rows3 className="size-4 shrink-0 text-muted-foreground" />
            )}
            <span className="text-xs xl:text-sm font-medium">Density</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-36 p-1">
          <DropdownMenuLabel className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase px-2 py-1">
            Table Density
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={canonicalDensity}
            onValueChange={(val) => {
              const selected = val as TableDensity;
              if (onDensityChange) {
                onDensityChange(selected);
              } else if (onToggleDensity) {
                onToggleDensity();
              }
            }}
          >
            <DropdownMenuRadioItem
              value="compact"
              className="text-xs cursor-pointer hover:bg-primary-hover! flex items-center gap-2 py-1.5"
            >
              <Rows4 className="size-3.5 text-muted-foreground shrink-0" />
              <span>Compact</span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              value="normal"
              className="text-xs cursor-pointer hover:bg-primary-hover! flex items-center gap-2 py-1.5"
            >
              <Rows3 className="size-3.5 text-muted-foreground shrink-0" />
              <span>Normal</span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              value="comfort"
              className="text-xs cursor-pointer hover:bg-primary-hover! flex items-center gap-2 py-1.5"
            >
              <Rows2 className="size-3.5 text-muted-foreground shrink-0" />
              <span>Comfort</span>
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              if (onResetColumns) {
                onResetColumns();
              } else {
                triggerResetColumnWidths();
              }
            }}
            className="text-xs cursor-pointer hover:bg-primary-hover! flex items-center gap-2 py-1.5 text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="size-3.5 shrink-0" />
            <span>Reset columns</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const renderResetColumnsButton = () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-9 shrink-0 cursor-pointer hover:border-primary hover:bg-primary-hover focus-visible:border-primary focus-visible:ring-primary/20"
          onClick={() => {
            if (onResetColumns) {
              onResetColumns();
            } else {
              triggerResetColumnWidths();
            }
          }}
          aria-label="Reset column widths"
        >
          <RotateCcw className="size-3.5 text-muted-foreground" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>Reset column widths</p>
      </TooltipContent>
    </Tooltip>
  );

  const renderResetButton = () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-9 shrink-0 cursor-pointer hover:border-primary hover:bg-primary-hover focus-visible:border-primary focus-visible:ring-primary/20"
          onClick={onReset}
          aria-label="Reset filters"
          disabled={isDefaultFilters}
        >
          <FunnelX className="size-3.5"/>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>Clear filters</p>
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
          {renderDensityDropdown()}
          {renderResetColumnsButton()}
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
                      ? "h-9 rounded-md px-3 sm:px-4 text-xs xl:text-sm cursor-pointer"
                      : "h-9 rounded-md px-3 font-normal text-xs xl:text-sm hover:bg-primary-hover hover:border-primary sm:px-4 cursor-pointer"
                  }
                  onClick={() => onStatusChange(item.value)}
                >
                  {item.label}
                </Button>
              );
            })}
          </div>

          {renderPriceSelect()}
          {renderDensityDropdown()}
          {renderResetColumnsButton()}
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
