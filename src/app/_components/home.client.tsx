"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import SectionPlusIcon from "@/assets/icons/selection-plus.svg";
import { usePostListInfiniteQuery, useTogglePostBookmarkMutation } from "@/features/post/api";
import {
  POST_CATEGORY_VALUE_BY_LABEL,
  POST_LIST_PAGE_SIZE,
  POST_SORT_QUERY_BY_VALUE,
  type PostCategoryLabel,
} from "@/features/post/constants";
import { getPrimaryPostCategoryLabel } from "@/features/post/model";
import { useInfiniteScrollObserver } from "@/shared/hooks";
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
import { SubHeadingWidget, type SubHeadingWidgetProps } from "@/widgets/sub-heading/ui/sub-heading.widget";

type HomeCategory = Extract<NonNullable<SubHeadingWidgetProps["selectedOptions"]>[number], PostCategoryLabel>;
type HomeSortValue = NonNullable<SubHeadingWidgetProps["sortValue"]>;

export default function HomePageClient() {
  const [selectedCategories, setSelectedCategories] = useState<HomeCategory[]>([]);
  const [sortValue, setSortValue] = useState<HomeSortValue>("latest");
  const bookmarkMutation = useTogglePostBookmarkMutation();

  // 화면 필터 값을 백엔드 홈 피드 query parameter로 변환한다.
  const selectedCategoryQuery = useMemo(
    () =>
      selectedCategories.length > 0
        ? selectedCategories.map((category) => POST_CATEGORY_VALUE_BY_LABEL[category]).join(",")
        : undefined,
    [selectedCategories],
  );
  const homePostsParams = useMemo(
    () => ({
      categories: selectedCategoryQuery,
      sortBy: POST_SORT_QUERY_BY_VALUE[sortValue],
      pageSize: POST_LIST_PAGE_SIZE,
    }),
    [selectedCategoryQuery, sortValue],
  );

  const homePostsQuery = usePostListInfiniteQuery(homePostsParams);

  // infinite query 응답을 화면에서 바로 순회할 수 있도록 단일 목록으로 평탄화한다.
  const posts = useMemo(() => homePostsQuery.data?.pages.flatMap((page) => page.posts) ?? [], [homePostsQuery.data]);
  const totalCount = homePostsQuery.data?.pages[0]?.totalPostCount ?? posts.length;
  const loadMoreRef = useInfiniteScrollObserver({
    enabled: Boolean(homePostsQuery.hasNextPage),
    isFetching: homePostsQuery.isFetching,
    onIntersect: homePostsQuery.fetchNextPage,
  });

  return (
    <div className="flex min-h-full flex-col bg-bg-01">
      <main className="flex flex-1 flex-col gap-6 px-common-padding pb-28 pt-6">
        <header className="min-w-0 space-y-5">
          <div className="min-w-0 space-y-2">
            <h1 id="home-judgment-heading" className="text-heading-b text-text-04">
              오늘의 <span className="text-secondary-strong">호구</span> 판결
            </h1>
            <p className="text-caption-m text-text-03">익명의 집단지성으로 당신의 선택을 검증하세요.</p>
          </div>
          <SubHeadingWidget
            selectedOptions={selectedCategories}
            sortValue={sortValue}
            totalCount={totalCount}
            onSelectedOptionsChange={setSelectedCategories}
            onSortValueChange={setSortValue}
          />
        </header>

        {homePostsQuery.isPending ? (
          <LoadingState className="min-h-[320px]" />
        ) : homePostsQuery.isError ? (
          <EmptyState
            layout="inline"
            title="게시글 목록을 불러오지 못했어요."
            description="잠시 후 다시 시도해주세요."
            action={
              <Button type="button" onClick={() => homePostsQuery.refetch()} className="mx-auto w-fit">
                다시 불러오기
              </Button>
            }
          />
        ) : posts.length > 0 ? (
          <section className="space-y-3" aria-labelledby="home-posts-heading">
            <h2 id="home-posts-heading" className="sr-only">
              게시글 목록
            </h2>
            <ul className="space-y-9">
              {posts.map((post) => (
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
            <div ref={loadMoreRef} className="flex min-h-8 items-center justify-center py-2">
              {homePostsQuery.isFetchingNextPage ? (
                <span className="text-caption-m text-text-03">게시글을 더 불러오는 중...</span>
              ) : null}
            </div>
          </section>
        ) : (
          <section className="flex flex-1 items-center justify-center" aria-label="게시글 없음">
            <EmptyState
              layout="inline"
              contentClassName="max-w-[335px]"
              icon={<SectionPlusIcon aria-hidden className="size-20 text-text-03" strokeWidth={8} />}
              title={"작성된 게시글이 없습니다.\n게시글을 추가하여 판결을 받아보세요!"}
            />
          </section>
        )}
      </main>
    </div>
  );
}
