"use client";

import Image from "next/image";
import type { ComponentProps, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import BookmarkIcon from "@/assets/icons/bookmark-simple.svg";
import BookmarkFillIcon from "@/assets/icons/bookmark-simple-fill.svg";
import VerticalDotIcon from "@/assets/icons/dots-three-vertical.svg";
import EyeIcon from "@/assets/icons/eye.svg";
import ShareIcon from "@/assets/icons/share-network.svg";
import { useSharePostLink } from "@/features/post/hooks/use-share-post-link.hook";
import { PostDeleteModal } from "@/features/post/ui/contents-delete-modal";
import { Tag, Toast } from "@/shared/ui";
import { cn } from "@/shared/utils";
import { formatNumber } from "@/shared/utils/format";

const iconButtonClassName = "inline-flex size-6 items-center justify-center leading-none";
const iconClassName = "block size-6";

export type PostDetailCardProps = ComponentProps<"article">;

export function PostDetailCard({ className, ...props }: PostDetailCardProps) {
  return <article className={cn("flex flex-col gap-6 overflow-hidden bg-bg-01", className)} {...props} />;
}

export type PostDetailHeaderProps = {
  postId: number | string;
  category: string;
  meta: string;
  viewCount: number;
  isBookmarked?: boolean;
  className?: string;
};

function IconButton(props: ComponentProps<"button">) {
  const { className, ...rest } = props;
  return <button type="button" className={cn(iconButtonClassName, className)} {...rest} />;
}

export function PostDetailHeader(props: PostDetailHeaderProps) {
  const { postId, category, meta, viewCount, isBookmarked = false, className } = props;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { isToastVisible: isShareToastVisible, handleShare } = useSharePostLink({ postId });

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className={cn("flex items-center justify-between gap-3", className)}>
        <ul className="inline-flex items-center gap-2 text-small-m text-text-03">
          <li>
            <Tag tone="categoryActive" size="md">
              {category}
            </Tag>
          </li>
          <li>{meta}</li>
          <li className="inline-flex items-center gap-1">
            <EyeIcon aria-hidden className="size-4 text-text-03" strokeWidth={20} />
            {formatNumber(viewCount)}
          </li>
        </ul>
        <div className="inline-flex items-center gap-3 text-text-03">
          <IconButton aria-label="북마크">
            {isBookmarked ? (
              <BookmarkFillIcon aria-hidden className={cn(iconClassName, "text-text-03")} />
            ) : (
              <BookmarkIcon aria-hidden className={cn(iconClassName, "text-text-03")} strokeWidth={20} />
            )}
          </IconButton>
          <IconButton aria-label="공유" onClick={handleShare}>
            <ShareIcon aria-hidden className={iconClassName} strokeWidth={20} />
          </IconButton>
          <div ref={menuRef} className="relative inline-flex size-6 items-center justify-center">
            <IconButton
              aria-label="게시글 더보기"
              aria-expanded={isMenuOpen}
              className="focus:outline-none focus-visible:outline-none focus-visible:ring-0"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              <VerticalDotIcon aria-hidden className={iconClassName} strokeWidth={20} />
            </IconButton>
            {isMenuOpen ? (
              <div className="absolute right-0 top-10 z-20 min-w-[110px] rounded-[16px] bg-bg-01 px-4 py-3 shadow-[0_8px_20px_rgba(0,0,0,0.12)]">
                <button
                  type="button"
                  className="block w-full py-1 text-left text-body-m text-text-03 focus:outline-none focus-visible:outline-none focus-visible:ring-0"
                >
                  수정하기
                </button>
                <button
                  type="button"
                  className="mt-1 block w-full py-1 text-left text-body-m text-danger focus:outline-none focus-visible:outline-none focus-visible:ring-0"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsDeleteModalOpen(true);
                  }}
                >
                  삭제하기
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>
      {isShareToastVisible ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-10 z-50 flex justify-center px-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Toast message="링크가 복사되었어요." size="app" />
        </div>
      ) : null}
      <PostDeleteModal
        open={isDeleteModalOpen}
        mode="post"
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirmDelete={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
}

export type PostDetailContentProps = {
  title: string;
  authorName: string;
  authorImage?: string;
  content: string;
  media?: ReactNode;
  className?: string;
  mediaContainerClassName?: string;
};

export function PostDetailContent(props: PostDetailContentProps) {
  const { title, authorName, authorImage, content, media, className, mediaContainerClassName } = props;
  const fallbackInitial = authorName.trim().charAt(0) || "?";

  return (
    <section className={cn("flex flex-col gap-5", className)} aria-label="게시글 본문">
      <h1 className="text-title1-m text-text-04">{title}</h1>
      <div className="flex items-center gap-3">
        {authorImage ? (
          <Image
            src={authorImage}
            alt={`${authorName} 프로필 이미지`}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-bg-02 text-caption-sb text-text-03">
            {fallbackInitial}
          </div>
        )}
        <span className="text-body-m text-text-04">{authorName}</span>
      </div>
      <div className="flex flex-col gap-4">
        <p className="whitespace-pre-line text-body-r text-text-04">{content}</p>
        {media ? <div className={cn("overflow-hidden rounded-[8px]", mediaContainerClassName)}>{media}</div> : null}
      </div>
    </section>
  );
}
