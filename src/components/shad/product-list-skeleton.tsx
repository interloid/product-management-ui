export function ProductListSkeleton() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      <div className="absolute inset-y-0 -left-1/3 w-1/3 animate-shimmer bg-linear-to-r from-transparent via-white/40 to-transparent" />
    </div>
  );
}