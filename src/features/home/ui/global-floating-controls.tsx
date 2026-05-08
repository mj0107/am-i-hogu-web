"use client";

import { usePathname } from "next/navigation";
import { PostWriteButton, TopScrollButton } from "@/shared/ui";

export function GlobalFloatingControls() {
  const pathname = usePathname();
  const hasPostWriteButton = pathname === "/";

  return (
    <>
      <TopScrollButton mode={hasPostWriteButton ? "withPostWrite" : "single"} />
      {hasPostWriteButton ? <PostWriteButton href="/post/write" className="bottom-[7.25rem]" /> : null}
    </>
  );
}
