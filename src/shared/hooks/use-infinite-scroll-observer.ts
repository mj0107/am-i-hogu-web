"use client";

import { useEffect, useRef } from "react";

type UseInfiniteScrollObserverParams = {
  enabled: boolean;
  isFetching?: boolean;
  rootMargin?: string;
  onIntersect?: () => unknown;
};

/**
 * 무한스크롤 sentinel element의 IntersectionObserver 등록을 관리하는 훅
 *
 * @description
 * sentinel element는 layout 높이 변화를 줄이기 위해 항상 렌더링하고,
 * 실제 observer 등록과 다음 페이지 호출 여부만 `enabled`, `isFetching` 값으로 제어합니다.
 *
 * @param params.enabled - 다음 페이지 호출 가능 여부입니다.
 * @param params.isFetching - 다음 페이지 호출 진행 여부입니다.
 * @param params.rootMargin - observer rootMargin 값입니다.
 * @param params.onIntersect - sentinel이 화면 근처에 들어왔을 때 실행할 핸들러입니다.
 *
 * @returns loadMoreRef - sentinel element에 연결할 ref입니다.
 */
export function useInfiniteScrollObserver(params: UseInfiniteScrollObserverParams) {
  const { enabled, isFetching = false, rootMargin = "160px 0px", onIntersect } = params;
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !enabled || isFetching || !onIntersect) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          onIntersect();
        }
      },
      { rootMargin },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [enabled, isFetching, onIntersect, rootMargin]);

  return loadMoreRef;
}
