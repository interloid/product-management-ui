import { PackageOpen, RotateCcw } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function EmptyProductTableRow({
  showNoResults = false,
  onResetFilters,
}: {
  showNoResults?: boolean;
  onResetFilters?: () => void;
}) {
  return (
    <TableRow>
      <TableCell colSpan={8} className="h-100 p-5">
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border/70 bg-muted/30 dark:bg-muted/10 p-6 text-center">
          <div className="mb-1 flex size-11 items-center justify-center rounded-lg border border-border/70 bg-background shadow-xs">
            <PackageOpen className="size-5 text-muted-foreground" />
          </div>
          <h3 className="text-[15px] font-semibold text-foreground">
            {showNoResults
              ? "No products match your search or filters"
              : "No products yet"}
          </h3>
          {showNoResults && onResetFilters && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="mt-2 gap-1.5 text-xs font-medium rounded-lg border-border/70 bg-background hover:border-primary/50 hover:bg-muted/40 cursor-pointer"
            >
              <RotateCcw className="size-3.5" />
              Clear all filters
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
