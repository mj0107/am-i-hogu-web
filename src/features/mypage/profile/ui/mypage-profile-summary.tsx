import PencilIcon from "@/assets/icons/pencil-simple.svg";
import type { MypageProfileSummaryProps } from "@/features/mypage/profile/model";
import { Avatar } from "@/shared/ui";
import { cn } from "@/shared/utils";

export function MypageProfileSummary({ profile, editable = false, className }: MypageProfileSummaryProps) {
  return (
    <section className={cn("flex flex-col items-center gap-4", className)} aria-labelledby="mypage-profile-heading">
      <Avatar name={profile.nickname} src={profile.avatarUrl} size={100} fallbackClassName="text-title1-b" />
      <h1 id="mypage-profile-heading" className="inline-flex items-center gap-1 text-title2-b text-text-04">
        {profile.nickname}
        {editable ? <PencilIcon aria-hidden className="size-4 text-text-03" strokeWidth={20} /> : null}
      </h1>
    </section>
  );
}
