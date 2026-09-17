import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getCurrentUser,
  login as loginService,
  loginWithPasscode as loginWithPasscodeService,
  logout as logoutService,
} from "@/services/auth-service";
import type {
  AuthProviderProps,
  AuthStatus,
  AuthUser,
  LoginCredentials,
  UserResponse,
} from "@/types/auth";
import { ApiError } from "@/lib/api-error";
import { AuthContext } from "./auth";
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
          const response = await getCurrentUser();
          const rawData = response?.data;
          const apiUser =
            rawData && "user" in rawData && rawData.user
              ? (rawData.user as UserResponse)
              : (rawData as UserResponse | null);

          if (!apiUser?.id || !apiUser?.email) {
            if (!shouldIgnore()) {
              setUser(null);
              setStatus("unauthenticated");
              setSessionError(null);
            }
            return false;
          }

          if (shouldIgnore()) {
            return true;
          }

          const userData: AuthUser = {
            id: apiUser.id,
            email: apiUser.email,
            name: `${apiUser.first_name ?? ""} ${apiUser.last_name ?? ""}`.trim(),
            avatar: apiUser.avatar_url,
          };
          setUser(userData);
          setStatus("authenticated");
          setSessionError(null);
          return true;
        } catch (error) {
          if (shouldIgnore()) {
            return false;
          }

          if (
            error instanceof ApiError &&
            (error.status === 401 ||
              error.status === 403 ||
              error.status === 404)
          ) {
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
          setSessionError(null);
          return false;
        }
      }

      return false;
    },
    [],
  );

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const response = await loginService(credentials);

      if (response?.success === false) {
        const serverMessage =
          typeof response?.message === "string" ? response.message.trim() : "";
        throw new Error(serverMessage || "Invalid email or password.");
      }

      const isAuthenticated = await checkAuth();

      if (!isAuthenticated) {
        throw new Error(
          "Unable to verify your session after sign-in. Please try again.",
        );
      }
    },
    [checkAuth],
  );

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
