import { MYPAGE_PROFILE_MOCK } from "@/features/mypage/profile/model";
import MypageAccountPageClient from "./_components/mypage-account-page.client";

export default function MypageAccountPage() {
  return <MypageAccountPageClient profile={MYPAGE_PROFILE_MOCK} />;
}
