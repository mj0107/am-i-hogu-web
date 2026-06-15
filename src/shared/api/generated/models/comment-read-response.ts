import type { CommentItemResponse } from "./comment-item-response";

/**
 * @description
 * Auto-generated DTO from backend OpenAPI schema.
 * Do not edit manually.
 */
export interface CommentReadResponse {
  /** 집단지성 목록 */
  comments: CommentItemResponse[];
  /** 다음 페이지 존재 여부 */
  hasNext: boolean;
  /** 다음 페이지 커서. hasNext가 false이면 null */
  nextCursor: string | null;
}
