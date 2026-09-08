import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { ProductTable } from "@/features/products/components/product-table/product-table";
import { ProductView } from "@/features/products/crud/product-form";
import { ProductEdit } from "@/features/products/crud/product-form";
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
  const [viewProduct, setViewProduct] = useState<ApiProduct | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewProductId, setViewProductId] = useState<string | null>(null);
  const [editProduct, setEditProduct] = useState<ApiProduct | null>(null);
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

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

  const openEdit = useCallback((product: ApiProduct) => {
    setViewOpen(false);
    setViewProduct(null);
    setViewProductId(null);

    setEditProductId(product.id);
    setEditProduct(null);
    setEditLoading(true);
    setEditOpen(true);
  }, []);

  useEffect(() => {
    if (!editOpen || !editProductId) {
      return;
    }

    let ignore = false;

    getProduct(editProductId)
      .then((response) => {
        if (!ignore) {
          setEditProduct(response);
        }
      })
      .catch((error) => {
        if (!ignore) {
          toast.error(
            error instanceof Error ? error.message : "Failed to load product",
          );
          setEditOpen(false);
        }
      })
      .finally(() => {
        if (!ignore) {
          setEditLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [editOpen, editProductId]);

  const openView = useCallback((product: ApiProduct) => {
    setEditOpen(false);
    setEditProduct(null);
    setEditProductId(null);

    setViewProductId(product.id);
    setViewProduct(null);
    setViewLoading(true);
    setViewOpen(true);
  }, []);
  useEffect(() => {
    if (!viewOpen || !viewProductId) {
      return;
    }

    let ignore = false;

    const frame = requestAnimationFrame(() => {
      getProduct(viewProductId)
        .then((response) => {
          if (!ignore) {
            setViewProduct(response);
          }
        })
        .catch((error) => {
          if (!ignore) {
            toast.error(
              error instanceof Error ? error.message : "Failed to load product",
            );
            setViewOpen(false);
          }
        })
        .finally(() => {
          if (!ignore) {
            setViewLoading(false);
          }
        });
    });

    return () => {
      ignore = true;
      cancelAnimationFrame(frame);
    };
  }, [viewOpen, viewProductId]);

  const handleProductUpdated = useCallback(() => {
    setEditOpen(false);
    setEditProduct(null);
    setEditProductId(null);
    refresh();
  }, [refresh]);

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
        <ProductView
          product={viewProduct}
          open={viewOpen}
          loading={viewLoading}
          onOpenChange={setViewOpen}
          onEdit={openEdit}
        />
        <ProductEdit
          key={editProduct?.id ?? "loading"}
          product={editProduct}
          open={editOpen}
          loading={editLoading}
          onOpenChange={setEditOpen}
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
