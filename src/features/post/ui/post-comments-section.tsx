"use client";

import type { ComponentProps } from "react";
import { useMemo } from "react";
import ChatIcon from "@/assets/icons/chat.svg";
import { COMMENT_SORT_OPTIONS, type PostCommentSortValue } from "@/features/post/constants";
import { PostCommentCard } from "@/features/post/ui/post-comment-card";
import { PostCommentForm } from "@/features/post/ui/post-comment-form";
import type { CommentItemResponse, CommentReadResponse } from "@/shared/api/generated";
import { useInfiniteScrollObserver } from "@/shared/hooks";
import { SortSelect } from "@/shared/ui";
import { cn } from "@/shared/utils";

export type PostCommentsSectionProps = ComponentProps<"section"> & {
  commentsResponse: CommentReadResponse;
  sortValue: PostCommentSortValue;
  onSortChange: (value: PostCommentSortValue) => void;
  onCreateComment: (content: string) => Promise<void>;
  onCreateReply: (parentId: string | number, content: string) => Promise<void>;
  onUpdateComment: (commentId: string | number, content: string) => Promise<void>;
  onDeleteComment: (commentId: string | number) => Promise<void>;
  onToggleHelpful: (comment: CommentItemResponse) => Promise<{ isHelpful: boolean; totalHelpfulCount: number }>;
  isCreatingComment?: boolean;
  hasNextPage?: boolean;
  isFetching?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => Promise<unknown>;
};

function EmptyComments() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <ChatIcon aria-hidden className="size-12 text-text-02" strokeWidth={20} />
      <p className="text-caption-m text-text-02">아직 작성된 집단 지성이 없습니다.</p>
    </div>
  );
}

export function PostCommentsSection(props: PostCommentsSectionProps) {
  const {
    commentsResponse,
    sortValue,
    onSortChange,
    onCreateComment,
    onCreateReply,
    onUpdateComment,
    onDeleteComment,
    onToggleHelpful,
    isCreatingComment = false,
    hasNextPage = false,
    isFetching = false,
    isFetchingNextPage = false,
    onLoadMore,
    className,
    ...rest
  } = props;
  const comments = commentsResponse.comments;
  const loadMoreRef = useInfiniteScrollObserver({
    enabled: hasNextPage,
    isFetching,
    onIntersect: onLoadMore,
  });
  const rootComments = useMemo(() => {
    const roots = comments.filter((comment) => comment.parentId === null);
    const sorted = [...roots];
    sorted.sort((a, b) => {
      if (sortValue === "helpful" && b.totalHelpfulCount !== a.totalHelpfulCount) {
        return b.totalHelpfulCount - a.totalHelpfulCount;
      }

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return sorted;
  }, [comments, sortValue]);
  const replyMap = useMemo(() => {
    const byParent: Record<string, CommentItemResponse[]> = {};
    comments
      .filter((comment) => comment.parentId !== null)
      .forEach((reply) => {
        const parentId = reply.parentId;
        if (parentId === null) {
          return;
        }

        const parentKey = String(parentId);
        if (!byParent[parentKey]) {
          byParent[parentKey] = [];
        }
        byParent[parentKey].push(reply);
      });

    for (const parentId of Object.keys(byParent)) {
      byParent[parentId].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
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
            onChange={onSortChange}
            ariaLabel="집단 지성 정렬"
            className="text-caption-m text-text-03"
          />
        </div>
      </div>

      <PostCommentForm onSubmit={onCreateComment} isSubmitting={isCreatingComment} />

      {rootComments.length > 0 ? (
        <div className="flex flex-col gap-3">
          {rootComments.map((comment) => (
            <PostCommentCard
              key={comment.commentId}
              comment={comment}
              replies={replyMap[String(comment.commentId)] ?? []}
              onCreateReply={onCreateReply}
              onUpdateComment={onUpdateComment}
              onDeleteComment={onDeleteComment}
              onToggleHelpful={onToggleHelpful}
            />
          ))}
        </div>
      ) : (
        <EmptyComments />
      )}
      <div ref={loadMoreRef} className="flex min-h-8 items-center justify-center py-2">
        {isFetchingNextPage ? <span className="text-caption-m text-text-03">댓글 불러오는 중...</span> : null}
      </div>
    </section>
  );
}
