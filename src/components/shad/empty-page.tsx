import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Badge } from "@/components/ui/badge";
import type { EmptyPageProps } from "@/types/props";

export default function EmptyProductPage({
  icon: Icon,
  image,
  badge = "Coming Soon",
  title = "Coming soon",
  description = "This page is currently under development.",
  children,
}: EmptyPageProps) {
  return (
    <div className="flex flex-1 h-full items-center justify-center p-4">
      <Empty className="max-w-lg border border-border/70 bg-card p-6 sm:p-8 rounded-xl shadow-xs">
        <EmptyHeader>
          <div className="flex justify-center mb-1">
            <Badge variant="secondary" className="px-2.5 py-0.5 font-medium text-xs">
              {badge}
            </Badge>
          </div>

          {image ? (
            <EmptyMedia>
              <img
                src={image}
                alt=""
                className="h-44 w-auto object-contain sm:h-52"
              />
            </EmptyMedia>
          ) : (
            Icon && (
              <EmptyMedia variant="icon" className="size-14 rounded-2xl bg-primary/10 text-primary mb-2">
                <Icon className="size-7" />
              </EmptyMedia>
            )
          )}
          <EmptyTitle className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {title}
          </EmptyTitle>
          <EmptyDescription className="text-sm text-muted-foreground max-w-sm mx-auto">
            {description}
          </EmptyDescription>
        </EmptyHeader>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          {children}
        </div>
      </Empty>
    </div>
  );
}
