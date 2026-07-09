import { type ChangeEvent, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  type POST_FILTER_OPTIONS,
  POST_WRITE_IMAGE_ACCEPT,
  POST_WRITE_IMAGE_LIMIT,
  POST_WRITE_IMAGE_MAX_SIZE_BYTES,
  POST_WRITE_IMAGE_SLOT_ITEMS,
  POST_WRITE_IMAGE_SUPPORTED_TYPES,
  POST_WRITE_TITLE_LIMIT,
} from "@/features/post/constants";
import {
  hasPostWriteFormChanged,
  type PostFormInitialValues,
  type PostWriteImageItem,
  type PostWriteSchemaType,
} from "@/features/post/model";
import { postWriteSchema } from "@/features/post/model/post-write.schema";
import { useToastStore } from "@/shared/model";

type CategoryOption = (typeof POST_FILTER_OPTIONS)[number];

type UsePostWriteFormParams = {
  initialValues?: PostFormInitialValues;
};

const createImageItemId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `post-image-${Date.now()}-${Math.random().toString(36).slice(2)}`;

const createInitialImageItems = (images: PostFormInitialValues["images"] = []): PostWriteImageItem[] =>
  images.slice(0, POST_WRITE_IMAGE_LIMIT).map((image, index) => ({
    id: `post-image-existing-${index}`,
    imageUrl: image.imageUrl,
    isThumbnail: image.isThumbnail,
  }));

const createPreviewUrl = (file: File) => URL.createObjectURL(file);

const isSupportedImageFile = (file: File) =>
  POST_WRITE_IMAGE_SUPPORTED_TYPES.includes(file.type as (typeof POST_WRITE_IMAGE_SUPPORTED_TYPES)[number]);

const revokePreviewUrls = (images: PostWriteImageItem[]) => {
  for (const image of images) {
    if (image.file && image.imageUrl) {
      URL.revokeObjectURL(image.imageUrl);
    }
  }
};

const resizeContentTextarea = (element: HTMLTextAreaElement) => {
  element.style.height = "auto";
  element.style.height = `${element.scrollHeight}px`;
};

/**
 * 게시글 작성/수정 폼의 입력값과 화면 동작 핸들러를 관리하는 훅
 *
 * @description
 * 작성 페이지와 수정 페이지가 같은 UI를 쓰도록 제목/본문/카테고리 입력값은 하나의 객체로 관리합니다.
 * 수정 페이지는 `initialValues`로 제목/본문/카테고리/기존 이미지와 썸네일 여부를 주입합니다.
 * 본문 textarea는 초기값이 들어온 edit mode에서도 작성 페이지처럼 내용 높이에 맞춰 자동 확장합니다.
 *
 * @param params.initialValues - 수정 모드에서 주입할 게시글 초기값입니다.
 *
 * @returns title - 제목 입력값입니다.
 * @returns content - 본문 입력값입니다.
 * @returns selectedCategories - 저장된 카테고리 선택값입니다.
 * @returns draftCategories - 바텀시트에서 편집 중인 카테고리 선택값입니다.
 * @returns isCategorySheetOpen - 카테고리 바텀시트 열림 여부입니다.
 * @returns contentTextareaRef - 본문 textarea 높이 계산에 사용하는 ref입니다.
 * @returns titleLength - 제목 글자 수입니다.
 * @returns titleHelperText - 제목 validation helper text입니다.
 * @returns isTitleTooLong - 제목 길이 초과 여부입니다.
 * @returns isFormValid - 제출 가능 여부입니다.
 * @returns isFormChanged - 수정 모드에서 기존 값 대비 변경 여부입니다.
 * @returns openCategorySheet - 카테고리 바텀시트를 여는 핸들러입니다.
 * @returns closeCategorySheet - 카테고리 바텀시트를 닫는 핸들러입니다.
 * @returns toggleDraftCategory - 바텀시트의 임시 카테고리 선택을 토글하는 핸들러입니다.
 * @returns saveCategories - 임시 카테고리 선택값을 저장하는 핸들러입니다.
 * @returns removeSelectedCategory - 저장된 카테고리를 제거하는 핸들러입니다.
 * @returns handleTitleChange - 제목 입력값을 갱신하는 핸들러입니다.
 * @returns handleContentChange - 본문 값과 textarea 높이를 함께 갱신하는 핸들러입니다.
 * @returns imageItems - 작성/수정 payload에 반영할 이미지 목록입니다.
 * @returns carouselImageItems - 이미지 캐러셀에 렌더링할 이미지/빈 슬롯 목록입니다.
 * @returns handleImageSelect - 이미지 파일을 선택하거나 교체하는 핸들러입니다.
 * @returns handleImageRemove - 이미지 목록에서 제거하는 핸들러입니다.
 * @returns handleImagePromote - 대표 이미지로 지정하는 핸들러입니다.
 */
export function usePostWriteForm({ initialValues }: UsePostWriteFormParams) {
  const showToast = useToastStore((state) => state.showToast);
  const [formValues, setFormValues] = useState<PostWriteSchemaType>({
    title: initialValues?.title ?? "",
    content: initialValues?.content ?? "",
    selectedCategories: initialValues?.selectedCategories ?? [],
  });
  const [imageItems, setImageItems] = useState<PostWriteImageItem[]>(() =>
    createInitialImageItems(initialValues?.images),
  );
  const [draftCategories, setDraftCategories] = useState<CategoryOption[]>([]);
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);
  const imageItemsRef = useRef(imageItems);

  const titleLength = formValues.title.length;
  const isTitleTooLong = titleLength > POST_WRITE_TITLE_LIMIT;
  const titleHelperText = isTitleTooLong
    ? `제목은 공백 포함 ${POST_WRITE_TITLE_LIMIT}자 이내로 작성해주세요.`
    : undefined;

  const isFormValid = useMemo(() => postWriteSchema.safeParse(formValues).success, [formValues]);
  const isFormChanged = useMemo(
    () => hasPostWriteFormChanged({ ...formValues, images: imageItems }, initialValues),
    [formValues, imageItems, initialValues],
  );
  const carouselImageItems = useMemo(() => {
    const emptySlotCount = Math.max(POST_WRITE_IMAGE_LIMIT - imageItems.length, 0);
    const emptySlots = POST_WRITE_IMAGE_SLOT_ITEMS.slice(0, emptySlotCount).map((slot, index) => ({
      ...slot,
      id: `empty-${index}-${slot.id}`,
    }));

    return [...imageItems, ...emptySlots];
  }, [imageItems]);

  const updateFormValue = <Key extends keyof PostWriteSchemaType>(name: Key, value: PostWriteSchemaType[Key]) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const openCategorySheet = () => {
    setDraftCategories(formValues.selectedCategories);
    setIsCategorySheetOpen(true);
  };

  const closeCategorySheet = () => {
    setDraftCategories(formValues.selectedCategories);
    setIsCategorySheetOpen(false);
  };

  const toggleDraftCategory = (option: CategoryOption) => {
    setDraftCategories((prev) => (prev.includes(option) ? [] : [option]));
  };

  const saveCategories = () => {
    updateFormValue("selectedCategories", draftCategories);
    setIsCategorySheetOpen(false);
  };

  const removeSelectedCategory = (option: CategoryOption) => {
    updateFormValue(
      "selectedCategories",
      formValues.selectedCategories.filter((category) => category !== option),
    );
    setDraftCategories((prev) => prev.filter((category) => category !== option));
  };

  useLayoutEffect(() => {
    if (!contentTextareaRef.current) {
      return;
    }

    resizeContentTextarea(contentTextareaRef.current);
  }, []);

  useEffect(() => {
    imageItemsRef.current = imageItems;
  }, [imageItems]);

  useEffect(() => {
    return () => {
      revokePreviewUrls(imageItemsRef.current);
    };
  }, []);

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateFormValue("title", event.target.value);
  };

  const handleContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    updateFormValue("content", event.target.value);
    resizeContentTextarea(event.target);
  };

  const validateImageFile = (file: File) => {
    if (file.size > POST_WRITE_IMAGE_MAX_SIZE_BYTES) {
      showToast({ message: "이미지는 5MB 이하로 업로드해주세요.", tone: "warning" });
      return false;
    }

    if (!isSupportedImageFile(file)) {
      showToast({ message: "JPG, PNG, WEBP 이미지만 업로드할 수 있어요.", tone: "warning" });
      return false;
    }

    return true;
  };

  const handleImageSelect = (targetId: string, file: File) => {
    if (!validateImageFile(file)) {
      return;
    }

    setImageItems((prev) => {
      const previewUrl = createPreviewUrl(file);
      const targetIndex = prev.findIndex((image) => image.id === targetId);

      if (targetIndex >= 0) {
        const next = [...prev];
        const previous = next[targetIndex];
        if (previous.file && previous.imageUrl) {
          URL.revokeObjectURL(previous.imageUrl);
        }
        next[targetIndex] = {
          ...previous,
          imageUrl: previewUrl,
          file,
        };

        return next;
      }

      if (prev.length >= POST_WRITE_IMAGE_LIMIT) {
        URL.revokeObjectURL(previewUrl);
        return prev;
      }

      return [
        ...prev,
        {
          id: createImageItemId(),
          imageUrl: previewUrl,
          file,
          isThumbnail: prev.length === 0,
        },
      ];
    });
  };

  const handleImageDrop = (files: File[]) => {
    const remainingCount = POST_WRITE_IMAGE_LIMIT - imageItemsRef.current.length;
    if (remainingCount <= 0) {
      showToast({ message: `이미지는 최대 ${POST_WRITE_IMAGE_LIMIT}장까지 업로드할 수 있어요.`, tone: "warning" });
      return;
    }

    if (files.length > remainingCount) {
      showToast({ message: `이미지는 최대 ${POST_WRITE_IMAGE_LIMIT}장까지 업로드할 수 있어요.`, tone: "warning" });
    }

    const validFiles = files.filter(validateImageFile).slice(0, remainingCount);
    if (validFiles.length === 0) {
      return;
    }

    setImageItems((prev) => {
      const next = [...prev];
      for (const file of validFiles) {
        next.push({
          id: createImageItemId(),
          imageUrl: createPreviewUrl(file),
          file,
          isThumbnail: next.length === 0,
        });
      }

      return next;
    });
  };

  const handleImageRemove = (targetId: string) => {
    setImageItems((prev) => {
      const removedImage = prev.find((image) => image.id === targetId);
      if (removedImage?.file && removedImage.imageUrl) {
        URL.revokeObjectURL(removedImage.imageUrl);
      }

      const next = prev.filter((image) => image.id !== targetId);
      if (next.length === 0 || next.some((image) => image.isThumbnail)) {
        return next;
      }

      const [firstImage, ...restImages] = next;
      return [{ ...firstImage, isThumbnail: true }, ...restImages];
    });
  };

  const handleImagePromote = (targetId: string) => {
    setImageItems((prev) => {
      const targetImage = prev.find((image) => image.id === targetId);
      if (!targetImage?.imageUrl) {
        return prev;
      }

      return [
        { ...targetImage, isThumbnail: true },
        ...prev.filter((image) => image.id !== targetId).map((image) => ({ ...image, isThumbnail: false })),
      ];
    });
  };

  return {
    title: formValues.title,
    content: formValues.content,
    selectedCategories: formValues.selectedCategories,
    draftCategories,
    isCategorySheetOpen,
    contentTextareaRef,
    titleLength,
    titleHelperText,
    isTitleTooLong,
    isFormValid,
    isFormChanged,
    openCategorySheet,
    closeCategorySheet,
    toggleDraftCategory,
    saveCategories,
    removeSelectedCategory,
    handleTitleChange,
    handleContentChange,
    imageItems,
    carouselImageItems: carouselImageItems.map((item) => ({
      ...item,
      accept: POST_WRITE_IMAGE_ACCEPT,
    })),
    handleImageSelect,
    handleImageDrop,
    handleImageRemove,
    handleImagePromote,
  };
}
