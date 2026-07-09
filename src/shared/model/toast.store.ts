"use client";

import type { ReactNode } from "react";
import { create } from "zustand";
import type { ToastSize, ToastTone } from "@/shared/ui";

type ToastState = {
  message: ReactNode | null;
  tone: ToastTone;
  size: ToastSize;
  durationMs: number;
};

type ShowToastParams = {
  message: ReactNode;
  tone?: ToastTone;
  size?: ToastSize;
  durationMs?: number;
};

type ToastActions = {
  showToast: (params: ShowToastParams) => void;
  hideToast: () => void;
};

type ToastStore = ToastState & ToastActions;

const DEFAULT_TOAST_DURATION_MS = 2000;

export const useToastStore = create<ToastStore>()((set) => ({
  message: null,
  tone: "success",
  size: "app",
  durationMs: DEFAULT_TOAST_DURATION_MS,
  showToast: ({ message, tone = "success", size = "app", durationMs = DEFAULT_TOAST_DURATION_MS }) =>
    set({ message, tone, size, durationMs }),
  hideToast: () => set({ message: null }),
}));
