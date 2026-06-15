import type { ErrorResponse } from "@/shared/api/generated";

const nicknameFieldErrorMessages: Record<string, string> = {
  EMPTY_NICKNAME: "닉네임을 입력해주세요.",
  SPECIAL_CHAR_NICKNAME: "특수문자는 입력할 수 없습니다.",
  NICKNAME_LENGTH_EXCEEDED: "2자 이상 20자 이하의 한글, 영문, 숫자만 사용해주세요.",
};

const onboardingSubmitErrorMessages: Record<string, string> = {
  EMPTY_REGISTER_TOKEN: "가입 인증 정보가 없습니다. 다시 로그인해주세요.",
  REGISTER_TOKEN_EXPIRED: "가입 인증 시간이 만료되었습니다. 다시 로그인해주세요.",
  INVALID_REGISTER_TOKEN: "가입 인증 정보가 올바르지 않습니다. 다시 로그인해주세요.",
};

/**
 * 닉네임 중복 확인 API의 실패 응답을 온보딩 입력 필드에 표시할 메시지로 변환한다.
 *
 * 서버가 명세의 `ErrorResponse.errors`로 닉네임 필드 오류 코드를 내려주면
 * 해당 코드를 사용자 안내 문구로 매핑하고, 알 수 없는 형태의 응답이면 기본 실패 문구를 반환한다.
 *
 * @param errorResponse - 닉네임 중복 확인 API 실패 응답
 * @returns 온보딩 닉네임 입력 필드에 표시할 에러 메시지
 */
export function getNicknameCheckErrorMessage(errorResponse?: ErrorResponse) {
  if (!errorResponse) {
    return "닉네임 중복 확인에 실패했습니다.";
  }

  const nicknameErrorCode = errorResponse.errors?.find((error) => error.field === "nickname")?.code;

  if (!nicknameErrorCode) {
    return "닉네임 중복 확인에 실패했습니다.";
  }

  return nicknameFieldErrorMessages[nicknameErrorCode] ?? "닉네임 중복 확인에 실패했습니다.";
}

/**
 * 온보딩 회원 생성 API 실패 응답 중 닉네임 필드에 표시할 메시지로 변환한다.
 *
 * 서버가 `DUPLICATE_NICKNAME` 또는 닉네임 필드 유효성 오류를 내려주면
 * 온보딩 입력 필드 에러로 표시할 메시지를 반환하고, 필드 에러가 아니면 `undefined`를 반환한다.
 *
 * @param errorResponse - 온보딩 회원 생성 API 실패 응답
 * @returns 닉네임 입력 필드에 표시할 메시지 또는 필드 에러가 아닐 때 `undefined`
 */
export function getOnboardingNicknameErrorMessage(errorResponse?: ErrorResponse) {
  if (!errorResponse) {
    return undefined;
  }

  if (errorResponse.code === "DUPLICATE_NICKNAME") {
    return "중복된 닉네임입니다.";
  }

  const nicknameErrorCode = errorResponse.errors?.find((error) => error.field === "nickname")?.code;

  return nicknameErrorCode ? nicknameFieldErrorMessages[nicknameErrorCode] : undefined;
}

/**
 * 온보딩 회원 생성 API 실패 응답을 제출 영역에 표시할 메시지로 변환한다.
 *
 * registerToken 관련 인증 오류는 사용자에게 다시 로그인해야 함을 안내하고,
 * 알 수 없는 응답은 일반 실패 문구로 변환한다.
 *
 * @param errorResponse - 온보딩 회원 생성 API 실패 응답
 * @returns 온보딩 제출 영역에 표시할 에러 메시지
 */
export function getOnboardingSubmitErrorMessage(errorResponse?: ErrorResponse) {
  if (!errorResponse) {
    return "온보딩을 완료하지 못했습니다. 잠시 후 다시 시도해주세요.";
  }

  return (
    onboardingSubmitErrorMessages[errorResponse.code] ?? "온보딩을 완료하지 못했습니다. 잠시 후 다시 시도해주세요."
  );
}
