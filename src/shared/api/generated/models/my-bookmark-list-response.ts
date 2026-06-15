import type { MyBookmarkItemResponse } from "./my-bookmark-item-response";

/**
 * @description
 * Auto-generated DTO from backend OpenAPI schema.
 * Do not edit manually.
 */
export interface MyBookmarkListResponse {
  /** 북마크 게시물 목록 */
  posts: MyBookmarkItemResponse[];
  /** 다음 페이지 존재 여부 */
  hasNext: boolean;
  /** 다음 페이지 커서 */
  nextCursor: string | null;
}
