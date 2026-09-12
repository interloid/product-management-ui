import EmptyProductPage from "@/components/shad/empty-page";
import pageNotFoundImage from "@/assets/page-not-found.webp";

export function NotFoundPage() {
  return (
    <EmptyProductPage
      image={pageNotFoundImage}
      title="Page not found"
      description="The page you're looking for doesn't exist."
    />
  );
}