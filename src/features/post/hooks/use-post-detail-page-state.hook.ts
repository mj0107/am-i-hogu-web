"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useDeletePostMutation, usePostDetailQuery, useTogglePostVoteMutation } from "@/features/post/api";
import { POST_CATEGORY_VALUES, toPostCategoryLabel } from "@/features/post/constants";
import { usePostDetailBookmarkState } from "@/features/post/hooks/use-post-detail-bookmark-state.hook";
import { usePostDetailComments } from "@/features/post/hooks/use-post-detail-comments.hook";
import type { PostVoteId } from "@/features/post/model";
import type { PostVoteOption } from "@/features/post/ui";
import { isApiError } from "@/shared/api";
import type { PostDetailResponse } from "@/shared/api/generated";
import { useToastStore } from "@/shared/model";

type UsePostDetailPageStateParams = {
  postId: string;
};

function createVoteOptions(vote: PostDetailResponse["vote"]): PostVoteOption[] {
  const totalVotes = vote.totalVotes || 0;
  const calculatePercent = (count: number) => (totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0);

  return [
    {
      id: "HOGU",
      label: "호구 맞다",
      emoji: "😢",
      percent: calculatePercent(vote.yesVotes),
    },
    {
      id: "NOT_HOGU",
      label: "아니다",
      emoji: "🤔",
      percent: calculatePercent(vote.noVotes),
    },
  ];
}

function getPrimaryCategoryLabel(post: Pick<PostDetailResponse, "categories">) {
  const category = post.categories.find((value) => POST_CATEGORY_VALUES.includes(value)) ?? "ETC";
  return toPostCategoryLabel(category);
}

function getSelectedVoteId(vote?: PostDetailResponse["vote"]) {
  return vote?.myVote === "HOGU" || vote?.myVote === "NOT_HOGU" ? vote.myVote : undefined;
}

/**
 * 게시글 상세 페이지에서 사용하는 조회/액션/파생 상태를 한 곳에 모으는 훅
 *
 * @description
 * route client는 화면 배치에 집중하고, 인증 필요 처리/삭제/투표/북마크/댓글 orchestration은 feature 훅에서 관리합니다.
 * 공개 조회 API도 로그인 문맥에 따라 isMine/isHelpful 값이 달라지므로, 하위 query/service 레이어의 optional auth 흐름을 그대로 사용합니다.
 *
 * @param params.postId - 상세를 조회할 게시글 ID입니다.
 *
 * @returns postDetailQuery - 게시글 상세 조회 쿼리입니다.
 * @returns post - 게시글 상세 응답입니다.
 * @returns categoryLabel - 화면에 표시할 대표 카테고리 라벨입니다.
 * @returns voteOptions - 판결 선택지와 비율입니다.
 * @returns selectedVoteId - 현재 사용자의 판결 선택 값입니다.
 * @returns bookmarkState - 상세 북마크 상태와 토글 핸들러입니다.
 * @returns commentsState - 댓글 목록/정렬/CRUD 핸들러 묶음입니다.
 * @returns isDeletingPost - 게시글 삭제 요청 진행 여부입니다.
 * @returns isVotingPost - 판결 요청 진행 여부입니다.
 * @returns handleDeletePost - 게시글 삭제 핸들러입니다.
 * @returns handleVoteSelect - 판결 선택 핸들러입니다.
 */
export function usePostDetailPageState(params: UsePostDetailPageStateParams) {
  const { postId } = params;
  const router = useRouter();
  const showToast = useToastStore((state) => state.showToast);
  const postDetailQuery = usePostDetailQuery(postId);
  const deletePostMutation = useDeletePostMutation(postId);
  const togglePostVoteMutation = useTogglePostVoteMutation(postId);
  const post = postDetailQuery.data;

  const handleAuthRequiredError = useCallback(
    (error: unknown) => {
      if (isApiError(error) && error.status === 401) {
        router.replace("/login?errorCode=AUTH_REQUIRED");
        return true;
      }

      return false;
    },
    [router],
  );
  const bookmarkState = usePostDetailBookmarkState({
    postId,
    post,
    onAuthRequired: handleAuthRequiredError,
  });
  const commentsState = usePostDetailComments({
    postId,
    onAuthRequired: handleAuthRequiredError,
  });
  const categoryLabel = useMemo(() => (post ? getPrimaryCategoryLabel(post) : ""), [post]);
  const voteOptions = useMemo(() => (post ? createVoteOptions(post.vote) : []), [post]);
  const selectedVoteId = useMemo(() => getSelectedVoteId(post?.vote), [post?.vote]);

  const handleDeletePost = async () => {
    try {
      await deletePostMutation.mutateAsync();
      router.replace("/");
    } catch (error) {
      if (!handleAuthRequiredError(error)) {
        showToast({ message: "게시글 삭제에 실패했습니다.", tone: "warning" });
      }
    }
  };

  const handleVoteSelect = async (nextVote: PostVoteId) => {
    if (!post) {
      return;
    }

    try {
      await togglePostVoteMutation.mutateAsync({
        currentVote: post.vote.myVote,
        nextVote,
      });
    } catch (error) {
      if (isApiError(error) && error.data?.code === "FORBIDDEN_ACCESS") {
        showToast({ message: "내 게시글에는 판결할 수 없습니다.", tone: "warning" });
        return;
      }

      if (!handleAuthRequiredError(error)) {
        showToast({ message: "판결 반영에 실패했습니다.", tone: "warning" });
      }
    }
  };

  return {
    postDetailQuery,
    post,
    categoryLabel,
    voteOptions,
    selectedVoteId,
    bookmarkState,
    commentsState,
    isDeletingPost: deletePostMutation.isPending,
    isVotingPost: togglePostVoteMutation.isPending,
    handleDeletePost,
    handleVoteSelect,
  };
}
