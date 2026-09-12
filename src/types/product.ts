export type ProductCategory =
  "Lighting" | "Apparel" | "Home" | "Electronics" | "Outdoor" | "Stationery";

export type ProductCategoryFilter = "All" | ProductCategory;

export type ProductStatus = "active" | "draft" | "out_of_stock" | "archived";

export type ProductStatusFilter = "All" | ProductStatus;

export type ProductSortField =
  "sku" | "name" | "category" | "price" | "stock" | "status" | "updated";

export type SortOrder = "asc" | "desc";

export type ProductSort = {
  field: ProductSortField | null;
  order: SortOrder;
};

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

export type PreviewImageItem = {
  src: string;
  alt?: string;
};

export type ImageError = {
  fileName?: string;
  fileSize?: number;
  message: string;
  details?: string;
};

export type JsonBody = object;

export type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: BodyInit | JsonBody;
};

export type ProductFormMode = "add" | "view" | "edit";

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
