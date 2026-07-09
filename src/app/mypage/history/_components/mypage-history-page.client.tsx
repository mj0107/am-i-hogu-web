"use client";

import { type InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  mypageQueryKeys,
  useGetMyBookmarksQuery,
  useGetMyCommentsQuery,
  useGetMyPageQuery,
  useGetMyPostsQuery,
  useGetMyVotesQuery,
} from "@/features/mypage/api";
import { MYPAGE_HISTORY_TABS } from "@/features/mypage/history/constants";
import type { MypageHistoryItem, MypageHistoryTab } from "@/features/mypage/history/model";
import { MypageHistorySection } from "@/features/mypage/history/ui";
import {
  toBookmarkHistoryItem,
  toCommentHistoryItem,
  toPostHistoryItem,
  toVoteHistoryItem,
} from "@/features/mypage/history/utils";
import { toMypageProfile } from "@/features/mypage/profile/model";
import { MypageProfileSummary } from "@/features/mypage/profile/ui";
import { deleteBookmarkWithAuth } from "@/features/post/api";
import type { MyBookmarkListResponse } from "@/shared/api/generated";
import { Button, EmptyState, LoadingState } from "@/shared/ui";
import { cn } from "@/shared/utils";

const HISTORY_QUERY_PARAMS = {};
type MyBookmarksInfiniteData = InfiniteData<MyBookmarkListResponse, string | null>;

export default function MypageHistoryPageClient() {
  const [selectedTab, setSelectedTab] = useState<MypageHistoryTab>("posts");
  const queryClient = useQueryClient();
  const mypageQuery = useGetMyPageQuery();
  const postsQuery = useGetMyPostsQuery(HISTORY_QUERY_PARAMS, selectedTab === "posts");
  const commentsQuery = useGetMyCommentsQuery(HISTORY_QUERY_PARAMS, selectedTab === "comments");
  const bookmarksQuery = useGetMyBookmarksQuery(HISTORY_QUERY_PARAMS, selectedTab === "bookmarks");
  const votesQuery = useGetMyVotesQuery(HISTORY_QUERY_PARAMS, selectedTab === "votes");
  const bookmarksQueryKey = mypageQueryKeys.myBookmarks(HISTORY_QUERY_PARAMS);
  const deleteBookmarkMutation = useMutation({
    mutationFn: deleteBookmarkWithAuth,
    onMutate: async ({ postId }) => {
      await queryClient.cancelQueries({ queryKey: bookmarksQueryKey });
      const previousBookmarks = queryClient.getQueryData<MyBookmarksInfiniteData>(bookmarksQueryKey);

      queryClient.setQueryData<MyBookmarksInfiniteData>(bookmarksQueryKey, (current) =>
        current
          ? {
              ...current,
              pages: current.pages.map((page) => ({
                ...page,
                posts: page.posts.filter((post) => String(post.postId) !== String(postId)),
              })),
            }
          : current,
      );

      return { previousBookmarks };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousBookmarks) {
        queryClient.setQueryData(bookmarksQueryKey, context.previousBookmarks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: bookmarksQueryKey });
    },
  });

  const activeQuery = {
    posts: postsQuery,
    comments: commentsQuery,
    bookmarks: bookmarksQuery,
    votes: votesQuery,
  }[selectedTab];

  const items = useMemo<MypageHistoryItem[]>(() => {
    if (selectedTab === "comments") {
      return commentsQuery.data?.pages.flatMap((page) => page.comments.map(toCommentHistoryItem)) ?? [];
    }
    if (selectedTab === "bookmarks") {
      return bookmarksQuery.data?.pages.flatMap((page) => page.posts.map(toBookmarkHistoryItem)) ?? [];
    }
    if (selectedTab === "votes") {
      return votesQuery.data?.pages.flatMap((page) => page.votes.map(toVoteHistoryItem)) ?? [];
    }

    return postsQuery.data?.pages.flatMap((page) => page.posts.map(toPostHistoryItem)) ?? [];
  }, [bookmarksQuery.data, commentsQuery.data, postsQuery.data, selectedTab, votesQuery.data]);

  if (mypageQuery.isPending) {
    return (
      <div data-app-shell-bottom-nav="hidden" className="flex min-h-full flex-col bg-bg-01">
        <main className="flex min-w-0 flex-1 flex-col justify-center overflow-x-hidden px-common-padding py-6">
          <LoadingState className="min-h-[320px]" />
        </main>
      </div>
    );
  }

  if (mypageQuery.error || !mypageQuery.data) {
    return (
      <div className="flex min-h-full flex-col bg-bg-01">
        <main className="flex min-w-0 flex-1 flex-col justify-center overflow-x-hidden px-common-padding pb-28 pt-6">
          <EmptyState
            title="히스토리 정보를 불러오지 못했어요."
            description="잠시 후 다시 시도해주세요."
            action={
              <Button type="button" onClick={() => mypageQuery.refetch()} className="mx-auto w-fit">
                다시 불러오기
              </Button>
            }
          />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col bg-bg-01">
      <main className="flex min-w-0 flex-1 flex-col gap-6 overflow-x-hidden px-common-padding pb-28 pt-10">
        <MypageProfileSummary profile={toMypageProfile(mypageQuery.data)} />
        <section className="min-w-0 space-y-6" aria-labelledby="mypage-history-tabs-heading">
          <h1 id="mypage-history-tabs-heading" className="sr-only">
            히스토리
          </h1>
          <div className="grid min-w-0 grid-cols-4 border-b border-line-02" role="tablist" aria-label="히스토리 필터">
            {MYPAGE_HISTORY_TABS.map((tab) => {
              const isSelected = selectedTab === tab.value;

              return (
                <button
                  key={tab.value}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  className={cn(
                    "min-w-0 break-words border-b-2 pb-3 text-center text-body-m",
                    isSelected ? "border-primary-strong text-primary-strong" : "border-transparent text-text-02",
                  )}
                  onClick={() => setSelectedTab(tab.value)}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
          {activeQuery.isPending ? (
            <LoadingState className="min-h-[240px]" />
          ) : activeQuery.error ? (
            <EmptyState
              layout="inline"
              title="히스토리 목록을 불러오지 못했어요."
              description="잠시 후 다시 시도해주세요."
              action={
                <Button type="button" onClick={() => activeQuery.refetch()} className="mx-auto w-fit">
                  다시 불러오기
                </Button>
              }
            />
          ) : (
            <MypageHistorySection
              activeTab={selectedTab}
              items={items}
              onBookmarkRemove={(postId) => deleteBookmarkMutation.mutate({ postId })}
              hasNextPage={activeQuery.hasNextPage}
              isFetching={activeQuery.isFetching}
              isFetchingNextPage={activeQuery.isFetchingNextPage}
              onLoadMore={() => {
                activeQuery.fetchNextPage();
              }}
            />
          )}
        </section>
      </main>
    </div>
  );
}
