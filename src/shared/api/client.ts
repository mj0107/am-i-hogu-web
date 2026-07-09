import { ApiError } from "./error";
import type { ErrorResponse } from "./generated";

const DEFAULT_API_TIMEOUT_MS = 15_000;

type JsonObject = object;

export type ApiClientOptions = Omit<RequestInit, "body"> & {
  body?: BodyInit | JsonObject | unknown[] | null;
  parseJson?: (text: string) => unknown;
  query?: Record<string, string | number | boolean | null | undefined>;
  timeoutMs?: number;
};

function getApiBaseUrl() {
  if (typeof window !== "undefined") {
    // 클라이언트(브라우저)에서는 NEXT_PUBLIC_ 접두사가 붙은 환경 변수만 사용할 수 있다.
    return process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  }

  return process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
}

function createApiUrl(path: string, query?: ApiClientOptions["query"]) {
  const baseUrl = getApiBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = baseUrl ? new URL(normalizedPath, baseUrl) : new URL(normalizedPath, "http://localhost");

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== null && value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }

  return baseUrl ? url.toString() : `${url.pathname}${url.search}`;
}

function isJsonBody(body: ApiClientOptions["body"]): body is JsonObject | unknown[] {
  return Boolean(body) && typeof body === "object" && !(body instanceof FormData) && !(body instanceof Blob);
}

async function parseResponseBody(response: Response, parseJson?: ApiClientOptions["parseJson"]) {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const text = await response.text();

    return parseJson ? parseJson(text) : JSON.parse(text);
  }

  return response.text();
}

function getErrorMessage(data: unknown, fallback: string) {
  if (data && typeof data === "object" && "message" in data && typeof data.message === "string") {
    return data.message;
  }

  return fallback;
}

export async function apiClient<T>(path: string, options: ApiClientOptions = {}): Promise<T> {
  const { body, headers, parseJson, query, timeoutMs = DEFAULT_API_TIMEOUT_MS, ...requestInit } = options;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  const shouldJsonStringify = isJsonBody(body);

  try {
    const response = await fetch(createApiUrl(path, query), {
      ...requestInit,
      body: shouldJsonStringify ? JSON.stringify(body) : body,
      headers: {
        ...(shouldJsonStringify ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      signal: controller.signal,
    });
    const data = await parseResponseBody(response, response.ok ? parseJson : undefined);

    if (!response.ok) {
      throw new ApiError({
        status: response.status,
        message: getErrorMessage(data, response.statusText),
        data: data as ErrorResponse,
      });
    }

    return data as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError({
        message: `Request timed out after ${timeoutMs} ms`,
      });
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
