"use client";

import Image from "next/image";
import Link from "next/link";
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
import { cn, toUserDisplay } from "@/shared/utils";
import { formatNumber } from "@/shared/utils/format";

const iconButtonClassName = "inline-flex size-6 items-center justify-center leading-none";
const iconClassName = "block size-6";

export type PostDetailCardProps = ComponentProps<"article">;

export function PostDetailCard({ className, ...props }: PostDetailCardProps) {
  return <article className={cn("flex min-w-0 flex-col gap-6 overflow-hidden bg-bg-01", className)} {...props} />;
}

export type PostDetailHeaderProps = {
  postId: number | string;
  category: string;
  meta: string;
  viewCount: number;
  isBookmarked?: boolean;
  isBookmarking?: boolean;
  isMine?: boolean;
  isDeleting?: boolean;
  onBookmarkToggle?: () => void;
  onDelete?: () => void;
  className?: string;
};

function IconButton(props: ComponentProps<"button">) {
  const { className, ...rest } = props;
  return <button type="button" className={cn(iconButtonClassName, className)} {...rest} />;
}

export function PostDetailHeader(props: PostDetailHeaderProps) {
  const {
    postId,
    category,
    meta,
    viewCount,
    isBookmarked = false,
    isBookmarking = false,
    isMine = false,
    isDeleting = false,
    onBookmarkToggle,
    onDelete,
    className,
  } = props;
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
      <header className={cn("flex min-w-0 flex-wrap items-start justify-between gap-3", className)}>
        <ul className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1 text-small-m text-text-03">
          <li>
            <Tag tone="categoryActive" size="md">
              {category}
            </Tag>
          </li>
          <li className="whitespace-nowrap">{meta}</li>
          <li className="inline-flex min-w-0 items-center gap-1 whitespace-nowrap">
            <EyeIcon aria-hidden className="size-4 shrink-0 text-text-03" strokeWidth={20} />
            <span className="min-w-0">{formatNumber(viewCount)}</span>
          </li>
        </ul>
        <div className="inline-flex shrink-0 items-center gap-3 text-text-03">
          <IconButton
            aria-label={isBookmarked ? "북마크 해제" : "북마크"}
            aria-pressed={isBookmarked}
            disabled={isBookmarking}
            onClick={onBookmarkToggle}
          >
            {isBookmarked ? (
              <BookmarkFillIcon aria-hidden className={cn(iconClassName, "text-text-03")} />
            ) : (
              <BookmarkIcon aria-hidden className={cn(iconClassName, "text-text-03")} strokeWidth={20} />
            )}
          </IconButton>
          <IconButton aria-label="공유" onClick={handleShare}>
            <ShareIcon aria-hidden className={iconClassName} strokeWidth={20} />
          </IconButton>
          {isMine ? (
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
                  <Link
                    href={`/post/${postId}/edit`}
                    className="block w-full py-1 text-left text-body-m text-text-03 focus:outline-none focus-visible:outline-none focus-visible:ring-0"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    수정하기
                  </Link>
                  <button
                    type="button"
                    className="mt-1 block w-full py-1 text-left text-body-m text-danger focus:outline-none focus-visible:outline-none focus-visible:ring-0"
                    disabled={isDeleting}
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
          ) : null}
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
        confirmText={isDeleting ? "삭제 중" : "삭제하기"}
        onConfirmDelete={() => {
          onDelete?.();
          setIsDeleteModalOpen(false);
        }}
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
  const author = toUserDisplay({ nickname: authorName, profileImageUrl: authorImage });
  const fallbackInitial = author.isDeletedUser ? "" : author.displayName.trim().charAt(0) || "?";

  return (
    <section className={cn("flex min-w-0 flex-col gap-5", className)} aria-label="게시글 본문">
      <h1 className="min-w-0 break-words text-title1-m text-text-04">{title}</h1>
      <div className="flex min-w-0 items-center gap-3">
        {author.profileImageUrl ? (
          <Image
            src={author.profileImageUrl}
            alt={`${author.displayName} 프로필 이미지`}
            width={40}
            height={40}
            className="shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bg-02 text-caption-sb text-text-03">
            {fallbackInitial}
          </div>
        )}
        <span className="min-w-0 break-words text-body-m text-text-04">{author.displayName}</span>
      </div>
      <div className="flex min-w-0 flex-col gap-4">
        <p className="min-w-0 whitespace-pre-line break-words text-body-r text-text-04">{content}</p>
        {media ? (
          <div className={cn("min-w-0 overflow-hidden rounded-[8px]", mediaContainerClassName)}>{media}</div>
        ) : null}
      </div>
    </section>
  );
}
