"use client";

import Link from "next/link";
import { type CSSProperties, type MouseEventHandler, type ReactNode, useEffect, useState } from "react";
import PencilSimpleIcon from "@/assets/icons/pencil-simple-fill.svg";
import PlusIcon from "@/assets/icons/plus.svg";
import XIcon from "@/assets/icons/x.svg";
import { buttonVariants } from "@/shared/ui/button";
import { cn } from "@/shared/utils";

export type PostWriteButtonProps = {
  href: string;
  text?: string;
  itemIcon?: ReactNode;
  useFlexLayout?: boolean;
  extraBottomOffset?: number;
  className?: string;
  onToggle?: (isOpen: boolean) => void;
  onItemClick?: MouseEventHandler<HTMLAnchorElement>;
};

function usePostWriteButtonToggleEffect(isOpen: boolean, onToggle?: (isOpen: boolean) => void) {
  useEffect(() => {
    onToggle?.(isOpen);
  }, [isOpen, onToggle]);
}

export function PostWriteButton(props: PostWriteButtonProps) {
  const {
    href,
    text = "새 게시글 작성하기",
    itemIcon,
    useFlexLayout = false,
    extraBottomOffset = 0,
    className,
    onToggle,
    onItemClick,
  } = props;
  const [isOpen, setIsOpen] = useState(false);

  usePostWriteButtonToggleEffect(isOpen, onToggle);

  const containerStyle: CSSProperties | undefined = (() => {
    if (!useFlexLayout) {
      return undefined;
    }

    return { bottom: `${12 + extraBottomOffset}px` };
  })();

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      {!useFlexLayout ? (
        <button
          type="button"
          aria-label="게시글 작성 안내 배경 닫기"
          onClick={() => setIsOpen(false)}
          className={cn(
            "fixed inset-0 z-40 bg-black/35 transition-opacity duration-300",
            isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
          )}
        />
      ) : null}
      <div
        className={cn(
          "z-50 h-fit w-fit",
          !useFlexLayout && "fixed bottom-12 right-[var(--spacing-app-floating-edge)]",
          useFlexLayout && "relative",
          className,
        )}
        style={containerStyle}
      >
        <button
          type="button"
          aria-label={isOpen ? "게시글 작성 안내 닫기" : "게시글 작성 안내 열기"}
          onClick={handleToggle}
          className={cn(
            buttonVariants({ variant: "primary", size: "iconLg" }),
            "shadow-strong flex h-12 w-12 items-center justify-center rounded-full bg-primary-strong",
          )}
        >
          {isOpen ? (
            <XIcon aria-hidden className="h-4 w-4" strokeWidth={20} />
          ) : (
            <PlusIcon aria-hidden className="h-4 w-4" strokeWidth={20} />
          )}
        </button>
        <div
          className={cn(
            "shadow-emphasize absolute bottom-[calc(100%+10px)] right-0 rounded-lg bg-bg-01 px-3 transition duration-300",
            isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <Link
            href={href}
            onClick={onItemClick}
            className="flex w-full items-center gap-1 whitespace-nowrap py-2 text-left text-body-r"
          >
            {itemIcon ?? <PencilSimpleIcon aria-hidden className="size-5 text-text-03" />}
            <span>{text}</span>
          </Link>
        </div>
      </div>
    </>
  );
}
