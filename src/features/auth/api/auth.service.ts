import { apiClient } from "@/shared/api";
import type { ReissueResponse } from "@/shared/api/generated";

export async function refreshAccessToken() {
  return apiClient<ReissueResponse>("/api/auth/refresh", {
    method: "POST",
    cache: "no-store",
    credentials: "include",
  });
}

export async function logout() {
  return apiClient<void>("/api/auth/logout", {
    method: "POST",
    cache: "no-store",
    credentials: "include",
  });
}
