import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/auth-provider";
import { ProtectedRoute } from "@/app/auth/protected-route";
import { PublicRoute } from "@/app/auth/public-route";
import LoadingScreen from "@/components/shad/loading-screen";
import { ToasterMessage } from "@/components/shad/toaster";
import { ErrorBoundary } from "@/components/shad/error-boundary";
import { NotFoundPage } from "@/app/pages/not-found";
import { useAuth } from "@/hooks/use-auth";
const LoginForm = lazy(() => import("@/app/pages/Authentication/login"));
const Callback = lazy(() => import("@/app/pages/Authentication/callback"));
const DashboardLayout = lazy(() => import("@/layouts/dashboard"));
const Orders = lazy(() => import("@/app/pages/dashboard/orders"));
const Products = lazy(
  () => import("@/app/pages/dashboard/products/products"),
);
const Categories = lazy(() => import("@/app/pages/dashboard/categories"));
const Customers = lazy(() => import("@/app/pages/dashboard/customers"));
const Reports = lazy(() => import("@/app/pages/dashboard/reports"));
const Settings = lazy(() => import("@/app/pages/dashboard/settings"));
const PasscodeRequestPage = lazy(
  () => import("@/app/pages/Authentication/passcode/request"),
);
const PasscodeVerifyPage = lazy(
  () => import("@/app/pages/Authentication/passcode/verify"),
);

function RootRedirect() {
  const { status } = useAuth();

  if (status === "loading") {
    return <LoadingScreen />;
  }

  return (
    <Navigate
      to={status === "authenticated" ? "/products" : "/login"}
      replace
    />
  );
}

export default function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <ErrorBoundary>
              <Suspense fallback={<LoadingScreen />}>
                <Routes>
                  <Route element={<PublicRoute />}>
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/passcode" element={<PasscodeRequestPage />} />
                    <Route
                      path="/passcode/verify"
                      element={<PasscodeVerifyPage />}
                    />
                  </Route>
                  <Route path="/callback" element={<Callback />} />
                  <Route element={<ProtectedRoute />}>
                    <Route element={<DashboardLayout />}>
                      <Route path="/products" element={<Products />} />
                      <Route path="/categories" element={<Categories />} />
                      <Route path="/orders" element={<Orders />} />
                      <Route path="/customers" element={<Customers />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/settings" element={<Settings />} />
                    </Route>
                  </Route>
                  <Route path="/" element={<RootRedirect />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
      <ToasterMessage />
    </>
  );
}
