"use client";

import { MypageAccountSection } from "@/features/mypage/account/ui";
import type { MypageProfile } from "@/features/mypage/profile/model";
import { MypageProfileSummary } from "@/features/mypage/profile/ui";
import { FooterWidget } from "@/widgets/footer/ui";
import { HeaderWidget } from "@/widgets/header/ui";

type MypageAccountPageClientProps = {
  profile: MypageProfile;
};

export default function MypageAccountPageClient({ profile }: MypageAccountPageClientProps) {
  return (
    <div className="flex min-h-full flex-col bg-bg-01">
      <HeaderWidget title="계정 관리" />
      <main className="flex flex-1 flex-col gap-16 px-common-padding pb-8 pt-8">
        <MypageProfileSummary profile={profile} editable />
        <MypageAccountSection />
      </main>
      <footer className="sticky bottom-0 z-20 px-common-padding">
        <FooterWidget activeTab="mypage" />
      </footer>
    </div>
  );
}
