import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import type { EmptyPageProps } from "@/types/props";

export default function EmptyProductPage({
  icon: Icon,
  title = "Coming soon",
  description = "This page is currently under development.",
  children,
}: EmptyPageProps) {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Empty>
        <EmptyHeader>
          {Icon && (
            <EmptyMedia variant="icon">
              <Icon className="size-6" />
            </EmptyMedia>
          )}
          <EmptyTitle>{title}</EmptyTitle>
          <EmptyDescription>{description}</EmptyDescription>
        </EmptyHeader>
        {children}
      </Empty>
    </div>
  );
}
