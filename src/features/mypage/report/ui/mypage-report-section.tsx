import Link from "next/link";
import ChartLineIcon from "@/assets/icons/chart-line.svg";
import IdeaIcon from "@/assets/icons/idea.svg";
import QuestionIcon from "@/assets/icons/question.svg";
import { CATEGORY_ANALYSIS_UNLOCK_POST_COUNT } from "@/features/mypage/report/constants";
import type { MypageReportSectionProps } from "@/features/mypage/report/model";

export function MypageReportSection({ categories, isPendingAggregation = false, stats }: MypageReportSectionProps) {
  const categoryAnalysisProgress = Math.min(
    Math.round((stats.postCount / CATEGORY_ANALYSIS_UNLOCK_POST_COUNT) * 100),
    100,
  );
  const shouldShowCategoryPendingState = isPendingAggregation && categories.length === 0;

  return (
    <>
      <section className="space-y-4" aria-labelledby="mypage-category-heading">
        <h2 id="mypage-category-heading" className="inline-flex items-center gap-2 text-caption-m text-primary-strong">
          <ChartLineIcon aria-hidden className="size-5" strokeWidth={20} />
          카테고리별 호구 분석
          <span className="group relative inline-flex">
            <button
              type="button"
              aria-label="카테고리별 분석 설명"
              className="inline-flex size-5 items-center justify-center rounded-full text-primary-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-default"
            >
              <QuestionIcon aria-hidden className="size-4 text-text-03" strokeWidth={20} />
            </button>
            <span className="pointer-events-none absolute left-1/2 top-7 z-20 hidden w-[200px] -translate-x-1/2 whitespace-normal rounded-[12px] bg-text-04 px-3 py-2 text-left text-small-m text-text-01 shadow-normal group-focus-within:block group-hover:block">
              게시글 수 비중이 아닌 각 카테고리에서 <br />
              호구 맞음으로 집계된 투표 비율입니다.
            </span>
          </span>
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
          ) : shouldShowCategoryPendingState ? (
            <div className="flex flex-col items-center justify-center gap-3">
              <p className="text-center text-caption-m text-text-04">
                게시글과 판결이 충분히 쌓이면
                <br />
                카테고리 분석이 열려요
              </p>
              <div className="flex w-full items-center justify-between text-small-m">
                <span className="text-text-03">현재 {stats.postCount}개</span>
                <strong className="text-small-sb text-secondary-strong">
                  목표 {CATEGORY_ANALYSIS_UNLOCK_POST_COUNT}개
                </strong>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-line-02">
                <div
                  className="h-full rounded-full bg-secondary-default"
                  style={{ width: `${categoryAnalysisProgress}%` }}
                />
              </div>
            </div>
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
