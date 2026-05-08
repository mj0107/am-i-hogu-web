import { useEffect, useState } from "react";

/**
 * 게시글 공유 링크 복사와 토스트 노출 상태를 관리하는 훅
 *
 * @description
 * 게시글 상세 URL을 공유하고, 성공 시 토스트를 일정 시간(2초) 노출합니다.
 * `navigator.share` 사용이 가능하면 공유 시트를 우선 사용하고,
 * 그 외 환경에서는 `navigator.clipboard.writeText`로 링크를 복사합니다.
 *
 * @param params.postId - 공유 링크를 생성할 게시글 ID입니다.
 *
 * @returns isToastVisible - 공유 완료 토스트 표시 여부입니다.
 * @returns handleShare - 링크 공유/복사 실행 핸들러입니다.
 */

type UseSharePostLinkParams = {
  postId: number | string;
};

export function useSharePostLink(params: UseSharePostLinkParams) {
  const { postId } = params;
  const [isToastVisible, setIsToastVisible] = useState(false);

  useEffect(() => {
    if (!isToastVisible) {
      return;
    }

    const timer = window.setTimeout(() => {
      setIsToastVisible(false);
    }, 2000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isToastVisible]);

  const handleShare = async () => {
    // TODO: 서버 배포되면 localhost 하드코딩 제거 후 실제 배포 URL로 교체
    const shareUrl = `http://localhost:3000/post/${postId}`;

    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ url: shareUrl });
        setIsToastVisible(true);
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setIsToastVisible(true);
      }
    } catch {
      // 공유 취소나 권한 오류 등 실패 시에는 조용히 종료
    }
  };

  return {
    isToastVisible,
    handleShare,
  };
}
