"use client";

import { useEffect, useRef, useState } from "react";
import DotsThreeIcon from "@/assets/icons/dots-three.svg";
import ThumbsUpIcon from "@/assets/icons/thumbs-up.svg";
import { useCommentHelpfulState } from "@/features/post/hooks";
import { PostDeleteModal, type PostDeleteMode } from "@/features/post/ui/contents-delete-modal";
import { PostCommentForm } from "@/features/post/ui/post-comment-form";
import type { CommentItemResponse } from "@/shared/api/generated";
import { useToastStore } from "@/shared/model";
import { Tag } from "@/shared/ui";
import { cn, toUserDisplay } from "@/shared/utils";
import { formatRelativeTime, isEditedByTimestamp } from "@/shared/utils/format";
import type { PostCommentsSectionProps } from "./post-comments-section";

const COMMENT_BODY_TEXT_CLASS = "whitespace-pre-line text-caption-m text-text-03";

type InteractiveHelpfulChipProps = {
  count: number;
  active?: boolean;
  disabled?: boolean;
  title?: string;
  onToggle: () => void;
};

function InteractiveHelpfulChip(props: InteractiveHelpfulChipProps) {
  const { count, active = false, disabled = false, title, onToggle } = props;

  return (
    <Tag
      as="button"
      tone={active ? "active" : "default"}
      size="sm"
      type="button"
      disabled={disabled}
      onClick={onToggle}
      aria-pressed={active}
      title={title}
      className="gap-1 disabled:opacity-60"
    >
      <ThumbsUpIcon aria-hidden className="size-4" strokeWidth={20} />
      유익해요 {count}
    </Tag>
  );
}

function CommentMeta({ comment }: { comment: CommentItemResponse }) {
  return (
    <span className="text-[10px] leading-[1.5] text-text-03">
      {formatRelativeTime(comment.createdAt)}
      {!comment.isDeleted && isEditedByTimestamp(comment.createdAt, comment.updatedAt) ? " (수정됨)" : ""}
    </span>
  );
}

function CommentWriterName({ comment }: { comment: CommentItemResponse }) {
  const writer = toUserDisplay(comment.writer);

  return (
    <strong className="text-body-m text-text-04">
      {writer.displayName}
      {comment.writer.isPostWriter ? <span className="ml-0.5 text-small-m">(작성자)</span> : null}
    </strong>
  );
}

type CommentActionMenuProps = {
  idPrefix: string;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

function CommentActionMenu(props: CommentActionMenuProps) {
  const { idPrefix, isOpen, onToggle, onClose, onEdit, onDelete } = props;
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
            onClick={onEdit}
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

export type PostCommentCardProps = {
  comment: CommentItemResponse;
  replies: CommentItemResponse[];
  onCreateReply: PostCommentsSectionProps["onCreateReply"];
  onUpdateComment: PostCommentsSectionProps["onUpdateComment"];
  onDeleteComment: PostCommentsSectionProps["onDeleteComment"];
  onToggleHelpful: PostCommentsSectionProps["onToggleHelpful"];
};

export function PostCommentCard(props: PostCommentCardProps) {
  const { comment, replies, onCreateReply, onUpdateComment, onDeleteComment, onToggleHelpful } = props;
  const showToast = useToastStore((state) => state.showToast);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [openActionMenuKey, setOpenActionMenuKey] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ mode: PostDeleteMode; commentId: string | number } | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | number | null>(null);
  const {
    commentHelpful,
    isCommentHelpfulPending,
    pendingReplyHelpfulId,
    replyHelpfulMap,
    toggleCommentHelpful,
    toggleReplyHelpful,
  } = useCommentHelpfulState({
    comment,
    replies,
    onToggleHelpful,
  });

  const toggleActionMenu = (key: string) => {
    setOpenActionMenuKey((prev) => (prev === key ? null : key));
  };

  const startEdit = (target: CommentItemResponse) => {
    setOpenActionMenuKey(null);
    setEditingCommentId(target.commentId);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    await onDeleteComment(deleteTarget.commentId);
    setDeleteTarget(null);
  };

  const showOwnHelpfulToast = (message: string) => {
    showToast({ message, tone: "warning" });
  };

  const renderCommentBody = (target: CommentItemResponse, isReply = false) => {
    const isEditing = editingCommentId === target.commentId;
    if (isEditing) {
      return (
        <div className={isReply ? "mt-2" : "mt-[11px]"}>
          <PostCommentForm
            initialContent={target.content}
            ariaLabel={isReply ? "답글 수정 입력" : "댓글 수정 입력"}
            showActions
            onCancel={() => setEditingCommentId(null)}
            onSubmit={async (content) => {
              await onUpdateComment(target.commentId, content);
              setEditingCommentId(null);
            }}
          />
        </div>
      );
    }

    return (
      <p data-slot="post-comment-body" className={cn(COMMENT_BODY_TEXT_CLASS, isReply ? "mt-2" : "mt-[11px]")}>
        {target.isDeleted ? "삭제된 의견입니다." : target.content}
      </p>
    );
  };

  return (
    <article className="rounded-[12px] bg-bg-02 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CommentWriterName comment={comment} />
          <CommentMeta comment={comment} />
        </div>
        {comment.isMine && !comment.isDeleted ? (
          <CommentActionMenu
            idPrefix={`comment-${comment.commentId}`}
            isOpen={openActionMenuKey === `comment-${comment.commentId}`}
            onToggle={() => toggleActionMenu(`comment-${comment.commentId}`)}
            onClose={() => setOpenActionMenuKey(null)}
            onEdit={() => startEdit(comment)}
            onDelete={() => {
              setOpenActionMenuKey(null);
              setDeleteTarget({ mode: "opinion", commentId: comment.commentId });
            }}
          />
        ) : null}
      </div>
      {renderCommentBody(comment)}

      {!comment.isDeleted ? (
        <div className="mt-3 flex items-center gap-2">
          <InteractiveHelpfulChip
            count={commentHelpful.count}
            active={commentHelpful.active}
            disabled={isCommentHelpfulPending}
            title={comment.isMine ? "내 댓글에는 유익해요를 누를 수 없습니다." : undefined}
            onToggle={() => {
              if (comment.isMine) {
                showOwnHelpfulToast("내 댓글에는 유익해요를 누를 수 없습니다.");
                return;
              }

              toggleCommentHelpful();
            }}
          />
          <button type="button" className="text-small-m text-text-03" onClick={() => setIsReplyOpen((prev) => !prev)}>
            {isReplyOpen ? "답글 닫기" : "답글 달기"}
          </button>
        </div>
      ) : null}

      {isReplyOpen ? (
        <div className="mt-3">
          <PostCommentForm
            isReply
            ariaLabel="답글 입력"
            onSubmit={async (content) => {
              await onCreateReply(comment.commentId, content);
              setIsReplyOpen(false);
            }}
          />
        </div>
      ) : null}

      {replies.map((reply) => {
        const replyHelpful = replyHelpfulMap[String(reply.commentId)] ?? {
          active: reply.isHelpful,
          count: reply.totalHelpfulCount,
        };

        return (
          <div key={reply.commentId} className="mt-4 pl-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CommentWriterName comment={reply} />
                <CommentMeta comment={reply} />
              </div>
              {reply.isMine && !reply.isDeleted ? (
                <CommentActionMenu
                  idPrefix={`reply-${reply.commentId}`}
                  isOpen={openActionMenuKey === `reply-${reply.commentId}`}
                  onToggle={() => toggleActionMenu(`reply-${reply.commentId}`)}
                  onClose={() => setOpenActionMenuKey(null)}
                  onEdit={() => startEdit(reply)}
                  onDelete={() => {
                    setOpenActionMenuKey(null);
                    setDeleteTarget({ mode: "reply", commentId: reply.commentId });
                  }}
                />
              ) : null}
            </div>
            {renderCommentBody(reply, true)}
            {!reply.isDeleted ? (
              <div className="mt-2">
                <InteractiveHelpfulChip
                  count={replyHelpful.count}
                  active={replyHelpful.active}
                  disabled={pendingReplyHelpfulId === reply.commentId}
                  title={reply.isMine ? "내 답글에는 유익해요를 누를 수 없습니다." : undefined}
                  onToggle={() => {
                    if (reply.isMine) {
                      showOwnHelpfulToast("내 답글에는 유익해요를 누를 수 없습니다.");
                      return;
                    }

                    toggleReplyHelpful(reply);
                  }}
                />
              </div>
            ) : null}
          </div>
        );
      })}
      <PostDeleteModal
        open={deleteTarget !== null}
        mode={deleteTarget?.mode ?? "opinion"}
        onClose={() => setDeleteTarget(null)}
        onConfirmDelete={confirmDelete}
      />
    </article>
  );
}
