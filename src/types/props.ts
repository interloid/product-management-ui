import type { LucideIcon } from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import type { AuthUser } from "./auth";
import type {
  ApiProduct,
  ImageError,
  PreviewImageItem,
  ProductCategoryFilter,
  ProductSort,
  ProductSortField,
  ProductStatusFilter,
} from "./product";

export type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
};

export type NavMainProps = {
  items: NavItem[];
};

export type ProductImageProps = {
  src?: string;
  alt: string;
  className?: string;
};

export type ImagePreviewDialogProps = {
  images?: PreviewImageItem[];
  image?: PreviewImageItem | null;
  initialIndex?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export type ProductImagePreviewProps = {
  src: string;
  alt: string;
  className?: string;
  images?: PreviewImageItem[];
  initialIndex?: number;
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
  onResetFilters?: () => void;
};

export type ProductFiltersProps = {
  category: ProductCategoryFilter;
  status: ProductStatusFilter;
  priceRange: string;
  sort: ProductSort;
  searchQuery?: string;
  page?: number;
  pageSize?: number;
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
  triggerAddProduct: () => void;
  addTrigger: number;
}

export type HeaderProps = {
  user: AuthUser | null;
  productCount?: number;
};

export type HeaderActionsProps = {
  user: AuthUser | null;
};

export interface ImageErrorBannerProps {
  error: ImageError;
}

export interface ImageOverlayControlsProps {
  isPrimary: boolean;
  onSetPrimary?: () => void;
}

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
  onArchive?: (product: ApiProduct) => void;
  onDelete?: (product: ApiProduct) => void;
};
