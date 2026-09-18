import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmptyProductPage from "@/components/shad/empty-page";
import pageNotFoundImage from "@/assets/images/page-not-found.webp";
import { useAuth } from "@/hooks/use-auth";

export function NotFoundPage() {
  const { status } = useAuth();
  const isAuthenticated = status === "authenticated";

  return (
    <EmptyProductPage
      image={pageNotFoundImage}
      title="Page not found"
      description="The page you're looking for doesn't exist."
    >
      <Button asChild className="mt-1 shadow-sm transition-all hover:shadow-md cursor-pointer">
        <Link to={isAuthenticated ? "/products" : "/login"}>
          <ArrowLeft className="mr-1.5 size-4" />
          {isAuthenticated ? "Back to Products" : "Back to Login"}
        </Link>
      </Button>
    </EmptyProductPage>
  );
}
