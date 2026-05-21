"use client";

import { useMemo, useState } from "react";
import { MYPAGE_HISTORY_TABS } from "@/features/mypage/history/constants";
import type { MypageHistoryItem, MypageHistoryTab } from "@/features/mypage/history/model";
import { MypageHistorySection } from "@/features/mypage/history/ui";
import type { MypageProfile } from "@/features/mypage/profile/model";
import { MypageProfileSummary } from "@/features/mypage/profile/ui";
import { cn } from "@/shared/utils";
import { FooterWidget } from "@/widgets/footer/ui";
import { HeaderWidget } from "@/widgets/header/ui";

type MypageHistoryPageClientProps = {
  profile: MypageProfile;
  histories: Record<MypageHistoryTab, MypageHistoryItem[]>;
};

export default function MypageHistoryPageClient({ profile, histories }: MypageHistoryPageClientProps) {
  const [selectedTab, setSelectedTab] = useState<MypageHistoryTab>("posts");
  const items = useMemo(() => histories[selectedTab], [histories, selectedTab]);

  return (
    <div className="flex min-h-full flex-col bg-bg-01">
      <HeaderWidget title="히스토리" />
      <main className="flex flex-1 flex-col gap-6 px-common-padding pb-8 pt-10">
        <MypageProfileSummary profile={profile} />
        <section className="space-y-6" aria-labelledby="mypage-history-tabs-heading">
          <h1 id="mypage-history-tabs-heading" className="sr-only">
            히스토리
          </h1>
          <div className="grid grid-cols-4 border-b border-line-02" role="tablist" aria-label="히스토리 필터">
            {MYPAGE_HISTORY_TABS.map((tab) => {
              const isSelected = selectedTab === tab.value;

              return (
                <button
                  key={tab.value}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  className={cn(
                    "border-b-2 pb-3 text-body-m",
                    isSelected ? "border-primary-strong text-primary-strong" : "border-transparent text-text-02",
                  )}
                  onClick={() => setSelectedTab(tab.value)}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
          <MypageHistorySection activeTab={selectedTab} items={items} />
        </section>
      </main>
      <footer className="sticky bottom-0 z-20 px-common-padding">
        <FooterWidget activeTab="mypage" />
      </footer>
    </div>
  );
}
