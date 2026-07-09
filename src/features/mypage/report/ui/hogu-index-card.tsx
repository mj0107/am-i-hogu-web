import QuestionIcon from "@/assets/icons/question.svg";
import type { HoguIndexCardProps } from "@/features/mypage/report/model";
import { Tag } from "@/shared/ui";
import { cn } from "@/shared/utils";
import { HoguIndexProgress } from "./hogu-index-progress";

export function HoguIndexCard({ index, variant = "compact", className }: HoguIndexCardProps) {
  const isDetail = variant === "detail";

  if (index.isPendingAggregation) {
    return (
      <section
        className={cn(
          "flex min-h-[168px] min-w-0 flex-col items-center justify-center gap-3 rounded-[32px] bg-bg-02 px-[clamp(12px,10vw,48px)] py-8 text-center",
          className,
        )}
        aria-label="호구 레벨 집계 대기"
      >
        <QuestionIcon aria-hidden className="size-12 text-text-02" strokeWidth={15} />
        <p className="text-caption-m text-text-02">아직 레벨을 집계할 수 없어요.</p>
      </section>
    );
  }

  return (
    <section
      className={cn(
        "flex min-w-0 flex-col items-center justify-center gap-5 rounded-[32px] bg-bg-02 px-[clamp(12px,7vw,32px)] py-8 text-center",
        className,
      )}
      aria-labelledby="hogu-index-heading"
    >
      <HoguIndexProgress value={index.score} strokeWidth={8} progressClassName="text-secondary-default">
        <span className="sr-only">호구 지수 {index.score}퍼센트</span>
        <strong className="text-title1-b">{index.score}%</strong>
        <span
          className={cn("font-bold text-secondary-strong", isDetail ? "text-[8px] tracking-[1px]" : "text-small-sb")}
        >
          {isDetail ? "HOGU INDEX" : index.label}
        </span>
      </HoguIndexProgress>
      <div className="flex min-w-0 flex-col items-center gap-2">
        <h2 id="hogu-index-heading">
          <Tag tone="secondary" size="lg">
            {isDetail ? index.label : index.summary}
          </Tag>
        </h2>
        {isDetail && index.description ? (
          <p className="max-w-[250px] text-small-m text-text-03">{index.description}</p>
        ) : null}
      </div>
    </section>
  );
}
