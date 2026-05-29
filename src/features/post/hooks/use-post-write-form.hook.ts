import { type ChangeEvent, useLayoutEffect, useMemo, useRef, useState } from "react";
import { type POST_FILTER_OPTIONS, POST_WRITE_TITLE_LIMIT } from "@/features/post/constants";
import type { PostFormInitialValues, PostWriteSchemaType } from "@/features/post/model";
import { postWriteSchema } from "@/features/post/model/post-write.schema";

type CategoryOption = (typeof POST_FILTER_OPTIONS)[number];

type UsePostWriteFormParams = {
  initialValues?: PostFormInitialValues;
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
 * 수정 페이지는 `initialValues`로 제목/본문/카테고리만 주입하고, 이미지는 API 연동 시 별도로 연결합니다.
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
 * @returns openCategorySheet - 카테고리 바텀시트를 여는 핸들러입니다.
 * @returns closeCategorySheet - 카테고리 바텀시트를 닫는 핸들러입니다.
 * @returns toggleDraftCategory - 바텀시트의 임시 카테고리 선택을 토글하는 핸들러입니다.
 * @returns saveCategories - 임시 카테고리 선택값을 저장하는 핸들러입니다.
 * @returns removeSelectedCategory - 저장된 카테고리를 제거하는 핸들러입니다.
 * @returns handleTitleChange - 제목 입력값을 갱신하는 핸들러입니다.
 * @returns handleContentChange - 본문 값과 textarea 높이를 함께 갱신하는 핸들러입니다.
 */
export function usePostWriteForm({ initialValues }: UsePostWriteFormParams) {
  const [formValues, setFormValues] = useState<PostWriteSchemaType>({
    title: initialValues?.title ?? "",
    content: initialValues?.content ?? "",
    selectedCategories: initialValues?.selectedCategories ?? [],
  });
  const [draftCategories, setDraftCategories] = useState<CategoryOption[]>([]);
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  const titleLength = formValues.title.length;
  const isTitleTooLong = titleLength > POST_WRITE_TITLE_LIMIT;
  const titleHelperText = isTitleTooLong
    ? `제목은 공백 포함 ${POST_WRITE_TITLE_LIMIT}자 이내로 작성해주세요.`
    : undefined;

  const isFormValid = useMemo(() => postWriteSchema.safeParse(formValues).success, [formValues]);

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

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateFormValue("title", event.target.value);
  };

  const handleContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    updateFormValue("content", event.target.value);
    resizeContentTextarea(event.target);
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
    openCategorySheet,
    closeCategorySheet,
    toggleDraftCategory,
    saveCategories,
    removeSelectedCategory,
    handleTitleChange,
    handleContentChange,
  };
}
