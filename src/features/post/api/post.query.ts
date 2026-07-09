"use client";

import {
  type InfiniteData,
  type QueryClient,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { mypageQueryKeys } from "@/features/mypage/api";
import { isApiError } from "@/shared/api";
import type {
  CommentItemResponse,
  HomePostListResponse,
  MyBookmarkListResponse,
  PostCreateRequest,
  PostDetailResponse,
  PostUpdateRequest,
  PostVoteResponse,
} from "@/shared/api/generated";
import type { CommentId, PostId, PostVoteId } from "../model/post.types";
import {
  cancelPostVoteWithAuth,
  createBookmarkWithAuth,
  createCommentHelpfulWithAuth,
  createCommentWithAuth,
  createPostWithAuth,
  deleteBookmarkWithAuth,
  deleteCommentHelpfulWithAuth,
  deleteCommentWithAuth,
  deletePostWithAuth,
  getCommentsWithOptionalAuth,
  getHomePostsWithOptionalAuth,
  getPostDetailWithOptionalAuth,
  updateCommentWithAuth,
  updatePostVoteWithAuth,
  updatePostWithAuth,
} from "./post.client-service";
import { postQueryKeys } from "./post.keys";
import type { GetCommentsParams, GetHomePostsParams } from "./post.service";
import { isValidPostId } from "./post.service";

type PostListInfiniteData = InfiniteData<HomePostListResponse>;
type MyBookmarkListInfiniteData = InfiniteData<MyBookmarkListResponse>;

function updatePostListBookmarkState(data: PostListInfiniteData | undefined, postId: PostId, isBookmarked: boolean) {
  return data
    ? {
        ...data,
        pages: data.pages.map((page) => ({
          ...page,
          posts: page.posts.map((post) => (String(post.postId) === String(postId) ? { ...post, isBookmarked } : post)),
        })),
      }
    : data;
}

function setPostListBookmarkState(queryClient: QueryClient, postId: PostId, isBookmarked: boolean) {
  queryClient.setQueriesData<PostListInfiniteData>({ queryKey: postQueryKeys.lists() }, (old) =>
    updatePostListBookmarkState(old, postId, isBookmarked),
  );
}

function setPostDetailBookmarkState(queryClient: QueryClient, postId: PostId, isBookmarked: boolean) {
  queryClient.setQueryData<PostDetailResponse>(postQueryKeys.detail(postId), (old) =>
    old ? { ...old, isBookmarked } : old,
  );
}

function removePostFromMypageBookmarkLists(queryClient: QueryClient, postId: PostId) {
  queryClient.setQueriesData<MyBookmarkListInfiniteData>({ queryKey: mypageQueryKeys.myBookmarksRoot() }, (old) =>
    old
      ? {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            posts: page.posts.filter((post) => String(post.postId) !== String(postId)),
          })),
        }
      : old,
  );
}

function invalidateMypageBookmarkQueries(queryClient: QueryClient) {
  // 북마크 토글은 마이페이지 히스토리의 북마크 탭과 연결되므로 post 캐시와 별도로 stale 처리한다.
  queryClient.invalidateQueries({ queryKey: mypageQueryKeys.myBookmarksRoot() });
}

function invalidateMypagePostContentQueries(queryClient: QueryClient) {
  // 게시글 작성/수정/삭제는 마이페이지 히스토리와 호구 리포트 집계에 반영되어야 한다.
  queryClient.invalidateQueries({ queryKey: mypageQueryKeys.hoguReport() });
  queryClient.invalidateQueries({ queryKey: mypageQueryKeys.myPostsRoot() });
  queryClient.invalidateQueries({ queryKey: mypageQueryKeys.myBookmarksRoot() });
  queryClient.invalidateQueries({ queryKey: mypageQueryKeys.myCommentsRoot() });
  queryClient.invalidateQueries({ queryKey: mypageQueryKeys.myVotesRoot() });
}

function setPostListVoteCount(queryClient: QueryClient, postId: PostId, totalVoteCount: number) {
  queryClient.setQueriesData<PostListInfiniteData>({ queryKey: postQueryKeys.lists() }, (old) =>
    old
      ? {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            posts: page.posts.map((post) =>
              String(post.postId) === String(postId) ? { ...post, totalVoteCount } : post,
            ),
          })),
        }
      : old,
  );
}

function setPostDetailVote(queryClient: QueryClient, postId: PostId, vote: PostVoteResponse) {
  queryClient.setQueryData<PostDetailResponse>(postQueryKeys.detail(postId), (old) => (old ? { ...old, vote } : old));
}

function invalidateMypageVoteRelatedQueries(queryClient: QueryClient) {
  // 게시글 투표는 마이페이지의 호구 지수/히스토리 판결 표시에도 영향을 주므로 관련 캐시만 stale 처리한다.
  queryClient.invalidateQueries({ queryKey: mypageQueryKeys.myPage() });
  queryClient.invalidateQueries({ queryKey: mypageQueryKeys.hoguReport() });
  queryClient.invalidateQueries({ queryKey: mypageQueryKeys.myPostsRoot() });
  queryClient.invalidateQueries({ queryKey: mypageQueryKeys.myBookmarksRoot() });
  queryClient.invalidateQueries({ queryKey: mypageQueryKeys.myVotesRoot() });
}

type TogglePostBookmarkVariables = {
  postId: PostId;
  isBookmarked: boolean;
};

type TogglePostVoteVariables = {
  currentVote: "HOGU" | "NOT_HOGU" | "NONE";
  nextVote: PostVoteId;
};

export function usePostListInfiniteQuery(params: Omit<GetHomePostsParams, "cursor"> = {}) {
  // 게시글 목록 무한 스크롤 쿼리: cursor는 query 내부 pageParam으로만 관리한다.
  return useInfiniteQuery({
    queryKey: postQueryKeys.list(params),
    queryFn: ({ pageParam }) =>
      getHomePostsWithOptionalAuth({
        ...params,
        cursor: pageParam,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursor : undefined),
  });
}

export function usePostDetailQuery(postId: PostId) {
  return useQuery({
    queryKey: postQueryKeys.detail(postId),
    queryFn: () => getPostDetailWithOptionalAuth(postId),
    enabled: isValidPostId(postId),
  });
}

export function useCommentsQuery(postId: PostId, params: GetCommentsParams = {}) {
  return useQuery({
    queryKey: postQueryKeys.comments(postId, params),
    queryFn: () => getCommentsWithOptionalAuth(postId, params),
    enabled: isValidPostId(postId),
  });
}

export function useCommentsInfiniteQuery(postId: PostId, params: Omit<GetCommentsParams, "cursor"> = {}) {
  return useInfiniteQuery({
    queryKey: postQueryKeys.commentsInfinite(postId, params),
    queryFn: ({ pageParam }) =>
      getCommentsWithOptionalAuth(postId, {
        ...params,
        cursor: pageParam,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursor : undefined),
    enabled: isValidPostId(postId),
  });
}

export function useDeletePostMutation(postId: PostId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deletePostWithAuth({ postId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postQueryKeys.all });
      invalidateMypagePostContentQueries(queryClient);
    },
  });
}

export function useCreatePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: PostCreateRequest) => createPostWithAuth(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postQueryKeys.lists() });
      invalidateMypagePostContentQueries(queryClient);
    },
  });
}

export function useUpdatePostMutation(postId?: PostId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: PostUpdateRequest) => {
      if (!postId || !isValidPostId(postId)) {
        throw new Error("수정할 게시글 정보를 찾을 수 없습니다.");
      }

      return updatePostWithAuth({ postId }, request);
    },
    onSuccess: () => {
      if (postId) {
        queryClient.invalidateQueries({ queryKey: postQueryKeys.detail(postId) });
      }
      queryClient.invalidateQueries({ queryKey: postQueryKeys.lists() });
      invalidateMypagePostContentQueries(queryClient);
    },
  });
}

export function useTogglePostBookmarkMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, isBookmarked }: TogglePostBookmarkVariables) =>
      isBookmarked ? deleteBookmarkWithAuth({ postId }) : createBookmarkWithAuth({ postId }),
    onMutate: async ({ postId, isBookmarked }) => {
      await queryClient.cancelQueries({ queryKey: postQueryKeys.lists() });
      await queryClient.cancelQueries({ queryKey: mypageQueryKeys.myBookmarksRoot() });
      const previousPostLists = queryClient.getQueriesData<PostListInfiniteData>({
        queryKey: postQueryKeys.lists(),
      });
      const previousMypageBookmarks = queryClient.getQueriesData<MyBookmarkListInfiniteData>({
        queryKey: mypageQueryKeys.myBookmarksRoot(),
      });

      // 낙관적 업데이트: 현재 로드된 게시글 목록 캐시의 북마크 상태를 즉시 반전한다.
      setPostListBookmarkState(queryClient, postId, !isBookmarked);
      setPostDetailBookmarkState(queryClient, postId, !isBookmarked);
      if (isBookmarked) {
        removePostFromMypageBookmarkLists(queryClient, postId);
      }

      return { previousMypageBookmarks, previousPostLists };
    },
    onSuccess: (result, { postId }) => {
      // 서버 응답을 한 번 더 반영해 중복 클릭/동시 요청으로 인한 표시 오차를 줄인다.
      setPostListBookmarkState(queryClient, postId, result.isBookmarked);
      setPostDetailBookmarkState(queryClient, postId, result.isBookmarked);
    },
    onError: (error, variables, context) => {
      if (!variables.isBookmarked && isApiError(error) && error.data?.code === "DUPLICATE_REQUEST") {
        // 이미 서버에 북마크가 있는 상태라면 실패로 롤백하지 않고 서버 상태에 맞춰 true로 고정한다.
        setPostListBookmarkState(queryClient, variables.postId, true);
        setPostDetailBookmarkState(queryClient, variables.postId, true);
        return;
      }

      context?.previousPostLists.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      setPostDetailBookmarkState(queryClient, variables.postId, variables.isBookmarked);
      context?.previousMypageBookmarks.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSettled: (_result, _error, { postId }) => {
      // 목록은 낙관적 업데이트/서버 응답으로 즉시 맞추고, 상세는 별도 캐시라 최신 상태만 다시 확인한다.
      queryClient.invalidateQueries({ queryKey: postQueryKeys.detail(postId) });
      invalidateMypageBookmarkQueries(queryClient);
    },
  });
}

export function useTogglePostVoteMutation(postId: PostId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ currentVote, nextVote }: TogglePostVoteVariables) =>
      currentVote === nextVote
        ? cancelPostVoteWithAuth({ postId })
        : updatePostVoteWithAuth({ postId }, { myVote: nextVote }),
    onSuccess: (vote) => {
      setPostDetailVote(queryClient, postId, vote);
      setPostListVoteCount(queryClient, postId, vote.totalVotes);
      invalidateMypageVoteRelatedQueries(queryClient);
    },
  });
}

export function useCreateCommentMutation(postId: PostId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ parentId, content }: { parentId: CommentId | null; content: string }) =>
      createCommentWithAuth({ postId }, { parentId, content }),
    onSuccess: () => {
      // 댓글 목록은 정렬/커서 페이지가 여러 개라 직접 끼워 넣기보다 루트 단위로 다시 읽어 일관성을 맞춘다.
      queryClient.invalidateQueries({ queryKey: postQueryKeys.commentsRoot(postId) });
      queryClient.invalidateQueries({ queryKey: postQueryKeys.detail(postId) });
    },
  });
}

export function useUpdateCommentMutation(postId: PostId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: CommentId; content: string }) =>
      updateCommentWithAuth({ postId, commentId }, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postQueryKeys.commentsRoot(postId) });
    },
  });
}

export function useDeleteCommentMutation(postId: PostId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: CommentId) => deleteCommentWithAuth({ postId, commentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postQueryKeys.commentsRoot(postId) });
      queryClient.invalidateQueries({ queryKey: postQueryKeys.detail(postId) });
    },
  });
}

export function useToggleCommentHelpfulMutation(postId: PostId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (comment: Pick<CommentItemResponse, "commentId" | "isHelpful">) =>
      comment.isHelpful
        ? deleteCommentHelpfulWithAuth({ postId, commentId: comment.commentId })
        : createCommentHelpfulWithAuth({ postId, commentId: comment.commentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postQueryKeys.commentsRoot(postId) });
    },
  });
}
