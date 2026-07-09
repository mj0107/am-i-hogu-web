"use client";

import { useRouter } from "next/navigation";
import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";
import { cn } from "@/shared/utils";

export type HeaderWidgetProps = {
  title?: string;
  variant?: "default" | "ghost";
};

export function HeaderWidget({ title, variant = "default" }: HeaderWidgetProps) {
  const router = useRouter();

  return (
    <header
      className={cn(
        "flex h-[60px] w-full min-w-0 items-center gap-[var(--spacing-app-responsive-control-gap)] px-[var(--spacing-app-responsive-inline)]",
        variant === "default" && "bg-indigo-50",
      )}
    >
      <button type="button" onClick={() => router.back()} aria-label="뒤로가기" className="shrink-0">
        <ArrowLeftIcon aria-hidden className="size-5 text-text-03" strokeWidth={25} />
      </button>
      {title ? <h2 className="min-w-0 truncate text-title2-m text-text-04">{title}</h2> : null}
    </header>
  );
}
