import { API_BASE_URL, apiRequest, requestTokenRefresh } from "@/lib/api";

import type {
  CurrentUserResponse,
  LoginCredentials,
  LoginResponse,
  OAuthProvider,
  PasscodeRequestResponse,
  PasscodeVerifyResponse,
} from "@/types/auth";

export function login(credentials: LoginCredentials): Promise<LoginResponse> {
  return apiRequest<LoginResponse>("/api/v1/auth/login", {
    method: "POST",
    body: credentials,
  });
}

export function loginWithProvider(provider: OAuthProvider): void {
  window.location.assign(`${API_BASE_URL}/api/v1/auth/${provider}`);
}

export function getCurrentUser(): Promise<CurrentUserResponse> {
  return apiRequest<CurrentUserResponse>("/api/v1/auth/me");
}

export function refreshToken(): Promise<boolean> {
  return requestTokenRefresh();
}

export async function logout(): Promise<void> {
  await apiRequest("/api/v1/auth/logout", {
    method: "POST",
  });
}

export function requestPasscode(
  email: string,
): Promise<PasscodeRequestResponse> {
  return apiRequest<PasscodeRequestResponse>("/api/v1/auth/passcode/requests", {
    method: "POST",
    body: { email },
  });
}

export function verifyPasscode(
  email: string,
  passcode: string,
): Promise<PasscodeVerifyResponse> {
  return apiRequest<PasscodeVerifyResponse>(
    "/api/v1/auth/passcode/verifications",
    {
      method: "POST",
      body: {
        email,
        passcode,
      },
    },
  );
}

export function loginWithPasscode(
  email: string,
  passcode: string,
): Promise<PasscodeVerifyResponse> {
  return verifyPasscode(email, passcode);
}
