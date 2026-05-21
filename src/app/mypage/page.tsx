import { MYPAGE_PROFILE_MOCK } from "@/features/mypage/profile/model";
import { HOGU_INDEX_MOCK } from "@/features/mypage/report/model";
import MypagePageClient from "./_components/mypage-page.client";

export default function MypagePage() {
  return <MypagePageClient profile={MYPAGE_PROFILE_MOCK} hoguIndex={HOGU_INDEX_MOCK} />;
}
