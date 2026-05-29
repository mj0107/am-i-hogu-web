"use client";

import { getPrimaryPostCategoryLabel, POST_DETAIL_RESPONSE_MOCKS } from "@/features/post/model";
import { createDetailVoteOptions, DETAIL_COMMENTS_MOCK } from "@/features/post/model/post-detail.mock";
import {
  PostCommentsSection,
  PostDetailCard,
  PostDetailContent,
  PostDetailHeader,
  PostVoteSection,
} from "@/features/post/ui";
import { ContentCardCarousel } from "@/shared/ui";
import { formatNumber, formatRelativeTime } from "@/shared/utils/format";
import { HeaderWidget } from "@/widgets/header/ui";

type PostDetailPageClientProps = {
  postId: number;
};

export default function PostDetailPageClient({ postId }: PostDetailPageClientProps) {
  const selectedPost = POST_DETAIL_RESPONSE_MOCKS.find((post) => post.postId === postId);
  if (!selectedPost) {
    throw new Error(`Post not found for postId=${postId}`);
  }

  const voteOptions = createDetailVoteOptions();
  const initialSelectedVoteId =
    selectedPost.vote.myVote === "HOGU" || selectedPost.vote.myVote === "NOT_HOGU"
      ? selectedPost.vote.myVote
      : undefined;
  const imageCarouselItems = selectedPost.images.map((gradientClassName, index) => ({
    id: `${selectedPost.postId}-image-${index + 1}`,
    content: <div className={`h-[196px] w-full rounded-[8px] bg-gradient-to-br ${gradientClassName}`} />,
  }));

  return (
    <div className="flex min-h-full flex-col">
      <HeaderWidget title="게시글 상세" />
      <main className="flex-1 px-common-padding py-6">
        <PostDetailCard>
          <PostDetailHeader
            postId={selectedPost.postId}
            category={getPrimaryPostCategoryLabel(selectedPost)}
            meta={formatRelativeTime(selectedPost.createdAt)}
            viewCount={selectedPost.viewCount}
            isBookmarked={false}
            isMine={selectedPost.isMine}
          />
          <PostDetailContent
            title={selectedPost.title}
            authorName={selectedPost.writer.nickname}
            content={selectedPost.content}
            media={
              <ContentCardCarousel
                items={imageCarouselItems}
                className="gap-0 px-0 pb-0"
                showPagination
                paginationClassName="bottom-4"
              />
            }
            mediaContainerClassName="rounded-[8px] bg-bg-02"
          />
          <PostVoteSection
            options={voteOptions}
            totalVotes={selectedPost.vote.totalVotes}
            initialSelectedId={initialSelectedVoteId}
            aria-label={`판결 참여 ${formatNumber(selectedPost.vote.totalVotes)}명`}
          />
        </PostDetailCard>

        <PostCommentsSection className="mt-16" commentsResponse={DETAIL_COMMENTS_MOCK} />
      </main>
    </div>
  );
}
