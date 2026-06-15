// API 호출 실패를 표현하는 공통 에러입니다.
// `src/app/error.tsx`는 렌더링이 실패했을 때 보여주는 글로벌 에러 화면이고,
// 이 파일의 `ApiError`는 400/401/404/500, timeout 같은 API 응답 실패를
// TanStack Query나 server action에서 다루기 위한 데이터 계층 에러입니다.

import type { ErrorResponse } from "@/shared/api/generated";

export type ApiErrorPayload = {
  status?: number;
  message: string;
  data?: ErrorResponse;
};

export class ApiError extends Error {
  status?: number;
  data?: ErrorResponse;

  constructor(payload: ApiErrorPayload) {
    super(payload.message);
    this.name = "ApiError";
    this.status = payload.status;
    this.data = payload.data;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }

  return "알 수 없는 오류가 발생했습니다.";
}

export function toApiError(error: unknown): ApiError {
  if (isApiError(error)) {
    return error;
  }

  return new ApiError({
    message: getErrorMessage(error),
  });
}
