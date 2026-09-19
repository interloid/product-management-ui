export interface ApiCategory {
  id: string;
  name: string;
}

export interface GetCategoriesResponse {
  success: boolean;
  message: string;
  data: ApiCategory[] | null;
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}

export interface CategoriesResult {
  categories: ApiCategory[];
  total: number;
  totalPages: number;
}
