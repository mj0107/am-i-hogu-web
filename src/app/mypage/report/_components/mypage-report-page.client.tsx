"use client";

import { useGetHoguReportQuery } from "@/features/mypage/api";
import { toMypageProfile } from "@/features/mypage/profile/model";
import { MypageProfileSummary } from "@/features/mypage/profile/ui";
import { HoguIndexCard, MypageReportSection } from "@/features/mypage/report/ui";
import { toHoguCategoryBreakdown, toMypageStats, toReportHoguIndex } from "@/features/mypage/report/utils";
import { Button, EmptyState, LoadingState } from "@/shared/ui";

export default function MypageReportPageClient() {
  const { data: report, error, isPending, refetch } = useGetHoguReportQuery();

  if (isPending) {
    return (
      <div data-app-shell-bottom-nav="hidden" className="flex min-h-full flex-col bg-bg-01">
        <main className="flex min-w-0 flex-1 flex-col justify-center overflow-x-hidden px-common-padding py-6">
          <LoadingState className="min-h-[320px]" />
        </main>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex min-h-full flex-col bg-bg-01">
        <main className="flex min-w-0 flex-1 flex-col justify-center overflow-x-hidden px-common-padding pb-28 pt-6">
          <EmptyState
            title="호구 보고서를 불러오지 못했어요."
            description="잠시 후 다시 시도해주세요."
            action={
              <Button type="button" onClick={() => refetch()} className="mx-auto w-fit">
                다시 불러오기
              </Button>
            }
          />
        </main>
      </div>
    );
  }

  const hoguIndex = toReportHoguIndex(report);

  return (
    <div className="flex min-h-full flex-col bg-bg-01">
      <main className="flex min-w-0 flex-1 flex-col gap-6 overflow-x-hidden px-common-padding pb-28 pt-10">
        <MypageProfileSummary profile={toMypageProfile(report)} />
        <HoguIndexCard index={hoguIndex} variant="detail" />
        <MypageReportSection
          categories={toHoguCategoryBreakdown(report)}
          isPendingAggregation={hoguIndex.isPendingAggregation}
          stats={toMypageStats(report)}
        />
      </main>
    </div>
  );
}
