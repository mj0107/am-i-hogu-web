import { clsx } from "clsx";
import BookmarkFillIcon from "@/assets/icons/bookmark-simple-fill.svg";
import ChatIcon from "@/assets/icons/chat.svg";
import { MYPAGE_HISTORY_RESULT_COPY } from "@/features/mypage/history/constants";
import type { HistoryResult, MypageHistoryItem, MypageHistoryTab } from "@/features/mypage/history/model";
import { EmptyState, Tag } from "@/shared/ui";
import { cn } from "@/shared/utils";

type MypageHistorySectionProps = {
  activeTab: MypageHistoryTab;
  items: MypageHistoryItem[];
};

function HistoryCategoryPill({ children, size = "default" }: { children: string; size?: "default" | "sm" }) {
  return (
    <Tag tone="muted" size={size === "sm" ? "xs" : "sm"} className="shrink-0">
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

function PostHistoryCard({ item, withBookmark = false }: { item: MypageHistoryItem; withBookmark?: boolean }) {
  return (
    <article
      className={cn("rounded-[16px] border border-line-01 bg-bg-01 p-6", withBookmark && "flex items-center gap-3")}
    >
      {withBookmark ? <BookmarkFillIcon aria-hidden className="size-6 shrink-0 text-text-03" /> : null}
      <div className="min-w-0 flex-1 space-y-3">
        <header className="flex items-center gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            {item.category ? <HistoryCategoryPill>{item.category}</HistoryCategoryPill> : null}
            <h3 className="truncate text-body-m text-text-04">{item.title}</h3>
          </div>
          <time className="shrink-0 text-small-m text-text-03">{item.createdAtLabel}</time>
        </header>
        <footer className="flex items-center justify-between">
          <HistoryResultLabel result={item.result} />
          <HistoryCommentsMeta count={item.commentCountLabel} />
        </footer>
      </div>
    </article>
  );
}

function CommentHistoryCard({ item }: { item: MypageHistoryItem }) {
  return (
    <article className="space-y-3 rounded-[16px] border border-line-01 bg-bg-01 p-6">
      <header className="flex items-center gap-4">
        <h3 className="min-w-0 flex-1 truncate text-body-m text-text-04">{item.comment}</h3>
        <time className="shrink-0 text-small-m text-text-03">{item.createdAtLabel}</time>
      </header>
      <footer className="flex items-center justify-between gap-5">
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          {item.category ? <HistoryCategoryPill size="sm">{item.category}</HistoryCategoryPill> : null}
          <span className="truncate text-small-m text-text-03">
            {item.isSourceDeleted ? "(삭제된 게시글)" : (item.sourceTitle ?? item.title)}
          </span>
        </div>
        <HistoryCommentsMeta count={item.commentCountLabel} />
      </footer>
    </article>
  );
}

function VoteHistoryCard({ item }: { item: MypageHistoryItem }) {
  return (
    <article className="space-y-3 rounded-[16px] border border-line-01 bg-bg-01 p-6">
      <header className="flex items-center justify-between">
        <HistoryResultLabel result={item.result} />
        <time className="shrink-0 text-small-m text-text-03">{item.createdAtLabel}</time>
      </header>
      <footer className="flex items-center justify-between gap-5">
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          {item.category ? <HistoryCategoryPill size="sm">{item.category}</HistoryCategoryPill> : null}
          <h3 className="truncate text-small-m text-text-03">{item.title}</h3>
        </div>
        <HistoryCommentsMeta count={item.commentCountLabel} />
      </footer>
    </article>
  );
}

function renderHistoryCard(activeTab: MypageHistoryTab, item: MypageHistoryItem) {
  if (activeTab === "comments") return <CommentHistoryCard item={item} />;
  if (activeTab === "bookmarks") return <PostHistoryCard item={item} withBookmark />;
  if (activeTab === "votes") return <VoteHistoryCard item={item} />;
  return <PostHistoryCard item={item} />;
}

export function MypageHistorySection({ activeTab, items }: MypageHistorySectionProps) {
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
    <section className="space-y-4" aria-labelledby="mypage-history-heading">
      <h2 id="mypage-history-heading" className="sr-only">
        히스토리 목록
      </h2>
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.id}>{renderHistoryCard(activeTab, item)}</li>
        ))}
      </ul>
    </section>
  );
}
