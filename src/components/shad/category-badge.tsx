import { Badge } from "@/components/ui/badge";
import { categoryToneFor } from "@/lib/category-colors";
import { cn } from "@/lib/utils";

export function CategoryBadge({
  name,
  className,
}: {
  readonly name: string;
  readonly className?: string;
}) {
  const tone = categoryToneFor(name);

  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium border transition-colors shadow-2xs",
        tone.badge,
        className,
      )}
    >
      <span className="truncate">{name}</span>
    </Badge>
  );
}