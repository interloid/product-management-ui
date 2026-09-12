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
  image,
  title = "Coming soon",
  description = "This page is currently under development.",
  children,
}: EmptyPageProps) {
  return (
    <div className="flex flex-1 h-full items-center justify-center">
      <Empty>
        <EmptyHeader>
          {image ? (
            <EmptyMedia>
              <img
                src={image}
                alt=""
                className="h-48 w-auto object-contain sm:h-56"
              />
            </EmptyMedia>
          ) : (
            Icon && (
              <EmptyMedia variant="icon">
                <Icon className="size-6" />
              </EmptyMedia>
            )
          )}
          <EmptyTitle>{title}</EmptyTitle>
          <EmptyDescription>{description}</EmptyDescription>
        </EmptyHeader>

        {children}
      </Empty>
    </div>
  );
}