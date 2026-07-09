"use client";

import { type DragEvent, useRef, useState } from "react";

type UseFileDropZoneParams = {
  disabled?: boolean;
  onFilesDrop: (files: File[]) => void;
};

const hasFilePayload = (event: DragEvent<HTMLElement>) => Array.from(event.dataTransfer.types).includes("Files");

/**
 * 파일 드래그 앤 드롭 영역의 hover 상태와 drop 이벤트를 관리하는 훅
 *
 * @description
 * dragenter/dragleave는 자식 요소를 오갈 때도 반복 발생하므로 depth를 추적해 실제 영역 이탈 시점에만
 * 드래그 상태를 해제합니다. 파일 payload가 아닌 드래그 이벤트는 무시해 일반 텍스트/링크 드래그와 충돌을 줄입니다.
 *
 * @param params.disabled - 드롭존 비활성화 여부입니다.
 * @param params.onFilesDrop - 드롭된 파일 목록을 전달받는 콜백입니다.
 *
 * @returns isDraggingFile - 파일이 드롭존 위에 올라와 있는지 여부입니다.
 * @returns dropZoneProps - 드롭존 요소에 spread할 drag 이벤트 핸들러 묶음입니다.
 */

export function useFileDropZone({ disabled = false, onFilesDrop }: UseFileDropZoneParams) {
  const dragDepthRef = useRef(0);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  const resetDragging = () => {
    dragDepthRef.current = 0;
    setIsDraggingFile(false);
  };

  const handleDragEnter = (event: DragEvent<HTMLElement>) => {
    if (disabled || !hasFilePayload(event)) {
      return;
    }

    event.preventDefault();
    dragDepthRef.current += 1;
    setIsDraggingFile(true);
  };

  const handleDragOver = (event: DragEvent<HTMLElement>) => {
    if (disabled || !hasFilePayload(event)) {
      return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  };

  const handleDragLeave = (event: DragEvent<HTMLElement>) => {
    if (disabled || !hasFilePayload(event)) {
      return;
    }

    event.preventDefault();
    dragDepthRef.current = Math.max(dragDepthRef.current - 1, 0);
    if (dragDepthRef.current === 0) {
      setIsDraggingFile(false);
    }
  };

  const handleDrop = (event: DragEvent<HTMLElement>) => {
    if (disabled || !hasFilePayload(event)) {
      return;
    }

    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    resetDragging();

    if (files.length > 0) {
      onFilesDrop(files);
    }
  };

  return {
    isDraggingFile,
    dropZoneProps: {
      onDragEnter: handleDragEnter,
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
    },
  };
}
