import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { ProductTable } from "@/app/pages/dashboard/products/crud-operations/product-components/productTable/product-table";
import { ProductForm } from "@/app/pages/dashboard/products/crud-operations/product-form";
import { useSearch } from "@/context/use-search";
import {
  archiveProduct as archiveProductApi,
  deleteProduct as deleteProductApi,
  getProduct,
  getProducts,
} from "@/services/product-service";
import type {
  ApiProduct,
  ProductCategoryFilter,
  ProductFormMode,
  ProductFormState,
  ProductSort,
  ProductSortField,
  ProductStatusFilter,
} from "@/types/product";
import { ProductListSkeleton } from "@/components/shad/product-list-skeleton";
import { TablePagination } from "@/components/shad/table-pagination";
import { Button } from "@/components/ui/button";
import { ProductFilters } from "@/app/pages/dashboard/products/crud-operations/product-components/product-filters";
import { ProductTableSkeleton } from "@/app/pages/dashboard/products/crud-operations/product-components/productTable/product-table-skeleton";
import { getUserFriendlyErrorMessage } from "@/lib/errors";

export default function ProductsPage() {
  const {
    searchQuery,
    setSearchQuery,
    refreshKey,
    refresh,
    productCount,
    setProductCount,
    addTrigger,
  } = useSearch();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [category, setCategory] = useState<ProductCategoryFilter>("All");
  const [status, setStatus] = useState<ProductStatusFilter>("All");
  const [priceRange, setPriceRange] = useState("all");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [archiveId, setArchiveId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isActionPending, setIsActionPending] = useState(false);
  const isActionPendingRef = useRef(false);
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

  const tableTopRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    tableTopRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [page]);

  const showNoResults =
    category !== "All" ||
    status !== "All" ||
    priceRange !== "all" ||
    debouncedSearch.trim() !== "" ||
    sort.field !== null ||
    page > 1;

  useEffect(() => {
    const controller = new AbortController();
    let ignore = false;

    async function loadProducts() {
      try {
        setIsLoading(true);
        setLoadError(null);

        const response = await getProducts(
          {
            page,
            pageSize,
            status,
            category,
            search: debouncedSearch,
            priceRange,
            sort: sort.field ?? undefined,
            order: sort.order,
          },
          controller.signal,
        );

        if (ignore) return;

        if (response.totalPages > 0 && page > response.totalPages) {
          setPage(response.totalPages);
          return;
        }

        if (response.totalPages === 0 && page !== 1) {
          setPage(1);
          return;
        }

        setProducts(response.products);
        setProductCount((current) =>
          current === response.total ? current : response.total,
        );
        setTotalPages(response.totalPages);
        setIsInitialLoad(false);
      } catch (error) {
        if (ignore || controller.signal.aborted) return;

        setLoadError(
          getUserFriendlyErrorMessage(
            error,
            "Unable to load products. Please try again.",
          ),
        );
      } finally {
        if (!ignore && !controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      ignore = true;
      controller.abort();
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
      setArchiveId(null);
      setDeleteId(null);
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const updateCategory = useCallback((value: ProductCategoryFilter) => {
    setArchiveId(null);
    setDeleteId(null);
    setCategory(value);
    setPage(1);
  }, []);

  const updateStatus = useCallback((value: ProductStatusFilter) => {
    setArchiveId(null);
    setDeleteId(null);
    setStatus(value);
    setPage(1);
  }, []);

  const updatePrice = useCallback((value: string) => {
    setArchiveId(null);
    setDeleteId(null);
    setPriceRange(value);
    setPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setArchiveId(null);
    setDeleteId(null);
    setCategory("All");
    setStatus("All");
    setPriceRange("all");
    setSort({ field: null, order: "desc" });
    setSearchQuery("");
    setDebouncedSearch("");
    setPage(1);
    setPageSize(10);
  }, [setSearchQuery]);

  const handleSort = useCallback((field: ProductSortField) => {
    setArchiveId(null);
    setDeleteId(null);
    setSort((current) => ({
      field,
      order:
        current.field === field && current.order === "asc" ? "desc" : "asc",
    }));

    setPage(1);
  }, []);

  const handleDeleteProduct = useCallback(
    async (id: string) => {
      if (isActionPendingRef.current) {
        return;
      }

      isActionPendingRef.current = true;
      setIsActionPending(true);

      try {
        await deleteProductApi(id);
        setDeleteId(null);
        toast.success("Product deleted successfully");
        refresh();
      } catch (error) {
        toast.error(
          getUserFriendlyErrorMessage(error, "Failed to delete product"),
        );
      } finally {
        isActionPendingRef.current = false;
        setIsActionPending(false);
      }
    },
    [refresh],
  );

  const handleArchiveProduct = useCallback(
    async (id: string) => {
      if (isActionPendingRef.current) {
        return;
      }

      isActionPendingRef.current = true;
      setIsActionPending(true);

      try {
        await archiveProductApi(id);
        setArchiveId(null);
        toast.success("Product archived successfully");
        refresh();
      } catch (error) {
        toast.error(
          getUserFriendlyErrorMessage(error, "Failed to archive product"),
        );
      } finally {
        isActionPendingRef.current = false;
        setIsActionPending(false);
      }
    },
    [refresh],
  );

  const openProductForm = useCallback(
    (product: ApiProduct, mode: ProductFormMode) => {
      setProductForm((current) => {
        const isSameProductLoaded =
          current.open &&
          current.productId === product.id &&
          current.product?.id === product.id &&
          !current.loading;

        return {
          mode,
          product: isSameProductLoaded ? current.product : product,
          productId: product.id,
          open: true,
          loading: !isSameProductLoaded,
        };
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

  const openAdd = useCallback(() => {
    setProductForm({
      mode: "add",
      product: null,
      productId: null,
      open: true,
      loading: false,
    });
  }, []);

  const lastAddTriggerRef = useRef(addTrigger);

  useEffect(() => {
    if (addTrigger > 0 && addTrigger !== lastAddTriggerRef.current) {
      lastAddTriggerRef.current = addTrigger;
      openAdd();
    }
  }, [addTrigger, openAdd]);

  useEffect(() => {
    if (!productForm.open || !productForm.productId || !productForm.loading) {
      return;
    }

    let ignore = false;
    const productId = productForm.productId;

    async function loadProduct() {
      try {
        const response = await getProduct(productId);

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
            getUserFriendlyErrorMessage(error, "Failed to load product"),
          );

          setProductForm((current) => ({
            ...current,
            open: false,
            loading: false,
          }));
        }
      }
    }

    void loadProduct();

    return () => {
      ignore = true;
    };
  }, [productForm.open, productForm.productId, productForm.loading]);

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

  const handleProductCreated = useCallback(() => {
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
      <div ref={tableTopRef} className="w-full space-y-4">
        <ProductFilters
          category={category}
          status={status}
          priceRange={priceRange}
          sort={sort}
          searchQuery={searchQuery}
          page={page}
          pageSize={pageSize}
          onCategoryChange={updateCategory}
          onStatusChange={updateStatus}
          onPriceChange={updatePrice}
          onReset={resetFilters}
        />
        <div className="relative">
          {isInitialLoad ? (
            <ProductTableSkeleton />
          ) : (
            <>
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
                  isActionPending={isActionPending}
                  showNoResults={showNoResults}
                  sort={sort}
                  onSort={handleSort}
                  onArchive={setArchiveId}
                  onCancelArchive={() => setArchiveId(null)}
                  onConfirmArchive={handleArchiveProduct}
                  onDelete={setDeleteId}
                  onCancelDelete={() => setDeleteId(null)}
                  onConfirmDelete={handleDeleteProduct}
                  onResetFilters={resetFilters}
                />
              </div>

              {isLoading && <ProductListSkeleton />}
            </>
          )}
        </div>
        <ProductForm
          key={`${productForm.mode}-${productForm.product?.id ?? productForm.productId ?? "new"}`}
          mode={productForm.mode}
          product={productForm.product}
          open={productForm.open}
          loading={productForm.loading}
          onOpenChange={handleProductFormOpenChange}
          onEdit={openEdit}
          onCreated={handleProductCreated}
          onUpdated={handleProductUpdated}
        />
      </div>
      <TablePagination
        page={page}
        pageSize={pageSize}
        productCount={productCount}
        totalPages={totalPages}
        setPage={(value) => {
          setArchiveId(null);
          setDeleteId(null);
          setPage(value);
        }}
        setPageSize={(value) => {
          setArchiveId(null);
          setDeleteId(null);
          setPageSize(value);
        }}
      />
    </>
  );
}
