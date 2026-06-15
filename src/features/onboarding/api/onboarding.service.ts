import { apiClient } from "@/shared/api";
import type { CheckNicknameResponse, OnboardingRequest, OnboardingResponse } from "@/shared/api/generated";

export async function checkNickname(nickname: string) {
  return apiClient<CheckNicknameResponse>("/api/users/check-nickname", {
    method: "GET",
    query: {
      nickname,
    },
  });
}

export async function createOnboardingUser(request: OnboardingRequest) {
  return apiClient<OnboardingResponse>("/api/users", {
    method: "POST",
    body: request,
    credentials: "include",
  });
}
