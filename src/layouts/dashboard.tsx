import { AppSidebar } from "@/components/shad/app-sidebar";
import Header from "@/components/shad/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { SearchContext } from "@/context/search";
import { useAuth } from "@/hooks/use-auth";
import { AppFooter } from "@/components/shad/app-footer";
import { notifyToast } from "@/lib/toast";

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const hasTriggeredLoginToast = useRef(false);

  useEffect(() => {
    if (hasTriggeredLoginToast.current) return;

    const hasSessionFlag =
      typeof window !== "undefined" &&
      sessionStorage.getItem("login_success") === "true";
    const hasStateFlag = (location.state as { loginSuccess?: boolean } | null)
      ?.loginSuccess;

    if (hasSessionFlag || hasStateFlag) {
      if (!user) return;
      hasTriggeredLoginToast.current = true;
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("login_success");
      }
      const userName = user.name?.trim() || user.email?.split("@")[0] || "User";
      notifyToast("success", `Login successful. Welcome back, ${userName}!`, {
        id: "login-success",
      });
      if (hasStateFlag) {
        navigate(location.pathname + location.search, {
          replace: true,
          state: {},
        });
      }
    }
  }, [location.pathname, location.search, location.state, navigate, user]);

  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [refreshKey, setRefreshKey] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [addTrigger, setAddTrigger] = useState(0);

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

        <SidebarInset className="min-w-0 max-w-full overflow-x-hidden">
          <Header user={user} productCount={productCount} />

          <main className="flex h-full flex-1 flex-col justify-start p-3 sm:p-4 min-w-0 max-w-full overflow-x-hidden">
            <Outlet />
          </main>

          <AppFooter />
        </SidebarInset>
      </SidebarProvider>
    </SearchContext.Provider>
  );
}
