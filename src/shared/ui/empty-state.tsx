import type { ReactNode } from "react";
import { cn } from "@/shared/utils";

export type EmptyStateProps = {
  className?: string;
  layout?: "fullscreen" | "inline";
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  titleClassName?: string;
  descriptionClassName?: string;
  contentClassName?: string;
};

export function EmptyState(props: EmptyStateProps) {
  const {
    className,
    layout = "fullscreen",
    icon,
    title,
    description,
    action,
    titleClassName,
    descriptionClassName,
    contentClassName,
  } = props;
  return (
    <figure
      className={cn(
        "flex w-full items-center justify-center px-5 py-12",
        layout === "fullscreen" ? "min-h-[calc(100dvh-60px)]" : "min-h-0",
        className,
      )}
    >
      <div className={cn("flex flex-col items-center gap-4 text-center", contentClassName)}>
        {icon ? <div className="shrink-0">{icon}</div> : null}
        <figcaption className={cn("whitespace-pre-line text-body-m text-text-03", titleClassName)}>{title}</figcaption>
        {description ? (
          <p className={cn("whitespace-pre-line text-caption-m text-text-02", descriptionClassName)}>{description}</p>
        ) : null}
        {action ? <div className="mt-2 w-full">{action}</div> : null}
      </div>
    </figure>
  );
}
