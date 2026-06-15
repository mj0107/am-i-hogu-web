import { AUTH_ERROR_CODE } from "../model/auth-error-code";

const DEFAULT_AUTH_ERROR_MESSAGE = "로그인에 실패했어요. 다시 시도해 주세요.";

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  [AUTH_ERROR_CODE.EMPTY_REFRESH_TOKEN]: "로그인이 필요한 페이지입니다. 로그인해 주세요.",
  [AUTH_ERROR_CODE.EMPTY_REGISTER_TOKEN]: "가입 인증 정보가 없습니다. 다시 로그인해 주세요.",
  [AUTH_ERROR_CODE.INVALID_AUTH_CODE]: "로그인 인증 코드가 유효하지 않아요. 다시 시도해 주세요.",
  [AUTH_ERROR_CODE.INVALID_ID_TOKEN]: "소셜 로그인 인증 정보가 유효하지 않아요. 다시 시도해 주세요.",
  [AUTH_ERROR_CODE.INVALID_REFRESH_TOKEN]: "로그인 정보가 올바르지 않습니다. 다시 로그인해 주세요.",
  [AUTH_ERROR_CODE.INVALID_REGISTER_TOKEN]: "가입 인증 정보가 올바르지 않습니다. 다시 로그인해 주세요.",
  [AUTH_ERROR_CODE.INVALID_STATE]: "로그인 요청이 유효하지 않아요. 다시 시도해 주세요.",
  [AUTH_ERROR_CODE.LOGIN_FAILED]: DEFAULT_AUTH_ERROR_MESSAGE,
  [AUTH_ERROR_CODE.PROVIDER_MISMATCH]: "로그인 제공자 정보가 일치하지 않아요. 다시 시도해 주세요.",
  [AUTH_ERROR_CODE.REFRESH_TOKEN_EXPIRED]: "로그인 시간이 만료되었습니다. 다시 로그인해 주세요.",
  [AUTH_ERROR_CODE.REFRESH_TOKEN_REUSED]: "로그인 정보가 만료되었습니다. 다시 로그인해 주세요.",
  [AUTH_ERROR_CODE.REGISTER_TOKEN_EXPIRED]: "가입 인증 시간이 만료되었습니다. 다시 로그인해 주세요.",
  [AUTH_ERROR_CODE.SOCIAL_SERVER_ERROR]: "소셜 로그인 서버에 문제가 있어요. 잠시 후 다시 시도해 주세요.",
  [AUTH_ERROR_CODE.STATE_EXPIRED]: "로그인 시간이 만료되었어요. 다시 시도해 주세요.",
  [AUTH_ERROR_CODE.STATE_REUSED]: "이미 처리된 로그인 요청이에요. 다시 시도해 주세요.",
  [AUTH_ERROR_CODE.UNKNOWN_AUTH_STATUS]: DEFAULT_AUTH_ERROR_MESSAGE,
  [AUTH_ERROR_CODE.UNSUPPORTED_PROVIDER]: "지원하지 않는 로그인 방식이에요.",
};

/**
 * 인증 실패 코드를 사용자가 이해할 수 있는 로그인 화면 안내 문구로 변환한다.
 *
 * 서버에서 내려주는 오류 코드를 그대로 노출하지 않고,
 * 알려진 코드는 원인에 맞는 문구로 바꾸며
 * 알 수 없는 코드는 기본 실패 문구로 처리한다.
 *
 * @param errorCode - 백엔드 또는 proxy에서 전달된 인증 실패 코드
 * @returns 로그인 화면에 표시할 사용자 안내 문구
 */
export function getAuthErrorMessage(errorCode?: string | null) {
  if (!errorCode) {
    return DEFAULT_AUTH_ERROR_MESSAGE;
  }

  return AUTH_ERROR_MESSAGES[errorCode] ?? DEFAULT_AUTH_ERROR_MESSAGE;
}
