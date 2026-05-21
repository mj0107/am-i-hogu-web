"use client";

import { useState } from "react";
import { MYPAGE_MENU_ITEMS } from "@/features/mypage/menu/constants";
import { MypageMenuList } from "@/features/mypage/menu/ui";
import type { MypageProfile } from "@/features/mypage/profile/model";
import { MypageProfileSummary } from "@/features/mypage/profile/ui";
import type { HoguIndex } from "@/features/mypage/report/model";
import { HoguIndexCard } from "@/features/mypage/report/ui";
import { MypageSupportModal } from "@/features/mypage/support/ui";
import { FooterWidget } from "@/widgets/footer/ui";

type MypagePageClientProps = {
  profile: MypageProfile;
  hoguIndex: HoguIndex;
};

export default function MypagePageClient({ profile, hoguIndex }: MypagePageClientProps) {
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  return (
    <div className="flex min-h-full flex-col bg-bg-01">
      <main className="flex flex-1 flex-col gap-6 px-common-padding pb-8 pt-10">
        <MypageProfileSummary profile={profile} />
        <HoguIndexCard index={hoguIndex} />
        <MypageMenuList
          items={MYPAGE_MENU_ITEMS}
          onItemSelect={(item) => {
            if (item.id === "support") {
              setIsSupportModalOpen(true);
            }
          }}
        />
      </main>
      <footer className="sticky bottom-0 z-20 px-common-padding">
        <FooterWidget activeTab="mypage" />
      </footer>
      <MypageSupportModal open={isSupportModalOpen} onClose={() => setIsSupportModalOpen(false)} />
    </div>
  );
}
