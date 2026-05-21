import type { MypageProfile, MypageUserResponse } from "@/features/mypage/profile/model/mypage-profile.types";

export const MYPAGE_USER_RESPONSE_MOCK: MypageUserResponse = {
  nickname: "김호구",
  profileImageUrl: "",
  hoguIndex: 72,
  hoguLevel: "RISKY",
  hoguShortDescription: "거절보다 양보가 앞서는 타입",
};

function toMypageProfile(response: Pick<MypageUserResponse, "nickname" | "profileImageUrl">): MypageProfile {
  return {
    nickname: response.nickname,
    avatarUrl: response.profileImageUrl || undefined,
  };
}

export const MYPAGE_PROFILE_MOCK = toMypageProfile(MYPAGE_USER_RESPONSE_MOCK);
