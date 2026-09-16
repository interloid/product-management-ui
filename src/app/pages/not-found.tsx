import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmptyProductPage from "@/components/shad/empty-page";
import pageNotFoundImage from "@/assets/page-not-found.webp";

export function NotFoundPage() {
  return (
    <EmptyProductPage
      image={pageNotFoundImage}
      title="Page not found"
      description="The page you're looking for doesn't exist."
    >
      <Button asChild className="mt-1 shadow-sm transition-all hover:shadow-md">
        <Link to="/login">
          <ArrowLeft className="mr-1.5 size-4" />
          Back to login
        </Link>
      </Button>
    </EmptyProductPage>
  );
}
