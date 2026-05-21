import { MYPAGE_HISTORY_ITEMS_BY_TAB_MOCK } from "@/features/mypage/history/model";
import { MYPAGE_PROFILE_MOCK } from "@/features/mypage/profile/model";
import MypageHistoryPageClient from "./_components/mypage-history-page.client";

export default function MypageHistoryPage() {
  return <MypageHistoryPageClient profile={MYPAGE_PROFILE_MOCK} histories={MYPAGE_HISTORY_ITEMS_BY_TAB_MOCK} />;
}
