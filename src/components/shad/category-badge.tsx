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
    <Badge variant="outline" className={cn("rounded-sm", tone.badge, className)}>
      {name}
    </Badge>
  );
}