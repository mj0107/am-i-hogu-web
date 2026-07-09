import { type MouseEvent, type PointerEvent, useCallback, useRef } from "react";

/**
 * 가로 스크롤 영역에 마우스 드래그 이동 인터랙션을 제공하는 훅
 *
 * @description
 * 터치 제스처와 충돌을 줄이기 위해 `mouse` 포인터만 처리합니다.
 * 드래그 임계값(4px)을 넘긴 뒤 스크롤을 이동시키며, 드래그 직후 발생하는 의도치 않은 클릭을
 * `guardClickWhenDragged`로 차단할 수 있습니다.
 *
 * @param options.preventDefaultOnPointerDown - pointerdown 시 기본 동작 차단 여부입니다.
 * 기본값은 `true`입니다.
 * @param options.ignorePointerDownSelector - 해당 selector 내부에서 시작한 pointerdown은 드래그 시작으로 처리하지 않습니다.
 *
 * @returns handlePointerDown - 드래그 시작 핸들러입니다.
 * @returns handlePointerMove - 드래그 이동 핸들러입니다.
 * @returns handlePointerUp - 드래그 종료/정리 핸들러입니다.
 * @returns guardClickWhenDragged - 드래그 직후 클릭을 차단하는 가드 함수입니다.
 */

type UseHorizontalDragScrollOptions = {
  preventDefaultOnPointerDown?: boolean;
  ignorePointerDownSelector?: string;
};

export function useHorizontalDragScroll(options?: UseHorizontalDragScrollOptions) {
  const { preventDefaultOnPointerDown = true, ignorePointerDownSelector } = options ?? {};
  const isPointerDownRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const hasPointerCaptureRef = useRef(false);
  const activePointerIdRef = useRef<number | null>(null);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLElement>, element: HTMLElement | null) => {
      if (
        ignorePointerDownSelector &&
        event.target instanceof Element &&
        event.target.closest(ignorePointerDownSelector)
      ) {
        return;
      }

      if (event.pointerType !== "mouse" || !element) {
        return;
      }

      const canSlide = element.scrollWidth > element.clientWidth;
      if (!canSlide) {
        return;
      }

      // 캐러셀처럼 기본 drag/select를 막아야 하는 경우에만 pointerdown 기본 동작을 막는다.
      if (preventDefaultOnPointerDown) {
        event.preventDefault();
      }

      // 드래그 시작 시점의 pointer/좌표/스크롤 위치를 저장
      isPointerDownRef.current = true;
      hasDraggedRef.current = false;
      hasPointerCaptureRef.current = false;
      activePointerIdRef.current = event.pointerId;
      startXRef.current = event.clientX;
      startScrollLeftRef.current = element.scrollLeft;
    },
    [ignorePointerDownSelector, preventDefaultOnPointerDown],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLElement>, element: HTMLElement | null, onAfterScroll?: () => void) => {
      if (!isPointerDownRef.current || activePointerIdRef.current !== event.pointerId || !element) {
        return;
      }

      const canSlide = element.scrollWidth > element.clientWidth;
      if (!canSlide) {
        return;
      }

      const deltaX = event.clientX - startXRef.current;

      // 작은 흔들림은 클릭으로 취급, 임계값(4px) 이상부터 드래그로 전환
      if (Math.abs(deltaX) > 4) {
        hasDraggedRef.current = true;
      }

      if (!hasDraggedRef.current) {
        return;
      }

      if (!hasPointerCaptureRef.current) {
        element.setPointerCapture(event.pointerId);
        hasPointerCaptureRef.current = true;
      }

      event.preventDefault();
      element.scrollLeft = startScrollLeftRef.current - deltaX;
      onAfterScroll?.();
    },
    [],
  );

  const handlePointerUp = useCallback((event?: PointerEvent<HTMLElement>, element?: HTMLElement | null) => {
    if (event && hasPointerCaptureRef.current && element?.hasPointerCapture(event.pointerId)) {
      element.releasePointerCapture(event.pointerId);
    }

    // 드래그 종료 시 추적 상태 초기화
    isPointerDownRef.current = false;
    hasPointerCaptureRef.current = false;
    activePointerIdRef.current = null;
  }, []);

  const guardClickWhenDragged = useCallback(<T extends HTMLElement>(event: MouseEvent<T>) => {
    if (!hasDraggedRef.current) {
      return false;
    }

    // 드래그 직후 발생하는 의도치 않은 클릭 막기
    event.preventDefault();
    event.stopPropagation();
    hasDraggedRef.current = false;
    return true;
  }, []);

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    guardClickWhenDragged,
  };
}
