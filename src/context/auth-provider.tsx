import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getCurrentSession,
  login as loginService,
  loginWithPasscode as loginWithPasscodeService,
  logout as logoutService,
} from "@/services/auth-service";
import type {
  AuthProviderProps,
  AuthStatus,
  AuthUser,
  LoginCredentials,
} from "@/types/auth";
import { ApiError } from "@/lib/api-error";
import { AuthContext } from "./auth-context";
import { setSessionExpiredListener } from "@/lib/api";

export function AuthProvider({ children }: AuthProviderProps) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [sessionError, setSessionError] = useState<string | null>(null);

  const clearSession = useCallback(() => {
    setUser(null);
    setStatus("unauthenticated");
    setSessionError(null);
  }, []);

  const checkAuth = useCallback(
    async (options?: { ignore?: () => boolean; retries?: number }) => {
      const shouldIgnore = () => options?.ignore?.() ?? false;
      const maxRetries = options?.retries ?? 2;

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          const response = await getCurrentSession();
          const apiUser = response?.data?.user;

          if (!apiUser?.id || !apiUser?.email) {
            throw new Error("Invalid user data");
          }

          if (shouldIgnore()) {
            return true;
          }

          const userData: AuthUser = {
            id: apiUser.id,
            email: apiUser.email,
            name: `${apiUser.first_name ?? ""} ${apiUser.last_name ?? ""}`.trim(),
          };
          setUser(userData);
          setStatus("authenticated");
          setSessionError(null);
          return true;
        } catch (error) {
          if (shouldIgnore()) {
            return false;
          }

          if (error instanceof ApiError && error.status === 401) {
            setUser(null);
            setStatus("unauthenticated");
            setSessionError(null);
            return false;
          }

          if (attempt < maxRetries) {
            await new Promise((resolve) =>
              setTimeout(resolve, 800 * (attempt + 1)),
            );
            continue;
          }

          setUser(null);
          setStatus("unauthenticated");
          setSessionError(
            "We couldn't reach the server. Please check your connection and try again.",
          );
          return false;
        }
      }

      return false;
    },
    [],
  );

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await loginService(credentials);
    const apiUser = response?.data?.user;

    if (!apiUser?.id || !apiUser?.email) {
      throw new Error("Invalid user data returned from login");
    }

    const userData: AuthUser = {
      id: apiUser.id,
      email: apiUser.email,
      name: `${apiUser.first_name ?? ""} ${apiUser.last_name ?? ""}`.trim(),
    };

    setUser(userData);
    setStatus("authenticated");
    setSessionError(null);
  }, []);

  const loginWithPasscode = useCallback(
    async (email: string, passcode: string) => {
      await loginWithPasscodeService(email, passcode);

      const isAuthenticated = await checkAuth();

      if (!isAuthenticated) {
        throw new Error(
          "Passcode accepted, but we couldn't verify your session. Please try again.",
        );
      }
    },
    [checkAuth],
  );

  const logout = useCallback(async () => {
    try {
      await logoutService();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearSession();
        return;
      }

      throw error;
    }

    clearSession();
  }, [clearSession]);

  useEffect(() => {
    setSessionExpiredListener(clearSession);

    return () => {
      setSessionExpiredListener(null);
    };
  }, [clearSession]);

  useEffect(() => {
    let cancelled = false;

    async function initializeAuth() {
      await checkAuth({
        ignore: () => cancelled,
      });
    }

    void initializeAuth();

    return () => {
      cancelled = true;
    };
  }, [checkAuth]);

  const value = useMemo(
    () => ({
      status,
      user,
      sessionError,
      login,
      loginWithPasscode,
      checkAuth,
      logout,
    }),
    [status, user, sessionError, login, loginWithPasscode, checkAuth, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
