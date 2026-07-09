"use client";

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/model";
import { createDomainQueryKeys, unwrapApiResult } from "@/shared/api";
import { checkNicknameAction, createUserAction } from "./mypage.action";
import {
  deleteUserWithAuth,
  getHoguReportWithAuth,
  getMyBookmarksWithAuth,
  getMyCommentsWithAuth,
  getMyPageWithAuth,
  getMyPostsWithAuth,
  getMyVotesWithAuth,
  updateProfileWithAuth,
} from "./mypage.client-service";
import type {
  CheckNicknameQueryParams,
  CreateUserBody,
  GetMyBookmarksQueryParams,
  GetMyCommentsQueryParams,
  GetMyPostsQueryParams,
  GetMyVotesQueryParams,
  UpdateProfileBody,
} from "./mypage.service";

export const mypageQueryKeys = {
  ...createDomainQueryKeys("users"),
  myPage: () => ["users", "me"] as const,
  hoguReport: () => ["users", "me", "report"] as const,
  myBookmarksRoot: () => ["users", "me", "bookmarks"] as const,
  myCommentsRoot: () => ["users", "me", "comments"] as const,
  myPostsRoot: () => ["users", "me", "posts"] as const,
  myVotesRoot: () => ["users", "me", "votes"] as const,
  myBookmarks: (params: GetMyBookmarksQueryParams = {}) => [...mypageQueryKeys.myBookmarksRoot(), params] as const,
  myComments: (params: GetMyCommentsQueryParams = {}) => [...mypageQueryKeys.myCommentsRoot(), params] as const,
  myPosts: (params: GetMyPostsQueryParams = {}) => [...mypageQueryKeys.myPostsRoot(), params] as const,
  myVotes: (params: GetMyVotesQueryParams = {}) => [...mypageQueryKeys.myVotesRoot(), params] as const,
};

export function useCheckNicknameQuery(params: CheckNicknameQueryParams) {
  return useQuery({
    queryKey: mypageQueryKeys.list(params),
    queryFn: () => checkNicknameAction(params).then(unwrapApiResult),
  });
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ body }: { body: CreateUserBody }) => createUserAction(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mypageQueryKeys.all });
    },
  });
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient();
  const clearAccessToken = useAuthStore((state) => state.clearAccessToken);

  return useMutation({
    mutationFn: deleteUserWithAuth,
    onSuccess: () => {
      clearAccessToken();
      queryClient.clear();
    },
  });
}

export function useGetHoguReportQuery() {
  return useQuery({
    queryKey: mypageQueryKeys.hoguReport(),
    queryFn: getHoguReportWithAuth,
  });
}

export function useGetMyBookmarksQuery(params: GetMyBookmarksQueryParams = {}, enabled = true) {
  const { cursor: _cursor, ...baseParams } = params;

  return useInfiniteQuery({
    queryKey: mypageQueryKeys.myBookmarks(baseParams),
    queryFn: ({ pageParam }) => getMyBookmarksWithAuth({ ...baseParams, cursor: pageParam }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursor : undefined),
    enabled,
  });
}

export function useGetMyCommentsQuery(params: GetMyCommentsQueryParams = {}, enabled = true) {
  const { cursor: _cursor, ...baseParams } = params;

  return useInfiniteQuery({
    queryKey: mypageQueryKeys.myComments(baseParams),
    queryFn: ({ pageParam }) => getMyCommentsWithAuth({ ...baseParams, cursor: pageParam }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursor : undefined),
    enabled,
  });
}

export function useGetMyPageQuery() {
  return useQuery({
    queryKey: mypageQueryKeys.myPage(),
    queryFn: getMyPageWithAuth,
  });
}

export function useGetMyPostsQuery(params: GetMyPostsQueryParams = {}, enabled = true) {
  const { cursor: _cursor, ...baseParams } = params;

  return useInfiniteQuery({
    queryKey: mypageQueryKeys.myPosts(baseParams),
    queryFn: ({ pageParam }) => getMyPostsWithAuth({ ...baseParams, cursor: pageParam }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursor : undefined),
    enabled,
  });
}

export function useGetMyVotesQuery(params: GetMyVotesQueryParams = {}, enabled = true) {
  const { cursor: _cursor, ...baseParams } = params;

  return useInfiniteQuery({
    queryKey: mypageQueryKeys.myVotes(baseParams),
    queryFn: ({ pageParam }) => getMyVotesWithAuth({ ...baseParams, cursor: pageParam }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursor : undefined),
    enabled,
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ body }: { body: UpdateProfileBody }) => updateProfileWithAuth(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mypageQueryKeys.all });
    },
  });
}
