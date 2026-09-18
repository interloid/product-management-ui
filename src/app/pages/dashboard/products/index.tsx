import { useEffect, useState, useCallback, useRef } from "react";
import { notifyToast } from "@/lib/toast";
import {
  ProductTable,
  ProductTableSkeleton,
} from "@/app/pages/dashboard/products/crud-operations/product-components/product-table";
import { ProductForm } from "@/app/pages/dashboard/products/crud-operations/product-form";
import { ProductActionConfirmDialog } from "@/app/pages/dashboard/products/crud-operations/product-components/product-action-confirm-dialog";
import { getPrimaryImage } from "@/app/pages/dashboard/products/crud-operations/product-utils/helpers";
import { useDebounce } from "@/hooks/use-debounce";
import { useSearch } from "@/hooks/use-search";
import { useCategories } from "@/hooks/use-categories";
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
import type { TableDensity } from "@/types/props";
import { Button } from "@/components/ui/button";
import { ProductFilters } from "@/app/pages/dashboard/products/crud-operations/product-components/product-filters";
import { ProductFiltersSkeleton } from "@/app/pages/dashboard/products/crud-operations/product-components/product-filters-skeleton";
import { ProductSearchInput } from "@/components/shad/product-search-input";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Plus, TriangleAlert } from "lucide-react";
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
  const { filterCategoryOptions, formCategoryOptions } = useCategories({
    autoFetch: false,
  });
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [category, setCategory] = useState<ProductCategoryFilter>("All");
  const [status, setStatus] = useState<ProductStatusFilter>("All");
  const [priceRange, setPriceRange] = useState("all");
  const [density, setDensity] = useState<TableDensity>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("product-table-density");
      if (saved === "compact" || saved === "comfortable") {
        return saved;
      }
    }
    return "comfortable";
  });

  const toggleDensity = useCallback(() => {
    setDensity((prev) => {
      const next = prev === "comfortable" ? "compact" : "comfortable";
      if (typeof window !== "undefined") {
        localStorage.setItem("product-table-density", next);
      }
      return next;
    });
  }, []);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [archiveId, setArchiveId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<{
    product: ApiProduct;
    kind: "archive" | "delete";
  } | null>(null);
  const [isActionPending, setIsActionPending] = useState(false);
  const isActionPendingRef = useRef(false);
  const debouncedSearch = useDebounce(searchQuery, 400);
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

  const [prevSearch, setPrevSearch] = useState(debouncedSearch);
  if (debouncedSearch !== prevSearch) {
    setPrevSearch(debouncedSearch);
    setArchiveId(null);
    setDeleteId(null);
    setPage(1);
  }

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

  const openConfirm = useCallback(
    (product: ApiProduct, kind: "archive" | "delete") => {
      setConfirmTarget({ product, kind });
    },
    [],
  );

  const handleArchiveClick = useCallback(
    (id: string) => {
      if (typeof window !== "undefined" && window.innerWidth < 768) {
        const targetProduct = products.find((p) => p.id === id);
        if (targetProduct) {
          openConfirm(targetProduct, "archive");
          return;
        }
      }
      setArchiveId(id);
    },
    [products, openConfirm],
  );

  const handleDeleteClick = useCallback(
    (id: string) => {
      if (typeof window !== "undefined" && window.innerWidth < 768) {
        const targetProduct = products.find((p) => p.id === id);
        if (targetProduct) {
          openConfirm(targetProduct, "delete");
          return;
        }
      }
      setDeleteId(id);
    },
    [products, openConfirm],
  );

  const handleDeleteProduct = useCallback(
    async (id: string) => {
      if (isActionPendingRef.current) {
        return;
      }

      isActionPendingRef.current = true;
      setIsActionPending(true);

      try {
        await deleteProductApi(id);
        setArchiveId(null);
        setDeleteId(null);
        setConfirmTarget(null);
        setProductForm({
          mode: "view",
          product: null,
          productId: null,
          open: false,
          loading: false,
        });
        notifyToast("success", "Product deleted successfully", {
          id: "delete-success",
        });
        refresh();
      } catch (error) {
        notifyToast(
          "error",
          getUserFriendlyErrorMessage(
            error,
            "Unable to delete product. Please try again.",
          ),
          { id: "delete-error" },
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
        setDeleteId(null);
        setConfirmTarget(null);
        setProductForm({
          mode: "view",
          product: null,
          productId: null,
          open: false,
          loading: false,
        });
        notifyToast("success", "Product archived successfully", {
          id: "archive-success",
        });
        refresh();
      } catch (error) {
        notifyToast(
          "error",
          getUserFriendlyErrorMessage(
            error,
            "Unable to archive product. Please try again.",
          ),
          { id: "archive-error" },
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
          notifyToast(
            "error",
            getUserFriendlyErrorMessage(
              error,
              "Unable to load product details. Please try again.",
            ),
            { id: "load-product-error" },
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
        <Empty className="max-w-md">
          <EmptyHeader>
            <EmptyMedia
              variant="icon"
              className="bg-destructive/10 text-destructive [&_svg:not([class*='size-'])]:size-6"
            >
              <TriangleAlert className="size-6" />
            </EmptyMedia>
            <EmptyTitle>Something went wrong</EmptyTitle>
            <EmptyDescription>{loadError}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button type="button" variant="outline" onClick={refresh}>
              Try again
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  return (
    <>
      <div ref={tableTopRef} className="w-full min-w-0 max-w-full space-y-4">
        {isInitialLoad ? (
          <ProductFiltersSkeleton />
        ) : (
          <ProductFilters
            category={category}
            status={status}
            priceRange={priceRange}
            sort={sort}
            searchQuery={searchQuery}
            page={page}
            pageSize={pageSize}
            density={density}
            onToggleDensity={toggleDensity}
            onCategoryChange={updateCategory}
            onStatusChange={updateStatus}
            onPriceChange={updatePrice}
            onReset={resetFilters}
            categoryOptions={filterCategoryOptions}
            searchSlot={
              <ProductSearchInput className="flex-1 min-[1100px]:w-175 min-[1100px]:flex-none min-[1382px]:w-64" />
            }
            actionsSlot={
              <Button
                type="button"
                className="h-9 shrink-0 cursor-pointer whitespace-nowrap px-3 sm:px-4 gap-1.5"
                onClick={openAdd}
              >
                <Plus className="size-4 shrink-0" />
                <span>Add Product</span>
              </Button>
            }
          />
        )}
        <div className="relative min-w-0 max-w-full">
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
                  density={density}
                  onView={openView}
                  onEdit={openEdit}
                  archiveId={archiveId}
                  deleteId={deleteId}
                  isActionPending={isActionPending}
                  showNoResults={showNoResults}
                  sort={sort}
                  onSort={handleSort}
                  onArchive={handleArchiveClick}
                  onCancelArchive={() => setArchiveId(null)}
                  onConfirmArchive={handleArchiveProduct}
                  onDelete={handleDeleteClick}
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
          categoryOptions={formCategoryOptions}
          onOpenChange={handleProductFormOpenChange}
          onEdit={openEdit}
          onArchive={(product) => {
            openConfirm(product, "archive");
          }}
          onDelete={(product) => {
            openConfirm(product, "delete");
          }}
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
      <ProductActionConfirmDialog
        open={confirmTarget !== null}
        image={
          confirmTarget
            ? getPrimaryImage(confirmTarget.product)?.url
            : undefined
        }
        alt={confirmTarget?.product.name ?? "Product"}
        title={
          confirmTarget?.kind === "archive"
            ? `Archive "${confirmTarget.product.name}"?`
            : `Delete "${confirmTarget?.product.name}"?`
        }
        description={
          confirmTarget?.kind === "archive"
            ? "It disappears from the active list."
            : "This permanently removes the product."
        }
        confirmLabel={
          confirmTarget?.kind === "archive" ? "Yes, Archive" : "Yes, Delete"
        }
        confirmTone={confirmTarget?.kind === "archive" ? "archive" : "delete"}
        isPending={isActionPending}
        onCancel={() => setConfirmTarget(null)}
        onConfirm={() => {
          if (!confirmTarget) {
            return;
          }

          if (confirmTarget.kind === "archive") {
            void handleArchiveProduct(confirmTarget.product.id);
          } else {
            void handleDeleteProduct(confirmTarget.product.id);
          }
        }}
      />
    </>
  );
}
