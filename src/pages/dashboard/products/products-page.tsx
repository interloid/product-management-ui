import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { ProductTable } from "@/features/products/components/product-table/product-table";
import { ProductForm } from "@/features/products/crud/product-form";
import { useSearch } from "@/features/search/use-search";
import {
  archiveProduct as archiveProductApi,
  deleteProduct as deleteProductApi,
  getProduct,
  getProducts,
} from "@/features/products/product-service";
import type {
  ApiProduct,
  ProductCategoryFilter,
  ProductSort,
  ProductSortField,
  ProductStatusFilter,
} from "@/types/data-type";
import { ProductListSkeleton } from "@/components/shared/product-list-skeleton";
import { TablePagination } from "@/components/shared/table-pagination";
import { Button } from "@/components/ui/button";
import { ProductFilters } from "@/features/products/components/product-filters";

type ProductFormMode = "view" | "edit";

type ProductFormState = {
  mode: ProductFormMode;
  product: ApiProduct | null;
  productId: string | null;
  open: boolean;
  loading: boolean;
};

export default function ProductsPage() {
  const { searchQuery, refreshKey, refresh, productCount, setProductCount } =
    useSearch();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [category, setCategory] = useState<ProductCategoryFilter>("All");
  const [status, setStatus] = useState<ProductStatusFilter>("All");
  const [priceRange, setPriceRange] = useState("all");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [archiveId, setArchiveId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [sort, setSort] = useState<ProductSort>({
    field: null,
    order: "desc",
  });
  const [productForm, setProductForm] = useState<ProductFormState>({
    mode: "view",
    product: null,
    productId: null,
    open: false,
    loading: false,
  });

  useEffect(() => {
    let ignore = false;

    async function loadProducts() {
      try {
        setIsLoading(true);
        setLoadError(null);

        const response = await getProducts({
          page,
          pageSize,
          status,
          category,
          search: debouncedSearch,
          priceRange,
          sort: sort.field ?? undefined,
          order: sort.order,
        });

        if (ignore) return;

        setProducts(response.products);
        setProductCount(response.total);
        setTotalPages(response.totalPages);
      } catch (error) {
        if (!ignore) {
          const message =
            error instanceof Error && error.message.includes("Authentication")
              ? "Your session has expired. Please sign in again."
              : "Unable to load products. Please try again.";
          setLoadError(message);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      ignore = true;
    };
  }, [
    page,
    pageSize,
    status,
    category,
    debouncedSearch,
    priceRange,
    refreshKey,
    sort.field,
    sort.order,
    setProductCount,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const updateCategory = useCallback((value: ProductCategoryFilter) => {
    setCategory(value);
    setPage(1);
  }, []);

  const updateStatus = useCallback((value: ProductStatusFilter) => {
    setStatus(value);
    setPage(1);
  }, []);

  const updatePrice = useCallback((value: string) => {
    setPriceRange(value);
    setPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setCategory("All");
    setStatus("All");
    setPriceRange("all");
    setPage(1);
  }, []);

  const handleSort = useCallback((field: ProductSortField) => {
    setSort((current) => ({
      field,
      order:
        current.field === field && current.order === "asc" ? "desc" : "asc",
    }));

    setPage(1);
  }, []);

  const handleDeleteProduct = useCallback(
    async (id: string) => {
      try {
        await deleteProductApi(id);
        setDeleteId(null);
        toast.success("Product deleted successfully");
        refresh();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to delete product",
        );
      }
    },
    [refresh],
  );

  const handleArchiveProduct = useCallback(
    async (id: string) => {
      try {
        await archiveProductApi(id);
        setArchiveId(null);
        toast.success("Product archived successfully");
        refresh();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to archive product",
        );
      }
    },
    [refresh],
  );

  const openProductForm = useCallback(
    (product: ApiProduct, mode: ProductFormMode) => {
      setProductForm({
        mode,
        product: null,
        productId: product.id,
        open: true,
        loading: true,
      });
    },
    [],
  );

  const openView = useCallback(
    (product: ApiProduct) => {
      openProductForm(product, "view");
    },
    [openProductForm],
  );

  const openEdit = useCallback(
    (product: ApiProduct) => {
      openProductForm(product, "edit");
    },
    [openProductForm],
  );

  useEffect(() => {
    if (!productForm.open || !productForm.productId) {
      return;
    }

    let ignore = false;

    async function loadProduct() {
      try {
        const response = await getProduct(productForm.productId!);

        if (!ignore) {
          setProductForm((current) => ({
            ...current,
            product: response,
            loading: false,
          }));
        }
      } catch (error) {
        if (!ignore) {
          toast.error(
            error instanceof Error ? error.message : "Failed to load product",
          );

          setProductForm((current) => ({
            ...current,
            open: false,
            loading: false,
          }));
        }
      }
    }
    loadProduct();
    return () => {
      ignore = true;
    };
  }, [productForm.open, productForm.productId]);

  const handleProductUpdated = useCallback(() => {
    setProductForm({
      mode: "view",
      product: null,
      productId: null,
      open: false,
      loading: false,
    });
    refresh();
  }, [refresh]);

  const handleProductFormOpenChange = useCallback((open: boolean) => {
    if (open) {
      setProductForm((current) => ({
        ...current,
        open: true,
      }));

      return;
    }

    setProductForm({
      mode: "view",
      product: null,
      productId: null,
      open: false,
      loading: false,
    });
  }, []);
  if (loadError) {
    return (
      <div className="flex min-h-50 items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-destructive font-medium">{loadError}</p>
          <Button type="button" variant="outline" onClick={refresh}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full space-y-4">
        <ProductFilters
          category={category}
          status={status}
          priceRange={priceRange}
          sort={sort}
          onCategoryChange={updateCategory}
          onStatusChange={updateStatus}
          onPriceChange={updatePrice}
          onReset={resetFilters}
        />
        <div className="relative">
          <div
            className={
              isLoading
                ? "pointer-events-none opacity-50 transition-opacity"
                : "opacity-100 transition-opacity"
            }
          >
            <ProductTable
              products={products}
              onEdit={openEdit}
              onView={openView}
              archiveId={archiveId}
              deleteId={deleteId}
              sort={sort}
              onSort={handleSort}
              onArchive={setArchiveId}
              onCancelArchive={() => setArchiveId(null)}
              onConfirmArchive={handleArchiveProduct}
              onDelete={setDeleteId}
              onCancelDelete={() => setDeleteId(null)}
              onConfirmDelete={handleDeleteProduct}
            />
          </div>
          {isLoading && <ProductListSkeleton />}
        </div>
        <ProductForm
          key={`${productForm.mode}-${productForm.product?.id ?? "loading"}`}
          mode={productForm.mode}
          product={productForm.product}
          open={productForm.open}
          loading={productForm.loading}
          onOpenChange={handleProductFormOpenChange}
          onEdit={openEdit}
          onUpdated={handleProductUpdated}
        />
      </div>
      <TablePagination
        page={page}
        pageSize={pageSize}
        productCount={productCount}
        totalPages={totalPages}
        setPage={setPage}
        setPageSize={setPageSize}
      />
    </>
  );
}
