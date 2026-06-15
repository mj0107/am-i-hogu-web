import type { HomePostItemResponse } from "./home-post-item-response";

/**
 * @description
 * Auto-generated DTO from backend OpenAPI schema.
 * Do not edit manually.
 */
export interface HomePostListResponse {
  /** 총 게시물 수 */
  totalPostCount?: number | null;
  /** 게시물 목록 */
  posts: HomePostItemResponse[];
  /** 다음 페이지 존재 여부 */
  hasNext: boolean;
  /** 다음 페이지 커서 */
  nextCursor: string | null;
}
