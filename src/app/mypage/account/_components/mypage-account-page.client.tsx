"use client";

import { MypageAccountSection } from "@/features/mypage/account/ui";
import { useGetMyPageQuery } from "@/features/mypage/api";
import { toMypageProfile } from "@/features/mypage/profile/model";
import { MypageProfileSummary } from "@/features/mypage/profile/ui";
import { Button, EmptyState, LoadingState } from "@/shared/ui";

export default function MypageAccountPageClient() {
  const { data: mypage, error, isPending, refetch } = useGetMyPageQuery();

  if (isPending) {
    return (
      <div data-app-shell-bottom-nav="hidden" className="flex min-h-full flex-col bg-bg-01">
        <main className="flex min-w-0 flex-1 flex-col justify-center overflow-x-hidden px-common-padding py-6">
          <LoadingState className="min-h-[320px]" />
        </main>
      </div>
    );
  }

  if (error || !mypage) {
    return (
      <div className="flex min-h-full flex-col bg-bg-01">
        <main className="flex min-w-0 flex-1 flex-col justify-center overflow-x-hidden px-common-padding pb-28 pt-6">
          <EmptyState
            title="계정 정보를 불러오지 못했어요."
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

  return (
    <div className="flex min-h-full flex-col bg-bg-01">
      <main className="flex min-w-0 flex-1 flex-col gap-16 overflow-x-hidden px-common-padding pb-28 pt-8">
        <MypageProfileSummary profile={toMypageProfile(mypage)} editable />
        <MypageAccountSection />
      </main>
    </div>
  );
}
