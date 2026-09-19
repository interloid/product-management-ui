import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { TableHead } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { SortableTableHeadProps } from "@/types/props";

export function SortableHeader({
  label,
  field,
  sort,
  onSort,
  className,
}: SortableTableHeadProps) {
  const isActive = sort.field === field;

  const renderSortIcon = () => {
    if (!isActive) {
      return (
        <ArrowUpDown className="size-3.5 text-muted-foreground group-hover/sort:text-muted-foreground transition-colors shrink-0" />
      );
    }
    if (sort.order === "asc") {
      return (
        <ArrowUp className="size-3.5 text-primary shrink-0 transition-colors" />
      );
    }
    return (
      <ArrowDown className="size-3.5 text-primary shrink-0 transition-colors" />
    );
  };

  return (
    <TableHead className={className}>
      <button
        type="button"
        onClick={() => onSort(field)}
        className={cn(
          "group/sort flex w-full items-center justify-start gap-1 text-[11px] font-semibold tracking-wider uppercase select-none cursor-pointer outline-none focus-visible:text-foreground focus-visible:ring-1 focus-visible:ring-primary/20 rounded-xs transition-colors",
        )}
        title={`Sort by ${label}`}
      >
        <span className="whitespace-nowrap">{label}</span>
        {renderSortIcon()}
      </button>
    </TableHead>
  );
}
