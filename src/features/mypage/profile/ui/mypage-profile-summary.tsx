import Link from "next/link";
import PencilIcon from "@/assets/icons/pencil-simple.svg";
import type { MypageProfileSummaryProps } from "@/features/mypage/profile/model";
import { Avatar } from "@/shared/ui";
import { cn } from "@/shared/utils";

export function MypageProfileSummary({ profile, editable = false, className }: MypageProfileSummaryProps) {
  const profileName = (
    <>
      {profile.nickname}
      {editable ? <PencilIcon aria-hidden className="size-4 text-text-03" strokeWidth={20} /> : null}
    </>
  );

  return (
    <section className={cn("flex flex-col items-center gap-4", className)} aria-labelledby="mypage-profile-heading">
      <Avatar name={profile.nickname} src={profile.avatarUrl} size={100} fallbackClassName="text-title1-b" />
      <h1 id="mypage-profile-heading" className="inline-flex items-center gap-1 text-title2-b text-text-04">
        {editable ? (
          <Link href="/mypage/profile/edit" className="inline-flex items-center gap-1">
            {profileName}
          </Link>
        ) : (
          profileName
        )}
      </h1>
    </section>
  );
}
