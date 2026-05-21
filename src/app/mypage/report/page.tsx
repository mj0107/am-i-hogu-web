import { MYPAGE_PROFILE_MOCK } from "@/features/mypage/profile/model";
import { MypageProfileSummary } from "@/features/mypage/profile/ui";
import {
  HOGU_CATEGORY_BREAKDOWN_MOCK,
  HOGU_INDEX_DETAIL_MOCK,
  MYPAGE_STATS_MOCK,
} from "@/features/mypage/report/model";
import { HoguIndexCard, MypageReportSection } from "@/features/mypage/report/ui";
import { FooterWidget } from "@/widgets/footer/ui";

export default function MypageReportPage() {
  return (
    <div className="flex min-h-full flex-col bg-bg-01">
      <main className="flex flex-1 flex-col gap-6 px-common-padding pb-8 pt-10">
        <MypageProfileSummary profile={MYPAGE_PROFILE_MOCK} />
        <HoguIndexCard index={HOGU_INDEX_DETAIL_MOCK} variant="detail" />
        <MypageReportSection categories={HOGU_CATEGORY_BREAKDOWN_MOCK} stats={MYPAGE_STATS_MOCK} />
      </main>
      <footer className="sticky bottom-0 z-20 px-common-padding">
        <FooterWidget activeTab="mypage" />
      </footer>
    </div>
  );
}
