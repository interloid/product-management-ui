import { AppSidebar } from "@/components/shad/app-sidebar";
import Header from "@/components/shad/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useCallback, useMemo, useState } from "react";
import { Outlet, useSearchParams } from "react-router-dom";
import { SearchContext } from "@/context/search-context";
import { useAuth } from "@/hooks/use-auth";
import { AppFooter } from "@/components/shad/app-footer";

export default function DashboardLayout() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [refreshKey, setRefreshKey] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [addTrigger, setAddTrigger] = useState(0);

  const { user } = useAuth();

  const setSearchQuery = useCallback(
    (action: React.SetStateAction<string>) => {
      setSearchParams(
        (prevParams) => {
          const prevQuery = prevParams.get("search") || "";
          const nextQuery =
            typeof action === "function" ? action(prevQuery) : action;
          const nextParams = new URLSearchParams(prevParams);

          if (nextQuery.trim()) {
            nextParams.set("search", nextQuery);
          } else {
            nextParams.delete("search");
          }

          return nextParams;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const refresh = useCallback(() => {
    setRefreshKey((current) => current + 1);
  }, []);

  const triggerAddProduct = useCallback(() => {
    setAddTrigger((current) => current + 1);
  }, []);

  const value = useMemo(
    () => ({
      searchQuery,
      setSearchQuery,
      refreshKey,
      refresh,
      productCount,
      setProductCount,
      triggerAddProduct,
      addTrigger,
    }),
    [
      searchQuery,
      setSearchQuery,
      refreshKey,
      refresh,
      productCount,
      triggerAddProduct,
      addTrigger,
    ],
  );

  return (
    <SearchContext.Provider value={value}>
      <SidebarProvider>
        <AppSidebar user={user} />

        <SidebarInset>
          <Header user={user} productCount={productCount} />

          <main className="flex h-full flex-1 flex-col justify-between p-3 sm:p-4">
            <Outlet />
          </main>

          <AppFooter />
        </SidebarInset>
      </SidebarProvider>
    </SearchContext.Provider>
  );
}