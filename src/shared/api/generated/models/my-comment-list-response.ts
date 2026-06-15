import type { MyCommentItemResponse } from "./my-comment-item-response";

/**
 * @description
 * Auto-generated DTO from backend OpenAPI schema.
 * Do not edit manually.
 */
export interface MyCommentListResponse {
  /** 댓글 목록 */
  comments: MyCommentItemResponse[];
  /** 다음 페이지 존재 여부 */
  hasNext: boolean;
  /** 다음 페이지 커서 */
  nextCursor: string | null;
}
