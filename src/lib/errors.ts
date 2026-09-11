import type { PasscodeErrorDetails } from "@/types/auth";
import { ApiError } from "@/lib/api-error";

export type ErrorMessageOptions = {
  context?: "login" | "default";
  fallback?: string;
};

export function getUserFriendlyErrorMessage(
  error: unknown,
  fallbackOrOptions?: string | ErrorMessageOptions,
  options?: ErrorMessageOptions,
): string {
  const fallback =
    typeof fallbackOrOptions === "string"
      ? fallbackOrOptions
      : (fallbackOrOptions?.fallback ??
        "Something went wrong. Please try again.");

  const opts =
    typeof fallbackOrOptions === "object" && fallbackOrOptions !== null
      ? fallbackOrOptions
      : options;

  const isLogin = opts?.context === "login";

  if (error instanceof TypeError && error.message === "Failed to fetch") {
    return "Unable to connect to the server. Please check your connection and try again.";
  }

  if (error instanceof ApiError) {
    if (
      error.code === "INVALID_CREDENTIALS" ||
      (isLogin && error.status === 401)
    ) {
      return "Invalid username or password.";
    }

    if (error.status === 401) {
      return "Your session has expired. Please sign in again.";
    }

    if (error.status === 403) {
      return "You don't have permission to perform this action.";
    }

    if (error.status === 404) {
      if (isLogin) {
        return "Account not found.";
      }
      return "The requested product could not be found.";
    }

    if (error.code === "NETWORK_ERROR") {
      return "Unable to connect to the server. Please try again.";
    }

    if (error.code === "SERVER_ERROR") {
      return "Something went wrong on the server. Please try again later.";
    }

    const message = error.message.trim();
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("network")) {
      return "Unable to connect to the server. Please try again.";
    }
    if (lowerMessage.includes("timeout")) {
      return "The request took too long. Please try again.";
    }

    if (lowerMessage.includes("sku")) {
      return "This SKU already exists. Please use a different SKU.";
    }

    if (error.status === 422) {
      return (
        message ||
        "Some of the information you entered is invalid. Please check the form."
      );
    }

    if (error.status >= 500) {
      return "Something went wrong on the server. Please try again later.";
    }

    if (message && !message.startsWith("Request failed with status")) {
      return message;
    }

    return fallback;
  }

  if (error instanceof Error) {
    const message = error.message.trim();
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("network")) {
      return "Unable to connect to the server. Please try again.";
    }
    if (lowerMessage.includes("timeout")) {
      return "The request took too long. Please try again.";
    }
    if (message) {
      return message;
    }
  }

  if (typeof error === "string" && error.trim()) {
    return error.trim();
  }

  return fallback;
}

function isPasscodeDetails(value: unknown): value is PasscodeErrorDetails {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  return (
    (!("attempts_used" in value) || typeof value.attempts_used === "number") &&
    (!("max_attempts" in value) || typeof value.max_attempts === "number") &&
    (!("remaining_attempts" in value) ||
      typeof value.remaining_attempts === "number") &&
    (!("retry_after_seconds" in value) ||
      typeof value.retry_after_seconds === "number")
  );
}

export function getPasscodeErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) {
    return error instanceof Error ? error.message : "Invalid passcode.";
  }
  const details = error.details;

  if (!isPasscodeDetails(details)) {
    return error.message || "Invalid passcode.";
  }

  const remainingAttempts = details.remaining_attempts;
  const retryAfterSeconds = details.retry_after_seconds ?? 0;

  if (remainingAttempts === 0 && retryAfterSeconds > 0) {
    const minutes = Math.ceil(retryAfterSeconds / 60);

    return `Too many failed attempts. Try again after ${minutes} minute${
      minutes === 1 ? "" : "s"
    }.`;
  }

  if (remainingAttempts !== undefined) {
    return `Invalid passcode. ${remainingAttempts} attempt${
      remainingAttempts === 1 ? "" : "s"
    } remaining.`;
  }

  return error.message || "Invalid passcode.";
}
