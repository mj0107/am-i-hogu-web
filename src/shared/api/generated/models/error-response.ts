import type { ErrorDetail } from "./error-detail";

/**
 * @description
 * Auto-generated DTO from backend OpenAPI schema.
 * Do not edit manually.
 */
export interface ErrorResponse {
  /** 에러 코드 */
  code: string;
  /** 상세 에러(없을 경우 생략) */
  errors?: ErrorDetail[] | null;
}
