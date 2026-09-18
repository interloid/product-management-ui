import { useCallback, useEffect, useState } from "react";
import { getCategories } from "@/services/category-service";
import { productCategories as defaultProductCategories } from "@/lib/product-options";
import type { ApiCategory } from "@/types/category";

let cachedCategories: ApiCategory[] | null = null;

export function useCategories() {
  const [categories, setCategories] = useState<ApiCategory[]>(() => cachedCategories ?? []);
  const [isLoading, setIsLoading] = useState<boolean>(() => cachedCategories === null);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getCategories({ page: 1, pageSize: 100 });
      cachedCategories = res.categories;
      setCategories(res.categories);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function load() {
      if (cachedCategories !== null) {
        return;
      }
      try {
        const res = await getCategories({ page: 1, pageSize: 100 });
        if (ignore) return;
        cachedCategories = res.categories;
        setCategories(res.categories);
      } catch (err) {
        if (ignore) return;
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      ignore = true;
    };
  }, []);

  const formCategoryOptions = categories.length > 0
    ? categories.map((c) => ({ value: c.name, label: c.name }))
    : defaultProductCategories;

  const filterCategoryOptions = [
    { value: "All", label: "All" },
    ...formCategoryOptions.filter((c) => c.value !== "All"),
  ];

  return {
    categories,
    filterCategoryOptions,
    formCategoryOptions,
    isLoading,
    error,
    refetch,
  };
}
