import { apiRequest } from "@/lib/api";
import type { CategoriesResult, GetCategoriesResponse } from "@/types/category";

export async function getCategories(
  params: {
    page?: number;
    pageSize?: number;
    search?: string;
  } = {},
  signal?: AbortSignal,
): Promise<CategoriesResult> {
  const query = new URLSearchParams();
  if (params.page !== undefined) {
    query.set("page", String(params.page));
  }
  if (params.pageSize !== undefined) {
    query.set("page_size", String(params.pageSize));
  }
  if (params.search?.trim()) {
    query.set("search", params.search.trim());
  }

  const queryString = query.toString();
  const endpoint = queryString
    ? `/api/v1/categories?${queryString}`
    : "/api/v1/categories";

  const response = await apiRequest<GetCategoriesResponse>(endpoint, {
    signal,
  });

  return {
    categories: response.data ?? [],
    total: response.pagination?.total ?? 0,
    totalPages: response.pagination?.total_pages ?? 1,
  };
}
