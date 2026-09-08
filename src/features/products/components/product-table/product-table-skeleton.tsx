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
      <div className="overflow-x-auto">
        <Table className="text-center">
          <TableHeader>
            <TableRow className="bg-muted/50 text-xs">
              <TableHead className="w-[24%] text-center">
                <Skeleton className="mx-auto h-4 w-20" />
              </TableHead>

              <TableHead className="w-[17%] text-center">
                <Skeleton className="mx-auto h-4 w-28" />
              </TableHead>

              <TableHead className="hidden w-[10%] text-center md:table-cell">
                <Skeleton className="mx-auto h-4 w-20" />
              </TableHead>

              <TableHead className="w-[10%] text-center">
                <Skeleton className="mx-auto h-4 w-14" />
              </TableHead>

              <TableHead className="w-[8%] text-center">
                <Skeleton className="mx-auto h-4 w-14" />
              </TableHead>

              <TableHead className="w-[11%] text-center">
                <Skeleton className="mx-auto h-4 w-16" />
              </TableHead>

              <TableHead className="hidden w-[12%] text-center md:table-cell">
                <Skeleton className="mx-auto h-4 w-20" />
              </TableHead>

              <TableHead className="w-[8%] text-center">
                <Skeleton className="mx-auto h-4 w-16" />
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.from({ length: SKELETON_ROWS }).map((_, index) => (
              <TableRow key={index} className="h-14.25">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-10 shrink-0 rounded-md" />

                    <Skeleton className="h-4 w-28" />
                  </div>
                </TableCell>

                <TableCell>
                  <Skeleton className="mx-auto h-4 w-28" />
                </TableCell>

                <TableCell className="hidden md:table-cell">
                  <Skeleton className="mx-auto h-4 w-16" />
                </TableCell>

                <TableCell>
                  <Skeleton className="mx-auto h-4 w-16" />
                </TableCell>

                <TableCell>
                  <Skeleton className="mx-auto h-4 w-8" />
                </TableCell>

                <TableCell>
                  <Skeleton className="mx-auto h-5 w-16 rounded-full" />
                </TableCell>

                <TableCell className="hidden md:table-cell">
                  <Skeleton className="mx-auto h-4 w-28" />
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
    </div>
  );
}