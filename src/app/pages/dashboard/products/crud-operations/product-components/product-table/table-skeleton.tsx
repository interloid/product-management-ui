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
    <div className="relative w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-border/80 bg-card shadow-xs ring-1 ring-black/4 dark:ring-white/6">
      <Table
        className="table-fixed min-w-[640px] md:min-w-240"
        containerClassName="max-h-[calc(100vh-270px)] overflow-y-auto"
      >
        <TableHeader className="sticky top-0 z-20 bg-slate-50/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-border/80 [&_th]:bg-slate-50/95 dark:[&_th]:bg-zinc-900/95">
          <TableRow className="bg-slate-50/95 dark:bg-zinc-900/95 text-xs">
            <TableHead className="w-[22%] md:w-[17%] min-w-32 md:min-w-38.75">
              <Skeleton className="h-4 w-16" />
            </TableHead>

            <TableHead className="w-[26%] md:w-[20%] min-w-36 md:min-w-40">
              <Skeleton className="h-4 w-28" />
            </TableHead>

            <TableHead className="hidden md:table-cell w-[10%] min-w-25">
              <Skeleton className="h-4 w-20" />
            </TableHead>

            <TableHead className="w-[14%] md:w-[9%] min-w-20 md:min-w-21.25">
              <Skeleton className="h-4 w-14" />
            </TableHead>

            <TableHead className="w-[12%] md:w-[7%] min-w-18 md:min-w-20">
              <Skeleton className="h-4 w-12" />
            </TableHead>

            <TableHead className="w-[14%] md:w-[11%] min-w-24 md:min-w-28.75">
              <Skeleton className="h-4 w-16" />
            </TableHead>

            <TableHead className="hidden md:table-cell w-[15%] min-w-40">
              <Skeleton className="h-4 w-20" />
            </TableHead>

            <TableHead className="w-[12%] md:w-[10%] min-w-20 md:min-w-23.75 text-center!">
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
                <Skeleton className="h-5 w-16 rounded-md" />
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
