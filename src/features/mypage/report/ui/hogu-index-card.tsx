import type { HoguIndexCardProps } from "@/features/mypage/report/model";
import { Tag } from "@/shared/ui";
import { cn } from "@/shared/utils";
import { HoguIndexProgress } from "./hogu-index-progress";

export function HoguIndexCard({ index, variant = "compact", className }: HoguIndexCardProps) {
  const isDetail = variant === "detail";

  return (
    <section
      className={cn(
        "flex flex-col items-center justify-center gap-5 rounded-[32px] bg-bg-02 px-8 py-8 text-center",
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
      <div className="flex flex-col items-center gap-2">
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
