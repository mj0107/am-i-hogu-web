import type { ChangeEventHandler, ComponentProps, FocusEventHandler } from "react";
import PaperPlaneRightIcon from "@/assets/icons/paper-plane-right.svg";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { cn } from "@/shared/utils";

export type CommentTextfieldState = "default" | "typing" | "disabled";

export type CommentTextfieldProps = {
  id?: string;
  value?: string;
  defaultValue?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onSubmit?: ComponentProps<"form">["onSubmit"];
  isReply?: boolean;
  state?: CommentTextfieldState;
  name?: string;
  ariaLabel?: string;
  className?: string;
  disabled?: boolean;
  submitDisabled?: boolean;
  isSubmitting?: boolean;
};

export function CommentTextfield(props: CommentTextfieldProps) {
  const {
    id,
    value,
    defaultValue,
    onChange,
    onBlur,
    onSubmit,
    isReply = false,
    state = "default",
    name,
    ariaLabel,
    className,
    disabled = false,
    submitDisabled = false,
    isSubmitting = false,
  } = props;
  const resolvedPlaceholder = isReply ? "내용을 입력해 주세요." : "당신의 의견을 남겨주세요...";
  const resolvedAriaLabel = ariaLabel ?? (isReply ? "답글 입력" : "댓글 입력");
  const isDisabled = disabled || isSubmitting || state === "disabled";
  const isSubmitDisabled = isDisabled || submitDisabled;
  const isReadOnly = value !== undefined && onChange === undefined;

  return (
    <form onSubmit={onSubmit} className={cn("flex w-full items-center gap-2 rounded-[12px]", className)}>
      <div
        data-slot="comment-textfield-surface"
        className={cn(
          "flex h-[44px] flex-1 items-center rounded-common-radius px-3 py-2",
          isReply ? "bg-bg-03" : "bg-bg-02",
        )}
      >
        <Input
          data-slot="comment-textfield-input"
          variant="plain"
          type="text"
          id={id}
          name={name}
          aria-label={resolvedAriaLabel}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onBlur={onBlur}
          readOnly={isReadOnly}
          disabled={isDisabled}
          placeholder={isDisabled ? "의견을 남길 수 없습니다." : resolvedPlaceholder}
          className="text-text-04 placeholder:text-text-03 disabled:placeholder:text-text-02"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="iconSm"
        className={cn(
          "size-10 [--button-radius:var(--radius-common-radius)]",
          isSubmitDisabled ? "bg-bg-03" : "bg-primary-strong hover:bg-primary-strong",
        )}
        aria-label="전송"
        disabled={isSubmitDisabled}
      >
        <PaperPlaneRightIcon
          aria-hidden
          className={cn("size-6", isSubmitDisabled ? "text-text-02" : "text-text-01")}
          strokeWidth={20}
        />
      </Button>
    </form>
  );
}
