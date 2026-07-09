"use client";

import { useGetMyPageQuery } from "@/features/mypage/api";
import { toMypageProfile } from "@/features/mypage/profile/model";
import { MypageProfileEditForm } from "@/features/mypage/profile/ui";
import { Button, EmptyState, LoadingState } from "@/shared/ui";

export default function MypageProfileEditPageClient() {
  const { data: mypage, error, isPending, refetch } = useGetMyPageQuery();

  if (isPending) {
    return (
      <main className="flex min-w-0 flex-1 flex-col justify-center overflow-x-hidden px-common-padding py-6">
        <LoadingState className="min-h-[320px]" />
      </main>
    );
  }

  if (error || !mypage) {
    return (
      <main className="flex min-w-0 flex-1 flex-col justify-center overflow-x-hidden px-common-padding py-6">
        <EmptyState
          title="프로필 정보를 불러오지 못했어요."
          description="잠시 후 다시 시도해주세요."
          action={
            <Button type="button" onClick={() => refetch()} className="mx-auto w-fit">
              다시 불러오기
            </Button>
          }
        />
      </main>
    );
  }

  return <MypageProfileEditForm profile={toMypageProfile(mypage)} />;
}
