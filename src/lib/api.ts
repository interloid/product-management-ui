import { ApiError } from "@/lib/api-error";
import type { ApiRequestOptions, JsonBody } from "@/types/product";

export const API_BASE_URL = import.meta.env.DEV
  ? ""
  : (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/+$/, "");

const API_TIMEOUT = 15_000;

const CREDENTIAL_AUTH_ENDPOINTS = new Set([
  "/api/v1/auth/login",
  "/api/v1/auth/logout",
  "/api/v1/auth/me",
  "/api/v1/auth/refresh",
  "/api/v1/auth/passcode/request",
  "/api/v1/auth/passcode/requests",
  "/api/v1/auth/passcode/verify",
  "/api/v1/auth/passcode/verifications",
]);

let refreshPromise: Promise<boolean> | null = null;

export async function requestTokenRefresh(): Promise<boolean> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.ok;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

type SessionExpiredListener = () => void;

let sessionExpiredListener: SessionExpiredListener | null = null;

export function setSessionExpiredListener(
  listener: SessionExpiredListener | null,
) {
  sessionExpiredListener = listener;
}

function notifySessionExpired(endpoint: string) {
  if (CREDENTIAL_AUTH_ENDPOINTS.has(endpoint)) {
    return;
  }

  sessionExpiredListener?.();
}

if (!API_BASE_URL && import.meta.env.PROD) {
  console.error(
    "VITE_API_BASE_URL is not configured. API calls will use relative paths.",
  );
}

function prepareRequestBody(body?: BodyInit | JsonBody): BodyInit | undefined {
  if (body === undefined) {
    return undefined;
  }

  if (body instanceof FormData) {
    return body;
  }

  if (typeof body === "string") {
    return body;
  }

  return JSON.stringify(body);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function extractDetailMessage(detail: unknown): string | null {
  if (typeof detail === "string" && detail.trim()) {
    return detail.trim();
  }

  if (Array.isArray(detail) && detail.length > 0) {
    const first = detail[0];
    if (isRecord(first)) {
      const field = Array.isArray(first.loc)
        ? first.loc[first.loc.length - 1]
        : undefined;
      const msg = typeof first.msg === "string" ? first.msg : undefined;

      if (field && typeof field === "string" && msg) {
        const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
        if (msg.toLowerCase() === "field required") {
          return `${fieldName} is required.`;
        }
        return `${fieldName}: ${msg}`;
      }

      if (msg) {
        return msg;
      }
    }
  }

  if (
    isRecord(detail) &&
    typeof detail.message === "string" &&
    detail.message.trim()
  ) {
    return detail.message.trim();
  }

  return null;
}

function getDefaultStatusMessage(status: number): string {
  switch (status) {
    case 400:
      return "Some information is missing or incorrect. Please check and try again.";

    case 401:
      return "Please sign in to continue.";

    case 403:
      return "You don't have permission to perform this action.";

    case 404:
      return "The item you're looking for could not be found.";

    case 409:
      return "This action cannot be completed because the information already exists.";

    case 422:
      return "Some information is not valid. Please check and try again.";

    case 429:
      return "Too many attempts. Please wait a moment and try again.";

    case 500:
      return "Something went wrong. Please try again shortly.";

    case 501:
      return "This feature is not currently available.";

    case 502:
      return "We're having trouble connecting right now. Please try again shortly.";

    case 503:
      return "The service is temporarily unavailable. Please try again shortly.";

    case 504:
      return "This is taking longer than expected. Please try again shortly.";

    case 505:
      return "Something went wrong. Please try again.";

    case 506:
      return "Something went wrong. Please try again later.";

    case 507:
      return "We couldn't save the information right now. Please try again later.";

    case 508:
      return "Something went wrong while completing this action. Please try again later.";

    case 510:
      return "We couldn't complete this action. Please try again.";

    case 511:
      return "Please complete the required network sign-in to continue.";

    default:
      if (status >= 500) {
        return "Something went wrong. Please try again shortly.";
      }
      return "Something went wrong. Please try again.";
  }
}

function getApiErrorMessage(data: unknown, status: number): string {
  if (typeof data === "string" && data.trim()) {
    if (data.trim().startsWith("<")) {
      return getDefaultStatusMessage(status);
    }
    return data.trim();
  }

  if (isRecord(data)) {
    if (typeof data.message === "string" && data.message.trim()) {
      return data.message.trim();
    }

    const detailMsg = extractDetailMessage(data.detail);
    if (detailMsg) {
      return detailMsg;
    }

    if (typeof data.error === "string" && data.error.trim()) {
      return data.error.trim();
    }

    if (
      isRecord(data.error) &&
      typeof data.error.message === "string" &&
      data.error.message.trim()
    ) {
      return data.error.message.trim();
    }
  }

  return getDefaultStatusMessage(status);
}

function getApiErrorDetails(data: unknown) {
  if (!isRecord(data)) {
    return {};
  }

  const error = isRecord(data.error) ? data.error : undefined;

  return {
    code:
      error && typeof error.code === "string"
        ? error.code
        : typeof data.code === "string"
          ? data.code
          : undefined,
    details: error?.details ?? data.details ?? data.detail,
    requestId:
      typeof data.request_id === "string" ? data.request_id : undefined,
  };
}

export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const controller = new AbortController();

  let timedOut = false;

  const timeoutId = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, API_TIMEOUT);

  const signal = options.signal
    ? AbortSignal.any([options.signal, controller.signal])
    : controller.signal;

  try {
    const isFormData = options.body instanceof FormData;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      body: prepareRequestBody(options.body),
      credentials: "include",
      signal,
      headers: {
        ...(isFormData
          ? {}
          : {
              "Content-Type": "application/json",
            }),
        ...options.headers,
      },
    });

    if (response.status === 204) {
      return undefined as T;
    }

    const contentType = response.headers.get("content-type") ?? "";
    const rawText = await response.text();

    let data: unknown;
    if (contentType.includes("application/json") && rawText.trim()) {
      try {
        data = JSON.parse(rawText);
      } catch {
        data = rawText;
      }
    } else {
      data = rawText;
    }

    if (!response.ok) {
      const isAuthEndpoint = CREDENTIAL_AUTH_ENDPOINTS.has(endpoint);
      const isRetry = Boolean(options._isRetry);

      if (response.status === 401 && !isAuthEndpoint && !isRetry) {
        const refreshSucceeded = await requestTokenRefresh();

        if (refreshSucceeded) {
          return apiRequest<T>(endpoint, {
            ...options,
            _isRetry: true,
          });
        }

        notifySessionExpired(endpoint);
      } else if (response.status === 401 && !isAuthEndpoint) {
        notifySessionExpired(endpoint);
      }

      throw new ApiError(
        getApiErrorMessage(data, response.status),
        response.status,
        getApiErrorDetails(data),
      );
    }

    return (data ?? undefined) as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      if (!timedOut) {
        throw error;
      }
      throw new Error(
        "The request timed out. Please check your connection and try again.",
        {
          cause: error,
        },
      );
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
