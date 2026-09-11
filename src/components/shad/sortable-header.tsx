import { ArrowDown, ArrowUp } from "lucide-react";
import { TableHead } from "@/components/ui/table";
import type { SortableTableHeadProps } from "@/types/props";

export function SortableHeader({
  label,
  field,
  sort,
  onSort,
  className,
}: SortableTableHeadProps) {
  const isActive = sort.field === field;

  return (
    <TableHead className={className}>
      <button
        type="button"
        onClick={() => onSort(field)}
        className="flex w-full items-center justify-start gap-1 text-xs font-bold hover:text-foreground select-none"
      >
        <span className="whitespace-nowrap text-sm">{label}</span>

        <span className="flex flex-col -space-y-1 shrink-0">
          <ArrowUp
            className={`size-3 ${
              isActive && sort.order === "asc"
                ? "text-foreground"
                : "text-muted-foreground/40"
            }`}
          />
          <ArrowDown
            className={`size-3 ${
              isActive && sort.order === "desc"
                ? "text-foreground"
                : "text-muted-foreground/40"
            }`}
          />
        </span>
      </button>
    </TableHead>
  );
}
