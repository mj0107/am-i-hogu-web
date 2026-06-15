import { AUTH_ERROR_CODE } from "../model/auth-error-code";

const LOGIN_SUCCESS_STATUS = "LOGIN_SUCCESS";

/**
 * OAuth 콜백 페이지에서 받은 인증 결과를 프론트 라우팅 경로로 변환한다.
 *
 * 백엔드는 OAuth 처리를 마친 뒤 프론트의 `/oauth/callback`으로 `status`와 선택적인 `code`를 전달한다.
 * 성공은 홈으로 보내고, 실패나 알 수 없는 상태는 로그인 페이지에 `errorCode` 쿼리를 붙여 안내 메시지를 표시한다.
 *
 * @param status - 백엔드 OAuth 콜백 처리 결과 상태
 * @param code - 백엔드가 전달한 선택적인 OAuth 실패 코드
 * @returns 인증 결과에 따라 이동할 프론트 라우팅 경로
 */
export function getOAuthCallbackRedirectPath(status?: string | null, code?: string | null) {
  if (status === LOGIN_SUCCESS_STATUS) {
    return "/";
  }

  if (status === AUTH_ERROR_CODE.LOGIN_FAILED) {
    return getLoginRedirectPath(code ?? AUTH_ERROR_CODE.LOGIN_FAILED);
  }

  return getLoginRedirectPath(AUTH_ERROR_CODE.UNKNOWN_AUTH_STATUS);
}

/**
 * 로그인 페이지가 해석할 수 있는 실패 코드 쿼리를 포함한 경로를 만든다.
 *
 * @param errorCode - 로그인 페이지에서 안내 문구로 변환할 OAuth 실패 코드
 * @returns `errorCode` 쿼리를 포함한 로그인 페이지 경로
 */
function getLoginRedirectPath(errorCode: string) {
  const searchParams = new URLSearchParams({ errorCode });

  return `/login?${searchParams.toString()}`;
}
