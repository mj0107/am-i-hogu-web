"use client";

import { clsx } from "clsx";
import Link from "next/link";
import BookmarkFillIcon from "@/assets/icons/bookmark-simple-fill.svg";
import ChatIcon from "@/assets/icons/chat.svg";
import { MYPAGE_HISTORY_RESULT_COPY } from "@/features/mypage/history/constants";
import type { HistoryResult, MypageHistoryItem, MypageHistoryTab } from "@/features/mypage/history/model";
import type { PostId } from "@/features/post/model";
import { useInfiniteScrollObserver } from "@/shared/hooks";
import { useToastStore } from "@/shared/model";
import { EmptyState, LoadingState, Tag } from "@/shared/ui";
import { cn } from "@/shared/utils";

type MypageHistorySectionProps = {
  activeTab: MypageHistoryTab;
  items: MypageHistoryItem[];
  onBookmarkRemove?: (postId: PostId) => void;
  hasNextPage?: boolean;
  isFetching?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
};

function HistoryCategoryPill({ children, size = "default" }: { children: string; size?: "default" | "sm" }) {
  return (
    <Tag tone="muted" size={size === "sm" ? "xs" : "sm"} className="min-w-0 max-w-full shrink">
      {children}
    </Tag>
  );
}

function HistoryCommentsMeta({ count }: { count: string }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 text-small-m text-text-03">
      <ChatIcon aria-hidden className="size-4" strokeWidth={20} />
      {count}
    </span>
  );
}

function HistoryResultLabel({ result: resultValue, compact = false }: { result: HistoryResult; compact?: boolean }) {
  const result = MYPAGE_HISTORY_RESULT_COPY[resultValue];
  const ResultIcon = result.icon;

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5",
        compact ? "text-small-sb" : "text-caption-b",
        result.className,
      )}
    >
      <ResultIcon aria-hidden className={compact ? "size-3" : "size-4"} strokeWidth={20} />
      {result.label}
    </span>
  );
}

function HistoryCardAction({
  item,
  children,
  className,
  onDeletedPostClick,
}: {
  item: MypageHistoryItem;
  children: React.ReactNode;
  className?: string;
  onDeletedPostClick: () => void;
}) {
  const actionClassName = cn(
    "block w-full min-w-0 appearance-none text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-default",
    item.isSourceDeleted && "cursor-not-allowed",
    className,
  );

  if (item.isSourceDeleted) {
    return (
      <button type="button" className={actionClassName} onClick={onDeletedPostClick}>
        {children}
      </button>
    );
  }

  return (
    <Link href={`/post/${item.postId}`} scroll className={actionClassName}>
      {children}
    </Link>
  );
}

function PostHistoryCard({
  item,
  withBookmark = false,
  onBookmarkRemove,
  onDeletedPostClick,
}: {
  item: MypageHistoryItem;
  withBookmark?: boolean;
  onBookmarkRemove?: (postId: PostId) => void;
  onDeletedPostClick: () => void;
}) {
  return (
    <article
      className={cn(
        "min-w-0 rounded-[16px] border border-line-01 bg-bg-01 p-[clamp(12px,5vw,24px)]",
        withBookmark && "flex items-center gap-3",
      )}
    >
      {withBookmark ? (
        <button
          type="button"
          className="flex size-6 shrink-0 items-center justify-center text-text-03"
          aria-label={`${item.title} 북마크 해제`}
          onClick={() => onBookmarkRemove?.(item.postId)}
        >
          <BookmarkFillIcon aria-hidden className="size-6" />
        </button>
      ) : null}
      <HistoryCardAction item={item} className="flex-1 space-y-3" onDeletedPostClick={onDeletedPostClick}>
        <header className="flex min-w-0 flex-wrap items-center gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            {item.category ? <HistoryCategoryPill>{item.category}</HistoryCategoryPill> : null}
            <h3 className="truncate text-body-m text-text-04">{item.title}</h3>
          </div>
          <time className="shrink-0 text-small-m text-text-03">{item.createdAtLabel}</time>
        </header>
        <footer className="flex min-w-0 flex-wrap items-center justify-between gap-2">
          <HistoryResultLabel result={item.result} />
          <HistoryCommentsMeta count={item.commentCountLabel} />
        </footer>
      </HistoryCardAction>
    </article>
  );
}

function CommentHistoryCard({ item, onDeletedPostClick }: { item: MypageHistoryItem; onDeletedPostClick: () => void }) {
  return (
    <article className="min-w-0 space-y-3 rounded-[16px] border border-line-01 bg-bg-01 p-[clamp(12px,5vw,24px)]">
      <HistoryCardAction item={item} className="space-y-3" onDeletedPostClick={onDeletedPostClick}>
        <header className="flex min-w-0 flex-wrap items-center gap-4">
          <h3 className="min-w-0 flex-1 truncate text-body-m text-text-04">{item.comment}</h3>
          <time className="shrink-0 text-small-m text-text-03">{item.createdAtLabel}</time>
        </header>
        <footer className="flex min-w-0 flex-wrap items-center justify-between gap-5">
          <div className="flex min-w-0 flex-1 items-center gap-1.5">
            {item.category ? <HistoryCategoryPill size="sm">{item.category}</HistoryCategoryPill> : null}
            <span className="truncate text-small-m text-text-03">
              {item.isSourceDeleted ? "(삭제된 게시글)" : (item.sourceTitle ?? item.title)}
            </span>
          </div>
          <HistoryCommentsMeta count={item.commentCountLabel} />
        </footer>
      </HistoryCardAction>
    </article>
  );
}

function VoteHistoryCard({ item, onDeletedPostClick }: { item: MypageHistoryItem; onDeletedPostClick: () => void }) {
  return (
    <article className="min-w-0 space-y-3 rounded-[16px] border border-line-01 bg-bg-01 p-[clamp(12px,5vw,24px)]">
      <HistoryCardAction item={item} className="space-y-3" onDeletedPostClick={onDeletedPostClick}>
        <header className="flex min-w-0 flex-wrap items-center justify-between gap-2">
          <HistoryResultLabel result={item.result} />
          <time className="shrink-0 text-small-m text-text-03">{item.createdAtLabel}</time>
        </header>
        <footer className="flex min-w-0 flex-wrap items-center justify-between gap-5">
          <div className="flex min-w-0 flex-1 items-center gap-1.5">
            {item.category ? <HistoryCategoryPill size="sm">{item.category}</HistoryCategoryPill> : null}
            <h3 className="truncate text-small-m text-text-03">{item.title}</h3>
          </div>
          <HistoryCommentsMeta count={item.commentCountLabel} />
        </footer>
      </HistoryCardAction>
    </article>
  );
}

function renderHistoryCard(
  activeTab: MypageHistoryTab,
  item: MypageHistoryItem,
  onBookmarkRemove?: (postId: PostId) => void,
  onDeletedPostClick?: () => void,
) {
  const handleDeletedPostClick = onDeletedPostClick ?? (() => undefined);

  if (activeTab === "comments") return <CommentHistoryCard item={item} onDeletedPostClick={handleDeletedPostClick} />;
  if (activeTab === "bookmarks")
    return (
      <PostHistoryCard
        item={item}
        withBookmark
        onBookmarkRemove={onBookmarkRemove}
        onDeletedPostClick={handleDeletedPostClick}
      />
    );
  if (activeTab === "votes") return <VoteHistoryCard item={item} onDeletedPostClick={handleDeletedPostClick} />;
  return <PostHistoryCard item={item} onDeletedPostClick={handleDeletedPostClick} />;
}

export function MypageHistorySection({
  activeTab,
  items,
  onBookmarkRemove,
  hasNextPage = false,
  isFetching = false,
  isFetchingNextPage = false,
  onLoadMore,
}: MypageHistorySectionProps) {
  const showToast = useToastStore((state) => state.showToast);
  const loadMoreRef = useInfiniteScrollObserver({
    enabled: hasNextPage,
    isFetching,
    onIntersect: onLoadMore,
  });

  if (items.length === 0) {
    return (
      <section aria-labelledby="mypage-history-heading">
        <h2 id="mypage-history-heading" className="sr-only">
          히스토리 목록
        </h2>
        <EmptyState layout="inline" title="아직 표시할 히스토리가 없어요." />
      </section>
    );
  }

  return (
    <section className="min-w-0 space-y-4" aria-labelledby="mypage-history-heading">
      <h2 id="mypage-history-heading" className="sr-only">
        히스토리 목록
      </h2>
      <ul className="min-w-0 space-y-4">
        {items.map((item) => (
          <li key={item.id}>
            {renderHistoryCard(activeTab, item, onBookmarkRemove, () => {
              showToast({ message: "삭제된 게시글입니다.", tone: "warning" });
            })}
          </li>
        ))}
      </ul>
      <div ref={loadMoreRef} aria-hidden className="h-6" />
      {isFetchingNextPage ? <LoadingState className="min-h-20" /> : null}
    </section>
  );
}
