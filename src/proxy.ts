import { type NextRequest, NextResponse } from "next/server";
import { AUTH_ERROR_CODE } from "@/features/auth/model/auth-error-code";

const REFRESH_TOKEN_COOKIE = "refreshToken";
const REGISTER_TOKEN_COOKIE = "registerToken";

const SERVICE_ENTRY_PATH = "/";
const LOGIN_PATH = "/login";
const ONBOARDING_PATH = "/onboarding";

function redirectTo(pathname: string, request: NextRequest) {
  return NextResponse.redirect(new URL(pathname, request.url));
}

function redirectToLoginWithError(errorCode: string, request: NextRequest) {
  const url = new URL(LOGIN_PATH, request.url);
  url.searchParams.set("errorCode", errorCode);

  return NextResponse.redirect(url);
}

function hasCookieValue(request: NextRequest, name: string) {
  // 온보딩 성공 후, registerToken이 cookie에서 사라지는게 아니라 빈 값으로 설정되어있기 때문에 빈 값을 체크한다.
  return Boolean(request.cookies.get(name)?.value);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasRefreshToken = hasCookieValue(request, REFRESH_TOKEN_COOKIE);
  const hasRegisterToken = hasCookieValue(request, REGISTER_TOKEN_COOKIE);

  if (pathname === LOGIN_PATH) {
    // stale refreshToken cookie가 남아 있을 수 있어,
    // errorCode가 있는 로그인 진입은 에러를 보여주기 위해 허용한다.
    if (request.nextUrl.searchParams.has("errorCode")) {
      return NextResponse.next();
    }

    return hasRefreshToken ? redirectTo(SERVICE_ENTRY_PATH, request) : NextResponse.next();
  }

  if (pathname === ONBOARDING_PATH) {
    if (hasRefreshToken) {
      return redirectTo(SERVICE_ENTRY_PATH, request);
    }

    return hasRegisterToken
      ? NextResponse.next()
      : redirectToLoginWithError(AUTH_ERROR_CODE.EMPTY_REGISTER_TOKEN, request);
  }

  // `/login`, `/onboarding` 외 matcher는 모두 protected route다.
  return hasRefreshToken ? NextResponse.next() : redirectToLoginWithError(AUTH_ERROR_CODE.EMPTY_REFRESH_TOKEN, request);
}

export const config = {
  matcher: ["/login", "/onboarding", "/mypage/:path*", "/post/write", "/post/:postId/edit"],
};
