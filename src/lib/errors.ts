import type { PasscodeErrorDetails } from "@/types/auth";
import { ApiError } from "@/lib/api-error";

export type ErrorMessageOptions = {
  context?: "login" | "default";
  fallback?: string;
};

export function isTechnicalMessage(msg: string): boolean {
  if (!msg || typeof msg !== "string") return true;
  const trimmed = msg.trim();
  if (!trimmed) return true;
  if (
    /<[a-z][\s\S]*>/i.test(trimmed) ||
    trimmed.startsWith("<!DOCTYPE") ||
    trimmed.startsWith("<html")
  ) {
    return true;
  }

  if (
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
    trimmed.includes('"loc":')
  ) {
    return true;
  }

  if (
    /traceback \(most recent call last\)/i.test(trimmed) ||
    /\b(file ".*", line \d+)/i.test(trimmed) ||
    /\bat [a-zA-Z0-9_$.]+ \([^)]+:\d+:\d+\)/.test(trimmed)
  ) {
    return true;
  }

  if (
    /request failed/i.test(trimmed) ||
    /failed with status/i.test(trimmed) ||
    /status code/i.test(trimmed) ||
    /\bhttp\s*\d{3}\b/i.test(trimmed) ||
    (/\b(400|401|403|404|405|409|413|422|429|500|502|503|504)\b/.test(
      trimmed,
    ) &&
      /\b(status|code|error|exception|bad request|unauthorized|forbidden|not found|conflict|unprocessable|internal server|gateway)\b/i.test(
        trimmed,
      ))
  ) {
    return true;
  }

  if (
    /internal server error/i.test(trimmed) ||
    /bad gateway/i.test(trimmed) ||
    /gateway timeout/i.test(trimmed) ||
    /service unavailable/i.test(trimmed) ||
    /unprocessable entity/i.test(trimmed)
  ) {
    return true;
  }

  if (
    /\b(typeerror|syntaxerror|referenceerror|rangeerror|evalerror|urierror)\b/i.test(
      trimmed,
    ) ||
    /uncaught/i.test(trimmed) ||
    /cannot read property/i.test(trimmed) ||
    /is not a function/i.test(trimmed) ||
    /is not defined/i.test(trimmed) ||
    /unexpected token/i.test(trimmed) ||
    /is not valid json/i.test(trimmed) ||
    /json\.parse/i.test(trimmed)
  ) {
    return true;
  }

  if (
    /failed to fetch/i.test(trimmed) ||
    /networkerror/i.test(trimmed) ||
    /load failed/i.test(trimmed) ||
    /net::err_/i.test(trimmed) ||
    /econnrefused/i.test(trimmed) ||
    /enotfound/i.test(trimmed)
  ) {
    return true;
  }

  if (
    /\b(pydantic|value_error|string_too_|number_type|missing_key)\b/i.test(
      trimmed,
    ) ||
    /input should be a valid/i.test(trimmed) ||
    /unable to parse/i.test(trimmed)
  ) {
    return true;
  }

  return false;
}

export function cleanUserMessage(msg: string): string {
  const trimmed = msg.trim();
  if (!trimmed) return "";
  const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  if (!/[.!?]$/.test(capitalized)) {
    return `${capitalized}.`;
  }
  return capitalized;
}

export function getUserFriendlyErrorMessage(
  error: unknown,
  fallbackOrOptions?: string | ErrorMessageOptions,
  options?: ErrorMessageOptions,
): string {
  const fallback =
    typeof fallbackOrOptions === "string"
      ? fallbackOrOptions
      : (fallbackOrOptions?.fallback ??
        options?.fallback ??
        "Something went wrong. Please try again.");

  const opts =
    typeof fallbackOrOptions === "object" && fallbackOrOptions !== null
      ? fallbackOrOptions
      : options;

  const isLogin = opts?.context === "login";

  const isNetworkFailure =
    (error instanceof TypeError &&
      /failed to fetch|network|load failed/i.test(error.message)) ||
    (error instanceof Error &&
      /networkerror|load failed|econnrefused|enotfound|net::err/i.test(
        error.message,
      ));

  if (isNetworkFailure) {
    return "Unable to connect to the server. Please check your internet connection and try again.";
  }

  const isTimeout =
    (error instanceof Error &&
      (error.name === "AbortError" ||
        /timeout|timed out/i.test(error.message))) ||
    (error instanceof ApiError && error.code === "TIMEOUT");

  if (isTimeout) {
    return "The request took too long to complete. Please check your connection and try again.";
  }

  if (error instanceof ApiError) {
    if (isLogin) {
      if (
        error.status === 401 ||
        error.status === 400 ||
        error.status === 404 ||
        error.status === 422 ||
        error.code === "INVALID_CREDENTIALS" ||
        error.code === "VALIDATION_ERROR"
      ) {
        return "Invalid email or password. Please try again.";
      }

      if (error.status === 403) {
        return "Your account doesn't have access to this workspace. Please contact your administrator.";
      }

      if (error.status === 429) {
        return "Too many sign-in attempts. Please wait a few minutes before trying again.";
      }

      if (error.status >= 500) {
        return "Our servers are experiencing a temporary issue. Please try again shortly.";
      }
    }

    if (error.status === 401) {
      return "Your session has expired. Please sign in again.";
    }

    if (error.status === 403) {
      return "You don't have permission to perform this action.";
    }

    if (error.status === 404) {
      return "The requested item could not be found.";
    }

    if (error.status === 409) {
      const msg = error.message.toLowerCase();
      if (msg.includes("sku")) {
        return "A product with this SKU already exists. Please use a different SKU.";
      }
      return "A record with this information already exists.";
    }

    if (error.status === 429) {
      return "Too many requests. Please wait a moment and try again.";
    }

    if (error.status >= 500) {
      return "Our servers are experiencing a temporary issue. Please try again shortly.";
    }

    if (error.code === "NETWORK_ERROR") {
      return "Unable to connect to the server. Please check your connection and try again.";
    }

    if (error.code === "SERVER_ERROR") {
      return "Our servers are experiencing a temporary issue. Please try again shortly.";
    }

    const message = error.message.trim();
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("sku")) {
      if (
        lowerMessage.includes("exist") ||
        lowerMessage.includes("taken") ||
        lowerMessage.includes("already") ||
        lowerMessage.includes("duplicate")
      ) {
        return "A product with this SKU already exists. Please use a different SKU.";
      }
      return "Please enter a valid SKU.";
    }

    if (lowerMessage.includes("price")) {
      return "Please enter a valid price.";
    }

    if (lowerMessage.includes("stock")) {
      return "Please enter a valid stock quantity.";
    }

    if (lowerMessage.includes("category")) {
      return "Please select a category.";
    }

    if (
      lowerMessage.includes("name") &&
      (lowerMessage.includes("product") || lowerMessage.includes("title"))
    ) {
      return "Please enter a product name.";
    }

    if (error.status === 422) {
      if (message && !isTechnicalMessage(message)) {
        return cleanUserMessage(message);
      }
      return "Some of the information you entered is invalid. Please review the form and try again.";
    }

    if (message && !isTechnicalMessage(message)) {
      return cleanUserMessage(message);
    }

    return fallback;
  }

  if (error instanceof Error) {
    const message = error.message.trim();
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("network")) {
      return "Unable to connect to the server. Please check your connection and try again.";
    }

    if (lowerMessage.includes("timeout")) {
      return "The request took too long to complete. Please try again.";
    }

    if (message && !isTechnicalMessage(message)) {
      return cleanUserMessage(message);
    }
  }

  if (typeof error === "string" && error.trim()) {
    if (!isTechnicalMessage(error)) {
      return cleanUserMessage(error);
    }
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
  if (
    error instanceof TypeError &&
    /failed to fetch|network|load failed/i.test(error.message)
  ) {
    return "Unable to connect to the server. Please check your connection and try again.";
  }

  if (
    error instanceof Error &&
    /timeout|timed out|abort/i.test(error.message)
  ) {
    return "The request took too long to complete. Please try again.";
  }

  if (error instanceof ApiError) {
    if (error.status >= 500) {
      return "Our servers are experiencing a temporary issue. Please try again shortly.";
    }

    if (error.status === 429) {
      return "Too many failed attempts. Please wait a few minutes before trying again.";
    }

    const details = error.details;

    if (isPasscodeDetails(details)) {
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
    }

    if (
      error.status === 400 ||
      error.status === 401 ||
      error.status === 404 ||
      error.status === 422
    ) {
      return "Invalid or expired Passcode. Please try again.";
    }

    if (error.message && !isTechnicalMessage(error.message)) {
      return cleanUserMessage(error.message);
    }

    return "Invalid or expired Passcode. Please try again.";
  }

  if (error instanceof Error) {
    if (error.message && !isTechnicalMessage(error.message)) {
      return cleanUserMessage(error.message);
    }
  }

  return "Invalid or expired Passcode. Please try again.";
}
