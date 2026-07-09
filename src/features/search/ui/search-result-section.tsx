"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePostListInfiniteQuery, useTogglePostBookmarkMutation } from "@/features/post/api";
import { POST_SORT_QUERY_BY_VALUE } from "@/features/post/constants";
import { getPrimaryPostCategoryLabel } from "@/features/post/model";
import type { CategoryLabel, CategoryParam, SearchPostsResponse, SortValue } from "@/features/search/model";
import {
  Button,
  ContentCard,
  ContentCardBody,
  ContentCardFooter,
  ContentCardHeader,
  EmptyState,
  LoadingState,
} from "@/shared/ui";
import { formatRelativeTime } from "@/shared/utils/format";
import { SubHeadingWidget } from "@/widgets/sub-heading/ui/sub-heading.widget";

type SearchResultSectionProps = {
  keyword: string;
  selectedCategoryParams: CategoryParam[];
  selectedCategories: CategoryLabel[];
  sortValue: SortValue;
  pageSize: number;
  onCategoryChange: (nextCategories: CategoryLabel[]) => void;
  onSortChange: (nextSort: SortValue) => void;
};

type SearchResultContentProps = {
  selectedCategories: CategoryLabel[];
  sortValue: SortValue;
  response: SearchPostsResponse;
  onCategoryChange: (nextCategories: CategoryLabel[]) => void;
  onSortChange: (nextSort: SortValue) => void;
  isLoading?: boolean;
  isError?: boolean;
  isFetching?: boolean;
  isFetchingNextPage?: boolean;
  onRetry: () => void;
  onLoadMore: () => void;
};

export function SearchResultSection(props: SearchResultSectionProps) {
  const { keyword, selectedCategoryParams, selectedCategories, sortValue, pageSize, onCategoryChange, onSortChange } =
    props;
  const selectedCategoryQuery = selectedCategoryParams.join(",");
  const searchPostsQuery = usePostListInfiniteQuery({
    keyword: keyword || null,
    categories: selectedCategoryQuery || null,
    sortBy: POST_SORT_QUERY_BY_VALUE[sortValue],
    pageSize,
  });
  const response = useMemo(
    () => ({
      totalPostCount: searchPostsQuery.data?.pages[0]?.totalPostCount ?? 0,
      posts: searchPostsQuery.data?.pages.flatMap((page) => page.posts) ?? [],
      hasNext: Boolean(searchPostsQuery.hasNextPage),
      nextCursor: searchPostsQuery.data?.pages.at(-1)?.nextCursor ?? null,
    }),
    [searchPostsQuery.data?.pages, searchPostsQuery.hasNextPage],
  );

  return (
    <SearchResultContent
      selectedCategories={selectedCategories}
      sortValue={sortValue}
      response={response}
      onCategoryChange={onCategoryChange}
      onSortChange={onSortChange}
      isLoading={searchPostsQuery.isPending}
      isError={searchPostsQuery.isError}
      isFetching={searchPostsQuery.isFetching}
      isFetchingNextPage={searchPostsQuery.isFetchingNextPage}
      onRetry={() => searchPostsQuery.refetch()}
      onLoadMore={() => {
        searchPostsQuery.fetchNextPage();
      }}
    />
  );
}

function SearchResultContent(props: SearchResultContentProps) {
  const bookmarkMutation = useTogglePostBookmarkMutation();
  const {
    selectedCategories,
    sortValue,
    response,
    onCategoryChange,
    onSortChange,
    isLoading = false,
    isError = false,
    isFetching = false,
    isFetchingNextPage = false,
    onRetry,
    onLoadMore,
  } = props;

  return (
    <div className="flex flex-1 flex-col gap-5 px-common-padding py-5">
      <section className="flex flex-col gap-3" aria-label="탐색 필터">
        <SubHeadingWidget
          selectedOptions={selectedCategories}
          sortValue={sortValue}
          totalCount={response.totalPostCount ?? response.posts.length}
          onSelectedOptionsChange={onCategoryChange}
          onSortValueChange={onSortChange}
        />
      </section>

      {isLoading ? (
        <LoadingState className="min-h-[320px]" />
      ) : isError ? (
        <EmptyState
          layout="inline"
          title="검색 결과를 불러오지 못했어요."
          description="잠시 후 다시 시도해주세요."
          action={
            <Button type="button" onClick={onRetry} className="mx-auto w-fit">
              다시 불러오기
            </Button>
          }
        />
      ) : response.posts.length > 0 ? (
        <section className="flex flex-col gap-3" aria-label="검색 게시글 목록">
          <ul className="flex flex-col gap-4">
            {response.posts.map((post) => (
              <li key={post.postId}>
                <ContentCard>
                  <ContentCardHeader
                    authorName={post.writer.nickname}
                    authorImage={post.writer.profileImageUrl || undefined}
                    category={getPrimaryPostCategoryLabel(post)}
                    meta={formatRelativeTime(post.createdAt)}
                    viewCount={post.viewCount}
                    isBookmarked={post.isBookmarked}
                    isBookmarking={bookmarkMutation.isPending}
                    onBookmarkToggle={() =>
                      bookmarkMutation.mutate({ postId: post.postId, isBookmarked: post.isBookmarked })
                    }
                  />
                  <Link href={`/post/${post.postId}`} className="block">
                    <ContentCardBody
                      title={post.title}
                      description={post.contentPreview}
                      image={
                        post.thumbnailUrl ? (
                          // biome-ignore lint/performance/noImgElement: 외부 이미지 도메인 정책은 이미지 연동 이슈에서 정리한다.
                          <img
                            src={post.thumbnailUrl}
                            alt={`${post.title} 썸네일`}
                            className="aspect-[5/3] w-full rounded-[8px] object-cover"
                          />
                        ) : undefined
                      }
                      imageContainerClassName="rounded-[8px] bg-bg-02"
                    />
                    <ContentCardFooter votes={post.totalVoteCount} comments={post.commentCount} className="mt-4" />
                  </Link>
                </ContentCard>
              </li>
            ))}
          </ul>
          {response.hasNext ? (
            <button
              type="button"
              onClick={() => {
                onLoadMore();
              }}
              disabled={isFetching}
              className="w-full rounded-[12px] bg-bg-02 px-4 py-3 text-caption-sb text-text-03 disabled:opacity-60"
            >
              {isFetchingNextPage ? "불러오는 중..." : "더 보기"}
            </button>
          ) : null}
        </section>
      ) : (
        <section
          className="flex flex-1 items-center justify-center text-caption-m text-text-03"
          aria-label="검색 결과 없음"
        >
          검색 결과가 없습니다.
        </section>
      )}
    </div>
  );
}
