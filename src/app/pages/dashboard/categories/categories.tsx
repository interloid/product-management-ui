import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Categories() {
  const navigate = useNavigate();

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Categories
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 sm:text-sm">
            Manage product taxonomy and classification categories across the catalog.
          </p>
        </div>

        <div>
          <Button
            type="button"
            size="sm"
            onClick={() => navigate("/products")}
            className="h-9 gap-1.5 cursor-pointer"
          >
            Manage Products
            <ArrowUpRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
