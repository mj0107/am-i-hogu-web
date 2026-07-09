"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/model";
import { logout } from "./auth.service";

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const clearAccessToken = useAuthStore((state) => state.clearAccessToken);

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearAccessToken();
      queryClient.clear();
    },
  });
}
