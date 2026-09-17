import { MoveDown, MoveUp } from "lucide-react";
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
        className="flex w-full items-center justify-start gap-1 text-[11px] font-semibold tracking-wider uppercase hover:text-foreground select-none cursor-pointer"
      >
        <span className="whitespace-nowrap">{label}</span>

        <span className="flex items-center shrink-0">
          <MoveUp
            className={`size-3 transition-colors ${
              isActive && sort.order === "asc"
                ? "text-primary"
                : "text-muted-foreground/40 hover:text-muted-foreground"
            }`}
          />
          <MoveDown
            className={`size-3 transition-colors ${
              isActive && sort.order === "desc"
                ? "text-primary"
                : "text-muted-foreground/40 hover:text-muted-foreground"
            }`}
          />
        </span>
      </button>
    </TableHead>
  );
}
