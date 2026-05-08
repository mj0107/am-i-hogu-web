"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import SectionPlusIcon from "@/assets/icons/selection-plus.svg";
import { HOME_POSTS_MOCK, type PostCategory } from "@/features/post/model/post.mock";
import { ContentCard, ContentCardBody, ContentCardFooter, ContentCardHeader, EmptyState } from "@/shared/ui";
import { formatRelativeTime } from "@/shared/utils/format";
import { FooterWidget } from "@/widgets/footer/ui";
import type { SubHeadingWidgetProps } from "@/widgets/sub-heading/ui/sub-heading.widget";
import { SubHeadingWidget } from "@/widgets/sub-heading/ui/sub-heading.widget";

type HomeCategory = Extract<NonNullable<SubHeadingWidgetProps["selectedOptions"]>[number], PostCategory>;
type HomeSortValue = NonNullable<SubHeadingWidgetProps["sortValue"]>;

export default function HomePageClient() {
  const [selectedCategories, setSelectedCategories] = useState<HomeCategory[]>([]);
  const [sortValue, setSortValue] = useState<HomeSortValue>("latest");

  const posts = useMemo(() => {
    const filtered =
      selectedCategories.length > 0
        ? HOME_POSTS_MOCK.filter((post) => selectedCategories.includes(post.category))
        : HOME_POSTS_MOCK;

    const sorted = [...filtered];
    sorted.sort((a, b) => {
      if (sortValue === "views") {
        return b.viewCount - a.viewCount;
      }
      if (sortValue === "comments") {
        return b.comments - a.comments;
      }
      if (sortValue === "votes") {
        return b.votes - a.votes;
      }

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return sorted;
  }, [selectedCategories, sortValue]);

  const hasPosts = posts.length > 0;

  return (
    <div className="flex min-h-full flex-col bg-bg-01">
      <main className="flex flex-1 flex-col gap-6 px-common-padding py-6">
        <section className="space-y-5" aria-labelledby="home-judgment-heading">
          <div className="space-y-2">
            <h1 id="home-judgment-heading" className="text-heading-b text-text-04">
              오늘의 <span className="text-secondary-strong">호구</span> 판결
            </h1>
            <p className="text-caption-m text-text-03">익명의 집단지성으로 당신의 선택을 검증하세요.</p>
          </div>
          <SubHeadingWidget
            selectedOptions={selectedCategories}
            sortValue={sortValue}
            totalCount={posts.length}
            onSelectedOptionsChange={setSelectedCategories}
            onSortValueChange={setSortValue}
          />
        </section>

        {hasPosts ? (
          <section className="space-y-3" aria-labelledby="home-posts-heading">
            <h2 id="home-posts-heading" className="sr-only">
              게시글 목록
            </h2>
            <ul className="space-y-9">
              {posts.map((post) => (
                <li key={post.id}>
                  <Link href={`/post/${post.id}`} className="block">
                    <ContentCard>
                      <ContentCardHeader
                        authorName={post.author}
                        category={post.category}
                        meta={formatRelativeTime(post.createdAt)}
                        viewCount={post.viewCount}
                        isBookmarked={post.isBookmarked}
                      />
                      <ContentCardBody
                        title={post.title}
                        description={post.description}
                        image={
                          <div className={`aspect-[5/3] w-full rounded-[8px] bg-gradient-to-br ${post.images[0]}`} />
                        }
                        imageContainerClassName="rounded-[8px] bg-bg-02"
                      />
                      <ContentCardFooter votes={post.votes} comments={post.comments} />
                    </ContentCard>
                  </Link>
                </li>
              ))}
            </ul>
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
      <footer className="sticky bottom-0 z-20 px-common-padding">
        <FooterWidget activeTab="home" />
      </footer>
    </div>
  );
}
