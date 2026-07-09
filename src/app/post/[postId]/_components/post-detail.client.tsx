"use client";

import { useEffect, useMemo } from "react";
import SmileyXEyesIcon from "@/assets/icons/smiley-x-eyes.svg";
import { usePostDetailPageState } from "@/features/post/hooks";
import {
  PostCommentsSection,
  PostDetailCard,
  PostDetailContent,
  PostDetailHeader,
  PostVoteSection,
} from "@/features/post/ui";
import { isApiError } from "@/shared/api";
import type { PostDetailResponse } from "@/shared/api/generated";
import { Button, ContentCardCarousel, EmptyState, LoadingState } from "@/shared/ui";
import { formatNumber, formatRelativeTime, isEditedByTimestamp } from "@/shared/utils/format";

type PostDetailPageClientProps = {
  postId: string;
};

function createImageCarouselItems(post: Pick<PostDetailResponse, "postId" | "images" | "title">) {
  return [...post.images]
    .sort((a, b) => a.order - b.order)
    .map((image, index) => ({
      id: `${post.postId}-image-${index + 1}`,
      content: (
        // biome-ignore lint/performance/noImgElement: 외부 이미지 도메인 정책의 경우, 추후 이미지 연동 이슈에서 정리될 예정
        <img
          src={image.imageUrl}
          alt={`${post.title} 첨부 이미지 ${index + 1}`}
          className="aspect-[5/3] w-full rounded-[8px] object-cover"
        />
      ),
    }));
}

function PostDetailErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-1 flex-col justify-center px-common-padding py-6">
      <EmptyState
        layout="inline"
        icon={<SmileyXEyesIcon aria-hidden className="size-20 text-text-03" />}
        title={"게시글을 불러오지 못했습니다.\n잠시 후 다시 시도해주세요."}
        action={
          <Button type="button" fullWidth onClick={onRetry}>
            다시 시도
          </Button>
        }
      />
    </div>
  );
}

function PostDetailNotFoundState() {
  return (
    <div className="flex flex-1 flex-col justify-center px-common-padding py-6">
      <EmptyState
        layout="inline"
        icon={<SmileyXEyesIcon aria-hidden className="size-20 text-text-03" />}
        title={"게시글을 찾을 수 없습니다.\n삭제되었거나 이동된 게시글입니다."}
      />
    </div>
  );
}

export default function PostDetailPageClient({ postId }: PostDetailPageClientProps) {
  const {
    postDetailQuery,
    post,
    categoryLabel,
    voteOptions,
    selectedVoteId,
    bookmarkState,
    commentsState,
    isDeletingPost,
    isVotingPost,
    handleDeletePost,
    handleVoteSelect,
  } = usePostDetailPageState({ postId });
  const imageCarouselItems = useMemo(() => (post ? createImageCarouselItems(post) : []), [post]);
  const postMeta = useMemo(() => {
    if (!post) {
      return "";
    }

    const relativeTime = formatRelativeTime(post.createdAt);
    return isEditedByTimestamp(post.createdAt, post.updatedAt) ? `${relativeTime} (수정됨)` : relativeTime;
  }, [post]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, []);

  if (postDetailQuery.isPending) {
    return (
      <main className="flex flex-1 flex-col justify-center px-common-padding py-6">
        <LoadingState className="min-h-[320px]" />
      </main>
    );
  }

  if (postDetailQuery.isError) {
    if (isApiError(postDetailQuery.error) && postDetailQuery.error.status === 404) {
      return <PostDetailNotFoundState />;
    }

    return <PostDetailErrorState onRetry={() => postDetailQuery.refetch()} />;
  }

  if (!post) {
    return <PostDetailNotFoundState />;
  }

  return (
    <div className="flex min-h-full flex-col bg-bg-01">
      <main className="min-w-0 flex-1 overflow-x-hidden px-common-padding py-6">
        <PostDetailCard>
          <PostDetailHeader
            postId={post.postId}
            category={categoryLabel}
            meta={postMeta}
            viewCount={post.viewCount}
            isBookmarked={bookmarkState.isBookmarked}
            isMine={post.isMine}
            isDeleting={isDeletingPost}
            isBookmarking={bookmarkState.isBookmarking}
            onBookmarkToggle={bookmarkState.handleToggleBookmark}
            onDelete={handleDeletePost}
          />
          <PostDetailContent
            title={post.title}
            authorName={post.writer.nickname}
            authorImage={post.writer.profileImageUrl ?? undefined}
            content={post.content}
            media={
              imageCarouselItems.length > 0 ? (
                <ContentCardCarousel
                  items={imageCarouselItems}
                  className="gap-0 px-0 pb-0"
                  showPagination
                  paginationClassName="bottom-4"
                />
              ) : null
            }
            mediaContainerClassName="rounded-[8px] bg-bg-02"
          />
          <PostVoteSection
            options={voteOptions}
            totalVotes={post.vote.totalVotes}
            selectedId={selectedVoteId ?? null}
            isDisabled={post.isMine}
            isVoting={isVotingPost}
            onVoteSelect={handleVoteSelect}
            aria-label={`판결 참여 ${formatNumber(post.vote.totalVotes)}명`}
          />
        </PostDetailCard>

        {commentsState.commentsQuery.isError ? (
          <PostDetailErrorState onRetry={() => commentsState.commentsQuery.refetch()} />
        ) : (
          <PostCommentsSection
            className="mt-12"
            commentsResponse={commentsState.commentsResponse}
            sortValue={commentsState.commentSortValue}
            onSortChange={commentsState.setCommentSortValue}
            onCreateComment={commentsState.handleCreateComment}
            onCreateReply={commentsState.handleCreateReply}
            onUpdateComment={commentsState.handleUpdateComment}
            onDeleteComment={commentsState.handleDeleteComment}
            onToggleHelpful={commentsState.handleToggleCommentHelpful}
            isCreatingComment={commentsState.isCreatingComment}
            hasNextPage={Boolean(commentsState.commentsQuery.hasNextPage)}
            isFetching={commentsState.commentsQuery.isFetching}
            isFetchingNextPage={commentsState.commentsQuery.isFetchingNextPage}
            onLoadMore={commentsState.handleLoadMoreComments}
          />
        )}
      </main>
    </div>
  );
}
