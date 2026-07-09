"use client";

import { type ApiClientOptions, apiClient, isApiError } from "@/shared/api";
import { useAuthStore } from "../model";
import { REFRESH_TOKEN_ERROR_CODES } from "../model/auth-error-code";
import { refreshAccessToken } from "./auth.service";

let refreshPromise: ReturnType<typeof refreshAccessToken> | null = null;

/**
 * 전달된 에러 코드가 refresh token 관련 에러 코드인지 판별한다.
 *
 * @param code - 백엔드에서 전달된 인증 관련 에러 코드
 * @returns refresh token 관련 에러 코드 여부
 */
function isRefreshTokenErrorCode(code?: string): code is string {
  return Boolean(code && REFRESH_TOKEN_ERROR_CODES.has(code));
}

/**
 * refresh token 관련 에러 발생시 로그인 화면으로 이동한다.
 *
 * @param errorCode - 백엔드에서 전달된 refresh token 관련 에러 코드
 */
function redirectToLoginWithError(errorCode: string) {
  const searchParams = new URLSearchParams({ errorCode });

  window.location.replace(`/login?${searchParams.toString()}`);
}

/**
 * refresh token 관련 에러가 발생했는지 확인하고 로그인 화면으로 이동한다.
 *
 * @param error - API 호출시 발생한 에러
 */
function redirectOnRefreshTokenError(error: unknown) {
  const errorCode = isApiError(error) ? error.data?.code : undefined;

  if (isRefreshTokenErrorCode(errorCode)) {
    redirectToLoginWithError(errorCode);
  }
}

/**
 * 인증 헤더를 포함한 요청 헤더를 생성한다.
 *
 * @param headers 인증 헤더를 제외한 나머지 헤더
 * @param accessToken access token
 * @returns 인증 헤더가 포함된 헤더 객체
 */
function createAuthenticatedHeaders(headers: ApiClientOptions["headers"], accessToken: string | null) {
  const nextHeaders = new Headers(headers);

  if (accessToken) {
    nextHeaders.set("Authorization", `Bearer ${accessToken}`);
  }

  return Object.fromEntries(nextHeaders.entries());
}

/**
 * 401 에러가 여러개 발생했을 때 중복해서 refreshAccessToken 함수가 호출되는 것을 방지한다.
 *
 * @description
 * - 예를 들어 3번의 각각 다른 API 요청을 병렬로 보낸다면 첫 번째 요청만 갱신에 성공할 것이고,
 *   나머지 두 요청은 첫 번째 요청이 만든 Promise를 기다린 뒤 같은 갱신 결과를 받는다.
 * - 이 때 refreshPromise가 null이라면 새로 생성하고, null이 아니면 기존의 promise를 반환한다.
 *
 * @returns access token 갱신 응답
 */
function refreshAccessTokenOnce() {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      // null로 초기화해야 이후 401 에러가 발생했을 때 새로운 refreshAccessToken이 호출된다.
      // 그렇지 않으면, 만료된 refresh token을 받은 Promise를 재사용하게 된다.
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

/**
 * 인증 정보를 반환한다.
 *
 * @description
 * - store에 인증 정보가 없다면 access token을 갱신하고 반환한다.
 * - access token 갱신에 실패하면 인증 정보를 초기화하고 에러를 던진다.
 *
 * @returns access token
 */
async function getAccessToken() {
  const { accessToken, clearAccessToken, setAccessToken } = useAuthStore.getState();

  if (accessToken) {
    return accessToken;
  }

  try {
    const reissueResponse = await refreshAccessTokenOnce();
    setAccessToken(reissueResponse.accessToken);

    return reissueResponse.accessToken;
  } catch (error) {
    clearAccessToken();
    redirectOnRefreshTokenError(error);
    throw error;
  }
}

/**
 * 공개 API에 사용자 문맥이 필요한 경우 사용할 access token을 반환한다.
 *
 * @description
 * - 게시글/댓글 조회처럼 비로그인 접근은 가능하지만, 로그인 상태라면 `isMine`, `isHelpful` 같은 사용자별 필드가 필요한 API에서 사용한다.
 * - feature service에서 refresh token을 직접 다루지 않도록 optional auth 책임도 이 레이어에 모은다.
 * - refresh token이 없거나 만료된 경우에는 public 요청으로 이어갈 수 있도록 null을 반환한다.
 * - refresh 요청은 보호 API와 같은 단일 Promise를 공유해 새로고침 직후 병렬 조회에서 refresh가 중복 호출되지 않게 한다.
 *
 * @returns access token 또는 null
 */
export async function getOptionalAccessToken(options?: { forceRefresh?: boolean }) {
  const forceRefresh = options?.forceRefresh ?? false;
  const { accessToken, clearAccessToken, setAccessToken } = useAuthStore.getState();

  if (accessToken && !forceRefresh) {
    return accessToken;
  }

  try {
    const reissueResponse = await refreshAccessTokenOnce();
    setAccessToken(reissueResponse.accessToken);

    return reissueResponse.accessToken;
  } catch {
    clearAccessToken();
    return null;
  }
}

export async function authenticatedApiClient<T>(path: string, options: ApiClientOptions = {}) {
  const accessToken = await getAccessToken();

  try {
    return await apiClient<T>(path, {
      ...options,
      credentials: options.credentials ?? "include",
      headers: createAuthenticatedHeaders(options.headers, accessToken),
    });
  } catch (error) {
    const shouldRefresh = isApiError(error) && error.status === 401;

    // 401 에러가 아니라면 에러를 그대로 던진다.
    if (!shouldRefresh) {
      throw error;
    }

    let reissueResponse: Awaited<ReturnType<typeof refreshAccessToken>>;
    const { clearAccessToken, setAccessToken } = useAuthStore.getState();

    // access token 갱신 요청을 보낸다.
    try {
      reissueResponse = await refreshAccessTokenOnce();
    } catch (refreshError) {
      // access token 갱신 실패시 인증 정보(store)를 초기화 한 후 에러를 던진다.
      clearAccessToken();
      redirectOnRefreshTokenError(refreshError);
      throw refreshError;
    }

    setAccessToken(reissueResponse.accessToken);

    // 갱신된 access token으로 원래 요청을 다시 보낸다.
    return await apiClient<T>(path, {
      ...options,
      credentials: options.credentials ?? "include",
      headers: createAuthenticatedHeaders(options.headers, reissueResponse.accessToken),
    });
  }
}
