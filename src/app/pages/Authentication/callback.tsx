import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function Callback() {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  const [error, setError] = useState("");
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const authenticate = async () => {
      try {
        const isAuthenticated = await checkAuth();
        if (!isMounted) {
          return;
        }

        if (isAuthenticated) {
          navigate("/products", {
            replace: true,
          });
          return;
        }

        setError("We couldn't complete your sign-in.");
      } catch {
        if (!isMounted) {
          return;
        }

        setError("We couldn't complete your sign-in.");
      }
    };

    void authenticate();

    return () => {
      isMounted = false;
    };
  }, [checkAuth, navigate]);

  const handleRetry = async () => {
    setIsRetrying(true);
    setError("");

    try {
      const isAuthenticated = await checkAuth();

      if (isAuthenticated) {
        navigate("/products", { replace: true });
        return;
      }

      setError("We couldn't complete your sign-in.");
    } catch {
      setError("We couldn't complete your sign-in.");
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className="flex min-h-full w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-lg">
        <Empty className="w-full">
          <EmptyHeader>
            <EmptyMedia variant="default">
              {!error && <Spinner className="size-8 text-primary" />}
            </EmptyMedia>

            <EmptyTitle>
              {error ? "Sign-in failed" : "Finishing sign-in…"}
            </EmptyTitle>

            <EmptyDescription>
              {error
                ? "We couldn't complete your sign-in."
                : "Please wait while we finish setting up your session."}
            </EmptyDescription>
          </EmptyHeader>

          {error && (
            <div className="flex w-full flex-col items-center gap-3">
              <Alert variant="destructive">
                <AlertTitle className="font-bold">
                  Authentication error
                </AlertTitle>

                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isRetrying}
                  onClick={handleRetry}
                >
                  {isRetrying ? (
                    <>
                      <Spinner className="size-4" />
                      Retrying...
                    </>
                  ) : (
                    "Try again"
                  )}
                </Button>

                <Button type="button" asChild>
                  <Link to="/login">Back to login</Link>
                </Button>
              </div>
            </div>
          )}
        </Empty>
      </div>
    </div>
  );
}
