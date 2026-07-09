"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, CommentTextfield } from "@/shared/ui";

export const COMMENT_CONTENT_MAX_LENGTH = 300;

type CommentFormData = {
  content: string;
};

export type PostCommentFormProps = {
  ariaLabel?: string;
  initialContent?: string;
  isReply?: boolean;
  isSubmitting?: boolean;
  submitLabel?: string;
  showActions?: boolean;
  onCancel?: () => void;
  onSubmit: (content: string) => Promise<void>;
};

function isValidCommentContent(content: string) {
  return content.trim().length > 0 && content.trim().length <= COMMENT_CONTENT_MAX_LENGTH;
}

// 댓글 작성, 답글 작성, 댓글 수정을 같은 폼 흐름으로 묶어 입력/검증/submit 상태를 한 곳에서 관리한다.
export function PostCommentForm(props: PostCommentFormProps) {
  const {
    ariaLabel,
    initialContent = "",
    isReply = false,
    isSubmitting = false,
    submitLabel = "저장",
    showActions = false,
    onCancel,
    onSubmit,
  } = props;
  const {
    formState: { isSubmitting: isFormSubmitting },
    control,
    handleSubmit,
    reset,
    watch,
  } = useForm<CommentFormData>({
    defaultValues: {
      content: initialContent,
    },
  });
  const content = watch("content") ?? "";
  const trimmedContent = content.trim();
  const isPending = isSubmitting || isFormSubmitting;
  const isUnchanged = initialContent.trim().length > 0 && trimmedContent === initialContent.trim();
  const isSubmitDisabled = !isValidCommentContent(content) || isUnchanged || isPending;

  useEffect(() => {
    reset({ content: initialContent });
  }, [initialContent, reset]);

  const submit = handleSubmit(async (values) => {
    if (isSubmitDisabled) {
      return;
    }

    await onSubmit(values.content.trim());
    reset({ content: "" });
  });

  return (
    <div className="flex flex-col gap-2">
      <Controller
        name="content"
        control={control}
        render={({ field }) => (
          <CommentTextfield
            name={field.name}
            value={field.value ?? ""}
            onBlur={field.onBlur}
            onChange={field.onChange}
            onSubmit={submit}
            isReply={isReply}
            ariaLabel={ariaLabel}
            submitDisabled={isSubmitDisabled}
            isSubmitting={isPending}
            className={showActions ? "[&_[data-slot='comment-textfield-surface']]:bg-bg-03" : undefined}
          />
        )}
      />
      {showActions ? (
        <div className="flex justify-end gap-2">
          <Button type="button" variant="chip" size="chip" className="bg-transparent text-text-04" onClick={onCancel}>
            취소
          </Button>
          <Button
            type="button"
            variant="primary"
            size="chip"
            className="bg-primary-strong text-text-01 hover:bg-primary-strong disabled:bg-bg-03 disabled:text-text-02"
            disabled={isSubmitDisabled}
            onClick={submit}
          >
            {submitLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
