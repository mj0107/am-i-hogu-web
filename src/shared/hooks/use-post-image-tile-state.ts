"use client";

import { type ChangeEvent, useEffect, useRef, useState } from "react";

/**
 * PostImageTile의 파일 선택/미리보기/삭제 상태를 관리하는 훅
 *
 * @description
 * 선택한 파일을 Object URL로 미리보기하고, URL 해제(revoke) 수명주기를 관리합니다.
 * 외부 `imageUrl`이 바뀌면 제거 상태를 초기화해 최신 소스를 다시 표시합니다.
 * `onRemove`가 제공되면 삭제 이벤트를 알린 뒤 내부 preview 상태를 정리합니다.
 *
 * @param params.imageUrl - 외부에서 전달되는 이미지 URL입니다.
 * @param params.onImageSelect - 파일 선택 시 호출되는 콜백입니다.
 * @param params.onRemove - 삭제 이벤트를 외부에 알릴 때 사용하는 콜백입니다.
 *
 * @returns inputRef - 파일 input 요소 ref입니다.
 * @returns resolvedImageUrl - 현재 표시할 이미지 URL입니다.
 * @returns handleSelectFile - 파일 선택(change) 핸들러입니다.
 * @returns handleRemove - 이미지 제거 핸들러입니다.
 */

type UsePostImageTileStateParams = {
  imageUrl?: string;
  onImageSelect?: (file: File) => void;
  onRemove?: () => void;
};

export function usePostImageTileState({ imageUrl, onImageSelect, onRemove }: UsePostImageTileStateParams) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const previousSourceRef = useRef<string | undefined>(undefined);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [isRemoved, setIsRemoved] = useState(false);

  const currentSource = imageUrl ?? previewUrl;
  const resolvedImageUrl = isRemoved ? undefined : (imageUrl ?? previewUrl);

  useEffect(() => {
    if (previousSourceRef.current !== currentSource) {
      setIsRemoved(false);
      previousSourceRef.current = currentSource;
    }
  }, [currentSource]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSelectFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    onImageSelect?.(file);

    if (!onImageSelect) {
      const nextPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl((prev) => {
        if (prev) {
          URL.revokeObjectURL(prev);
        }
        return nextPreviewUrl;
      });
    }

    event.target.value = "";
  };

  const handleRemove = () => {
    onRemove?.();

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(undefined);
    }
    setIsRemoved(true);
  };

  return {
    inputRef,
    resolvedImageUrl,
    handleSelectFile,
    handleRemove,
  };
}
