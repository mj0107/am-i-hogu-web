import Image from "next/image";
import type { ComponentProps, ReactNode } from "react";
import BookmarkIcon from "@/assets/icons/bookmark-simple.svg";
import BookmarkFillIcon from "@/assets/icons/bookmark-simple-fill.svg";
import ChatIcon from "@/assets/icons/chat.svg";
import EyeIcon from "@/assets/icons/eye.svg";
import { Tag } from "@/shared/ui/tag";
import { cn, toUserDisplay } from "@/shared/utils";
import { formatNumber } from "@/shared/utils/format";

export type ContentCardProps = ComponentProps<"article">;

export function ContentCard({ className, ...props }: ContentCardProps) {
  return (
    <article
      className={cn(
        "flex min-w-0 flex-col gap-4 overflow-hidden rounded-[24px] border border-line-02 bg-bg-01 px-[var(--spacing-content-card-inline)] py-[var(--spacing-content-card-block)]",
        className,
      )}
      {...props}
    />
  );
}

export type ContentCardHeaderProps = {
  authorImage?: string;
  authorName?: string;
  category: string;
  meta: string;
  className?: string;
  viewCount?: number;
  isBookmarked?: boolean;
  isBookmarking?: boolean;
  onBookmarkToggle?: () => void;
};

export function ContentCardHeader({
  authorImage,
  authorName,
  category,
  meta,
  viewCount,
  isBookmarked = false,
  isBookmarking = false,
  onBookmarkToggle,
  className,
}: ContentCardHeaderProps) {
  const author = toUserDisplay({ nickname: authorName, profileImageUrl: authorImage });
  const fallbackInitial = author.isDeletedUser ? "" : author.displayName.trim().charAt(0) || "?";

  return (
    <header className={cn(className)}>
      <div className="flex min-w-0 flex-row items-center justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2 text-caption-m text-text-03">
          {author.profileImageUrl ? (
            <Image
              src={author.profileImageUrl}
              alt={`${author.displayName || "작성자"} 프로필 이미지`}
              width={40}
              height={40}
              className="shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bg-02 text-caption-sb text-text-03">
              {fallbackInitial}
            </div>
          )}
          <div className="flex min-w-0 flex-col">
            {author.displayName ? (
              <span className="truncate text-body-m text-text-04">{author.displayName}</span>
            ) : null}
            <div className="flex min-w-0 flex-row items-center gap-2">
              <span className="truncate text-caption-m text-text-03">{meta}</span>
              <div className="flex shrink-0 flex-row items-center gap-1">
                <EyeIcon aria-hidden className="size-4 text-text-03" strokeWidth={20} />
                <span className="text-caption-m text-text-03">{formatNumber(viewCount ?? 0)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 flex-row items-center gap-2">
          <Tag tone="categoryInactive" size="sm">
            {category}
          </Tag>
          {onBookmarkToggle ? (
            <button
              type="button"
              aria-label={isBookmarked ? "북마크 해제" : "북마크"}
              aria-pressed={isBookmarked}
              disabled={isBookmarking}
              onClick={onBookmarkToggle}
              className="flex size-6 items-center justify-center disabled:opacity-60"
            >
              {isBookmarked ? (
                <BookmarkFillIcon aria-hidden className="size-6 text-text-02" />
              ) : (
                <BookmarkIcon aria-hidden className="size-6 text-text-02" strokeWidth={20} />
              )}
            </button>
          ) : isBookmarked ? (
            <BookmarkFillIcon aria-hidden className="size-6 text-text-02" />
          ) : (
            <BookmarkIcon aria-hidden className="size-6 text-text-02" strokeWidth={20} />
          )}
        </div>
      </div>
    </header>
  );
}

export type ContentCardBodyProps = {
  title: string;
  description: string;
  image?: ReactNode;
  className?: string;
  imageContainerClassName?: string;
};

export function ContentCardBody({
  title,
  description,
  image,
  className,
  imageContainerClassName,
}: ContentCardBodyProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <h3 className="line-clamp-2 text-subtitle-sb text-text-04">{title}</h3>
      <p className="line-clamp-3 text-body-r text-text-03">{description}</p>
      {image ? <div className={cn("overflow-hidden rounded-[8px]", imageContainerClassName)}>{image}</div> : null}
    </div>
  );
}

export type ContentCardFooterProps = {
  votes: number;
  comments: number;
  className?: string;
};

export function ContentCardFooter(props: ContentCardFooterProps) {
  const { votes, comments, className } = props;
  return (
    <footer
      className={cn(
        "flex min-w-0 items-center justify-between gap-3 border-t border-line-02 pt-4 text-caption-m text-text-03",
        className,
      )}
    >
      <span className="min-w-0 truncate text-small-m">현재까지 {formatNumber(votes)}명이 판결에 참여했습니다.</span>
      <span className="inline-flex shrink-0 items-center gap-2 text-body-m">
        <ChatIcon aria-hidden className="size-5" strokeWidth={20} />
        {comments}
      </span>
    </footer>
  );
}
