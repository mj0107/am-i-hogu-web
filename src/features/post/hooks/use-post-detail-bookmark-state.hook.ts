"use client";

import { useTogglePostBookmarkMutation } from "@/features/post/api";
import { isApiError } from "@/shared/api";
import type { PostDetailResponse } from "@/shared/api/generated";

type UsePostDetailBookmarkStateParams = {
  postId: string | number;
  post?: PostDetailResponse;
  onAuthRequired: (error: unknown) => boolean;
};

/**
 * 게시글 상세의 북마크 토글 상태와 낙관적 업데이트를 관리하는 훅
 *
 * @description
 * 상세 API의 `isBookmarked` 값을 표시 상태로 사용하고, 토글 요청은 mutation의 낙관적 캐시 업데이트에 위임합니다.
 * 인증 에러는 호출자가 주입한 로그인 이동 핸들러에 위임합니다.
 *
 * @param params.postId - 북마크를 토글할 게시글 ID입니다.
 * @param params.post - 상세 API 응답입니다.
 * @param params.onAuthRequired - 인증 필요 에러 처리 핸들러입니다.
 *
 * @returns isBookmarked - 현재 북마크 표시 여부입니다.
 * @returns isBookmarking - 북마크 토글 요청 진행 여부입니다.
 * @returns handleToggleBookmark - 북마크 토글 핸들러입니다.
 */
export function usePostDetailBookmarkState(params: UsePostDetailBookmarkStateParams) {
  const { postId, post, onAuthRequired } = params;
  const togglePostBookmarkMutation = useTogglePostBookmarkMutation();
  const isBookmarked = post?.isBookmarked ?? false;

  const handleToggleBookmark = async () => {
    const previousBookmarked = isBookmarked;

    try {
      await togglePostBookmarkMutation.mutateAsync({ postId, isBookmarked: previousBookmarked });
    } catch (error) {
      if (!previousBookmarked && isApiError(error) && error.data?.code === "DUPLICATE_REQUEST") {
        return;
      }

      if (!onAuthRequired(error)) {
        throw error;
      }
    }
  };

  return {
    isBookmarked,
    isBookmarking: togglePostBookmarkMutation.isPending,
    handleToggleBookmark,
  };
}
