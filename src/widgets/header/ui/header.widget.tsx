"use client";

import { useRouter } from "next/navigation";
import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";

export type HeaderWidgetProps = {
  title: string;
};

export function HeaderWidget({ title }: HeaderWidgetProps) {
  const router = useRouter();

  return (
    <header className="bg-indigo-50 flex h-16 items-center gap-4 px-6">
      <button type="button" onClick={() => router.back()} aria-label="뒤로가기">
        <ArrowLeftIcon aria-hidden className="size-5 text-text-03" strokeWidth={25} />
      </button>
      <h2 className="text-title2-m text-text-04">{title}</h2>
    </header>
  );
}
