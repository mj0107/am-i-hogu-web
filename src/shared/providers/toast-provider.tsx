"use client";

import { useEffect } from "react";
import { useToastStore } from "@/shared/model";
import { Toast } from "@/shared/ui";

export function ToastProvider() {
  const message = useToastStore((state) => state.message);
  const tone = useToastStore((state) => state.tone);
  const size = useToastStore((state) => state.size);
  const durationMs = useToastStore((state) => state.durationMs);
  const hideToast = useToastStore((state) => state.hideToast);

  useEffect(() => {
    if (!message) {
      return;
    }

    const timer = window.setTimeout(() => {
      hideToast();
    }, durationMs);

    return () => {
      window.clearTimeout(timer);
    };
  }, [durationMs, hideToast, message]);

  if (!message) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-10 z-50 flex justify-center px-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <Toast className="pointer-events-auto" message={message} tone={tone} size={size} onClose={hideToast} />
    </div>
  );
}
