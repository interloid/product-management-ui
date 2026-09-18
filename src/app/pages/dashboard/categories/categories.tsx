import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Tags, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Categories() {
  const navigate = useNavigate();

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Categories
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 sm:text-sm">
            Manage product taxonomy and classification categories across the
            catalog.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 cursor-pointer"
          >
            <RefreshCw className="size-3.5" />
            <span>Refresh</span>
          </Button>
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
      <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-border p-8 text-center">
        <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Tags className="size-5" />
        </div>
        <p className="mt-3 text-sm font-medium text-foreground">
          No categories found
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Categories will appear here once created or assigned to products.
        </p>
      </div>
    </div>
  );
}
