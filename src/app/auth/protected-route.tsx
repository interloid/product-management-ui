import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "@/hooks/use-auth";
import { Spinner } from "@/components/ui/spinner";

export function ProtectedRoute() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return (
      <div className="h-full">
        <div className="text-muted-foreground flex min-h-full items-center justify-center gap-2">
          <Spinner />
          checking for Authentication...
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  return <Outlet />;
}
