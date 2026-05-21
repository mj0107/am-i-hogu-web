import type { MouseEventHandler, ReactNode } from "react";
import { Avatar, type AvatarProps } from "@/shared/ui/avatar";
import { cn } from "@/shared/utils";

export type EditableAvatarProps = Omit<AvatarProps, "className"> & {
  actionLabel: ReactNode;
  actionIcon?: ReactNode;
  onActionClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  avatarClassName?: string;
  actionButtonClassName?: string;
  actionOffset?: number;
};

export function EditableAvatar(props: EditableAvatarProps) {
  const {
    actionLabel,
    actionIcon,
    onActionClick,
    className,
    avatarClassName,
    actionButtonClassName,
    actionOffset = 16,
    size = 120,
    ...avatarProps
  } = props;

  return (
    <div className={cn("relative", className)} style={{ width: size, minHeight: size + actionOffset }}>
      <Avatar {...avatarProps} size={size} className={avatarClassName} />
      <button
        type="button"
        onClick={onActionClick}
        className={cn(
          "absolute bottom-0 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-bg-01 px-2 py-1 text-caption-m text-text-04 shadow-normal",
          actionButtonClassName,
        )}
      >
        {actionIcon ? <span className="shrink-0">{actionIcon}</span> : null}
        {actionLabel}
      </button>
    </div>
  );
}
