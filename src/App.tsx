import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/features/auth/auth-provider";
import { ProtectedRoute } from "@/routes/protected-route";
import { PublicRoute } from "@/routes/public-route";
import LoadingScreen from "@/components/shared/loading-screen";
import { ToasterMessage } from "@/components/shared/toaster";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { NotFoundPage } from "@/pages/not-found-page";
const LoginForm = lazy(() => import("@/pages/auth/login-page"));
const Callback = lazy(() => import("@/pages/auth/callback-page"));
const DashboardLayout = lazy(() => import("@/layouts/dashboard"));
const Orders = lazy(() => import("@/pages/dashboard/orders-page"));
const Products = lazy(
  () => import("@/pages/dashboard/products/products-page"),
);
const Categories = lazy(() => import("@/pages/dashboard/categories-page"));
const Customers = lazy(() => import("@/pages/dashboard/customers-page"));
const Reports = lazy(() => import("@/pages/dashboard/reports-page"));
const Settings = lazy(() => import("@/pages/dashboard/settings-page"));
const PasscodeRequestPage = lazy(
  () => import("@/pages/auth/passcode/request-page"),
);
const PasscodeVerifyPage = lazy(
  () => import("@/pages/auth/passcode/verify-page"),
);

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
                  <Route path="/" element={<Navigate to="/login" replace />} />
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
