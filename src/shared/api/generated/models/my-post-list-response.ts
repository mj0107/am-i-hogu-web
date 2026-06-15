import type { MyPostItemResponse } from "./my-post-item-response";

/**
 * @description
 * Auto-generated DTO from backend OpenAPI schema.
 * Do not edit manually.
 */
export interface MyPostListResponse {
  /** 게시물 목록 */
  posts: MyPostItemResponse[];
  /** 다음 페이지 존재 여부 */
  hasNext: boolean;
  /** 다음 페이지 커서 */
  nextCursor: string | null;
}
