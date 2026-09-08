import { AppSidebar } from "@/pages/dashboard/components/app-sidebar";
import Header from "@/pages/dashboard/components/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useCallback, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import { SearchContext } from "@/features/search/search-context";
import { useAuth } from "@/features/auth/use-auth";
import { AppFooter } from "@/components/shared/app-footer";

export default function DashboardLayout() {
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [productCount, setProductCount] = useState(0);

  const { user } = useAuth();

  const refresh = useCallback(() => {
    setRefreshKey((current) => current + 1);
  }, []);

  const value = useMemo(
    () => ({
      searchQuery,
      setSearchQuery,
      refreshKey,
      refresh,
      productCount,
      setProductCount,
    }),
    [searchQuery, refreshKey, refresh, productCount],
  );

  return (
    <SearchContext.Provider value={value}>
      <SidebarProvider>
        <AppSidebar user={user} />
        <SidebarInset>
          <Header user={user} productCount={productCount} />
          <main className="flex flex-1 flex-col justify-between p-3 sm:p-4 h-full">
            <Outlet />
          </main>
          <AppFooter />
        </SidebarInset>
      </SidebarProvider>
    </SearchContext.Provider>
  );
}
