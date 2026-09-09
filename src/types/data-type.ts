import type { LucideIcon } from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import type { AuthUser } from "./auth";
import type { Sidebar } from "@/components/ui/sidebar";

type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
};

export type NavMainProps = {
  items: NavItem[];
};

export type ProductCategory =
  | "Lighting"
  | "Apparel"
  | "Home"
  | "Electronics"
  | "Outdoor"
  | "Stationery";

export type ProductCategoryFilter = "All" | ProductCategory;

export type ProductStatus = "active" | "draft" | "out_of_stock" | "archived";

export type ProductStatusFilter = "All" | ProductStatus;

export type ProductSortField =
  | "sku"
  | "name"
  | "category"
  | "price"
  | "stock"
  | "status"
  | "updated";

export type SortOrder = "asc" | "desc";

export type ProductSort = {
  field: ProductSortField | null;
  order: SortOrder;
};

export const categories: Array<{
  value: ProductCategoryFilter;
  label: string;
}> = [
  { value: "All", label: "All" },
  { value: "Lighting", label: "Lighting" },
  { value: "Apparel", label: "Apparel" },
  { value: "Home", label: "Home" },
  { value: "Electronics", label: "Electronics" },
  { value: "Outdoor", label: "Outdoor" },
  { value: "Stationery", label: "Stationery" },
];

export const productCategories = categories.filter(
  (category) => category.value !== "All",
);

export const statuses: Array<{
  value: ProductStatus;
  label: string;
}> = [
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "out_of_stock", label: "Out of Stock" },
  { value: "archived", label: "Archived" },
];

export const statusFilters: Array<{
  value: ProductStatusFilter;
  label: string;
}> = [{ value: "All", label: "All" }, ...statuses];

export type ApiProductImage = {
  id: string;
  url: string;
  is_primary: boolean;
};

export type ApiProduct = {
  id: string;
  name: string;
  sku: string;
  category_name: ProductCategory;
  price: string | number;
  stock: number;
  status: ProductStatus;
  description: string;
  created_at: string;
  updated_at: string;
  images: ApiProductImage[];
};

export type Pagination = {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
};

export type GetProductsResponse = {
  success: boolean;
  message: string;
  data: ApiProduct[];
  pagination: Pagination;
};

export type ProductsResult = {
  products: ApiProduct[];
  total: number;
  totalPages: number;
};

export type GetProductsParams = {
  page: number;
  pageSize: number;
  status?: ProductStatusFilter;
  category?: ProductCategoryFilter;
  search?: string;
  priceRange?: string;
  sort?: ProductSortField;
  order?: SortOrder;
};

export type ProductForm = {
  name: string;
  sku: string;
  category: ProductCategory | "";
  price: string;
  stock: string;
  status: ProductStatus;
  description: string;
};

export type FormError = Partial<Record<keyof ProductForm, string>>;

export interface ProductImage {
  id: string;
  file: File;
  previewUrl: string;
  isPrimary: boolean;
}

export type ProductImageProps = {
  src?: string;
  alt: string;
  className?: string;
};

export type ProductImagePreviewProps = {
  src: string;
  alt: string;
  className?: string;
};

export type ImagePreviewDialogProps = {
  image: {
    src: string;
    alt: string;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export type ImageError = {
  fileName?: string;
  fileSize?: number;
  message: string;
  details?: string;
};

export interface ProductTableRowProps {
  product: ApiProduct;
  isArchiving: boolean;
  isDeleting: boolean;
  isActionPending?: boolean;
  onView: () => void;
  onEdit: () => void;
  onArchive: () => void;
  onCancelArchive: () => void;
  onConfirmArchive: () => void;
  onDelete: () => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
}

export type ProductTableProps = {
  products: ApiProduct[];
  archiveId: string | null;
  deleteId: string | null;
  isActionPending?: boolean;
  showNoResults?: boolean;
  sort: ProductSort;
  onSort: (field: ProductSortField) => void;
  onView: (product: ApiProduct) => void;
  onEdit: (product: ApiProduct) => void;
  onArchive: (id: string) => void;
  onCancelArchive: () => void;
  onConfirmArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onCancelDelete: () => void;
  onConfirmDelete: (id: string) => void;
};

export type ProductFiltersProps = {
  category: ProductCategoryFilter;
  status: ProductStatusFilter;
  priceRange: string;
  sort: ProductSort;
  onCategoryChange: (value: ProductCategoryFilter) => void;
  onStatusChange: (value: ProductStatusFilter) => void;
  onPriceChange: (value: string) => void;
  onReset: () => void;
};

export type SortableTableHeadProps = {
  label: string;
  field: ProductSortField;
  sort: ProductSort;
  onSort: (field: ProductSortField) => void;
  className?: string;
};

export type PaginationProps = {
  page: number;
  pageSize: number;
  productCount: number;
  totalPages: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
};

export interface SearchContextValue {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  refreshKey: number;
  refresh: () => void;
  productCount: number;
  setProductCount: React.Dispatch<React.SetStateAction<number>>;
}

export type HeaderProps = {
  user: AuthUser | null;
  productCount?: number;
};

export type HeaderActionsProps = {
  user: AuthUser | null;
};

export type JsonBody = object;

export type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: BodyInit | JsonBody;
};

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly details?: unknown;
  readonly requestId?: string;

  constructor(
    message: string,
    status: number,
    options?: {
      code?: string;
      details?: unknown;
      requestId?: string;
    },
  ) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.code = options?.code;
    this.details = options?.details;
    this.requestId = options?.requestId;
  }
}

export interface ImageErrorBannerProps {
  error: ImageError;
}

export interface ImageOverlayControlsProps {
  isPrimary: boolean;
  onSetPrimary?: () => void;
}

export type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user: AuthUser | null;
};

export type EmptyPageProps = {
  icon?: ComponentType<{
    className?: string;
  }>;
  title?: string;
  description?: string;
  children?: ReactNode;
};

export interface UnsavedChangesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onKeepEditing: () => void;
  onDiscard: () => void;
}

export interface LogoutDialogProps {
  trigger: React.ReactNode;
}

export type ProductActionConfirmationRowProps = {
  image?: string;
  alt: string;
  title: string;
  description: string;
  confirmLabel: string;
  isPending?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export type ProductFormProps = {
  mode: "add" | "edit" | "view";
  product?: ApiProduct | null;
  open: boolean;
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
  onUpdated?: (product: ApiProduct) => void;
  onEdit?: (product: ApiProduct) => void;
};

export type ProductFormMode = "view" | "edit";

export type ProductFormState = {
  mode: ProductFormMode;
  product: ApiProduct | null;
  productId: string | null;
  open: boolean;
  loading: boolean;
};

export type UseProductFormSheetOptions<T extends ProductForm> = {
  initialForm: T;
  onOpenChange: (open: boolean) => void;
  isDirtyExtra?: boolean;
  onReset?: () => void;
};


export type FormFieldChange = <K extends keyof ProductForm>(
  field: K,
  value: ProductForm[K],
) => void;

export type UseProductImagesProps = {
  maxImages?: number;
  isSubmitting?: boolean;
  existingImages?: ApiProductImage[];
};