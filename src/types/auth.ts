import type { ReactNode } from "react";

export interface LoginCredentials {
  email: string;
  password: string;
  remember_me: boolean;
}

export interface UserResponse {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  role?: string;
}

export interface CurrentUserResponse {
  success: boolean;
  message: string;
  data: UserResponse | null;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: null | {
    user?: UserResponse;
  };
}

export interface PasscodeRequestResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export interface PasscodeVerifyResponse {
  success: boolean;
  message: string;
  data?: null | {
    access_token?: string;
    expires_in?: number;
    token_type?: string;
    user?: UserResponse;
  };
}

export interface PasscodeErrorDetails {
  attempts_used?: number;
  max_attempts?: number;
  remaining_attempts?: number;
  retry_after_seconds?: number;
}

export type OAuthProvider = "google" | "github" | "microsoft";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
};

export interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  sessionError: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  loginWithPasscode: (email: string, passcode: string) => Promise<void>;
  checkAuth: () => Promise<boolean>;
  logout: () => Promise<void>;
}

export interface AuthProviderProps {
  children: ReactNode;
}

export interface PasscodeLocationState {
  email?: string;
}
