import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const SKELETON_ROWS = 10;

export function ProductTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border">
      <Table
        className="table-fixed min-w-212.5"
        containerClassName="max-h-[calc(100vh-270px)] overflow-y-auto"
      >
        <TableHeader className="sticky top-0 z-20 bg-muted/95 backdrop-blur-xs shadow-xs [&_th]:bg-muted">
          <TableRow className="bg-muted text-xs">
            <TableHead className="w-[15%] min-w-30">
              <Skeleton className="h-4 w-16" />
            </TableHead>

            <TableHead className="w-[25%] min-w-42.5">
              <Skeleton className="h-4 w-28" />
            </TableHead>

            <TableHead className="hidden md:table-cell w-[12%] min-w-25">
              <Skeleton className="h-4 w-20" />
            </TableHead>

            <TableHead className="w-[11%] min-w-21.25">
              <Skeleton className="h-4 w-14" />
            </TableHead>

            <TableHead className="w-[8%] min-w-16.25">
              <Skeleton className="h-4 w-12" />
            </TableHead>

            <TableHead className="w-[11%] min-w-23.75">
              <Skeleton className="h-4 w-16" />
            </TableHead>

            <TableHead className="hidden md:table-cell w-[10%] min-w-26.25">
              <Skeleton className="h-4 w-20" />
            </TableHead>

            <TableHead className="w-[8%] min-w-20 text-center!">
              <Skeleton className="mx-auto h-4 w-14" />
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: SKELETON_ROWS }).map((_, index) => (
            <TableRow key={index} className="h-14.25">
              <TableCell>
                <div className="flex items-center gap-3">
                  <Skeleton className="size-10 shrink-0 rounded-md" />

                  <Skeleton className="h-4 w-20" />
                </div>
              </TableCell>

              <TableCell className="overflow-hidden">
                <Skeleton className="h-4 w-32" />
              </TableCell>

              <TableCell className="hidden md:table-cell">
                <Skeleton className="h-4 w-16" />
              </TableCell>

              <TableCell>
                <Skeleton className="h-4 w-14" />
              </TableCell>

              <TableCell>
                <Skeleton className="h-4 w-8" />
              </TableCell>

              <TableCell>
                <Skeleton className="h-5 w-16 rounded-full" />
              </TableCell>

              <TableCell className="hidden md:table-cell">
                <Skeleton className="h-4 w-24" />
              </TableCell>

              <TableCell>
                <div className="flex items-center justify-center gap-1">
                  <Skeleton className="h-8 w-14 rounded-md" />
                  <Skeleton className="size-8 rounded-md" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}