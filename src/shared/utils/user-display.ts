const DELETED_USER_NICKNAME_PATTERN = /^d_\d+$/;
const DELETED_USER_DISPLAY_NAME = "(탈퇴한 사용자)";

type UserDisplaySource = {
  nickname?: string | null;
  profileImageUrl?: string | null;
};

export function isDeletedUserNickname(nickname?: string | null) {
  return DELETED_USER_NICKNAME_PATTERN.test(nickname ?? "");
}

export function toUserDisplay(source: UserDisplaySource) {
  const isDeletedUser = isDeletedUserNickname(source.nickname);
  const displayName = isDeletedUser ? DELETED_USER_DISPLAY_NAME : (source.nickname ?? "");

  return {
    displayName,
    profileImageUrl: isDeletedUser ? undefined : (source.profileImageUrl ?? undefined),
    isDeletedUser,
  };
}
