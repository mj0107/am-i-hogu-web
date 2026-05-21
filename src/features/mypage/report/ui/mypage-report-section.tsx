import Link from "next/link";
import ChartLineIcon from "@/assets/icons/chart-line.svg";
import IdeaIcon from "@/assets/icons/idea.svg";
import type { MypageReportSectionProps } from "@/features/mypage/report/model";

export function MypageReportSection({ categories, stats }: MypageReportSectionProps) {
  return (
    <>
      <section className="space-y-4" aria-labelledby="mypage-category-heading">
        <h2 id="mypage-category-heading" className="inline-flex items-center gap-2 text-caption-m text-primary-strong">
          <ChartLineIcon aria-hidden className="size-5" strokeWidth={20} />
          카테고리별 분석
        </h2>
        <div className="space-y-4 rounded-[16px] bg-bg-02 p-6">
          {categories.length > 0 ? (
            categories.map((category) => (
              <div key={category.id} className="space-y-2">
                <div className="flex items-center justify-between text-small-sb">
                  <span className="text-text-04">{category.label}</span>
                  <span className="text-primary-light">{category.percentage}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-line-02">
                  <div className="h-full rounded-full bg-primary-light" style={{ width: `${category.percentage}%` }} />
                </div>
              </div>
            ))
          ) : (
            <p className="py-2 text-center text-small-m text-text-03">아직 분석할 카테고리가 없어요.</p>
          )}
        </div>
      </section>

      <section
        className="grid grid-cols-3 rounded-[16px] border border-line-01 bg-bg-01 p-5 text-center"
        aria-label="활동 통계"
      >
        <div className="space-y-1">
          <p className="text-small-sb text-text-03">게시글</p>
          <strong className="text-subtitle-b text-text-04">{stats.postCount}</strong>
        </div>
        <div className="space-y-1 border-x border-line-01">
          <p className="text-small-sb text-text-03">호구 맞음</p>
          <strong className="text-subtitle-b text-secondary-strong">{stats.hoguVoteCount}</strong>
        </div>
        <div className="space-y-1">
          <p className="text-small-sb text-text-03">호구 아님</p>
          <strong className="text-subtitle-b text-primary-light">{stats.notHoguVoteCount}</strong>
        </div>
      </section>

      <aside className="rounded-[32px] border border-primary-light bg-primary-default/10 p-6 text-primary-default">
        <Link href="/mypage/history" className="flex items-center gap-4">
          <IdeaIcon aria-hidden className="size-6 shrink-0" strokeWidth={20} />
          <span className="text-caption-m">
            더 자세히 보고싶다면?
            <br />
            <strong className="underline">히스토리</strong>로 바로가기
          </span>
        </Link>
      </aside>
    </>
  );
}
