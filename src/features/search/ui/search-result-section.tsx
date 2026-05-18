"use client";

import Link from "next/link";
import { PARAM_TO_CATEGORY } from "@/features/search/model/search.mock";
import type { CategoryLabel, SearchPostsResponse, SortValue } from "@/features/search/model/search.types";
import { ContentCard, ContentCardBody, ContentCardFooter, ContentCardHeader } from "@/shared/ui";
import { formatRelativeTime } from "@/shared/utils/format";
import { SubHeadingWidget } from "@/widgets/sub-heading/ui/sub-heading.widget";

type SearchResultSectionProps = {
  selectedCategories: CategoryLabel[];
  sortValue: SortValue;
  response: SearchPostsResponse;
  onCategoryChange: (nextCategories: CategoryLabel[]) => void;
  onSortChange: (nextSort: SortValue) => void;
  onLoadMore: () => void;
};

export function SearchResultSection(props: SearchResultSectionProps) {
  const { selectedCategories, sortValue, response, onCategoryChange, onSortChange, onLoadMore } = props;

  return (
    <div className="flex flex-1 flex-col gap-5 px-common-padding py-5">
      <section className="flex flex-col gap-3" aria-label="탐색 필터">
        <SubHeadingWidget
          selectedOptions={selectedCategories}
          sortValue={sortValue}
          totalCount={response.totalPostCount}
          onSelectedOptionsChange={onCategoryChange}
          onSortValueChange={onSortChange}
        />
      </section>

      {response.posts.length > 0 ? (
        <section className="flex flex-col gap-3" aria-label="검색 게시글 목록">
          <ul className="flex flex-col gap-4">
            {response.posts.map((post) => (
              <li key={post.postId}>
                <Link href={`/post/${post.postId}`} className="block">
                  <ContentCard>
                    <ContentCardHeader
                      authorName={post.writer.nickname}
                      authorImage={post.writer.profileImageUrl || undefined}
                      category={PARAM_TO_CATEGORY[post.categories]}
                      meta={formatRelativeTime(post.createdAt)}
                      viewCount={post.viewCount}
                      isBookmarked={post.isBookmarked}
                    />
                    <ContentCardBody
                      title={post.title}
                      description={post.contentPreview}
                      image={
                        <div className={`aspect-[5/3] w-full rounded-[8px] bg-gradient-to-br ${post.thumbnailUrl}`} />
                      }
                    />
                    <ContentCardFooter votes={post.totalVoteCount} comments={post.commentCount} />
                  </ContentCard>
                </Link>
              </li>
            ))}
          </ul>
          {response.hasNext && response.nextCursor ? (
            <button
              type="button"
              onClick={onLoadMore}
              className="w-full rounded-[12px] bg-bg-02 px-4 py-3 text-caption-sb text-text-03"
            >
              더 보기
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
