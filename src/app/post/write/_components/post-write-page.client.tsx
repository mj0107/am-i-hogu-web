"use client";

import CaretRightIcon from "@/assets/icons/caret-right.svg";
import IdeaIcon from "@/assets/icons/idea.svg";
import XIcon from "@/assets/icons/x.svg";
import { POST_WRITE_IMAGE_SLOT_ITEMS, POST_WRITE_TITLE_LIMIT } from "@/features/post/constants";
import { usePostWriteForm } from "@/features/post/hooks";
import type { PostFormInitialValues } from "@/features/post/model";
import { PostFilterBottomSheet } from "@/features/post/ui";
import { Button, Chip, PostImageCarousel, Textarea, Textfield } from "@/shared/ui";
import { HeaderWidget } from "@/widgets/header/ui";

type PostWritePageClientProps = {
  mode?: "create" | "edit";
  headerTitle?: string;
  submitLabel?: string;
  submitAriaLabel?: string;
  initialValues?: PostFormInitialValues;
};

export default function PostWritePageClient(props: PostWritePageClientProps) {
  const { mode = "create", initialValues } = props;
  const headerTitle = props.headerTitle ?? (mode === "edit" ? "게시글 수정" : "게시글 작성");
  const submitLabel = props.submitLabel ?? (mode === "edit" ? "수정하기" : "등록하기");
  const submitAriaLabel = props.submitAriaLabel ?? (mode === "edit" ? "게시글 수정" : "게시글 등록");
  const {
    title,
    content,
    selectedCategories,
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
  } = usePostWriteForm({ initialValues });

  const handleSubmit = () => {
    // TODO: API 연동 전까지 UI-only로 유지
    // create: POST /api/posts
    // edit: PATCH /api/posts/{postId}
    // Authorization: Bearer {accessToken}
    // {
    //   "title": "제목입니다",
    //   "categories": ["USED_TRADE", "CONTRACT"],
    //   "content": "본문입니다",
    //   "images": [
    //     { "imageUrl": "https://...", "order": 0, "isThumbnail": false },
    //     { "imageUrl": "https://...", "order": 1, "isThumbnail": false },
    //     { "imageUrl": "https://...", "order": 2, "isThumbnail": false },
    //     { "imageUrl": "https://...", "order": 3, "isThumbnail": true }
    //   ]
    // }
  };

  return (
    <div className="relative flex min-h-full flex-col bg-bg-01">
      <HeaderWidget title={headerTitle} />

      <main className="relative flex-1 overflow-y-auto px-4 pb-28 pt-4">
        <div className="flex flex-col gap-10">
          <section className="rounded-[16px] border border-line-02 px-4 py-5">
            <div className="flex flex-col gap-8">
              <Textfield
                id="post-title"
                name="title"
                title="제목"
                required
                value={title}
                onChange={handleTitleChange}
                placeholder="제목을 입력하세요."
                countText={`${titleLength}/${POST_WRITE_TITLE_LIMIT}`}
                helperText={titleHelperText}
                tone={isTitleTooLong ? "danger" : "default"}
              />

              <section className="flex flex-col gap-3">
                <button
                  type="button"
                  className="flex w-full items-center justify-between text-left"
                  onClick={openCategorySheet}
                  aria-label="카테고리 선택 열기"
                >
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <p className="text-body-m text-text-04">
                      카테고리<span className="text-danger">*</span>
                    </p>
                    <p className="truncate text-caption-m text-text-03">
                      {selectedCategories.length > 0 ? "" : "게시글과 관련된 카테고리를 선택해주세요."}
                    </p>
                  </div>
                  <CaretRightIcon aria-hidden className="size-5 text-text-03" strokeWidth={20} />
                </button>

                {selectedCategories.length > 0 ? (
                  <ul className="flex flex-wrap items-center gap-2">
                    {selectedCategories.map((option) => (
                      <li key={option}>
                        <Chip
                          tone="highlight"
                          size="md"
                          onClick={() => removeSelectedCategory(option)}
                          rightIcon={<XIcon aria-hidden className="size-[14px] text-text-04" strokeWidth={20} />}
                          aria-label={`${option} 카테고리 제거`}
                        >
                          {option}
                        </Chip>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>

              <section className="flex w-full flex-col">
                <header className="mb-2 flex items-center justify-between">
                  <label className="inline-flex items-center text-body-m text-text-04" htmlFor="post-content">
                    <span>본문</span>
                    <span className="text-danger">*</span>
                  </label>
                </header>
                <Textarea
                  id="post-content"
                  name="content"
                  ref={contentTextareaRef}
                  variant="filled"
                  value={content}
                  onChange={handleContentChange}
                  placeholder="내용을 입력하세요."
                  className="min-h-[177px] overflow-hidden"
                />
              </section>

              {/* TODO : API 연동 나중에 해주기...  edit mode의 경우, initialValues로 연결 */}
              <PostImageCarousel items={POST_WRITE_IMAGE_SLOT_ITEMS} />
            </div>
          </section>

          {/* TODO : 추후 변경 필요 */}
          <section className="rounded-[32px] border border-primary-light bg-[rgba(0,44,110,0.1)] p-[25px]">
            <div className="flex items-start gap-4">
              <IdeaIcon aria-hidden className="mt-0.5 size-[22px] text-primary-default" />
              <div className="space-y-1">
                <p className="text-caption-m font-bold text-primary-default">판결 Tip!</p>
                <p className="text-small-m text-primary-default">
                  구체적인 금액과 정황을 적을수록
                  <br />
                  보다 정확한 '호구 판결'을 받을 수 있습니다.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <div className="sticky bottom-0 left-0 w-full bg-bg-01 px-4 pb-6 pt-3">
        <Button
          fullWidth
          variant={isFormValid ? "primary" : "disabled"}
          disabled={!isFormValid}
          aria-label={submitAriaLabel}
          onClick={handleSubmit}
        >
          {submitLabel}
        </Button>
      </div>

      {isCategorySheetOpen ? (
        <div className="fixed inset-0 z-20 flex items-end justify-center bg-[rgba(0,0,0,0.4)]">
          <div className="w-full max-w-common-width">
            <PostFilterBottomSheet
              className="mx-auto w-full"
              title="카테고리 선택"
              selectedOptions={draftCategories}
              onToggleOption={toggleDraftCategory}
              onSave={saveCategories}
              onClose={closeCategorySheet}
              saveText="저장하기"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
