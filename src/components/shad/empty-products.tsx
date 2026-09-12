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
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted p-6 text-center">
          <div className="mb-1 flex size-11 items-center justify-center rounded-md border bg-background">
            <PackageOpen className="size-5 text-muted-foreground" />
          </div>
          <h3 className="text-[15px] font-semibold">
            {showNoResults
              ? "No products match your search or filters"
              : "No products yet"}
          </h3>
          {showNoResults && onResetFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="mt-2 gap-1.5 text-xs font-medium"
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
