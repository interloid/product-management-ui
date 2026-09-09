import {
  ApiError,
  type ApiRequestOptions,
  type JsonBody,
} from "@/types/data-type";

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? ""
).replace(/\/+$/, "");

const API_TIMEOUT = 15_000;

const CREDENTIAL_AUTH_ENDPOINTS = new Set([
  "/api/v1/auth/login",
  "/api/v1/auth/session",
  "/api/v1/auth/passcode/request",
  "/api/v1/auth/passcode/verify",
]);

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

function getApiErrorMessage(data: unknown, status: number): string {
  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (
    isRecord(data) &&
    typeof data.message === "string" &&
    data.message.trim()
  ) {
    return data.message;
  }

  return `Request failed with status ${status}`;
}

function getApiErrorDetails(data: unknown) {
  if (!isRecord(data)) {
    return {};
  }

  const error = isRecord(data.error) ? data.error : undefined;

  return {
    code: error && typeof error.code === "string" ? error.code : undefined,
    details: error?.details,
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
      if (response.status === 401) {
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
