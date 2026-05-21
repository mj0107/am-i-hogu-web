import { MYPAGE_PROFILE_MOCK } from "@/features/mypage/profile/model";
import { MypageProfileEditForm } from "@/features/mypage/profile/ui";
import { HeaderWidget } from "@/widgets/header/ui";

export default function MypageProfileEditPage() {
  return (
    <div className="flex min-h-full flex-col bg-bg-01">
      <HeaderWidget title="프로필 편집" />
      <MypageProfileEditForm profile={MYPAGE_PROFILE_MOCK} />
    </div>
  );
}
