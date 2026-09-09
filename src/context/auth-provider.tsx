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
import { ApiError } from "@/types/data-type";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }: AuthProviderProps) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const checkAuth = useCallback(async () => {
    try {
      const response = await getCurrentSession();
      const apiUser = response?.data?.user;

      if (!apiUser?.id || !apiUser?.email) {
        throw new Error("Invalid user data");
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
      if (error instanceof ApiError && error.status === 401) {
        setUser(null);
        setStatus("unauthenticated");
        setSessionError(null);

        return false;
      }

      setSessionError("Unable to check your session. Please retry.");

      return false;
    }
  }, []);

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
      await checkAuth();
    },
    [checkAuth],
  );

  const logout = useCallback(async () => {
    try {
      await logoutService();
    } finally {
      setUser(null);
      setStatus("unauthenticated");
      setSessionError(null);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const initializeAuth = async () => {
      try {
        const response = await getCurrentSession();
        const apiUser = response?.data?.user;

        if (!apiUser?.id || !apiUser?.email) {
          throw new Error("Invalid user data");
        }

        if (cancelled) {
          return;
        }

        const userData: AuthUser = {
          id: apiUser.id,
          email: apiUser.email,
          name: `${apiUser.first_name ?? ""} ${apiUser.last_name ?? ""}`.trim(),
        };

        setUser(userData);
        setStatus("authenticated");
        setSessionError(null);
      } catch (error) {
        if (cancelled) {
          return;
        }

        if (error instanceof ApiError && error.status === 401) {
          setUser(null);
          setStatus("unauthenticated");
          setSessionError(null);
          return;
        }

        setSessionError("Unable to check your session. Please retry.");
      }
    };

    void initializeAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      status,
      isAuthenticated: status === "authenticated",
      user,
      sessionError,
      login,
      loginWithPasscode,
      checkAuth,
      logout,
    }),
    [
      status,
      user,
      sessionError,
      login,
      loginWithPasscode,
      checkAuth,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
