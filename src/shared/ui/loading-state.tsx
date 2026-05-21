import ScalesLoadingIcon from "@/assets/icons/scales-loading.svg";
import { cn } from "@/shared/utils";

type LoadingStateProps = {
  className?: string;
  strokeWidth?: number;
};

export function LoadingState({ className, strokeWidth = 6 }: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-label="로딩 중"
      className={cn(
        "flex min-h-[calc(100dvh-60px)] w-full flex-col items-center justify-center gap-5 bg-bg-01",
        className,
      )}
    >
      <ScalesLoadingIcon aria-hidden={true} className="size-20 shrink-0 text-text-03" strokeWidth={strokeWidth} />
      <p className="text-body-m text-text-03">Loading...</p>
    </div>
  );
}
