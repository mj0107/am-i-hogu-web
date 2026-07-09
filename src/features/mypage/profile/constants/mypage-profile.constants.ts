export const MYPAGE_PROFILE_NICKNAME_MAX_LENGTH = 20;

export const MYPAGE_PROFILE_NICKNAME_HELPER_TEXT = "한글 및 영문, 숫자 최대 20자까지 입력할 수 있어요.";

export const MYPAGE_PROFILE_DUPLICATE_NICKNAME_ERROR_MESSAGE = "중복된 닉네임입니다.";

export const MYPAGE_PROFILE_SAVE_ERROR_MESSAGE = "프로필을 저장하지 못했습니다. 잠시 후 다시 시도해주세요.";

export const MYPAGE_PROFILE_SAVE_SUCCESS_MESSAGE = "프로필이 저장되었습니다.";

export const MYPAGE_PROFILE_NICKNAME_FIELD_ERROR_MESSAGES: Record<string, string> = {
  EMPTY_NICKNAME: "닉네임을 입력해주세요.",
  SPECIAL_CHAR_NICKNAME: "특수문자는 입력할 수 없습니다.",
  NICKNAME_LENGTH_EXCEEDED: "2자 이상 20자 이하의 한글, 영문, 숫자만 사용해주세요.",
};
