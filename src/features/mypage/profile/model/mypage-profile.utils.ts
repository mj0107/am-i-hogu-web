import type { MyPageResponse } from "@/shared/api/generated";
import type { MypageProfile } from "./mypage-profile.types";

export function toMypageProfile(response: Pick<MyPageResponse, "nickname" | "profileImageUrl">): MypageProfile {
  return {
    nickname: response.nickname,
    avatarUrl: response.profileImageUrl || undefined,
  };
}
