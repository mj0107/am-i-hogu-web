"use client";

import type { ComponentProps } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import ChatIcon from "@/assets/icons/chat.svg";
import DotsThreeIcon from "@/assets/icons/dots-three.svg";
import ThumbsUpIcon from "@/assets/icons/thumbs-up.svg";
import { PostDeleteModal, type PostDeleteMode } from "@/features/post/ui/contents-delete-modal";
import { CommentTextfield, SortSelect, type SortSelectOption, Tag } from "@/shared/ui";
import { cn } from "@/shared/utils";
import { formatRelativeTime } from "@/shared/utils/format";

export type PostCommentReply = {
  commentId: number;
  isMine: boolean;
  createdAt: string;
  updatedAt: string;
  content: string;
  isDeleted: boolean;
  isHelpful: boolean;
  totalHelpfulCount: number;
  parentId: number | null;
  depth: number;
  writer: {
    nickname: string;
    profileImageUrl?: string | null;
    isPostWriter: boolean;
  };
};

export type PostCommentItem = {
  commentId: number;
  isMine: boolean;
  createdAt: string;
  updatedAt: string;
  content: string;
  isDeleted: boolean;
  isHelpful: boolean;
  totalHelpfulCount: number;
  parentId: number | null;
  depth: number;
  writer: {
    nickname: string;
    profileImageUrl?: string | null;
    isPostWriter: boolean;
  };
};

export type PostCommentsSectionProps = ComponentProps<"section"> & {
  commentsResponse: {
    comments: PostCommentItem[];
    hasNext: boolean;
    nextCursor: string | null;
  };
  sortLabel?: string;
};

const COMMENT_SORT_OPTIONS = [
  { value: "latest", label: "최신순" },
  { value: "helpful", label: "유익해요순" },
] satisfies readonly SortSelectOption<"latest" | "helpful">[];

type InteractiveHelpfulChipProps = {
  count: number;
  active?: boolean;
  onToggle: () => void;
};

function InteractiveHelpfulChip(props: InteractiveHelpfulChipProps) {
  const { count, active = false, onToggle } = props;

  return (
    <Tag
      as="button"
      tone={active ? "active" : "default"}
      size="sm"
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      className="gap-1"
    >
      <ThumbsUpIcon aria-hidden className="size-4" strokeWidth={20} />
      유익해요 {count}
    </Tag>
  );
}

type CommentActionMenuProps = {
  idPrefix: string;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onDelete: () => void;
};

function CommentActionMenu(props: CommentActionMenuProps) {
  const { idPrefix, isOpen, onToggle, onClose, onDelete } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstActionRef = useRef<HTMLButtonElement>(null);
  const menuId = `${idPrefix}-menu`;

  useEffect(() => {
    if (isOpen) {
      firstActionRef.current?.focus();
      return;
    }

    triggerRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-label="댓글 더보기"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={onToggle}
        className="focus:outline-none focus-visible:outline-none focus-visible:ring-0"
      >
        <DotsThreeIcon aria-hidden className="size-6 text-text-03" />
      </button>
      {isOpen ? (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 top-8 z-20 min-w-[110px] rounded-[16px] bg-bg-01 px-4 py-3 shadow-[0_8px_20px_rgba(0,0,0,0.12)]"
        >
          <button
            ref={firstActionRef}
            type="button"
            role="menuitem"
            className="block w-full py-1 text-left text-body-m text-text-03 focus:outline-none focus-visible:outline-none focus-visible:ring-0"
          >
            수정하기
          </button>
          <button
            type="button"
            role="menuitem"
            className="mt-1 block w-full py-1 text-left text-body-m text-danger focus:outline-none focus-visible:outline-none focus-visible:ring-0"
            onClick={onDelete}
          >
            삭제하기
          </button>
        </div>
      ) : null}
    </div>
  );
}

function CommentCard({ comment, replies }: { comment: PostCommentItem; replies: PostCommentReply[] }) {
  const [isHelpful, setIsHelpful] = useState(Boolean(comment.isHelpful));
  const [helpfulCount, setHelpfulCount] = useState(comment.totalHelpfulCount);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [openActionMenuKey, setOpenActionMenuKey] = useState<string | null>(null);
  const [deleteMode, setDeleteMode] = useState<PostDeleteMode | null>(null);
  const [replyHelpfulMap, setReplyHelpfulMap] = useState<Record<number, { active: boolean; count: number }>>(() =>
    Object.fromEntries(
      replies.map((reply) => [reply.commentId, { active: reply.isHelpful, count: reply.totalHelpfulCount }]),
    ),
  );

  const toggleHelpful = () => {
    const nextActive = !isHelpful;
    setIsHelpful(nextActive);
    setHelpfulCount((count) => (nextActive ? count + 1 : Math.max(0, count - 1)));
  };

  const toggleReplyHelpful = (replyId: number) => {
    setReplyHelpfulMap((prev) => {
      const current = prev[replyId] ?? { active: false, count: 0 };
      const nextActive = !current.active;
      const nextCount = nextActive ? current.count + 1 : Math.max(0, current.count - 1);
      return { ...prev, [replyId]: { active: nextActive, count: nextCount } };
    });
  };

  const toggleActionMenu = (key: string) => {
    setOpenActionMenuKey((prev) => (prev === key ? null : key));
  };

  return (
    <article className="rounded-[12px] bg-bg-02 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <strong className="text-body-m text-text-04">
            {comment.writer.nickname}
            {comment.writer.isPostWriter ? <span className="ml-0.5 text-small-m">(작성자)</span> : null}
          </strong>
          <span className="text-[10px] leading-[1.5] text-text-03">{formatRelativeTime(comment.createdAt)}</span>
        </div>
        {comment.isMine ? (
          <CommentActionMenu
            idPrefix={`comment-${comment.commentId}`}
            isOpen={openActionMenuKey === `comment-${comment.commentId}`}
            onToggle={() => toggleActionMenu(`comment-${comment.commentId}`)}
            onClose={() => setOpenActionMenuKey(null)}
            onDelete={() => {
              setOpenActionMenuKey(null);
              setDeleteMode("opinion");
            }}
          />
        ) : null}
      </div>
      <p className="mt-[11px] whitespace-pre-line text-caption-m text-text-03">
        {comment.isDeleted ? "삭제된 의견입니다." : comment.content}
      </p>

      <div className="mt-3 flex items-center gap-2">
        <InteractiveHelpfulChip count={helpfulCount} active={isHelpful} onToggle={toggleHelpful} />
        <button type="button" className="text-small-m text-text-03" onClick={() => setIsReplyOpen((prev) => !prev)}>
          {isReplyOpen ? "답글 닫기" : "답글 달기"}
        </button>
      </div>

      {isReplyOpen ? (
        <div className="mt-3">
          <CommentTextfield
            isReply
            value={replyText}
            onChange={(event) => setReplyText(event.target.value)}
            ariaLabel="답글 입력"
          />
        </div>
      ) : null}

      {replies.map((reply) => (
        <div key={reply.commentId} className="mt-4 pl-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <strong className="text-body-m text-text-04">
                {reply.writer.nickname}
                {reply.writer.isPostWriter ? <span className="ml-0.5 text-small-m">(작성자)</span> : null}
              </strong>
              <span className="text-[10px] leading-[1.5] text-text-03">{formatRelativeTime(reply.createdAt)}</span>
            </div>
            {reply.isMine ? (
              <CommentActionMenu
                idPrefix={`reply-${reply.commentId}`}
                isOpen={openActionMenuKey === `reply-${reply.commentId}`}
                onToggle={() => toggleActionMenu(`reply-${reply.commentId}`)}
                onClose={() => setOpenActionMenuKey(null)}
                onDelete={() => {
                  setOpenActionMenuKey(null);
                  setDeleteMode("reply");
                }}
              />
            ) : null}
          </div>
          <p className="mt-2 text-caption-m text-text-03">{reply.isDeleted ? "삭제된 의견입니다." : reply.content}</p>
          <div className="mt-2">
            <InteractiveHelpfulChip
              count={replyHelpfulMap[reply.commentId]?.count ?? reply.totalHelpfulCount}
              active={replyHelpfulMap[reply.commentId]?.active}
              onToggle={() => toggleReplyHelpful(reply.commentId)}
            />
          </div>
        </div>
      ))}
      <PostDeleteModal
        open={deleteMode !== null}
        mode={deleteMode ?? "opinion"}
        onClose={() => setDeleteMode(null)}
        onConfirmDelete={() => setDeleteMode(null)}
      />
    </article>
  );
}

function EmptyComments() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <ChatIcon aria-hidden className="size-12 text-text-02" strokeWidth={20} />
      <p className="text-caption-m text-text-02">아직 작성된 집단 지성이 없습니다.</p>
    </div>
  );
}

export function PostCommentsSection(props: PostCommentsSectionProps) {
  const { commentsResponse, sortLabel = "최신순", className, ...rest } = props;
  const initialSortValue = sortLabel === "유익해요순" ? "helpful" : "latest";
  const [sortValue, setSortValue] = useState<"latest" | "helpful">(initialSortValue);
  const comments = commentsResponse.comments;
  const rootComments = useMemo(() => {
    const roots = comments.filter((comment) => comment.depth === 1);
    const sorted = [...roots];
    sorted.sort((a, b) => {
      if (sortValue === "helpful") {
        if (b.totalHelpfulCount !== a.totalHelpfulCount) {
          return b.totalHelpfulCount - a.totalHelpfulCount;
        }
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return sorted;
  }, [comments, sortValue]);
  const replyMap = useMemo(() => {
    const byParent: Record<number, PostCommentReply[]> = {};
    comments
      .filter((comment): comment is PostCommentReply => comment.depth > 1)
      .forEach((reply) => {
        const parentId = reply.parentId;
        if (parentId === null) {
          return;
        }

        if (!byParent[parentId]) {
          byParent[parentId] = [];
        }
        byParent[parentId].push(reply);
      });

    for (const parentId of Object.keys(byParent)) {
      byParent[Number(parentId)].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    return byParent;
  }, [comments]);

  return (
    <section className={cn("flex flex-col gap-4", className)} aria-label="집단 지성 댓글" {...rest}>
      <div className="flex flex-col gap-1">
        <h2 className="text-subtitle-b text-text-04">집단 지성 ({rootComments.length})</h2>
        <div className="flex justify-end">
          <SortSelect
            value={sortValue}
            options={COMMENT_SORT_OPTIONS}
            onChange={setSortValue}
            ariaLabel="집단 지성 정렬"
            className="text-caption-m text-text-03"
          />
        </div>
      </div>

      <CommentTextfield />

      {rootComments.length > 0 ? (
        <div className="flex flex-col gap-3">
          {rootComments.map((comment) => (
            <CommentCard key={comment.commentId} comment={comment} replies={replyMap[comment.commentId] ?? []} />
          ))}
        </div>
      ) : (
        <EmptyComments />
      )}
    </section>
  );
}
