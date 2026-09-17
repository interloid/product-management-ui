import { useNavigate } from "react-router-dom";
import EmptyPage from "@/components/shad/empty-page";
import { Button } from "@/components/ui/button";
import { Tags } from "lucide-react";

export default function Categories() {
  const navigate = useNavigate();

  return (
    <EmptyPage
      icon={Tags}
      badge="Catalog Taxonomies"
      title="Category Hierarchy & Attributes"
      description="Organize your product line with structured taxonomy trees, attribute templates, and category-level discount rules."
      features={[
        "Multi-level nested categories, sub-categories, and collections",
        "Category-wide custom attributes (sizes, colors, materials)",
        "Bulk product reassignment and drag-and-drop hierarchy",
      ]}
    >
      <Button
        variant="default"
        onClick={() => navigate("/products")}
        className="cursor-pointer"
      >
        Manage Products
      </Button>
    </EmptyPage>
  );
}
